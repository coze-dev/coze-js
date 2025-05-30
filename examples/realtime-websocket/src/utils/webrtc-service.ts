/**
 * WebRTC服务 - 用于处理WebRTC同声传译的发布和订阅
 */
// 使用fetch API代替axios，避免额外依赖

// WTN服务基础URL
const WTN_BASE_URL = 'https://wtn.volcvideo.com';

/**
 * WebRTC资源状态
 */
export enum ResourceStatus {
  IDLE = 'idle', // 初始状态
  CONNECTING = 'connecting', // 连接中
  CONNECTED = 'connected', // 已连接
  FAILED = 'failed', // 连接失败
  CLOSING = 'closing', // 关闭中
  CLOSED = 'closed', // 已关闭
}

/**
 * WebRTC资源类型
 */
export enum ResourceType {
  PUBLISH = 'publish', // 发布资源
  SUBSCRIBE = 'subscribe', // 订阅资源
}

/**
 * WebRTC连接配置
 */
export interface WebRTCConfig {
  appId: string; // 应用ID
  streamId: string; // 流ID
  pat: string; // 访问令牌
}

/**
 * WebRTC发布资源结果
 */
export interface PublishResult {
  resourceId?: string; // 资源ID
  resourceUrl?: string; // 资源URL (用于销毁资源)
  shareUrl?: string; // 分享URL (用于扫码收听)
  error?: Error; // 错误信息
}

/**
 * WebRTC服务类
 */
export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private resourceUrl: string = '';
  private status: ResourceStatus = ResourceStatus.IDLE;
  private resourceType: ResourceType | null = null;
  private config: WebRTCConfig | null = null;
  private player: HTMLAudioElement;

  /**
   * 创建WebRTC服务实例
   */
  constructor() {
    this.setupPeerConnectionListeners();
    this.player = document.createElement('audio');
  }

  /**
   * 获取当前连接状态
   */
  public getStatus(): ResourceStatus {
    return this.status;
  }

  /**
   * 获取资源URL
   */
  public get resourceURL(): string {
    return this.resourceUrl || '';
  }

  /**
   * 获取分享URL
   */
  public getShareUrl(): string {
    if (!this.config) {
      return '';
    }
    return `${location.origin}/#subscribe?appId=${this.config.appId}&streamId=${this.config.streamId}`;
  }

  /**
   * 初始化资源发布
   * @param config WebRTC配置
   * @param mediaStream 媒体流
   */
  public async publish(
    config: WebRTCConfig,
    mediaStream: MediaStream,
  ): Promise<PublishResult> {
    try {
      this.config = config;
      this.localStream = mediaStream;
      this.status = ResourceStatus.CONNECTING;

      // 1. 创建RTCPeerConnection
      const rtcConfig = {
        // iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      };
      this.peerConnection = new RTCPeerConnection(rtcConfig);
      this.setupPeerConnectionListeners();

      // 2. 添加本地音频轨道
      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio track found in media stream');
      }

      audioTracks.forEach(track => {
        // this.peerConnection?.addTrack(track, mediaStream);
        this.peerConnection?.addTransceiver(track, {
          streams: [mediaStream],
          direction: 'sendonly',
        });
      });

      // 3. 创建Offer (SDP)
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      await this.peerConnection.setLocalDescription(offer);

      // 4. 发送Offer到WTN服务创建发布资源
      const { appId, streamId, pat } = config;
      const publishUrl = `${WTN_BASE_URL}/pub/${appId}/${streamId}?MuteVideo=true`;

      const response = await fetch(publishUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          Authorization: `Bearer ${pat}`,
        },
        body: offer.sdp,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 5. 保存资源URL (用于销毁资源)
      this.resourceUrl = response.headers.get('location') || '';

      // 6. 设置远程SDP (Answer)
      // 直接获取文本响应，因为服务器返回的是application/sdp格式而非json
      const answerSdp = await response.text();
      const answer = new RTCSessionDescription({
        type: 'answer',
        sdp: answerSdp,
      });
      await this.peerConnection.setRemoteDescription(answer);

      // 7. 返回结果
      return {
        resourceId: streamId,
        resourceUrl: this.resourceUrl,
        shareUrl: this.getShareUrl(),
      };
    } catch (error) {
      this.status = ResourceStatus.FAILED;
      console.error('Failed to publish WebRTC stream:', error);
      return {
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * 订阅音频资源
   * @param appId 应用ID
   * @param streamId 流ID
   * @param pat 访问令牌
   * @param clientId 客户端ID
   */
  public async subscribe(
    appId: string,
    streamId: string,
    clientId: string = '',
  ): Promise<any> {
    try {
      // 先清理现有连接
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      this.status = ResourceStatus.CONNECTING;

      // 1. 创建RTCPeerConnection
      const rtcConfig = {
        // iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      };
      const pc = new RTCPeerConnection(rtcConfig);

      pc.ontrack = (event: RTCTrackEvent) => {
        console.log('Received remote track:', event.track.kind);
        this.player.onloadeddata = () => {
          this.player.play();
        };
        this.player.srcObject = event.streams[0];
      };

      this.peerConnection = pc;
      this.setupPeerConnectionListeners();

      pc.addTransceiver('audio', {
        direction: 'recvonly',
      });

      // 2. 创建Offer (SDP)
      const offer = await pc.createOffer();

      // 设置本地描述
      await pc.setLocalDescription(offer);

      // 等待ICE收集完成再继续
      await this.waitForIceGathering(pc);

      if (!pc.localDescription?.sdp) {
        throw new Error('Failed to create SDP offer');
      }

      // 3. 发送Offer到WTN服务订阅资源
      let subscribeUrl = `${WTN_BASE_URL}/sub/${appId}/${streamId}?MuteVideo=true`;
      if (clientId) {
        subscribeUrl += `&clientid=${clientId}`;
      }

      const response = await fetch(subscribeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          // Authorization: `Bearer ${pat}`,
        },
        body: offer.sdp,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 4. 保存资源URL (用于销毁资源)
      this.resourceUrl = response.headers.get('location') || '';

      // 5. 设置远程SDP (Answer)
      // 直接获取文本响应，因为服务器返回的是application/sdp格式而非json
      const answerSdp = await response.text();
      const answer = new RTCSessionDescription({
        type: 'answer',
        sdp: answerSdp,
      });
      await this.peerConnection.setRemoteDescription(answer);

      // 7. 返回结果
      return {
        resourceUrl: this.resourceUrl,
        status: this.status,
        peerConnection: this.peerConnection, // 返回连接对象，以便客户端可以监听媒体事件
      };
    } catch (error) {
      this.status = ResourceStatus.FAILED;
      console.error('Failed to subscribe WebRTC stream:', error);
      return Promise.reject(error);
    }
  }

  /**
   * 销毁发布资源
   */
  public async unpublish(): Promise<boolean> {
    try {
      // 销毁发布资源
      if (!this.resourceUrl || this.resourceType !== ResourceType.PUBLISH) {
        return Promise.reject('No valid publish resource URL to unpublish');
      }

      this.status = ResourceStatus.CLOSING;

      const response = await fetch(this.resourceUrl, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(
          `Failed to unpublish: ${response.status} ${response.statusText}`,
        );
      }

      // 停止本地媒体流
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      // 关闭RTC连接
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      this.resourceUrl = '';
      this.resourceType = null;
      this.status = ResourceStatus.CLOSED;
      return true;
    } catch (error) {
      console.error('Error unpublishing resource:', error);
      this.status = ResourceStatus.FAILED;
      return Promise.reject(error);
    }
  }

  /**
   * 销毁订阅资源
   */
  public async unsubscribe(): Promise<boolean> {
    try {
      // 销毁订阅资源
      if (!this.resourceUrl || this.resourceType !== ResourceType.SUBSCRIBE) {
        return Promise.reject(
          'No valid subscription resource URL to unsubscribe',
        );
      }

      this.status = ResourceStatus.CLOSING;

      const response = await fetch(this.resourceUrl, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(
          `Failed to unsubscribe: ${response.status} ${response.statusText}`,
        );
      }

      // 关闭RTC连接
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      this.resourceUrl = '';
      this.resourceType = null;
      this.status = ResourceStatus.CLOSED;
      return true;
    } catch (error) {
      console.error('Error unsubscribing resource:', error);
      this.status = ResourceStatus.FAILED;
      return Promise.reject(error);
    }
  }

  /**
   * 静音/取消静音
   * @param muted 是否静音
   */
  public setMuted(muted: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !muted;
      });
    }
  }

  /**
   * 更新媒体流
   * @param stream 新的媒体流
   */
  public updateMediaStream(stream: MediaStream): void {
    if (!this.peerConnection || !this.localStream) {
      console.warn(
        'Cannot update media stream: No active connection or stream',
      );
      return;
    }

    // 存储新的媒体流引用
    this.localStream = stream;

    // 获取当前流的发送器
    const senders = this.peerConnection.getSenders();
    if (!senders.length) {
      console.warn('No senders found in peer connection');
      return;
    }

    // 获取新流中的音频轨道
    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) {
      console.warn('No audio tracks found in the new stream');
      return;
    }

    // 循环更新每个发送器的轨道
    senders.forEach((sender, index) => {
      if (sender.track && sender.track.kind === 'audio' && audioTracks[index]) {
        sender
          .replaceTrack(audioTracks[index])
          .then(() => {
            console.log('Successfully replaced audio track');
          })
          .catch(error => {
            console.error('Failed to replace audio track:', error);
          });
      }
    });
  }

  /**
   * 关闭并清理资源
   */
  public close(): void {
    // 关闭媒体流
    if (this.localStream) {
      this.localStream
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      this.localStream = null;
    }

    // 关闭PeerConnection
    this.closePeerConnection();

    // 重置状态
    this.resourceUrl = '';
    this.resourceType = null;
    this.config = null;
    this.status = ResourceStatus.IDLE;
  }

  /**
   * 设置PeerConnection事件监听
   */
  /**
   * 等待ICE收集完成
   * @param pc RTCPeerConnection实例
   */
  private waitForIceGathering(pc: RTCPeerConnection): Promise<void> {
    return new Promise<void>(resolve => {
      // 如果已经收集完成，直接返回
      if (pc.iceGatheringState === 'complete') {
        resolve();
        return;
      }

      // 设置收集完成时的回调
      const checkState = () => {
        if (pc.iceGatheringState === 'complete') {
          pc.removeEventListener('icegatheringstatechange', checkState);
          resolve();
        }
      };

      // 监听收集状态变化
      pc.addEventListener('icegatheringstatechange', checkState);

      // 添加超时处理，防止永远等待
      setTimeout(() => resolve(), 5000);
    });
  }

  private setupPeerConnectionListeners(): void {
    if (!this.peerConnection) return;

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log(
        'ICE connection state changed:',
        this.peerConnection?.iceConnectionState,
      );

      switch (this.peerConnection?.iceConnectionState) {
        case 'connected':
        case 'completed':
          this.status = ResourceStatus.CONNECTED;
          break;
        case 'failed':
        case 'disconnected':
          this.status = ResourceStatus.FAILED;
          break;
        case 'closed':
          this.status = ResourceStatus.CLOSED;
          break;
      }
    };

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
      }
    };
  }

  /**
   * 关闭PeerConnection
   */
  private closePeerConnection(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}

// 导出WebRTC服务单例
export default new WebRTCService();
