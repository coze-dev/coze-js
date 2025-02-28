import {
  type ScreenConfig,
  type AudioPropertiesConfig,
  type IRTCEngine,
} from '@volcengine/rtc';
import { CozeAPI, type CreateRoomData, type GetToken } from '@coze/api';

import * as RealtimeUtils from './utils';
import { isScreenShareDevice } from './utils';
import { RealtimeEventHandler, EventNames } from './event-handler';
import { RealtimeAPIError, RealtimeError } from './error';
import { EngineClient } from './client';
export interface VideoConfig {
  videoOnDefault?: boolean /** optional, Whether to turn on video by default, defaults to true */;
  renderDom?: string /** optional, The DOM element to render the video stream to */;
  videoInputDeviceId?: string /** optional, The device ID of the video input device to use */;
  screenConfig?: ScreenConfig; // optional, Screen share configuration if videoInputDeviceId is 'screenShare' see https://www.volcengine.com/docs/6348/104481#screenconfig for more details
}

export interface RealtimeClientConfig {
  accessToken: GetToken /** required, Access Token */;
  botId: string /** required, Bot Id */;
  voiceId?: string /** optional, Voice Id */;
  conversationId?: string /** optional, Conversation Id */;
  userId?: string /** optional, User Id */;
  workflowId?: string /** optional, Workflow Id */;
  baseURL?: string /** optional, defaults to "https://api.coze.cn" */;
  debug?: boolean /** optional, defaults to false */;
  /** Whether Personal Access Tokens (PAT) are allowed in browser environments */
  allowPersonalAccessTokenInBrowser?: boolean;
  /** Whether to mute by default, defaults to false
   * If set to true, audio streams will not be automatically published and subscribed */
  audioMutedDefault?: boolean;
  connectorId: string /** required, Connector Id */;
  suppressStationaryNoise?: boolean /** optional, Suppress stationary noise, defaults to false */;
  suppressNonStationaryNoise?: boolean /** optional, Suppress non-stationary noise, defaults to false */;
  videoConfig?: VideoConfig /** optional, Video configuration */;
  isAutoSubscribeAudio?: boolean /** optional, Whether to automatically subscribe to bot reply audio streams, defaults to true */;
}

class RealtimeClient extends RealtimeEventHandler {
  public _config: RealtimeClientConfig;
  private _client: EngineClient | null = null;
  public isConnected = false;
  private _api: CozeAPI;
  private _isTestEnv = false;
  public _isSupportVideo = false;

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
   * @param config.userId - Optional, User Id. |
   *                        可选，用户Id。
   * @param config.baseURL - Optional, defaults to "https://api.coze.cn". |
   *                        可选，默认值为 "https://api.coze.cn"。
   * @param config.debug - Optional, defaults to false.
   *                      可选，默认值为 false。
   * @param config.allowPersonalAccessTokenInBrowser
   * - Optional, whether to allow personal access tokens in browser environment. |
   *   可选，是否允许在浏览器环境中使用个人访问令牌。
   * @param config.audioMutedDefault - Optional, whether audio is muted by default, defaults to false. |
   *                                  可选，默认是否静音，默认值为 false。
   * @param config.connectorId - Required, Connector Id. |
   *                             必填，渠道 Id。
   * @param config.suppressStationaryNoise - Optional, suppress stationary noise, defaults to false. |
   *                                       可选，默认是否抑制静态噪声，默认值为 false。
   * @param config.suppressNonStationaryNoise - Optional, suppress non-stationary noise, defaults to false. |
   *                                         可选，默认是否抑制非静态噪声，默认值为 false。
   * @param config.isAutoSubscribeAudio - Optional, whether to automatically subscribe to bot reply audio streams, defaults to true. |
   * @param config.videoConfig - Optional, Video configuration. |
   *                            可选，视频配置。
   * @param config.videoConfig.videoOnDefault - Optional, Whether to turn on video by default, defaults to true. |
   *                                            可选，默认是否开启视频，默认值为 true。
   * @param config.videoConfig.renderDom - Optional, The DOM element to render the video stream to. |
   *                                       可选，渲染视频流的 DOM 元素。
   * @param config.videoConfig.videoInputDeviceId - Optional, The device ID of the video input device to use. |
   *                                               可选，视频输入设备的设备 ID。
   * @param config.videoConfig.screenConfig - Optional, Screen share configuration if videoInputDeviceId is 'screenShare' see https://www.volcengine.com/docs/6348/104481#screenconfig for more details. |
   *                                         可选，屏幕共享配置，如果 videoInputDeviceId 是 'screenShare'，请参考 https://www.volcengine.com/docs/6348/104481#screenconfig 了解更多详情。
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
    this._isSupportVideo = !!config.videoConfig;
  }

  /**
   * en: Establish a connection to the Coze API and join the room
   *
   * zh: 建立与 Coze API 的连接并加入房间
   */
  async connect() {
    const { botId, conversationId, voiceId } = this._config;

    let roomInfo: CreateRoomData;
    try {
      // Step1 get token
      let config = undefined;
      if (this._config.videoConfig) {
        if (isScreenShareDevice(this._config.videoConfig.videoInputDeviceId)) {
          config = {
            video_config: {
              stream_video_type: 'screen' as const,
            },
          };
        } else {
          config = {
            video_config: {
              stream_video_type: 'main' as const,
            },
          };
        }
      }
      roomInfo = await this._api.audio.rooms.create({
        bot_id: botId,
        conversation_id: conversationId || undefined,
        voice_id: voiceId && voiceId.length > 0 ? voiceId : undefined,
        connector_id: this._config.connectorId,
        uid: this._config.userId || undefined,
        workflow_id: this._config.workflowId || undefined,
        config,
      });
    } catch (error) {
      this.dispatch(EventNames.ERROR, error);
      throw new RealtimeAPIError(
        RealtimeError.CREATE_ROOM_ERROR,
        error instanceof Error ? error.message : 'Unknown error',
        error,
      );
    }

    // Step2 create engine
    this._client = new EngineClient(
      roomInfo.app_id,
      this._config.debug,
      this._isTestEnv,
      this._isSupportVideo,
      this._config.videoConfig,
    );

    // Step3 bind engine events
    this._client.bindEngineEvents();
    this._client.on(EventNames.ALL, (eventName: string, data: unknown) => {
      this.dispatch(eventName, data, false);
    });

    if (this._config.suppressStationaryNoise) {
      await this._client.enableAudioNoiseReduction();
      this.dispatch(EventNames.SUPPRESS_STATIONARY_NOISE, {});
    }

    if (this._config.suppressNonStationaryNoise) {
      await this._client.initAIAnsExtension();
      this._client.changeAIAnsExtension(true);
      this.dispatch(EventNames.SUPPRESS_NON_STATIONARY_NOISE, {});
    }

    // Step4 join room
    await this._client.joinRoom({
      token: roomInfo.token,
      roomId: roomInfo.room_id,
      uid: roomInfo.uid,
      audioMutedDefault: this._config.audioMutedDefault ?? false,
      videoOnDefault: this._config.videoConfig?.videoOnDefault ?? true,
      isAutoSubscribeAudio: this._config.isAutoSubscribeAudio ?? true,
    });

    // Step5 create local stream
    await this._client.createLocalStream(
      roomInfo.uid,
      this._config.videoConfig,
    );

    // step6 set connected and dispatch connected event
    this.isConnected = true;
    this.dispatch(EventNames.CONNECTED, {
      roomId: roomInfo.room_id,
      uid: roomInfo.uid,
      token: roomInfo.token,
      appId: roomInfo.app_id,
    });
  }

  /**
   * en: Interrupt the current conversation
   *
   * zh: 中断当前对话
   */
  async interrupt() {
    await this._client?.stop();
    this.dispatch(EventNames.INTERRUPTED, {});
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

  async setVideoEnable(isEnable: boolean) {
    await this._client?.changeVideoState(isEnable);
    if (isEnable) {
      this.dispatch(EventNames.VIDEO_ON, {});
    } else {
      this.dispatch(EventNames.VIDEO_OFF, {});
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

  /**
   * en: Set the audio input device
   *
   * zh: 设置音频输入设备
   */
  async setAudioInputDevice(deviceId: string) {
    await this._client?.setAudioInputDevice(deviceId);
    this.dispatch(EventNames.AUDIO_INPUT_DEVICE_CHANGED, { deviceId });
  }

  /**
   * en: Set the audio output device
   *
   * zh: 设置音频输出设备
   */
  async setAudioOutputDevice(deviceId: string) {
    await this._client?.setAudioOutputDevice(deviceId);
    this.dispatch(EventNames.AUDIO_OUTPUT_DEVICE_CHANGED, { deviceId });
  }

  async setVideoInputDevice(deviceId: string) {
    await this._client?.setVideoInputDevice(deviceId);
    this.dispatch(EventNames.VIDEO_INPUT_DEVICE_CHANGED, { deviceId });
  }

  /**
   * en: Get the RTC engine instance, for detail visit https://www.volcengine.com/docs/6348/104481
   *
   * zh: 获取 RTC 引擎实例，详情请访问 https://www.volcengine.com/docs/6348/104481
   */
  getRtcEngine(): IRTCEngine | undefined {
    return this._client?.getRtcEngine();
  }
}

export {
  RealtimeUtils,
  RealtimeClient,
  RealtimeAPIError,
  RealtimeError,
  EventNames,
};
