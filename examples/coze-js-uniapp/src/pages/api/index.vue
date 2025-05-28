<template>
  <view class="index">
    <view class="header">
      <text class="title">Coze.js API 示例</text>
      <button class="back-button" @click="goBack">返回首页</button>
    </view>
    
    <view class="api-options">
      <view>
        <switch :checked="streaming" @change="handleStreamingChange" />
        <text>{{ streaming ? 'streaming' : 'polling' }}</text>
      </view>
      <view>
        <switch :checked="isWorkflow" @change="handleWorkflowChange" />
        <text>{{ isWorkflow ? 'workflow' : 'chat' }}</text>
      </view>
    </view>
    
    <template v-if="streaming">
      <button @click="isWorkflow ? handleWorkflow() : handleStreamingChat()">
        {{ isWorkflow ? 'workflow' : 'streaming chat' }}
      </button>
      <button
        :disabled="!isResponsing"
        style="color: black; margin-top: 10px"
        @click="handleAbort"
      >
        abort
      </button>
      <text>{{
        isWorkflow ? workflowStreamingMessage : chatStreamingMessage
      }}</text>
    </template>
    <template v-else>
      <button @click="handlePollingChat">polling chat</button>
      <text>{{ pollingMessage }}</text>
    </template>
  
    <view class="upload-section">
      <button @click="chooseImage">Image Upload</button>
      <text v-if="fileId">File ID: {{ fileId }}</text>
      <image
        v-if="imagePath"
        :src="imagePath"
        mode="aspectFit"
        class="preview-image"
      ></image>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';
import { useChat } from '../../composables/use-chat';
import { useWorkflow } from '../../composables/use-workflow';
import { useFileUpload } from '../../composables/use-file-upload';

export default {
  setup() {
    const streaming = ref(true);
    const isWorkflow = ref(false);

    const {
      streamingMessage: chatStreamingMessage,
      pollingMessage,
      isResponsing: chatIsResponsing,
      handleStreamingChat,
      handlePollingChat,
      handleAbort: handleChatAbort,
    } = useChat();

    const {
      streamingMessage: workflowStreamingMessage,
      isResponsing: workflowIsResponsing,
      handleWorkflow,
      handleAbort: handleWorkflowAbort,
    } = useWorkflow();

    const { fileId, imagePath, isUploading, chooseImage } = useFileUpload();

    const handleStreamingChange = e => {
      streaming.value = e.detail.value;
    };

    const handleWorkflowChange = e => {
      isWorkflow.value = e.detail.value;
    };

    const handleAbort = () => {
      if (isWorkflow.value) {
        handleWorkflowAbort();
      } else {
        handleChatAbort();
      }
    };
    
    // 返回首页
    const goBack = () => {
      uni.navigateTo({
        url: '/pages/home/index'
      });
    };

    return {
      streaming,
      isWorkflow,
      chatStreamingMessage,
      workflowStreamingMessage,
      pollingMessage,
      isResponsing: isWorkflow.value ? workflowIsResponsing : chatIsResponsing,
      handleStreamingChange,
      handleWorkflowChange,
      handleStreamingChat,
      handlePollingChat,
      handleWorkflow,
      handleAbort,
      fileId,
      imagePath,
      isUploading,
      chooseImage,
      goBack
    };
  },
};
</script>

<style>
.index {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.back-button {
  padding: 5px 10px;
  font-size: 14px;
}

.api-options {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.upload-section {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.preview-image {
  width: 200px;
  height: 200px;
  margin-top: 10px;
}
</style>
