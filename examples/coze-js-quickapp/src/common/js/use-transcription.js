/**
 * 语音转写功能模块
 * 基于WebSocket实现实时语音转写功能
 */
const {
  WsTranscriptionClient,
  WebsocketsEventType,
} = require('@coze/quickapp-api/ws-tools');

/**
 * 创建语音转写功能
 * @param {Object} options - 配置选项
 * @param {string} options.token - API令牌
 * @param {boolean} options.debug - 是否开启调试模式
 * @returns {Object} - 语音转写相关方法和状态
 */
function useTranscription(options = {}) {
  // 默认配置
  const config = {
    token: '',
    debug: false,
    ...options,
  };

  // 客户端实例
  let transcriptionClient = null;

  // 状态变量
  let isRecording = false;
  let isPaused = false;
  let errorMessage = '';
  let transcriptionText = '';

  // 事件回调
  let onStatusChangeCallback = null;
  let onTranscriptionUpdateCallback = null;
  let onErrorCallback = null;

  /**
   * 初始化转写客户端
   */
  const initClient = () => {
    try {
      if (!transcriptionClient) {
        transcriptionClient = new WsTranscriptionClient({
          token: config.token,
          debug: config.debug,
        });

        // 设置事件监听
        transcriptionClient.on(
          WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_UPDATE,
          data => {
            console.log(
              '[useTranscription] TRANSCRIPTIONS_MESSAGE_UPDATE:',
              JSON.stringify(data),
            );
            // 处理部分转写结果
            if (data.data && data.data.content) {
              transcriptionText = data.data.content;
              onTranscriptionUpdateCallback &&
                onTranscriptionUpdateCallback(transcriptionText);
            }
          },
        );

        transcriptionClient.on(
          WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_COMPLETED,
          data => {
            console.log(
              '[useTranscription] TRANSCRIPTIONS_MESSAGE_COMPLETED:',
              JSON.stringify(data),
            );
            // 处理最终转写结果
            if (data.data && data.data.content) {
              transcriptionText = data.data.content;
              onTranscriptionUpdateCallback &&
                onTranscriptionUpdateCallback(transcriptionText);
            }
            isRecording = false;
            isPaused = false;
            onStatusChangeCallback &&
              onStatusChangeCallback({ isRecording, isPaused });
          },
        );

        transcriptionClient.on(WebsocketsEventType.ERROR, error => {
          console.error('Transcription error:', error);
          errorMessage = error?.data?.msg || '转写过程中发生错误';
          isRecording = false;
          isPaused = false;
          onStatusChangeCallback &&
            onStatusChangeCallback({ isRecording, isPaused });
          onErrorCallback && onErrorCallback(errorMessage);
        });
      }
    } catch (error) {
      console.error('Failed to initialize transcription client:', error);
      errorMessage = `初始化失败: ${error.message || '未知错误'}`;
      onErrorCallback && onErrorCallback(errorMessage);
    }
  };

  /**
   * 开始录音并转写
   */
  const startRecording = async () => {
    errorMessage = '';

    try {
      if (!transcriptionClient) {
        initClient();
      }

      await transcriptionClient.start();
      isRecording = true;
      isPaused = false;
      onStatusChangeCallback &&
        onStatusChangeCallback({ isRecording, isPaused });
    } catch (error) {
      console.error('Failed to start recording:', error);
      errorMessage = `启动失败: ${error.message || '未知错误'}`;
      onErrorCallback && onErrorCallback(errorMessage);
    }
  };

  /**
   * 停止录音并完成转写
   */
  const stopRecording = () => {
    if (isRecording && transcriptionClient) {
      try {
        transcriptionClient.stop();
        isRecording = false;
        isPaused = false;
        onStatusChangeCallback &&
          onStatusChangeCallback({ isRecording, isPaused });
      } catch (error) {
        console.error('Error stopping recording:', error);
        errorMessage = `停止失败: ${error.message || '未知错误'}`;
        onErrorCallback && onErrorCallback(errorMessage);
      }
    }
  };

  /**
   * 暂停录音
   */
  const pauseRecording = () => {
    if (isRecording && !isPaused && transcriptionClient) {
      try {
        transcriptionClient.pause();
        isPaused = true;
        onStatusChangeCallback &&
          onStatusChangeCallback({ isRecording, isPaused });
      } catch (error) {
        console.error('Error pausing recording:', error);
        errorMessage = `暂停失败: ${error.message || '未知错误'}`;
        onErrorCallback && onErrorCallback(errorMessage);
      }
    }
  };

  /**
   * 恢复录音
   */
  const resumeRecording = () => {
    if (isRecording && isPaused && transcriptionClient) {
      try {
        transcriptionClient.resume();
        isPaused = false;
        onStatusChangeCallback &&
          onStatusChangeCallback({ isRecording, isPaused });
      } catch (error) {
        console.error('Error resuming recording:', error);
        errorMessage = `恢复失败: ${error.message || '未知错误'}`;
        onErrorCallback && onErrorCallback(errorMessage);
      }
    }
  };

  /**
   * 清理资源
   */
  const destroy = () => {
    if (transcriptionClient) {
      transcriptionClient.destroy();
      transcriptionClient = null;
    }
    isRecording = false;
    isPaused = false;
  };

  /**
   * 设置状态变化回调
   * @param {Function} callback - 状态变化回调函数
   */
  const onStatusChange = callback => {
    onStatusChangeCallback = callback;
  };

  /**
   * 设置转写文本更新回调
   * @param {Function} callback - 转写文本更新回调函数
   */
  const onTranscriptionUpdate = callback => {
    onTranscriptionUpdateCallback = callback;
  };

  /**
   * 设置错误回调
   * @param {Function} callback - 错误回调函数
   */
  const onError = callback => {
    onErrorCallback = callback;
  };

  /**
   * 获取当前状态
   * @returns {Object} - 当前状态对象
   */
  const getStatus = () => ({
    isRecording,
    isPaused,
    errorMessage,
    transcriptionText,
  });

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

module.exports = { useTranscription };
