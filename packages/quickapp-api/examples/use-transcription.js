/**
 * 语音转写示例
 * 展示如何使用WsTranscriptionClient进行语音转写
 */

// 导入WsTranscriptionClient和RecordingStatus
import { WsTranscriptionClient } from '@coze/quickapp-api/ws-tools';

/**
 * 创建语音转写功能
 * @param {Object} options - 配置选项
 * @param {string} options.token - Coze API令牌
 * @param {boolean} [options.debug=false] - 是否启用调试模式
 * @returns {Object} - 语音转写控制对象
 */
export function useTranscription(options) {
  // 创建转写客户端实例
  const transcriptionClient = new WsTranscriptionClient({
    token: options.token,
    debug: options.debug || false,
  });

  // 状态变量
  let isRecording = false;
  let isPaused = false;
  let transcriptionText = '';
  let statusChangeCallback = null;
  let transcriptionUpdateCallback = null;
  let errorCallback = null;

  /**
   * 开始录音和转写
   * @returns {Promise<void>}
   */
  async function startRecording() {
    if (isRecording) {
      return;
    }

    try {
      await transcriptionClient.start();
      isRecording = true;
      isPaused = false;
      transcriptionText = '';

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isRecording,
          isPaused,
          text: transcriptionText,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 停止录音和转写
   */
  function stopRecording() {
    if (!isRecording) {
      return;
    }

    try {
      transcriptionClient.stop();
      isRecording = false;
      isPaused = false;

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isRecording,
          isPaused,
          text: transcriptionText,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 暂停录音
   */
  function pauseRecording() {
    if (!isRecording || isPaused) {
      return;
    }

    try {
      transcriptionClient.pause();
      isPaused = true;

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isRecording,
          isPaused,
          text: transcriptionText,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 恢复录音
   */
  function resumeRecording() {
    if (!isRecording || !isPaused) {
      return;
    }

    try {
      transcriptionClient.resume();
      isPaused = false;

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isRecording,
          isPaused,
          text: transcriptionText,
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
  function destroy() {
    try {
      transcriptionClient.destroy();
      isRecording = false;
      isPaused = false;
      transcriptionText = '';

      // 触发状态变更回调
      if (statusChangeCallback) {
        statusChangeCallback({
          isRecording,
          isPaused,
          text: transcriptionText,
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
   * 设置转写更新回调
   * @param {Function} callback - 转写更新回调函数
   */
  function onTranscriptionUpdate(callback) {
    transcriptionUpdateCallback = callback;

    // 监听转写更新事件
    transcriptionClient.on('transcriptions.message.update', message => {
      if (message && message.data && message.data.text) {
        transcriptionText = message.data.text;

        // 触发转写更新回调
        if (transcriptionUpdateCallback) {
          transcriptionUpdateCallback({
            text: transcriptionText,
            isFinal: false,
          });
        }

        // 触发状态变更回调
        if (statusChangeCallback) {
          statusChangeCallback({
            isRecording,
            isPaused,
            text: transcriptionText,
          });
        }
      }
    });

    // 监听转写完成事件
    transcriptionClient.on('transcriptions.message.completed', message => {
      if (message && message.data && message.data.text) {
        transcriptionText = message.data.text;

        // 触发转写更新回调
        if (transcriptionUpdateCallback) {
          transcriptionUpdateCallback({
            text: transcriptionText,
            isFinal: true,
          });
        }

        // 触发状态变更回调
        if (statusChangeCallback) {
          statusChangeCallback({
            isRecording,
            isPaused,
            text: transcriptionText,
          });
        }
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
    transcriptionClient.on('error', error => {
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
      isRecording,
      isPaused,
      text: transcriptionText,
    };
  }

  // 返回控制对象
  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    destroy,
    onStatusChange,
    onTranscriptionUpdate,
    onError,
    getStatus,
  };
}

export default useTranscription;
