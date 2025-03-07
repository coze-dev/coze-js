<template>
  <div style="text-align: center">
    <a-space style="padding: 20px">
      <a-button
        type="primary"
        :disabled="isConnected || isConnecting"
        @click="handleConnectClick"
      >
        连接
      </a-button>
      <a-button :disabled="!isConnected" @click="handleInterrupt">
        打断
      </a-button>
      <a-button danger :disabled="!isConnected" @click="handleDisconnect">
        断开
      </a-button>
      <a-button
        v-if="audioEnabled"
        :disabled="!isConnected"
        @click="toggleMicrophone"
      >
        静音
      </a-button>
      <a-button v-else :disabled="!isConnected" @click="toggleMicrophone">
        取消静音
      </a-button>
    </a-space>
    <br />
    <div>
      <p>Connection Status: {{ connectStatus }}</p>
    </div>
    <a-space direction="vertical">
      <a-space v-if="isSupportVideo">
        <div
          id="local-player"
          style="width: 400px; height: 400px; border: 1px solid #ccc"
        ></div>
      </a-space>
      <a-space>
        <div
          style="
            margin-top: 20px;
            padding: 20px;
            max-height: 600px;
            width: 400px;
            overflow-y: auto;
            border: 1px solid #ccc;
          "
        >
          <h3>实时语音回复</h3>
          <a-list :data-source="messageList">
            <template #renderItem="{ item }">
              <a-list-item style="text-align: left">
                {{ item }}
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-space>
    </a-space>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  EventNames,
  RealtimeAPIError,
  RealtimeClient,
  RealtimeError,
  RealtimeUtils,
} from '@coze/realtime-api';
import { CozeAPI, COZE_CN_BASE_URL, ChatEventType } from '@coze/api';
import {
  useTokenWithPat,
  useTokenWithWeb,
  useTokenWithJWT,
  useTokenWithDevice,
  useTokenWithPKCE,
} from './hooks/index';
import { NetworkErrorManager } from './network-error-manager';

const botId = '742817732159922***';
const { getToken } = useTokenWithPat();

export default {
  data() {
    return {
      client: null,
      messageList: [],
      isConnecting: false,
      isConnected: false,
      audioEnabled: true,
      isSupportVideo: false,
      connectStatus: 'disconnected',
      networkManager: null,
    };
  },

  methods: {
    async getVoices() {
      const api = new CozeAPI({
        token: getToken,
        baseURL: COZE_CN_BASE_URL,
        allowPersonalAccessTokenInBrowser: true,
      });
      const voices = await api.audio.voices.list();
      return voices.voice_list;
    },

    async initClient() {
      if (this.client) {
        return;
      }
      const permission = await RealtimeUtils.checkDevicePermission(true);
      if (!permission.audio) {
        throw new Error('需要麦克风访问权限');
      }
      this.isSupportVideo = permission.video;

      const voices = await this.getVoices();

      this.client = new RealtimeClient({
        accessToken: getToken,
        botId,
        connectorId: '1024',
        voiceId: voices.length > 0 ? voices[0].voice_id : undefined,
        allowPersonalAccessTokenInBrowser: true,
        debug: true,
        videoConfig: permission.video
          ? {
              renderDom: 'local-player',
            }
          : undefined,
      });

      this.handleMessageEvent();

      // 这段代码可选，主要处理移动端场景下，网络异常监控处理
      this.networkManager = new NetworkErrorManager(this.client);
      this.networkManager.onStatusChange = status => {
        this.connectStatus = status;
        this.isConnecting =
          status === 'connecting' || status === 'reconnecting';
        this.isConnected = status === 'connected';
      };
      // 这段代码可选，主要处理移动端场景下，网络异常监控处理
    },

    handleMessageEvent() {
      let lastEvent;
      this.client?.on(EventNames.ALL_SERVER, (eventName, event) => {
        if (
          event.event_type !== ChatEventType.CONVERSATION_MESSAGE_DELTA &&
          event.event_type !== ChatEventType.CONVERSATION_MESSAGE_COMPLETED
        ) {
          return;
        }
        const content = event.data.content;

        if (
          lastEvent?.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA
        ) {
          this.messageList[this.messageList.length - 1] += content;
        } else if (
          event.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA
        ) {
          this.messageList.push(content);
        }
        lastEvent = event;
      });
    },

    handleConnectClick() {
      this.isConnecting = true;
      this.handleConnect();
    },

    async handleConnect() {
      try {
        if (!this.client) {
          await this.initClient();
        }

        await this.client?.connect();
        this.isConnected = true;
      } catch (error) {
        this.isConnecting = false;
        console.error(error);
        if (error instanceof RealtimeAPIError) {
          switch (error.code) {
            case RealtimeError.CREATE_ROOM_ERROR:
              message.error(`创建房间失败: ${error.message}`);
              break;
            case RealtimeError.CONNECTION_ERROR:
              message.error(`加入房间失败: ${error.message}`);
              break;
            case RealtimeError.DEVICE_ACCESS_ERROR:
              message.error(`获取设备失败: ${error.message}`);
              break;
            default:
              message.error(`连接错误: ${error.message}`);
          }
        } else {
          message.error('连接错误：' + error);
        }
      }
    },

    handleInterrupt() {
      try {
        this.client?.interrupt();
      } catch (error) {
        message.error('打断失败：' + error);
      }
    },

    handleDisconnect() {
      try {
        this.client?.disconnect();
      } catch (error) {
        message.error('断开失败：' + error);
      }
    },

    toggleMicrophone() {
      try {
        this.client?.setAudioEnable(!this.audioEnabled);
        this.audioEnabled = !this.audioEnabled;
      } catch (error) {
        message.error('切换麦克风状态失败：' + error);
      }
    },
  },

  beforeUnmount() {
    this.networkManager?.destroy();
    this.handleDisconnect();
  },
};
</script>
