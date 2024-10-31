import { type AudioPropertiesConfig } from '@volcengine/rtc';
import { CozeAPI, type CreateRoomData } from '@coze/api';

import * as RealtimeUtils from './utils.js';
import { RealtimeEventHandler, EventNames } from './event-handler.js';
import { RealtimeAPIError, RealtimeError } from './error.js';
import { EngineClient } from './client.js';

export interface RealtimeClientConfig {
  accessToken: string /** 必填(required)，Access Token */;
  botId: string /** 必填(required)，Bot Id */;
  voiceId?: string /** 可选(optional)，音色Id */;
  conversationId?: string /** 可选(optional)，会话Id */;
  baseURL?: string /** 可选(optional)，默认 https://api.coze.cn */;
  debug?: boolean /** 可选(optional)，默认 false */;
  /** Whether Personal Access Tokens (PAT) are allowed in browser environments */
  allowPersonalAccessTokenInBrowser?: boolean;
  /** Whether to mute by default, defaults to false
   * If set to true, audio streams will not be automatically published and subscribed */
  audioMutedDefault?: boolean;
  connectorId?: string /** 可选(optional)，Connector Id，默认值为 '999' */;
}

class RealtimeClient extends RealtimeEventHandler {
  private _config: RealtimeClientConfig;
  private _client: EngineClient | null = null;
  private _roomInfo: CreateRoomData | null = null;
  public isConnected = false;
  private _api: CozeAPI;
  private _isTestEnv = false;

  /**
   * Constructor for initializing a RealtimeClient instance.
   *
   * 构造函数，初始化RealtimeClient实例。
   *
   * @param config
   * @param config.accessToken - Required, Access Token. |
   *                            必填，Access Token。
   * @param config.botId - Required, Bot Id. |
   *                       必填，Bot Id。
   * @param config.voiceId - Optional, Voice Id. |
   *                         可选，音色Id。
   * @param config.conversationId - Optional, Conversation Id. |
   *                               可选，会话Id。
   * @param config.baseURL - Optional, defaults to "https://api.coze.cn". |
   *                        可选，默认值为 "https://api.coze.cn"。
   * @param config.debug - Optional, defaults to false.
   *                      可选，默认值为 false。
   * @param config.allowPersonalAccessTokenInBrowser
   * - Optional, whether to allow personal access tokens in browser environment. |
   *   可选，是否允许在浏览器环境中使用个人访问令牌。
   * @param config.audioMutedDefault - Optional, whether audio is muted by default, defaults to false. |
   *                                  可选，默认是否静音，默认值为 false。
   */
  constructor(config: RealtimeClientConfig) {
    super(config.debug);
    this._config = config;

    const defaultBaseURL = this._config.baseURL ?? 'https://api.coze.cn';
    this._config.baseURL = defaultBaseURL;
    // init api
    this._api = new CozeAPI({
      token: this._config.accessToken,
      baseURL: defaultBaseURL,
      allowPersonalAccessTokenInBrowser:
        this._config.allowPersonalAccessTokenInBrowser,
    });
    this._isTestEnv = defaultBaseURL !== 'https://api.coze.cn';
  }

  /**
   * en: Establish a connection to the Coze API and join the room
   *
   * zh: 建立与 Coze API 的连接并加入房间
   */
  async connect() {
    const { botId, conversationId, voiceId } = this._config;

    // step1 get token
    const roomInfo = await this._api.audio.rooms.create({
      bot_id: botId,
      conversation_id: conversationId,
      voice_id: voiceId && voiceId.length > 0 ? voiceId : undefined,
      connector_id: this._config.connectorId ?? '999',
    });
    this._roomInfo = roomInfo;

    // step2 create engine
    this._client = new EngineClient(
      roomInfo.app_id,
      this._config.debug,
      this._isTestEnv,
    );

    // step3 bind engine events
    this._client.bindEngineEvents();
    this._client.on(EventNames.ALL, (eventName: string, data: unknown) => {
      this.dispatch(eventName, data);
    });

    // step4 join room
    await this._client.joinRoom({
      token: roomInfo.token,
      roomId: roomInfo.room_id,
      uid: roomInfo.uid,
      audioMutedDefault: this._config.audioMutedDefault ?? false,
    });

    // step5 create local stream
    await this._client.createLocalStream();

    // step6 set connected and dispatch connected event
    this.isConnected = true;
    this.dispatch(EventNames.CONNECTED, {
      roomId: roomInfo.room_id,
      uid: roomInfo.uid,
      token: roomInfo.token,
      appId: roomInfo.app_id,
    });
    this._log('dispatch client.connected event');
  }

  /**
   * en: Interrupt the current conversation
   *
   * zh: 中断当前对话
   */
  async interrupt() {
    await this._client?.stop();
    this.dispatch(EventNames.INTERRUPTED, {});
    this._log('dispatch client.interrupted event');
  }

  /**
   * en: Disconnect from the current session
   *
   * zh: 断开与当前会话的连接
   */
  async disconnect() {
    await this._client?.disconnect();

    this.isConnected = false;
    this.dispatch(EventNames.DISCONNECTED, {});
  }

  /**
   * en: Send a message to the bot
   *
   * zh: 发送消息给Bot
   */
  async sendMessage(message: Record<string, unknown>) {
    await this._client?.sendMessage(message);
    const eventType =
      typeof message.event_type === 'string'
        ? message.event_type
        : 'unknown_event';
    this.dispatch(`client.${eventType}`, message);
  }

  /**
   * en: Enable or disable audio
   *
   * zh: 启用或禁用音频
   */
  async setAudioEnable(isEnable: boolean) {
    await this._client?.changeAudioState(isEnable);
    if (isEnable) {
      this.dispatch(EventNames.AUDIO_UNMUTED, {});
    } else {
      this.dispatch(EventNames.AUDIO_MUTED, {});
    }
  }

  /**
   * en: Enable audio properties reporting (debug mode only)
   *
   * zh: 启用音频属性报告（仅限调试模式）
   */
  enableAudioPropertiesReport(config?: AudioPropertiesConfig) {
    if (this._config.debug) {
      this._client?.enableAudioPropertiesReport(config);
      return true;
    } else {
      console.warn(
        'enableAudioPropertiesReport is not supported in non-debug mode',
      );
      return false;
    }
  }

  /**
   * en: Start audio playback device test (debug mode only)
   *
   * zh: 开始音频播放设备测试（仅限调试模式）
   */
  async startAudioPlaybackDeviceTest() {
    if (this._config.debug) {
      await this._client?.startAudioPlaybackDeviceTest();
    } else {
      console.warn(
        'startAudioPlaybackDeviceTest is not supported in non-debug mode',
      );
    }
  }

  /**
   * en: Stop audio playback device test (debug mode only)
   *
   * zh: 停止音频播放设备测试（仅限调试模式）
   */
  stopAudioPlaybackDeviceTest() {
    if (this._config.debug) {
      this._client?.stopAudioPlaybackDeviceTest();
    } else {
      console.warn(
        'stopAudioPlaybackDeviceTest is not supported in non-debug mode',
      );
    }
  }
}

export {
  RealtimeUtils,
  RealtimeClient,
  RealtimeAPIError,
  RealtimeError,
  EventNames,
};
