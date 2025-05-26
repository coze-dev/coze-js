<template>
  <view class="speech-container">
    <view class="header">
      <text class="title">文本转语音 WebSocket 演示</text>
    </view>

    <view class="input-section">
      <textarea
        v-model="inputText"
        class="text-input"
        placeholder="请输入要转换为语音的文本..."
        :disabled="isPlaying"
      ></textarea>
    </view>

    <view class="action-buttons">
      <button
        @click="handleConvert"
        :disabled="!inputText || isPlaying"
        type="primary"
        class="action-button"
      >
        转换为语音
      </button>

      <button @click="handleTogglePlay" type="default" class="action-button">
        {{ isPlaying ? '暂停' : '继续' }}
      </button>

      <button
        @click="handleAbort"
        :disabled="!isPlaying"
        type="warn"
        class="action-button"
      >
        中止转换
      </button>
    </view>

    <view v-if="errorMessage" class="error-message">
      <text>{{ errorMessage }}</text>
    </view>

    <navigator url="/pages/index/index" open-type="navigate" class="nav-link">
      返回主页
    </navigator>
  </view>
</template>

<script>
import { ref } from 'vue';
import { useSpeech } from '../../composables/use-speech';

export default {
  setup() {
    // 使用文本转语音钩子
    const {
      isPlaying,
      errorMessage,
      convertTextToSpeech,
      abortRequest,
      togglePlayback,
    } = useSpeech();

    // 没有额外的暂停状态，直接使用isPlaying

    // 用户输入的文本
    const inputText = ref('你好，我是 Coze！欢迎使用文本转语音功能。');

    // 处理转换请求
    const handleConvert = () => {
      convertTextToSpeech(inputText.value);
    };

    // 处理中止请求
    const handleAbort = () => {
      abortRequest();
    };

    // 处理暂停/继续播放切换
    const handleTogglePlay = async () => {
      await togglePlayback();
    };

    return {
      isPlaying,
      errorMessage,
      inputText,
      handleConvert,
      handleAbort,
      handleTogglePlay,
    };
  },
};
</script>

<style>
.speech-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.connection-status {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.connected {
  background-color: #4caf50;
}

.disconnected {
  background-color: #f44336;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.text-input {
  width: 100%;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
}

.voice-selector {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.picker-text {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-width: 200px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-button {
  margin: 0;
}

.error-message {
  padding: 10px;
  background-color: #ffebee;
  border-radius: 6px;
  color: #f44336;
}

.audio-player {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-weight: bold;
}

.audio-element {
  width: 100%;
}

.nav-link {
  margin-top: 20px;
  color: #2196f3;
  text-align: center;
}
</style>
