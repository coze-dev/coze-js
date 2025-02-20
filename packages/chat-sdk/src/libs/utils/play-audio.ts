import Taro, { InnerAudioContext, TaroStatic, Events } from '@tarojs/taro';

import { MiniChatError } from './mini-chat-error';
import { logger } from './logger';
import { isWeb } from './device';

export enum AudioPlayEvent {
  STOP = 'stop',
  PLAY = 'play',
}

let playNo = 1000;
export class PlayAudio {
  private static instance: PlayAudio;
  private isStop = true;
  private audioContext?: InnerAudioContext;
  private event: InstanceType<TaroStatic['Events']> = new Events();
  private audioPrm: Promise<ArrayBuffer> | null = null;

  static stopNow() {
    PlayAudio.instance?.stop();
  }
  async playText(
    text: string,
    audioSpeechFunc: (text: string) => Promise<ArrayBuffer>,
  ) {
    if (!PlayAudio.instance?.isStop) {
      PlayAudio.instance?.stop();
    }
    if (!this.audioPrm) {
      this.audioPrm = audioSpeechFunc(text);
    }
    this.isStop = false;
    try {
      const audioData = await this.audioPrm;
      if (this.isStop) {
        return;
      }
      this.playData(audioData);
    } catch (e) {
      this.audioPrm = null;
      logger.error('PlayAudio Get audio speech error', e);
      throw new MiniChatError(-1, 'Get Speech Failed');
    }
  }
  playData(data: ArrayBuffer) {
    let tempFile = '';
    if (isWeb) {
      const blobData = new Blob([data], {
        type: 'audio/wav',
      });
      tempFile = URL.createObjectURL(blobData);
    } else {
      tempFile = `${Taro.env.USER_DATA_PATH}/tempFile${playNo++}.wav`;
      Taro.getFileSystemManager().writeFileSync(tempFile, data, 'binary');
    }
    logger.debug('playData:', tempFile);
    this.play(tempFile);
  }
  async play(audioSrc: string) {
    if (!PlayAudio.instance?.isStop) {
      PlayAudio.instance?.stop();
    }

    this.isStop = false;

    PlayAudio.instance = this;
    this.audioContext = Taro.createInnerAudioContext();
    this.audioContext.src = audioSrc;
    if (!isWeb) {
      this.audioContext.obeyMuteSwitch = false;
    }
    logger.debug('audioContext', audioSrc);

    this.audioContext.onPlay(() => {
      logger.debug('audioContext onPlay');
      this.event.trigger(AudioPlayEvent.PLAY);
    });
    this.audioContext.onPause(() => {
      this.stop();
    });
    this.audioContext.onError(res => {
      logger.error('audioContext onError', res);
      this.emitStopEvent(true);

      this.stop();
    });
    this.audioContext.onEnded(() => {
      logger.debug('audioContext onEnded');
      this.stop();
    });
    this.audioContext.onStop(() => {
      this.unregister();
      logger.debug('audioContext onStop');
    });
    try {
      await this.audioContext.play();
    } catch (err) {
      logger.error('audioContext play error', err);
    }
    logger.debug('audioContext', audioSrc);
  }
  stop() {
    logger.debug('audioContext stop1', this.isStop);
    if (this.isStop) {
      return;
    }
    try {
      this.emitStopEvent();
      this.audioContext?.stop();

      this.unregister();
      this.isStop = true;
    } catch (_err) {
      this.emitStopEvent(true);
    }
  }
  on(event: AudioPlayEvent, callback: (params: unknown) => void) {
    this.event.on(event, callback);
  }
  emitStopEvent(isError = false) {
    logger.debug('audioContext emitStopEvent', this.isStop);
    if (this.isStop) {
      return;
    }
    this.event.trigger(AudioPlayEvent.STOP, {
      isError,
    });
  }
  unregister() {
    this.audioContext?.offPlay();
    this.audioContext?.offError();
    this.audioContext?.offEnded();
    this.audioContext?.offPause();
    this.event.off();
  }
}
