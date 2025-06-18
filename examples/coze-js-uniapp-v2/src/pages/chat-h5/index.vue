<template>
  <view class="chat-container">
    <view class="header">
      <text class="title">实时语音聊天 WebSocket 演示</text>
    </view>

    <!-- 聊天消息列表 -->
    <scroll-view scroll-y class="messages-container" :scroll-top="scrollTop">
      <view v-if="messages.length === 0" class="empty-state">
        <text>开始聊天后，消息将显示在这里...</text>
      </view>
      <view v-else class="messages-list">
        <view
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', getMessageClass(msg.role)]"
        >
          <view class="message-role">{{ getRoleName(msg.role) }}</view>
          <view class="message-content">{{ msg.content }}</view>
        </view>
      </view>
    </scroll-view>

    <!-- 语音状态指示器 -->
    <view class="status-indicator">
      <view
        :class="[
          'status-dot',
          isConnected ? (isMuted ? 'muted' : 'active') : 'inactive',
        ]"
      ></view>
      <text>{{ getStatusText() }}</text>
    </view>

    <!-- 文本输入框 -->
    <view class="input-container">
      <input
        class="text-input"
        v-model="textMessage"
        placeholder="输入文本消息..."
        :disabled="!isConnected"
      />
      <button
        class="send-button"
        @click="handleSendText"
        :disabled="!isConnected"
        type="primary"
      >
        发送
      </button>
    </view>
    <!-- 控制按钮 -->
    <view class="button-grid">
      <view class="button-cell">
        <button @click="startChat" :disabled="isConnected" type="primary">
          开始聊天
        </button>
      </view>
      <view class="button-cell">
        <button
          @click="toggleMute"
          :disabled="!isConnected"
          :type="isMuted ? 'default' : 'warn'"
        >
          {{ isMuted ? '开启麦克风' : '关闭麦克风' }}
        </button>
      </view>
      <view class="button-cell">
        <button @click="interrupt" :disabled="!isConnected" type="default">
          中断对话
        </button>
      </view>
      <view class="button-cell">
        <button @click="stopChat" :disabled="!isConnected" type="warn">
          结束聊天
        </button>
      </view>
      <view class="volume-control-container" v-if="isConnected">
        <view class="volume-control-label"
          >播放音量: {{ Math.round(playbackVolume * 100) }}%</view
        >
        <view class="volume-control-slider">
          <slider
            :value="playbackVolume * 100"
            min="0"
            max="100"
            show-value
            @change="handleVolumeChange"
            :disabled="!isConnected"
          />
        </view>
      </view>
    </view>

    <!-- 错误信息 -->
    <view v-if="errorMessage" class="error-message">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script>
import { createVoiceChatMixin } from './use-voice-chat';

export default {
  mixins: [createVoiceChatMixin()],
};
</script>

<style>
.chat-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
}

.header {
  margin-bottom: 10px;
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

.messages-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  flex: 1;
  max-height: 40vh;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-style: italic;
}

.messages-list {
  display: flex;
  flex-direction: column;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  background-color: #dcf8c6;
}

.assistant-message {
  align-self: flex-start;
  background-color: #ffffff;
}

.system-message {
  align-self: center;
  background-color: #eeeeee;
  font-style: italic;
  font-size: 14px;
  padding: 5px 10px;
}

.message-role {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.message-content {
  word-break: break-word;
}

.status-indicator {
  display: flex;
  align-items: center;
  margin: 15px 0;
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

.active {
  background-color: #4cd964;
  animation: pulse 1.5s infinite;
}

.muted {
  background-color: #ff9500;
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

.input-container {
  display: flex;
  margin-bottom: 15px;
}

.text-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.button-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 8px 30px;
  width: calc(100% - 60px);
}

.button-cell {
  width: 50%;
  padding: 5px;
  box-sizing: border-box;
}

.button-cell button {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
}

.send-button {
  font-size: 16px;
}

.error-message {
  padding: 10px;
  background-color: #ffe0e0;
  border-radius: 4px;
  color: #c00;
  margin-top: 15px;
}

/* 语音录制区域样式 */
.voice-record-area {
  margin: 10px 0 20px;
}

.voice-button {
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #333;
  font-size: 16px;
  user-select: none;
  -webkit-touch-callout: none;
  transition: all 0.2s;
}

.voice-button.recording {
  background-color: #e0e0e0;
  color: #ff3b30;
}

.recording-status {
  margin-top: 15px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recording-time {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.recording-progress-container {
  width: 90%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.recording-progress {
  height: 100%;
  background-color: #ff3b30;
  border-radius: 3px;
  transition: width 0.3s linear;
}

.recording-tip {
  font-size: 14px;
  color: #fff;
}

.cancel-tip {
  color: #ff3b30;
}

/* Volume control styles */
.volume-control-container {
  width: 140px;
  background-color: #f8f8f8;
  border: 1px solid #eaeaea;
}

.volume-control-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  text-align: center;
}

.volume-control-slider {
  width: 100%;
  margin-bottom: 10px;
}

.volume-control-buttons {
  display: flex;
  justify-content: center;
}

.volume-control-button {
  width: 130px !important;
  font-size: 14px !important;
}
</style>
