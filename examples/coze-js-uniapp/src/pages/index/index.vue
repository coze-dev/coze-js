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
      <text>{{ streamingMessage }}</text>
    </template>
    <template v-else>
      <button @click="handlePollingChat">polling chat</button>
      <text>{{ pollingMessage }}</text>
    </template>
  </view>
</template>

<script>
import { CozeAPI, AbortController } from '@coze/uniapp-api';
import { RoleType, ChatEventType, WorkflowEventType } from '@coze/api';

export default {
  data() {
    return {
      streaming: true,
      streamingMessage: '',
      pollingMessage: '',
      client: null,
      isResponsing: false,
      isWorkflow: false,
      controller: null,
    };
  },
  onLoad() {
    this.client = new CozeAPI({
      baseURL: import.meta.env.VITE_COZE_BASE_URL,
      token: import.meta.env.VITE_COZE_TOKEN || '',
      allowPersonalAccessTokenInBrowser: true, // only for test
    });
  },
  methods: {
    handleStreamingChange(e) {
      this.streaming = e.detail.value;
    },
    handleWorkflowChange(e) {
      this.isWorkflow = e.detail.value;
    },
    handleAbort() {
      this.controller?.abort();
      this.isResponsing = false;
    },
    async handleStreamingChat() {
      if (this.client) {
        this.streamingMessage = '';
        try {
          this.controller = new AbortController();
          // setTimeout(() => {
          //   this.controller.abort();
          // }, 10);
          this.isResponsing = true;
          const res = this.client.chat.stream(
            {
              bot_id: import.meta.env.VITE_COZE_BOT_ID || '',
              user_id: 'abc',
              additional_messages: [
                {
                  role: RoleType.User,
                  content: '讲一个故事',
                  content_type: 'text',
                },
              ],
            },
            {
              signal: this.controller?.signal,
            },
          );
          for await (const chunk of res) {
            if (chunk.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
              this.streamingMessage += chunk.data.content;
            }
            console.log(chunk);
          }
          this.isResponsing = false;
        } catch (e) {
          console.log('failed: ', e);
        }
      }
    },
    async handlePollingChat() {
      if (this.client) {
        this.pollingMessage = '';
        try {
          const controller = new AbortController();
          // setTimeout(() => {
          //   controller.abort();
          // }, 10);

          const { messages = [] } = await this.client.chat.createAndPoll(
            {
              bot_id: import.meta.env.VITE_COZE_BOT_ID || '',
              user_id: 'abc',
              additional_messages: [
                { role: RoleType.User, content: 'hello', content_type: 'text' },
              ],
            },
            {
              signal: controller.signal,
            },
          );
          this.pollingMessage = (messages || []).reduce((acc, cur) => {
            if (cur.type === 'answer') {
              acc += cur.content;
            }
            return acc;
          }, '');
          console.log('messages: ', messages);
        } catch (e) {
          console.log('failed: ', e);
        }
      }
    },
    async handleWorkflow() {
      if (this.client) {
        this.streamingMessage = '';
        try {
          this.controller = new AbortController();

          this.isResponsing = true;
          const res = await this.client.workflows.runs.stream(
            {
              workflow_id: import.meta.env.VITE_COZE_WORKFLOW_ID || '',
              // 工作流参数，需要根据实际工作流所定义的参数填写，否则会报错
              parameters: {
                norco: 'JavaScript',
              },
              // 智能体ID，没有就不需要填
              bot_id: import.meta.env.VITE_COZE_BOT_ID || '',
            },
            {
              signal: this.controller?.signal,
            },
          );

          for await (const event of res) {
            if (event.event === WorkflowEventType.MESSAGE) {
              this.streamingMessage += event.data?.content;
            }
          }

          this.isResponsing = false;
        } catch (e) {
          console.log('failed: ', e);
        }
      }
    },
  },
};
</script>

<style>
.index {
  padding: 20px;
}
</style>
