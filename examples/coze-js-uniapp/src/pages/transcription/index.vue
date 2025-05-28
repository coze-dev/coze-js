<template>
  <view class="transcription-container">
    <view class="header">
      <text class="title">实时语音转写 WebSocket 演示</text>
      <button class="back-button" @click="goBackToHome">返回首页</button>
    </view>

    <view class="transcription-box">
      <text v-if="!transcriptionText" class="placeholder">语音转写内容将显示在这里...</text>
      <text v-else class="transcription-text">{{ transcriptionText }}</text>
    </view>

    <view class="status-indicator">
      <view
        :class="[
          'status-dot',
          isRecording ? (isPaused ? 'paused' : 'recording') : 'inactive',
        ]"
      ></view>
      <text>{{ getStatusText() }}</text>
    </view>

    <view class="button-row">
      <button
        @click="handleStartRecording"
        :disabled="isRecording && !isPaused"
        type="primary"
      >
        开始转写
      </button>
    </view>
    
    <view class="button-row">
      <button
        @click="handlePauseResume"
        :disabled="!isRecording"
        type="default"
      >
        {{ isPaused ? '继续录音' : '暂停录音' }}
      </button>
    </view>
    
    <view class="button-row">
      <button
        @click="handleStopRecording"
        :disabled="!isRecording"
        type="warn"
      >
        结束录音
      </button>
    </view>

    <view v-if="errorMessage" class="error-message">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script>
import { useTranscription } from '../../composables/use-transcription';
import { onUnmounted } from 'vue';

export default {
  setup() {
    const {
      isRecording,
      isPaused,
      transcriptionText,
      errorMessage,
      startRecording,
      stopRecording,
      pauseRecording,
      resumeRecording,
      destroy,
    } = useTranscription();

    // 处理开始录音
    const handleStartRecording = () => {
      startRecording();
    };

    // 处理结束录音
    const handleStopRecording = () => {
      stopRecording();
    };

    // 处理暂停/继续录音
    const handlePauseResume = () => {
      if (isPaused.value) {
        resumeRecording();
      } else {
        pauseRecording();
      }
    };

    // 获取当前状态文本
    const getStatusText = () => {
      if (isRecording.value) {
        return isPaused.value ? '已暂停' : '正在录音';
      }
      return '等待开始';
    };

    // 组件卸载时清理资源
    onUnmounted(() => {
      destroy();
    });
    
    // 返回首页
    const goBackToHome = () => {
      uni.reLaunch({
        url: '/pages/home/index'
      });
    };

    return {
      isRecording,
      isPaused,
      transcriptionText,
      errorMessage,
      handleStartRecording,
      handleStopRecording,
      handlePauseResume,
      getStatusText,
      goBackToHome,
    };
  },
};
</script>

<style>
.transcription-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.back-button {
  font-size: 14px;
  padding: 5px 10px;
}

.transcription-display {
  flex: 1;
  margin-bottom: 20px;
}

.transcription-box {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.placeholder {
  color: #999;
  font-style: italic;
}

.transcription-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.status-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.inactive {
  background-color: #ccc;
}

.recording {
  background-color: #f00;
  animation: pulse 1.5s infinite;
}

.paused {
  background-color: #f90;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.button-row {
  margin: 10px 30px;
  width: calc(100% - 60px);
}

.button-row button {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
}

.error-message {
  padding: 10px;
  background-color: #ffe0e0;
  border-radius: 4px;
  color: #c00;
  margin-top: 20px;
}
</style>
