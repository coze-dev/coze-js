import Taro from '@tarojs/taro';
import { Events, type TaroStatic } from '@tarojs/taro';

import { AudioRaw } from '@/libs/types';

import { MiniChatError } from '../mini-chat-error';
export enum RecorderEvent {
  START = 'start',
  PAUSE = 'pause',
  RESUME = 'resume',
  STOP = 'stop',
  ERROR = 'error',
  INTERRUPT = 'interrupt',
  VOLUME = 'volume',
}
export interface RecorderEventArgs {
  [RecorderEvent.START]: unknown;
  [RecorderEvent.PAUSE]: unknown;
  [RecorderEvent.RESUME]: unknown;
  [RecorderEvent.STOP]: AudioRaw;
  [RecorderEvent.ERROR]: MiniChatError;
  [RecorderEvent.INTERRUPT]: unknown;
  [RecorderEvent.VOLUME]: {
    volume: number; // 0 ~ 1;
  };
}
export interface RecorderStartOptions {
  sampleRate?: keyof Taro.RecorderManager.SampleRate;
  numberOfChannels?: 1 | 2;
}

export abstract class BaseRecorderManager {
  protected event: InstanceType<TaroStatic['Events']> = new Events();
  protected isStop = false;
  abstract start(options: RecorderStartOptions): Promise<void>;
  abstract pause(): void;
  abstract resume(): void;
  abstract destroy(): void;
  abstract stop(): void;
  emit<T extends RecorderEvent>(event: T, args: RecorderEventArgs[T]) {
    this.event.trigger(event, args);
  }
  on<T extends RecorderEvent>(
    event: T,
    callback: (args: RecorderEventArgs[T]) => void,
  ) {
    this.event.on(event, callback);
  }
  off(event: RecorderEvent, callback: (args: unknown) => void) {
    this.event.off(event, callback);
  }
  isStopped() {
    return this.isStop;
  }
}
