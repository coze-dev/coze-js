import { v4 as uuid } from 'uuid';

import { type WavStreamPlayer } from '../wavtools';
import {
  type WsChatClientOptions,
  WsChatEventNames,
  type WsChatCallbackHandler,
  type WsChatEventData,
  type SentenceItem,
  ClientEventType,
} from '../types';
import {
  APIError,
  type AudioCodec,
  type ConversationAudioSentenceStartEvent,
  COZE_CN_BASE_WS_URL,
  CozeAPI,
  type CreateChatWsReq,
  type CreateChatWsRes,
  type ErrorRes,
  RoleType,
  type WebSocketAPI,
  WebsocketsEventType,
} from '../../index';

abstract class BaseWsChatClient {
  public ws: WebSocketAPI<CreateChatWsReq, CreateChatWsRes> | null = null;
  protected listeners: Map<string, Set<WsChatCallbackHandler>> = new Map();
  protected wavStreamPlayer?: WavStreamPlayer;
  protected trackId = 'default';
  protected api: CozeAPI;
  protected audioDeltaList: string[] = [];
  /** 句子列表队列 */
  protected sentenceList: SentenceItem[] = [];
  /** 首个音频delta的时间戳（用于计算实际经过的时间）*/
  protected firstAudioDeltaTime: number | null = null;
  // 当前播放的句子索引
  protected currentSentenceIndex = -1;
  // 句子切换定时器
  protected sentenceSwitchTimer: NodeJS.Timeout | null = null;
  // 音频完成定时器
  protected audioCompletedTimer: NodeJS.Timeout | null = null;
  public config: WsChatClientOptions;
  protected outputAudioCodec: AudioCodec = 'pcm';
  protected outputAudioSampleRate = 24000;

  constructor(config: WsChatClientOptions) {
    this.api = new CozeAPI({
      baseWsURL: COZE_CN_BASE_WS_URL,
      ...config,
      debug: false,
    });

    this.config = config;
  }

  protected async init() {
    if (this.ws) {
      return this.ws;
    }
    const ws = await this.api.websockets.chat.create(
      {
        bot_id: this.config.botId,
        workflow_id: this.config.workflowId,
      },
      this.config.websocketOptions,
    );
    this.ws = ws;

    // 标记 websocket 是否已 resolve or reject
    let isResolved = false;

    this.trackId = `my-track-id-${uuid()}`;

    return new Promise<WebSocketAPI<CreateChatWsReq, CreateChatWsRes>>(
      (resolve, reject) => {
        ws.onopen = () => {
          this.log('ws open');
        };

        ws.onmessage = data => {
          // Trigger all registered event listeners
          this.emit(`server.${data.event_type}`, data);

          switch (data.event_type) {
            case WebsocketsEventType.ERROR:
              this.closeWs();
              if (isResolved) {
                return;
              }
              isResolved = true;
              reject(
                new APIError(
                  data.data.code,
                  {
                    code: data.data.code,
                    msg: data.data.msg,
                    detail: data.detail,
                  },
                  undefined,
                  undefined,
                ),
              );
              return;

            case WebsocketsEventType.CHAT_CREATED:
              resolve(ws);
              isResolved = true;
              break;

            case WebsocketsEventType.CONVERSATION_AUDIO_DELTA:
              this.audioDeltaList.push(data.data.content);
              if (this.audioDeltaList.length === 1) {
                this.handleAudioMessage();
              }
              break;

            case WebsocketsEventType.CONVERSATION_AUDIO_SENTENCE_START:
              this.handleSentenceStart(data);
              break;

            case WebsocketsEventType.INPUT_AUDIO_BUFFER_SPEECH_STARTED:
              this.clear();
              break;

            case WebsocketsEventType.CONVERSATION_AUDIO_COMPLETED:
              this.handleAudioCompleted();
              break;

            case WebsocketsEventType.CONVERSATION_CHAT_CANCELED:
              // this.isInterrupted = false;
              this.emitSentenceEnd();
              this.clear();
              break;
            default:
              break;
          }
        };

        ws.onerror = (error, event) => {
          this.warn('ws error', error, event);

          this.emit(`server.${WebsocketsEventType.ERROR}`, error);

          this.closeWs();
          if (isResolved) {
            return;
          }
          isResolved = true;
          reject(
            new APIError(
              error.data.code,
              error as unknown as ErrorRes,
              error.data.msg,
              undefined,
            ),
          );
        };

        ws.onclose = () => {
          this.log('ws close');
        };
      },
    );
  }

  sendMessage(data: CreateChatWsReq) {
    this.ws?.send(data);
    this.log('sendMessage', data);
  }

  sendTextMessage(text: string) {
    this.clear();
    this.sendMessage({
      id: uuid(),
      event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
      data: {
        role: RoleType.User,
        content_type: 'text',
        content: text,
      },
    });
  }

  /**
   * en: Add event listener(s)
   * zh: 添加事件监听器
   * @param event - string | string[] Event name or array of event names
   * @param callback - Event callback function
   */
  on(event: string | string[], callback: WsChatCallbackHandler) {
    const events = Array.isArray(event) ? event : [event];
    events.forEach(eventName => {
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, new Set());
      }
      this.listeners.get(eventName)?.add(callback);
      this.log('on', eventName);
    });
  }

  /**
   * en: Remove event listener(s)
   * zh: 移除事件监听器
   * @param event - string | string[] Event name or array of event names
   * @param callback - Event callback function to remove
   */
  off(event: string | string[], callback: WsChatCallbackHandler) {
    const events = Array.isArray(event) ? event : [event];
    events.forEach(eventName => {
      this.listeners.get(eventName)?.delete(callback);
    });
  }

  protected closeWs() {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  async clear() {
    this.audioDeltaList.length = 0;

    // 重置音字同步状态
    this.resetSentenceSyncState();

    // 打断当前播放
    await this.wavStreamPlayer?.interrupt();
    this.trackId = `my-track-id-${uuid()}`;
  }

  protected emit(eventName: string, event: WsChatEventData) {
    this.listeners
      .get(eventName)
      ?.forEach(callback => callback(eventName, event));
    this.listeners
      .get(WsChatEventNames.ALL)
      ?.forEach(callback => callback(eventName, event));
    this.log('dispatch', eventName, event);
  }

  private handleAudioMessage = async () => {
    const message = this.audioDeltaList[0];
    const decodedContent = atob(message);
    const arrayBuffer = new ArrayBuffer(decodedContent.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < decodedContent.length; i++) {
      view[i] = decodedContent.charCodeAt(i);
    }

    // 记录首个音频delta的时间
    if (this.firstAudioDeltaTime === null) {
      this.firstAudioDeltaTime = performance.now();
    }

    if (this.sentenceList.length > 0) {
      // 计算音频时长
      // 例如：PCM 16bit 采样率为24000的计算公式: (字节数 / 2) / 24000 * 1000 毫秒
      const audioDurationMs =
        (decodedContent.length / 2 / this.outputAudioSampleRate) * 1000;
      this.sentenceList[this.sentenceList.length - 1].audioDuration +=
        audioDurationMs; // 更新当前句子的音频时长
    }

    try {
      await this.wavStreamPlayer?.add16BitPCM(arrayBuffer, this.trackId);

      this.audioDeltaList.shift();
      if (this.audioDeltaList.length > 0) {
        this.handleAudioMessage();
      }
    } catch (error) {
      this.warn('wavStreamPlayer error', error);
    }
  };

  private handleAudioCompleted() {
    // 标记最后一个句子
    this.audioCompletedTimer = setInterval(() => {
      // 确保音频delta列表为空
      if (this.audioDeltaList.length === 0) {
        if (this.sentenceList.length > 0) {
          this.sentenceList[this.sentenceList.length - 1].isLastSentence = true;
        }
        this.audioCompletedTimer && clearInterval(this.audioCompletedTimer);
      }
    }, 50);
  }

  /**
   * 处理句子开始事件
   * @param event 句子开始事件
   */
  private handleSentenceStart(
    event: ConversationAudioSentenceStartEvent,
  ): void {
    // 将句子加入队列，存储文本和初始音频累计时长
    const sentenceItem = {
      id: event.id,
      content: event.data.text,
      audioDuration: 0, // 初始时该句子的音频累计时长为0
      isLastSentence: false,
    };
    this.sentenceList.push(sentenceItem);

    // 如果是首个句子，立即触发客户端句子开始事件
    if (this.sentenceList.length === 1 && this.currentSentenceIndex === -1) {
      this.currentSentenceIndex = 0;
      this.emitSentenceStart(sentenceItem);
      this.scheduleSentenceSwitch();
    }
  }

  private scheduleSentenceSwitch(): void {
    if (this.sentenceSwitchTimer) {
      clearTimeout(this.sentenceSwitchTimer);
    }

    const { isLastSentence, audioDuration } =
      this.sentenceList[this.currentSentenceIndex];

    // 是否还有下一个句子
    const hasNextSentence =
      this.currentSentenceIndex + 1 < this.sentenceList.length;

    let delay = 0;
    if (this.currentSentenceIndex === 0) {
      // 处理第一个句子 delay = 句子已累计时长 - 已播放时长
      delay =
        audioDuration -
        (performance.now() - (this.firstAudioDeltaTime || performance.now()));
      if (delay <= 0) {
        // postpone until we have a meaningful duration
        this.sentenceSwitchTimer = setTimeout(
          () => this.scheduleSentenceSwitch(),
          50,
        );
        return;
      }
    } else {
      // 处理后续句子 delay = 句子累计时长
      delay = audioDuration;
    }

    this.sentenceSwitchTimer = setTimeout(() => {
      if (hasNextSentence) {
        this.currentSentenceIndex++;
        const nextSentence = this.sentenceList[this.currentSentenceIndex];
        this.emitSentenceStart(nextSentence);
      }
      if (isLastSentence) {
        this.emitSentenceEnd();
      } else {
        this.scheduleSentenceSwitch();
      }
    }, delay);
  }

  /**
   * 发送客户端句子开始事件
   * @param sentenceItem 句子开始事件
   */
  private emitSentenceStart(sentenceItem: SentenceItem): void {
    this.emit(WsChatEventNames.AUDIO_SENTENCE_PLAYBACK_START, {
      event_type: ClientEventType.AUDIO_SENTENCE_PLAYBACK_START,
      data: {
        content: sentenceItem.content,
        id: sentenceItem.id,
      },
    });
  }

  /**
   * 发送客户端句子结束事件
   */
  private emitSentenceEnd(): void {
    this.emit(WsChatEventNames.AUDIO_SENTENCE_PLAYBACK_ENDED, {
      event_type: ClientEventType.AUDIO_SENTENCE_PLAYBACK_ENDED,
    });
  }

  private resetSentenceSyncState() {
    this.currentSentenceIndex = -1;
    this.sentenceList = [];
    this.firstAudioDeltaTime = null;
    if (this.sentenceSwitchTimer) {
      clearTimeout(this.sentenceSwitchTimer);
    }
    if (this.audioCompletedTimer) {
      clearInterval(this.audioCompletedTimer);
    }
    this.sentenceSwitchTimer = null;
    this.audioCompletedTimer = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected log(...args: any[]) {
    if (this.config.debug) {
      console.log('[WsChatClient]', ...args);
    }
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected warn(...args: any[]) {
    if (this.config.debug) {
      console.warn('[WsChatClient]', ...args);
    }
    return true;
  }
}

export default BaseWsChatClient;
