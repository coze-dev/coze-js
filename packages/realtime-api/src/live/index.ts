import { COZE_CN_BASE_URL, CozeAPI } from '@coze/api';

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

// 状态监听回调函数类型
export type StatusChangeCallback = (status: ResourceStatus) => void;

/**
 * 同声传译客户端
 */
export class WebLiveClient {
  private peerConnection: RTCPeerConnection | null = null;
  private resourceUrl = '';
  private status: ResourceStatus = ResourceStatus.IDLE;
  private player: HTMLAudioElement;
  private statusListeners: StatusChangeCallback[] = [];
  private liveId: string;

  constructor(liveId: string) {
    this.setupPeerConnectionListeners();
    this.player = document.createElement('audio');
    this.liveId = liveId;
  }

  /**
   * 获取当前连接状态
   */
  public getStatus(): ResourceStatus {
    return this.status;
  }

  /**
   * 添加状态变化监听器
   * @param callback 状态变化回调函数
   */
  public onStatusChange(callback: StatusChangeCallback): void {
    this.statusListeners.push(callback);
  }

  /**
   * 移除状态变化监听器
   * @param callback 要移除的回调函数
   */
  public offStatusChange(callback: StatusChangeCallback): void {
    this.removeStatusListener(callback);
  }

  /**
   * 移除状态变化监听器
   * @param callback 要移除的回调函数
   */
  public removeStatusListener(callback: StatusChangeCallback): void {
    const index = this.statusListeners.indexOf(callback);
    if (index !== -1) {
      this.statusListeners.splice(index, 1);
    }
  }

  /**
   * 订阅音频资源
   * @param appId 应用ID
   * @param streamId 流ID
   * @param clientId 客户端ID
   */
  public async subscribe(appId: string, streamId: string, clientId = '') {
    try {
      // 先清理现有连接
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      this.setStatus(ResourceStatus.CONNECTING);

      // 1. 创建RTCPeerConnection
      const rtcConfig = {
        // iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      };
      const pc = new RTCPeerConnection(rtcConfig);

      pc.ontrack = (event: RTCTrackEvent) => {
        // 音频流
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
   * 销毁订阅资源
   */
  public async unsubscribe() {
    try {
      // 销毁订阅资源
      if (!this.resourceUrl) {
        throw new Error('No valid subscription resource URL to unsubscribe');
      }

      this.setStatus(ResourceStatus.CLOSING);

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
    this.player.muted = muted;
  }

  /**
   * 关闭并清理资源
   */
  public close(): void {
    // 关闭PeerConnection
    this.closePeerConnection();

    // Clean up audio element
    if (this.player) {
      this.player.pause();
      this.player.srcObject = null;
      this.player.remove();
    }

    // 重置状态
    this.resourceUrl = '';
    this.setStatus(ResourceStatus.IDLE);
  }

  /**
   * 获取直播信息
   */
  public getLiveData = async () => {
    const api = new CozeAPI({
      baseURL: COZE_CN_BASE_URL,
      token: '', // 免登录
    });
    return await api.audio.live.retrieve(this.liveId);
  };

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
    if (!this.peerConnection) {
      return;
    }

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log(
        'ICE connection state changed:',
        this.peerConnection?.iceConnectionState,
      );

      switch (this.peerConnection?.iceConnectionState) {
        case 'connected':
        case 'completed':
          this.setStatus(ResourceStatus.CONNECTED);
          break;
        case 'failed':
        case 'disconnected':
          this.setStatus(ResourceStatus.FAILED);
          break;
        case 'closed':
          this.setStatus(ResourceStatus.CLOSED);
          break;
        default:
          console.log(
            'ICE connection state changed:',
            this.peerConnection?.iceConnectionState,
          );
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

  /**
   * 设置状态并触发监听回调
   * @param newStatus 新状态
   * @private 私有方法，仅内部使用
   */
  private setStatus(newStatus: ResourceStatus): void {
    const oldStatus = this.status;
    if (oldStatus !== newStatus) {
      this.status = newStatus;
      // 触发所有监听器
      for (const listener of this.statusListeners) {
        try {
          listener(newStatus);
        } catch (error) {
          console.error('Error in status listener:', error);
        }
      }
    }
  }
}
