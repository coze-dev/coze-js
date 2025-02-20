import Taro from '@tarojs/taro';

import {
  BaseRecorderManager,
  RecorderEvent,
  RecorderStartOptions,
} from './type';
import { MiniChatError, MiniChatErrorCode } from '../mini-chat-error';
import { logger } from '../logger';
import { isTT } from '../device';
export class TaroRecorderManager extends BaseRecorderManager {
  private static recorder?: Taro.RecorderManager | null = null;
  private static curInstance?: TaroRecorderManager;
  private options: RecorderStartOptions = {};

  private format?: keyof Taro.RecorderManager.Format;
  private fileName?: string;

  async start(options: RecorderStartOptions) {
    if (this.isStop) {
      throw new MiniChatError(-1, 'recorder is stop');
    }
    logger.debug(
      'TaroRedorManager start instance stopFlag',
      TaroRecorderManager.curInstance?.isStop,
    );
    // There's only one instance at a time.
    if (!TaroRecorderManager.curInstance?.isStop) {
      TaroRecorderManager.curInstance?.stop();
    }
    TaroRecorderManager.curInstance = this;

    logger.debug(
      'TaroRedorManager start instance recorder',
      TaroRecorderManager.recorder,
    );
    if (!TaroRecorderManager.recorder) {
      TaroRecorderManager.recorder = Taro.getRecorderManager();
      this.registerEvent();
    }
    this.format = isTT ? 'wav' : 'mp3';
    this.fileName = `recorder_${Date.now()}.${this.format}`;
    this.options = options;
    const { sampleRate = 8000, numberOfChannels = 1 } = this.options;

    try {
      await this.checkPermission();
      if (this.isStop) {
        TaroRecorderManager.curInstance?.emit(RecorderEvent.STOP, {
          duration: 0,
          tempFilePath: '',
          fileSize: 0,
        });
        TaroRecorderManager.recorder?.stop();
        return;
      }
      TaroRecorderManager.recorder.start({
        numberOfChannels,
        sampleRate,
        format: this.format,
        frameSize: 2,
      });
      const getVolume = TaroRecorderManager.curInstance?.genGetVolumeFunc();
      getVolume?.();
    } catch (err) {
      logger.error('TaroRecorderManager start error', err);
      this.emitError(
        new MiniChatError(
          MiniChatErrorCode.Audio_Permission_Denied,
          'Permission Denied',
        ),
      );
    }
  }

  private checkPermission() {
    return new Promise((resolve, reject) => {
      Taro.getSetting({
        success: res => {
          logger.debug('TaroRecorderManager getSetting', res);
          if (res.authSetting['scope.record'] !== true) {
            Taro.authorize({
              scope: 'scope.record',
              success: () => {
                logger.debug('TaroRecorderManager authorize scope.record true');
                resolve(true);
              },
              fail: resFail => {
                logger.error(
                  'TaroRecorderManager authorize scope.record false',
                  resFail,
                );
                reject(
                  new Error('TaroRecorderManager authorize scope.record false'),
                );
              },
            });
          } else {
            logger.debug('TaroRecorderManager getSetting scope.record true');
            resolve(true);
          }
        },
        fail: () => {
          logger.debug('TaroRecorderManager getSetting fails');

          resolve(true);
        },
      });
    });
  }
  private registerEvent() {
    TaroRecorderManager.recorder?.onStart(() => {
      TaroRecorderManager.curInstance?.emit(RecorderEvent.START, {});
    });
    TaroRecorderManager.recorder?.onPause(() => {
      TaroRecorderManager.curInstance?.emit(RecorderEvent.PAUSE, {});
    });
    TaroRecorderManager.recorder?.onResume(() => {
      TaroRecorderManager.curInstance?.emit(RecorderEvent.RESUME, {});
    });
    TaroRecorderManager.recorder?.onStop(event => {
      TaroRecorderManager.curInstance?.emit(RecorderEvent.STOP, {
        duration: event.duration,
        tempFilePath: event.tempFilePath,
        fileSize: event.fileSize,
        fileName: this.fileName,
      });
    });
    TaroRecorderManager.recorder?.onInterruptionBegin?.(() => {
      logger.debug('TaroRecorderManager onInterruptionBegin');
      TaroRecorderManager.curInstance?.emit(RecorderEvent.INTERRUPT, {});
    });
    TaroRecorderManager.recorder?.onError(event => {
      logger.error('TaroRecorderManager onError', event);
      TaroRecorderManager.curInstance?.emitError(
        new MiniChatError(
          event?.errMsg?.includes('deny')
            ? MiniChatErrorCode.Audio_Permission_Denied
            : -1,
          event.errMsg,
        ),
      );
    });
  }
  private genGetVolumeFunc() {
    const getVolume = () => {
      if (this.isStop) {
        this.emit(RecorderEvent.VOLUME, {
          volume: 0,
        });
        return;
      }
      const volume = Math.random() * 0.5;
      this.emit(RecorderEvent.VOLUME, {
        volume: volume < 0.002 ? 0 : volume,
      });
      setTimeout(() => {
        getVolume();
      }, 100);
    };
    return getVolume;
  }

  private emitError(error: MiniChatError) {
    this.emit(RecorderEvent.ERROR, error);
  }
  stop() {
    if (this.isStop) {
      logger.warn('recorder has been stopped');
      return;
    }
    this.isStop = true;
    try {
      TaroRecorderManager.recorder?.stop();
    } catch (err) {
      this.emitError(new MiniChatError(-1, 'unknown error'));
    }
  }
  pause() {
    if (this.isStop) {
      logger.warn('recorder has been stopped');
      return;
    }
    TaroRecorderManager.recorder?.pause();
  }
  resume() {
    if (this.isStop) {
      logger.warn('recorder has been stopped');
      return;
    }
    TaroRecorderManager.recorder?.resume();
  }
  destroy() {
    this.stop();
    this.event.off();
  }
}
