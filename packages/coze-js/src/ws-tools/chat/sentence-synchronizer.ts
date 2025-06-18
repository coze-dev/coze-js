import {
  type WsChatEventData,
  type SentenceItem,
  WsChatEventNames,
  ClientEventType,
} from '../types';
import { type ConversationAudioSentenceStartEvent } from '../../index';

/**
 * 音字同步器配置选项
 */
export interface SentenceSynchronizerOptions {
  /**
   * 事件发射器，用于向外部发送事件
   */
  eventEmitter: (eventName: string, eventData: WsChatEventData) => void;
  /**
   * 是否启用调试模式
   */
  debug?: boolean;
}

/**
 * 音字同步器 - 负责管理音频播放与文本显示的同步
 */
export class SentenceSynchronizer {
  /** 句子列表队列 */
  private sentenceList: SentenceItem[] = [];
  /** 首个音频delta的时间戳（用于计算实际经过的时间）*/
  private firstAudioDeltaTime: number | null = null;
  // 当前播放的句子索引
  private currentSentenceIndex = -1;
  // 句子切换定时器
  private sentenceSwitchTimer: NodeJS.Timeout | null = null;
  // 音频完成定时器
  private audioCompletedTimer: NodeJS.Timeout | null = null;
  // 事件发射器
  private eventEmitter: (eventName: string, eventData: WsChatEventData) => void;
  // 调试模式
  private debug: boolean;

  /**
   * 构造函数
   * @param options 同步器配置选项
   */
  constructor(options: SentenceSynchronizerOptions) {
    this.eventEmitter = options.eventEmitter;
    this.debug = options.debug || false;
    this.scheduleSentenceSwitch = this.scheduleSentenceSwitch.bind(this);
    this.emitSentenceStart = this.emitSentenceStart.bind(this);
    this.emitSentenceEnd = this.emitSentenceEnd.bind(this);
  }

  /**
   * 设置首个音频 Delta 时间
   * @param time 时间戳
   */
  public setFirstAudioDeltaTime(time: number): void {
    if (this.firstAudioDeltaTime === null) {
      this.firstAudioDeltaTime = time;
      this.log('First audio delta time set:', time);
    } else {
      // this.log('First audio delta time already set:', this.firstAudioDeltaTime);
    }
  }

  /**
   * 处理音频完成事件
   */
  public handleAudioCompleted(): void {
    // 标记最后一个句子
    // this.audioCompletedTimer = setTimeout(() => {
    if (this.sentenceList.length > 0) {
      this.sentenceList[this.sentenceList.length - 1].isLastSentence = true;
    }
    // }, 100);
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
    };
    this.sentenceList.push(sentenceItem);
    this.log(
      'handleSentenceStart',
      this.currentSentenceIndex,
      this.sentenceList,
    );

    // 如果是首个句子，立即触发客户端句子开始事件
    if (this.sentenceList.length === 1 && this.currentSentenceIndex === -1) {
      this.currentSentenceIndex = 0;
      this.emitSentenceStart(sentenceItem);
      this.scheduleSentenceSwitch();
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
      this.log(
        `Updated audio duration for sentence ${sentenceId}:`,
        this.sentenceList[index].audioDuration,
      );
    }
  }

  /**
   * 更新最后一个句子的音频时长
   * @param duration 音频时长增量
   * @returns 是否更新成功
   */
  public updateLatestSentenceAudioDuration(duration: number): boolean {
    if (this.sentenceList.length === 0) {
      return false;
    }

    const lastSentence = this.sentenceList[this.sentenceList.length - 1];
    lastSentence.audioDuration += duration;
    return true;
  }

  /**
   * 安排句子切换
   */
  private scheduleSentenceSwitch(): void {
    if (this.sentenceSwitchTimer) {
      clearTimeout(this.sentenceSwitchTimer);
    }

    const { isLastSentence, audioDuration } =
      this.sentenceList[this.currentSentenceIndex];

    // 是否还有下一个句子
    const hasNextSentence =
      this.currentSentenceIndex + 1 < this.sentenceList.length;

    console.log(
      'info',
      this.currentSentenceIndex,
      this.sentenceList[this.currentSentenceIndex],
      this.firstAudioDeltaTime,
      performance.now() - (this.firstAudioDeltaTime || performance.now()),
    );
    let delay = 0;
    if (this.currentSentenceIndex === 0) {
      // 处理第一个句子 delay = 句子已累计时长 - 已播放时长
      delay =
        audioDuration -
        (performance.now() - (this.firstAudioDeltaTime || performance.now()));
      if (delay <= 0) {
        // postpone until we have a meaningful duration
        // this.sentenceSwitchTimer = setTimeout(
        //   () => this.scheduleSentenceSwitch(),
        //   50,
        // );
        delay = 50;
        // return;
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
    this.currentSentenceIndex = -1;
    this.sentenceList.length = 0;
    this.firstAudioDeltaTime = null;
    if (this.sentenceSwitchTimer) {
      clearTimeout(this.sentenceSwitchTimer);
    }
    if (this.audioCompletedTimer) {
      clearInterval(this.audioCompletedTimer);
    }
    this.sentenceSwitchTimer = null;
    this.audioCompletedTimer = null;
    this.log('Reset sentence sync state');
  }

  /**
   * 日志输出
   * @param args 日志内容
   */
  private log(...args: any[]): void {
    if (this.debug) {
      console.log('[SentenceSynchronizer]', ...args);
    }
  }
}

export default SentenceSynchronizer;
