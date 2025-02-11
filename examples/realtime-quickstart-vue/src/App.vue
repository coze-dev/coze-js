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

<script lang="ts" setup>
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

const botId = '7428177321599***';

const client = ref<RealtimeClient | null>(null);
const messageList = ref<string[]>([]);
const isConnecting = ref(false);
const isConnected = ref(false);
const audioEnabled = ref(true);
const isSupportVideo = ref(false);

const { getToken } = useTokenWithPat();
// const { getToken } = useTokenWithWeb();

async function getVoices() {
  const api = new CozeAPI({
    token: getToken,
    baseURL: COZE_CN_BASE_URL,
    allowPersonalAccessTokenInBrowser: true,
  });

  const voices = await api.audio.voices.list();
  return voices.voice_list;
}

async function initClient() {
  const permission = await RealtimeUtils.checkDevicePermission(true);
  if (!permission.audio) {
    throw new Error('需要麦克风访问权限');
  }
  isSupportVideo.value = permission.video;

  const voices = await getVoices();

  client.value = new RealtimeClient({
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

  handleMessageEvent();
}

const handleMessageEvent = () => {
  let lastEvent: any;

  client.value?.on(EventNames.ALL_SERVER, (eventName, event: any) => {
    if (
      event.event_type !== ChatEventType.CONVERSATION_MESSAGE_DELTA &&
      event.event_type !== ChatEventType.CONVERSATION_MESSAGE_COMPLETED
    ) {
      return;
    }
    const content = event.data.content;

    if (lastEvent?.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      messageList.value[messageList.value.length - 1] += content;
    } else if (event.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      messageList.value.push(content);
    }
    lastEvent = event;
  });
};

const handleConnectClick = async () => {
  isConnecting.value = true;
  try {
    await handleConnect();
  } finally {
    isConnecting.value = false;
  }
};

const handleConnect = async () => {
  try {
    if (!client.value) {
      await initClient();
    }
    await client.value?.connect();
    isConnected.value = true;
  } catch (error) {
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
};

const handleInterrupt = () => {
  try {
    client.value?.interrupt();
  } catch (error) {
    message.error('打断失败：' + error);
  }
};

const handleDisconnect = () => {
  try {
    client.value?.disconnect();
    client.value?.clearEventHandlers();
    client.value = null;
    isConnected.value = false;
  } catch (error) {
    message.error('断开失败：' + error);
  }
};

const toggleMicrophone = async () => {
  try {
    await client.value?.setAudioEnable(!audioEnabled.value);
    audioEnabled.value = !audioEnabled.value;
  } catch (error) {
    message.error('切换麦克风状态失败：' + error);
  }
};

onUnmounted(() => {
  handleDisconnect();
});
</script>
