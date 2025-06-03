<template>
  <view class="chat-container">
    <view class="header">
      <text class="title">实时语音聊天 WebSocket 演示</text>
      <button class="back-button" @click="goBackToHome">返回首页</button>
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
        :disabled="!isConnected || isPressRecording"
      />
      <button
        class="send-button"
        @click="handleSendText"
        :disabled="!isConnected || isPressRecording"
        type="primary"
      >
        发送
      </button>
    </view>

    <!-- 语音消息按钮 -->
    <view class="voice-record-area" v-if="isConnected">
      <view
        class="voice-button"
        :class="{ recording: isPressRecording }"
        @touchstart="handleVoiceButtonTouchStart"
        @touchend="handleVoiceButtonTouchEnd"
        @touchmove="handleVoiceButtonTouchMove"
        @touchcancel="handleVoiceButtonTouchCancel"
      >
        {{ isPressRecording ? '松开 发送' : '按住 说话' }}
      </view>

      <!-- 录音状态提示 -->
      <view class="recording-status" v-if="isPressRecording">
        <view class="recording-time">
          {{
            Math.floor(recordingDuration / 60)
              .toString()
              .padStart(2, '0')
          }}:{{ (recordingDuration % 60).toString().padStart(2, '0') }}
        </view>
        <view class="recording-progress-container">
          <view
            class="recording-progress"
            :style="{
              width: (recordingDuration / maxRecordingTime) * 100 + '%',
            }"
          ></view>
        </view>
        <view
          class="recording-tip"
          :class="{ 'cancel-tip': isCancelRecording }"
        >
          {{ isCancelRecording ? '松开手指，取消发送' : '上滑取消发送' }}
        </view>
      </view>
    </view>

    <!-- 控制按钮 -->
    <view class="button-grid">
      <view class="button-cell">
        <button @click="handleStartChat" :disabled="isConnected" type="primary">
          开始聊天
        </button>
      </view>
      <view class="button-cell" v-if="turnDetection === 'client_vad'">
        <button
          @click="handleToggleMute"
          :disabled="!isConnected"
          :type="isMuted ? 'default' : 'warn'"
        >
          {{ isMuted ? '开启麦克风' : '关闭麦克风' }}
        </button>
      </view>
      <view class="button-cell">
        <button
          @click="handleInterrupt"
          :disabled="!isConnected"
          type="default"
        >
          中断对话
        </button>
      </view>
      <view class="button-cell">
        <button @click="handleStopChat" :disabled="!isConnected" type="warn">
          结束聊天
        </button>
      </view>
      <view class="button-cell" v-if="isConnected">
        <button
          @click="handleToggleAudioPlayback"
          :type="isPlaybackMuted ? 'primary' : 'default'"
          :disabled="!isConnected"
        >
          {{ isPlaybackMuted ? '取消静音' : '静音播放' }}
        </button>
      </view>
    </view>

    <!-- 错误信息 -->
    <view v-if="errorMessage" class="error-message">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script>
import { useVoiceChat } from '../../composables/use-voice-chat';
import { onUnmounted, ref, watch } from 'vue';

export default {
  setup() {
    const {
      isConnected,
      isRecording,
      isMuted,
      isPlaybackMuted,
      messages,
      errorMessage,
      isPressRecording,
      recordingDuration,
      maxRecordingTime,
      startChat,
      stopChat,
      sendTextMessage,
      toggleMute,
      interrupt,
      startPressRecord,
      finishPressRecord,
      cancelPressRecord,
      togglePlaybackMute,
      destroy,
      turnDetection,
    } = useVoiceChat();

    // 文本消息
    const textMessage = ref('');

    // 按住说话相关状态
    const isCancelRecording = ref(false); // 是否处于取消状态（上滑）
    const touchStartY = ref(0); // 记录触摸开始的Y坐标

    // 滚动控制
    const scrollTop = ref(0);

    // 监听消息变化，自动滚动到底部
    watch(messages, () => {
      // 在下一个渲染周期滚动到底部
      setTimeout(() => {
        scrollTop.value = 9999999;
      }, 100);
    });

    // 处理开始聊天
    const handleStartChat = () => {
      startChat();
    };

    // 处理结束聊天
    const handleStopChat = () => {
      stopChat();
    };

    // 处理麦克风开关
    const handleToggleMute = () => {
      toggleMute();
    };

    // 处理中断对话
    const handleInterrupt = () => {
      interrupt();
    };

    // 发送文本消息
    const handleSendText = () => {
      if (textMessage.value.trim()) {
        sendTextMessage(textMessage.value);
        textMessage.value = '';
      }
    };

    // 切换音频静音
    const handleToggleAudioPlayback = () => {
      try {
        togglePlaybackMute();
      } catch (error) {
        console.error('Error toggling audio playback:', error);
        errorMessage.value = `操作失败: ${error.message}`;
      }
    };

    // 获取当前状态文本
    const getStatusText = () => {
      if (!isConnected.value) {
        return '未连接';
      }

      if (isMuted.value) {
        return '麦克风已关闭';
      }

      return '正在聊天中';
    };

    // 获取消息样式类
    const getMessageClass = role => {
      switch (role) {
        case 'user':
          return 'user-message';
        case 'assistant':
          return 'assistant-message';
        default:
          return 'system-message';
      }
    };

    // 获取角色显示名称
    const getRoleName = role => {
      switch (role) {
        case 'user':
          return '我';
        case 'assistant':
          return '助手';
        default:
          return '系统';
      }
    };

    // 按住说话相关方法
    const handleVoiceButtonTouchStart = e => {
      if (isConnected.value) {
        // 记录初始触摸位置的Y坐标
        touchStartY.value = e.touches[0].clientY;
        isCancelRecording.value = false;
        startPressRecord();
      }
    };

    const handleVoiceButtonTouchMove = e => {
      if (isPressRecording.value) {
        // 计算Y方向的移动距离，判断是否上滑取消
        const moveY = e.touches[0].clientY;
        const moveDistance = touchStartY.value - moveY;

        // 上滑超过50px时，进入取消状态
        isCancelRecording.value = moveDistance > 50;
      }
    };

    const handleVoiceButtonTouchEnd = () => {
      if (isPressRecording.value) {
        if (isCancelRecording.value) {
          // 如果处于取消状态，则取消录音
          cancelPressRecord();
        } else {
          // 否则结束录音并发送
          finishPressRecord();
        }
        isCancelRecording.value = false;
      }
    };

    const handleVoiceButtonTouchCancel = () => {
      if (isPressRecording.value) {
        // 触摸取消时，也取消录音
        cancelPressRecord();
        isCancelRecording.value = false;
      }
    };

    // 组件卸载时清理资源
    onUnmounted(() => {
      destroy();
    });

    // 返回首页
    const goBackToHome = () => {
      uni.reLaunch({
        url: '/pages/home/index',
      });
    };

    return {
      isConnected,
      isRecording,
      isMuted,
      messages,
      errorMessage,
      isPressRecording,
      recordingDuration,
      maxRecordingTime,
      isCancelRecording,
      textMessage,
      scrollTop,
      handleStartChat,
      handleStopChat,
      handleToggleMute,
      handleInterrupt,
      handleSendText,
      handleVoiceButtonTouchStart,
      handleVoiceButtonTouchMove,
      handleVoiceButtonTouchEnd,
      handleVoiceButtonTouchCancel,
      handleToggleAudioPlayback,
      getStatusText,
      getMessageClass,
      getRoleName,
      goBackToHome,
      turnDetection,
      isPlaybackMuted,
    };
  },
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
</style>
