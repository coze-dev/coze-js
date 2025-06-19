import {
  type WsChatEventData,
  type SentenceItem,
  WsChatEventNames,
  ClientEventType,
} from '../types';
import {
  type AudioCodec,
  type ConversationAudioSentenceStartEvent,
} from '../../index';

/**
 * 音字同步器配置选项
 */
export interface SentenceSynchronizerOptions {
  /**
   * 事件发射器，用于向外部发送事件
   */
  eventEmitter: (eventName: string, eventData: WsChatEventData) => void;
}

/**
 * 音字同步器 - 负责管理音频播放与文本显示的同步
 */
export class SentenceSynchronizer {
  /** 输出音频采样率 */
  private outputAudioSampleRate: number;
  /** 输出音频编码格式 */
  private outputAudioCodec: AudioCodec;
  /** 句子列表队列 */
  private sentenceList: SentenceItem[] = [];
  /** 首个音频delta的时间戳（用于计算实际经过的时间）*/
  private firstAudioDeltaTime: number | null = null;
  // 当前播放的句子索引
  private currentSentenceIndex = -1;
  // 句子切换定时器
  private sentenceSwitchTimer: NodeJS.Timeout | null = null;
  // 事件发射器
  private eventEmitter: (eventName: string, eventData: WsChatEventData) => void;

  /**
   * 构造函数
   * @param options 同步器配置选项
   */
  constructor(options: SentenceSynchronizerOptions) {
    this.eventEmitter = options.eventEmitter;
    this.scheduleSentenceSwitch = this.scheduleSentenceSwitch.bind(this);
    this.emitSentenceStart = this.emitSentenceStart.bind(this);
    this.emitSentenceEnd = this.emitSentenceEnd.bind(this);
    this.outputAudioSampleRate = 24000;
    this.outputAudioCodec = 'pcm';
  }

  /**
   * 设置首个句子首个音频 Delta 时间
   */
  public setFirstAudioDeltaTime(): void {
    if (
      this.currentSentenceIndex === 0 &&
      this.sentenceList[0].audioDuration === 0
    ) {
      this.firstAudioDeltaTime = performance.now();
    }
  }

  /**
   * 处理音频完成事件，标记最后一个句子
   */
  public handleAudioCompleted(): void {
    if (this.sentenceList.length > 0) {
      this.sentenceList[this.sentenceList.length - 1].isLastSentence = true;
      this.sentenceList[this.sentenceList.length - 1].isDurationFinish = true;
    }
  }

  /**
   * 处理句子开始事件
   * @param event 句子开始事件
   */
  public handleSentenceStart(event: ConversationAudioSentenceStartEvent): void {
    // 将句子加入队列，存储文本和初始音频累计时长
    const sentenceItem = {
      id: event.id,
      content: event.data.text,
      audioDuration: 0, // 初始时该句子的音频累计时长为0
      isLastSentence: false,
      isDurationFinish: false,
    };
    this.sentenceList.push(sentenceItem);

    // 如果是首个句子，立即触发客户端句子开始事件
    if (this.sentenceList.length === 1 && this.currentSentenceIndex === -1) {
      this.currentSentenceIndex = 0;
      this.emitSentenceStart(sentenceItem);
      this.scheduleSentenceSwitch();
    } else {
      // 后续句子，更新上一个句子的 isDurationFinish 为 true
      this.sentenceList[this.sentenceList.length - 2].isDurationFinish = true;
    }
  }

  /**
   * 更新指定句子的音频时长
   * @param sentenceId 句子ID
   * @param duration 音频时长增量
   */
  public updateAudioDuration(sentenceId: string, duration: number): void {
    const index = this.sentenceList.findIndex(item => item.id === sentenceId);
    if (index >= 0) {
      this.sentenceList[index].audioDuration += duration;
    }
  }

  /**
   * 更新最后一个句子的音频时长
   * @param duration 音频时长增量
   * @returns 是否更新成功
   */
  public updateLatestSentenceAudioDuration(contentLength: number): boolean {
    if (this.sentenceList.length === 0) {
      return false;
    }

    // 计算音频时长
    // 例如：PCM 16bit 采样率为24000的计算公式: (字节数 / 2) / 24000 * 1000 毫秒
    const bitDepth = this.outputAudioCodec === 'pcm' ? 16 : 8;
    const audioDurationMs =
      (contentLength / (bitDepth / 8) / this.outputAudioSampleRate) * 1000;

    const lastSentence = this.sentenceList[this.sentenceList.length - 1];
    lastSentence.audioDuration += audioDurationMs;
    return true;
  }

  /**
   * 安排句子切换
   */
  private scheduleSentenceSwitch(): void {
    if (this.sentenceSwitchTimer) {
      clearTimeout(this.sentenceSwitchTimer);
    }

    const { isDurationFinish, isLastSentence, audioDuration } =
      this.sentenceList[this.currentSentenceIndex];

    let delay = 0;
    if (isDurationFinish) {
      if (this.currentSentenceIndex === 0) {
        // 第一个句子，更新剩余播放时长
        delay =
          audioDuration -
          (performance.now() - (this.firstAudioDeltaTime || performance.now()));
      } else {
        // 后续句子
        delay = audioDuration;
      }
    } else {
      delay = 100;
      this.sentenceSwitchTimer = setTimeout(() => {
        this.scheduleSentenceSwitch();
      }, delay);
      return;
    }

    this.sentenceSwitchTimer = setTimeout(() => {
      // 判断是否还有后续句子
      const hasNextSentence =
        this.currentSentenceIndex < this.sentenceList.length - 1;
      if (hasNextSentence) {
        this.currentSentenceIndex++;
        const nextSentence = this.sentenceList[this.currentSentenceIndex];
        this.emitSentenceStart(nextSentence);
      } else {
        if (isLastSentence) {
          this.emitSentenceEnd();
        }
        return;
      }
      this.scheduleSentenceSwitch();
    }, delay);
  }

  /**
   * 发送客户端句子开始事件
   * @param sentenceItem 句子开始事件
   */
  private emitSentenceStart(sentenceItem: SentenceItem): void {
    this.eventEmitter(WsChatEventNames.AUDIO_SENTENCE_PLAYBACK_START, {
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
    this.eventEmitter(WsChatEventNames.AUDIO_SENTENCE_PLAYBACK_ENDED, {
      event_type: ClientEventType.AUDIO_SENTENCE_PLAYBACK_ENDED,
    });
  }

  /**
   * 重置句子同步状态
   */
  public resetSentenceSyncState(): void {
    if (this.sentenceList.length > 0) {
      // 发送句子结束事件
      this.emitSentenceEnd();
    }
    this.currentSentenceIndex = -1;
    this.sentenceList.length = 0;
    this.firstAudioDeltaTime = null;
    if (this.sentenceSwitchTimer) {
      clearTimeout(this.sentenceSwitchTimer);
    }
    this.sentenceSwitchTimer = null;
  }

  public setOutputAudioConfig(
    outputAudioSampleRate: number,
    outputAudioCodec: AudioCodec,
  ): void {
    this.outputAudioSampleRate = outputAudioSampleRate;
    this.outputAudioCodec = outputAudioCodec;
  }
}

export default SentenceSynchronizer;
