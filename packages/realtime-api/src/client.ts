import RTCAIAnsExtension from '@volcengine/rtc/extension-ainr';
import VERTC, {
  type AudioPropertiesConfig,
  type IRTCEngine,
  MediaType,
  type NetworkQuality,
  type onUserJoinedEvent,
  type onUserLeaveEvent,
  StreamIndex,
  type UserMessageEvent,
  VideoSourceType,
} from '@volcengine/rtc';

import {
  getAudioDevices,
  isMobileVideoDevice,
  isScreenShareDevice,
} from './utils';
import EventNames from './event-names';
import { RealtimeEventHandler } from './event-handler';
import { RealtimeAPIError, RealtimeError } from './error';
import { type VideoConfig } from '.';

export class EngineClient extends RealtimeEventHandler {
  private engine: IRTCEngine;
  private joinUserId = '';
  private _AIAnsExtension: RTCAIAnsExtension | null = null;
  private _isSupportVideo = false;
  private _videoConfig?: VideoConfig;
  private _streamIndex?: StreamIndex;
  private _roomUserId?: string;

  // eslint-disable-next-line max-params
  constructor(
    appId: string,
    debug = false,
    isTestEnv = false,
    isSupportVideo = false,
    videoConfig?: VideoConfig,
  ) {
    super(debug);

    if (isTestEnv) {
      VERTC.setParameter('ICE_CONFIG_REQUEST_URLS', ['rtc-test.bytedance.com']);
    }

    this.engine = VERTC.createEngine(appId);

    this.handleMessage = this.handleMessage.bind(this);
    this.handleUserJoin = this.handleUserJoin.bind(this);
    this.handleUserLeave = this.handleUserLeave.bind(this);
    this.handleEventError = this.handleEventError.bind(this);
    this.handlePlayerEvent = this.handlePlayerEvent.bind(this);
    this.handleNetworkQuality = this.handleNetworkQuality.bind(this);
    this.handleTrackEnded = this.handleTrackEnded.bind(this);

    // Debug only
    this.handleLocalAudioPropertiesReport =
      this.handleLocalAudioPropertiesReport.bind(this);
    this.handleRemoteAudioPropertiesReport =
      this.handleRemoteAudioPropertiesReport.bind(this);

    this._isSupportVideo = isSupportVideo;
    this._videoConfig = videoConfig;
  }

  bindEngineEvents() {
    this.engine.on(VERTC.events.onUserMessageReceived, this.handleMessage);
    this.engine.on(VERTC.events.onUserJoined, this.handleUserJoin);
    this.engine.on(VERTC.events.onUserLeave, this.handleUserLeave);
    this.engine.on(VERTC.events.onError, this.handleEventError);
    this.engine.on(VERTC.events.onNetworkQuality, this.handleNetworkQuality);
    this.engine.on(VERTC.events.onTrackEnded, this.handleTrackEnded);

    if (this._isSupportVideo) {
      this.engine.on(VERTC.events.onPlayerEvent, this.handlePlayerEvent);
    }

    if (this._debug) {
      this.engine.on(
        VERTC.events.onLocalAudioPropertiesReport,
        this.handleLocalAudioPropertiesReport,
      );
      this.engine.on(
        VERTC.events.onRemoteAudioPropertiesReport,
        this.handleRemoteAudioPropertiesReport,
      );
    }
  }

  removeEventListener() {
    this.engine.off(VERTC.events.onUserMessageReceived, this.handleMessage);
    this.engine.off(VERTC.events.onUserJoined, this.handleUserJoin);
    this.engine.off(VERTC.events.onUserLeave, this.handleUserLeave);
    this.engine.off(VERTC.events.onError, this.handleEventError);
    this.engine.off(VERTC.events.onNetworkQuality, this.handleNetworkQuality);
    this.engine.off(VERTC.events.onTrackEnded, this.handleTrackEnded);

    if (this._isSupportVideo) {
      this.engine.off(VERTC.events.onPlayerEvent, this.handlePlayerEvent);
    }

    if (this._debug) {
      this.engine.off(
        VERTC.events.onLocalAudioPropertiesReport,
        this.handleLocalAudioPropertiesReport,
      );
      this.engine.off(
        VERTC.events.onRemoteAudioPropertiesReport,
        this.handleRemoteAudioPropertiesReport,
      );
    }
  }

  _parseMessage(event: UserMessageEvent) {
    try {
      return JSON.parse(event.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      throw new RealtimeAPIError(
        RealtimeError.PARSE_MESSAGE_ERROR,
        e?.message || 'Unknown error',
      );
    }
  }

  handleMessage(event: UserMessageEvent) {
    try {
      const message = this._parseMessage(event);
      this.dispatch(`server.${message.event_type}`, message);
    } catch (e) {
      if (e instanceof RealtimeAPIError) {
        if (e.code === RealtimeError.PARSE_MESSAGE_ERROR) {
          this.dispatch(EventNames.ERROR, {
            message: `Failed to parse message: ${event.message}`,
            error: e,
          });
        } else if (e.code === RealtimeError.HANDLER_MESSAGE_ERROR) {
          this.dispatch(EventNames.ERROR, {
            message: `Failed to handle message: ${event.message}`,
            error: e,
          });
        }
      } else {
        this.dispatch(EventNames.ERROR, e);
      }
    }
  }

  handleEventError(e: unknown) {
    this.dispatch(EventNames.ERROR, e);
  }

  handleUserJoin(event: onUserJoinedEvent) {
    this.joinUserId = event.userInfo.userId;
    this.dispatch(EventNames.BOT_JOIN, event);
  }

  handleUserLeave(event: onUserLeaveEvent) {
    this.dispatch(EventNames.BOT_LEAVE, event);
  }

  handlePlayerEvent(event: unknown) {
    this.dispatch(EventNames.PLAYER_EVENT, event);
  }

  handleNetworkQuality(
    uplinkNetworkQuality: NetworkQuality,
    downlinkNetworkQuality: NetworkQuality,
  ) {
    this.dispatch(EventNames.NETWORK_QUALITY, {
      uplinkNetworkQuality,
      downlinkNetworkQuality,
    });
  }

  handleTrackEnded(event: unknown) {
    this.dispatch(EventNames.TRACK_ENDED, event);
  }

  async joinRoom(options: {
    token: string;
    roomId: string;
    uid: string;
    audioMutedDefault?: boolean;
    videoOnDefault?: boolean;
    isAutoSubscribeAudio?: boolean;
  }) {
    const {
      token,
      roomId,
      uid,
      audioMutedDefault,
      videoOnDefault,
      isAutoSubscribeAudio,
    } = options;
    try {
      await this.engine.joinRoom(
        token,
        roomId,
        {
          userId: uid,
        },
        {
          isAutoPublish: !audioMutedDefault,
          isAutoSubscribeAudio,
          isAutoSubscribeVideo: this._isSupportVideo && videoOnDefault,
        },
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new RealtimeAPIError(RealtimeError.CONNECTION_ERROR, e.message);
      }
    }
  }

  async setAudioInputDevice(deviceId: string) {
    const devices = await getAudioDevices();
    if (devices.audioInputs.findIndex(i => i.deviceId === deviceId) === -1) {
      throw new RealtimeAPIError(
        RealtimeError.DEVICE_ACCESS_ERROR,
        `Audio input device not found: ${deviceId}`,
      );
    }
    this.engine.stopAudioCapture();
    await this.engine.startAudioCapture(deviceId);
  }

  async setAudioOutputDevice(deviceId: string) {
    const devices = await getAudioDevices({ video: false });
    if (devices.audioOutputs.findIndex(i => i.deviceId === deviceId) === -1) {
      throw new RealtimeAPIError(
        RealtimeError.DEVICE_ACCESS_ERROR,
        `Audio output device not found: ${deviceId}`,
      );
    }
    await this.engine.setAudioPlaybackDevice(deviceId);
  }

  async setVideoInputDevice(deviceId: string, isAutoCapture = true) {
    const devices = await getAudioDevices({ video: true });
    if (
      !isMobileVideoDevice(deviceId) &&
      devices.videoInputs.findIndex(i => i.deviceId === deviceId) === -1
    ) {
      throw new RealtimeAPIError(
        RealtimeError.DEVICE_ACCESS_ERROR,
        `Video input device not found: ${deviceId}`,
      );
    }

    await this.changeVideoState(false);
    if (isScreenShareDevice(deviceId)) {
      if (this._streamIndex === StreamIndex.STREAM_INDEX_MAIN) {
        this.engine.setLocalVideoPlayer(StreamIndex.STREAM_INDEX_MAIN);
      }
      if (isAutoCapture) {
        this.engine.setVideoSourceType(
          StreamIndex.STREAM_INDEX_SCREEN,
          VideoSourceType.VIDEO_SOURCE_TYPE_INTERNAL,
        );
        await this.engine.startScreenCapture(this._videoConfig?.screenConfig);
        await this.engine.publishScreen(MediaType.VIDEO);
      }
      this._streamIndex = StreamIndex.STREAM_INDEX_SCREEN;
    } else {
      if (this._streamIndex === StreamIndex.STREAM_INDEX_SCREEN) {
        this.engine.setLocalVideoPlayer(StreamIndex.STREAM_INDEX_SCREEN);
      }

      if (isAutoCapture) {
        await this.engine.startVideoCapture(deviceId);
      }
      this._streamIndex = StreamIndex.STREAM_INDEX_MAIN;
    }

    this.engine.setLocalVideoPlayer(this._streamIndex, {
      renderDom: this._videoConfig?.renderDom || 'local-player',
      userId: this._roomUserId,
    });
  }

  async createLocalStream(userId?: string, videoConfig?: VideoConfig) {
    this._roomUserId = userId;
    const devices = await getAudioDevices({ video: this._isSupportVideo });
    if (!devices.audioInputs.length) {
      throw new RealtimeAPIError(
        RealtimeError.DEVICE_ACCESS_ERROR,
        'Failed to get audio devices',
      );
    }

    if (this._isSupportVideo && !devices.videoInputs.length) {
      throw new RealtimeAPIError(
        RealtimeError.DEVICE_ACCESS_ERROR,
        'Failed to get video devices',
      );
    }

    await this.engine.startAudioCapture(devices.audioInputs[0].deviceId);

    if (this._isSupportVideo) {
      await this.setVideoInputDevice(
        videoConfig?.videoInputDeviceId || devices.videoInputs[0].deviceId,
        videoConfig?.videoOnDefault,
      );
    }
  }

  async disconnect() {
    try {
      await this.engine.leaveRoom();
      this.removeEventListener();
      this.clearEventHandlers();
      VERTC.destroyEngine(this.engine);
    } catch (e) {
      this.dispatch(EventNames.ERROR, e);
      throw e;
    }
  }

  async changeAudioState(isMicOn: boolean) {
    try {
      if (isMicOn) {
        await this.engine.publishStream(MediaType.AUDIO);
      } else {
        await this.engine.unpublishStream(MediaType.AUDIO);
      }
    } catch (e) {
      this.dispatch(EventNames.ERROR, e);
      throw e;
    }
  }

  async changeVideoState(isVideoOn: boolean) {
    try {
      if (isVideoOn) {
        if (this._streamIndex === StreamIndex.STREAM_INDEX_MAIN) {
          await this.engine.startVideoCapture();
        } else {
          this.engine.setVideoSourceType(
            StreamIndex.STREAM_INDEX_SCREEN,
            VideoSourceType.VIDEO_SOURCE_TYPE_INTERNAL,
          );
          await this.engine.startScreenCapture(this._videoConfig?.screenConfig);
          await this.engine.publishScreen(MediaType.VIDEO);
        }
      } else {
        if (this._streamIndex === StreamIndex.STREAM_INDEX_MAIN) {
          await this.engine.stopVideoCapture();
        } else {
          await this.engine.stopScreenCapture();
          await this.engine.unpublishScreen(MediaType.VIDEO);
        }
      }
    } catch (e) {
      this.dispatch(EventNames.ERROR, e);
      throw e;
    }
  }

  async stop() {
    try {
      const result = await this.engine.sendUserMessage(
        this.joinUserId,
        JSON.stringify({
          id: 'event_1',
          event_type: 'conversation.chat.cancel',
          data: {},
        }),
      );
      this._log(`interrupt ${this.joinUserId} ${result}`);
    } catch (e) {
      this.dispatch(EventNames.ERROR, e);
      throw e;
    }
  }

  async sendMessage(message: Record<string, unknown>) {
    try {
      const result = await this.engine.sendUserMessage(
        this.joinUserId,
        JSON.stringify(message),
      );
      this._log(
        `sendMessage ${this.joinUserId} ${JSON.stringify(message)} ${result}`,
      );
    } catch (e) {
      this.dispatch(EventNames.ERROR, e);
      throw e;
    }
  }

  enableAudioPropertiesReport(config?: AudioPropertiesConfig) {
    this.engine.enableAudioPropertiesReport(config);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleLocalAudioPropertiesReport(event: any) {
    if (this._debug && event[0]?.audioPropertiesInfo?.linearVolume > 0) {
      console.log('handleLocalAudioPropertiesReport', event);
    }
  }

  handleRemoteAudioPropertiesReport(event: unknown) {
    if (this._debug) {
      console.log('handleRemoteAudioPropertiesReport', event);
    }
  }

  async enableAudioNoiseReduction() {
    await this.engine?.setAudioCaptureConfig({
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true,
    });
  }

  async initAIAnsExtension() {
    const AIAnsExtension = new RTCAIAnsExtension();
    await this.engine.registerExtension(AIAnsExtension);
    this._AIAnsExtension = AIAnsExtension;
  }

  changeAIAnsExtension(enable: boolean) {
    if (enable) {
      this._AIAnsExtension?.enable();
    } else {
      this._AIAnsExtension?.disable();
    }
  }

  async startAudioPlaybackDeviceTest() {
    try {
      await this.engine.startAudioPlaybackDeviceTest('audio-test.wav', 200);
    } catch (e) {
      this.dispatch(EventNames.ERROR, e);
      throw e;
    }
  }

  stopAudioPlaybackDeviceTest() {
    try {
      this.engine.stopAudioPlaybackDeviceTest();
    } catch (e) {
      this.dispatch(EventNames.ERROR, e);
      throw e;
    }
  }

  getRtcEngine() {
    return this.engine;
  }
}
