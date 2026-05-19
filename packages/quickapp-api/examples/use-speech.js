/**
 * 语音合成示例
 * 展示如何使用WsSpeechClient进行语音合成
 */

// 导入WsSpeechClient
import { WsSpeechClient } from '@coze/quickapp-api/ws-tools';

/**
 * 创建语音合成功能
 * @param {Object} options - 配置选项
 * @param {string} options.token - Coze API令牌
 * @param {boolean} [options.debug=false] - 是否启用调试模式
 * @returns {Object} - 语音合成控制对象
 */
export function useSpeech(options) {
  // 创建语音合成客户端实例
  const speechClient = new WsSpeechClient({
    token: options.token,
    debug: options.debug || false,
  });

  // 状态变量
  let isSpeaking = false;
  let isPaused = false;
  let currentText = '';
  let statusChangeCallback = null;
  let speechEndCallback = null;
  let errorCallback = null;

  /**
   * 文字转语音
   * @param {Object} params - 语音合成参数
   * @param {string} params.text - 要转换为语音的文本
   * @param {string} [params.voice='zh-CN-XiaoxiaoNeural'] - 语音ID
   * @param {number} [params.rate=1.0] - 语速 (0.5 到 2.0)
   * @param {number} [params.pitch=1.0] - 音调 (0.5 到 2.0)
   * @returns {Promise<void>}
   */
  async function speak(params) {
    if (!params || !params.text) {
      throw new Error('文本不能为空');
    }

    try {
      // 保存当前文本
      currentText = params.text;

      // 开始语音合成
      await speechClient.speak({
        text: params.text,
        voice: params.voice || 'zh-CN-XiaoxiaoNeural',
        rate: params.rate || 1.0,
        pitch: params.pitch || 1.0,
      });

      // 更新状态
      isSpeaking = true;
      isPaused = false;

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isSpeaking,
          isPaused,
          text: currentText,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 停止语音播放
   */
  function stop() {
    if (!isSpeaking) {
      return;
    }

    try {
      speechClient.stop();
      isSpeaking = false;
      isPaused = false;

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isSpeaking,
          isPaused,
          text: currentText,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 暂停语音播放
   */
  function pause() {
    if (!isSpeaking || isPaused) {
      return;
    }

    try {
      speechClient.pause();
      isPaused = true;

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isSpeaking,
          isPaused,
          text: currentText,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 恢复语音播放
   */
  function resume() {
    if (!isSpeaking || !isPaused) {
      return;
    }

    try {
      speechClient.resume();
      isPaused = false;

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isSpeaking,
          isPaused,
          text: currentText,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 清理资源
   */
  async function destroy() {
    try {
      await speechClient.destroy();
      isSpeaking = false;
      isPaused = false;
      currentText = '';

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isSpeaking,
          isPaused,
          text: currentText,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 设置状态变更回调
   * @param {Function} callback - 状态变更回调函数
   */
  function onStatusChange(callback) {
    statusChangeCallback = callback;
  }

  /**
   * 设置语音结束回调
   * @param {Function} callback - 语音结束回调函数
   */
  function onSpeechEnd(callback) {
    speechEndCallback = callback;

    // 监听语音结束事件
    speechClient.on('speech.end', () => {
      isSpeaking = false;
      isPaused = false;

      // 触发语音结束回调
      if (speechEndCallback) {
        speechEndCallback();
      }

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isSpeaking,
          isPaused,
          text: currentText,
        });
      }
    });
  }

  /**
   * 设置错误回调
   * @param {Function} callback - 错误回调函数
   */
  function onError(callback) {
    errorCallback = callback;

    // 监听错误事件
    speechClient.on('error', error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
  }

  /**
   * 获取当前状态
   * @returns {Object} - 当前状态
   */
  function getStatus() {
    return {
      isSpeaking,
      isPaused,
      text: currentText,
    };
  }

  // 返回控制对象
  return {
    speak,
    stop,
    pause,
    resume,
    destroy,
    onStatusChange,
    onSpeechEnd,
    onError,
    getStatus,
  };
}

export default useSpeech;
