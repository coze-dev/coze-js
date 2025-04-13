<template>
  <view class="index">
    <view>
      <switch :checked="streaming" @change="handleStreamingChange" />
      <text>{{ streaming ? 'streaming' : 'polling' }}</text>
    </view>
    <view>
      <switch :checked="isWorkflow" @change="handleWorkflowChange" />
      <text>{{ isWorkflow ? 'workflow' : 'chat' }}</text>
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
  </view>
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
    };
  },
};
</script>

<style>
.index {
  padding: 20px;
}

.upload-section {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
}

.preview-image {
  width: 200px;
  height: 200px;
  margin-top: 10px;
}
</style>
