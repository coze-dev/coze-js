import VERTC, {
  type AudioPropertiesConfig,
  type IRTCEngine,
  MediaType,
  type onUserJoinedEvent,
  type onUserLeaveEvent,
  type UserMessageEvent,
} from '@volcengine/rtc';

import { RealtimeEventHandler } from './event-handler';
import { RealtimeAPIError, RealtimeError } from './error';

export class EngineClient extends RealtimeEventHandler {
  private engine: IRTCEngine;
  private joinUserId = '';
  constructor(appId: string, debug = false, isTestEnv = false) {
    super(debug);

    if (isTestEnv) {
      VERTC.setParameter('ICE_CONFIG_REQUEST_URLS', ['rtc-test.bytedance.com']);
    }

    this.engine = VERTC.createEngine(appId);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleUserJoin = this.handleUserJoin.bind(this);
    this.handleUserLeave = this.handleUserLeave.bind(this);
    this.handleEventError = this.handleEventError.bind(this);

    // Debug only
    this.handleLocalAudioPropertiesReport =
      this.handleLocalAudioPropertiesReport.bind(this);
    this.handleRemoteAudioPropertiesReport =
      this.handleRemoteAudioPropertiesReport.bind(this);
  }

  bindEngineEvents() {
    this.engine.on(VERTC.events.onUserMessageReceived, this.handleMessage);
    this.engine.on(VERTC.events.onUserJoined, this.handleUserJoin);
    this.engine.on(VERTC.events.onUserLeave, this.handleUserLeave);
    this.engine.on(VERTC.events.onError, this.handleEventError);

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

  handleMessage(event: UserMessageEvent) {
    try {
      const message = JSON.parse(event.message);
      this.dispatch(`server.${message.event_type}`, message);
    } catch (e) {
      this.dispatch('client.error', {
        message: `Failed to parse message: ${event.message}`,
        error: e,
      });
    }
  }

  handleEventError(e: unknown) {
    this.dispatch('client.error', e);
  }

  handleUserJoin(event: onUserJoinedEvent) {
    this.joinUserId = event.userInfo.userId;
    this.dispatch('server.bot.join', event);
  }

  handleUserLeave(event: onUserLeaveEvent) {
    this.dispatch('server.bot.leave', event);
  }

  async joinRoom(options: {
    token: string;
    roomId: string;
    uid: string;
    audioMutedDefault?: boolean;
  }) {
    const { token, roomId, uid, audioMutedDefault = false } = options;
    try {
      await this.engine.joinRoom(
        token,
        roomId,
        {
          userId: uid,
        },
        {
          isAutoPublish: !audioMutedDefault,
          isAutoSubscribeAudio: true,
          isAutoSubscribeVideo: false,
        },
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new RealtimeAPIError(RealtimeError.CONNECTION_ERROR, e.message);
      }
      throw new RealtimeAPIError(
        RealtimeError.CONNECTION_ERROR,
        'Unknown error',
      );
    }
  }

  async getDevices() {
    const devices = await VERTC.enumerateDevices();
    return {
      audioInputs: devices.filter(i => i.deviceId && i.kind === 'audioinput'),
    };
  }

  async createLocalStream() {
    const devices = await this.getDevices();
    if (!devices.audioInputs.length) {
      throw new RealtimeAPIError(
        RealtimeError.DEVICE_ACCESS_ERROR,
        'Failed to get devices',
      );
    }

    await this.engine.startAudioCapture(devices.audioInputs[0].deviceId);
  }

  async disconnect() {
    try {
      await this.engine.stopAudioCapture();
      await this.engine.unpublishStream(MediaType.AUDIO);
      await this.engine.leaveRoom();
      this.removeEventListener();
    } catch (e) {
      this.dispatch('client.error', e);
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
      this.dispatch('client.error', e);
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
      this.dispatch('client.error', e);
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
      this.dispatch('client.error', e);
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

  async startAudioPlaybackDeviceTest() {
    try {
      await this.engine.startAudioPlaybackDeviceTest('audio-test.wav', 200);
    } catch (e) {
      this.dispatch('client.error', e);
      throw e;
    }
  }

  stopAudioPlaybackDeviceTest() {
    try {
      this.engine.stopAudioPlaybackDeviceTest();
    } catch (e) {
      this.dispatch('client.error', e);
      throw e;
    }
  }
}
