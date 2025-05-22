<template>
  <div style="text-align: center">
    <a-space style="padding: 20px" direction="vertical">
      <a-space>
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

      <a-space v-if="isSupportVideo && videoDevices.length > 0">
        <a-select
          style="width: 250px"
          :disabled="!isConnected"
          v-model:value="selectedVideoDeviceId"
          placeholder="选择视频输入设备"
          @change="handleVideoDeviceChange"
        >
          <a-select-option
            v-for="device in videoDevices"
            :key="device.deviceId"
            :value="device.deviceId"
          >
            {{ device.label || `设备 ${device.deviceId.substring(0, 8)}...` }}
          </a-select-option>
        </a-select>
        <a-button
          v-if="isVideoEnabled"
          :disabled="!isConnected"
          @click="toggleVideo"
        >
          关闭视频
        </a-button>
        <a-button v-else :disabled="!isConnected" @click="toggleVideo">
          开启视频
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
      videoDevices: [],
      selectedVideoDeviceId: '',
      isVideoEnabled: true,
      isMobileDevice: false,
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

    // 检测是否为移动设备
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    },

    async initClient() {
      if (this.client) {
        return;
      }

      // 检测是否为移动设备
      this.isMobileDevice = this.isMobile();

      const permission = await RealtimeUtils.checkDevicePermission(true);
      if (!permission.audio) {
        throw new Error('需要麦克风访问权限');
      }
      this.isSupportVideo = permission.video;

      // 获取设备列表
      if (this.isMobileDevice && this.isSupportVideo) {
        // 移动设备上直接提供前置和后置摄像头选项
        // 注意：移动端设备上也可以通过 RealtimeUtils.getAudioDevices 获取设备列表，
        // 但是可能会返回比较多的设备，如苹果手机会有：前置相机、后置双镜头、后置相机、后置长焦相机这些设备
        // 如果仅需要前置和后置摄像头选项，可以参考以下代码
        this.videoDevices = [
          { deviceId: 'user', label: '前置摄像头' },
          { deviceId: 'environment', label: '后置摄像头' },
        ];
      } else {
        // 非移动设备获取实际设备列表
        const devices = await RealtimeUtils.getAudioDevices({
          video: true,
        });
        this.videoDevices = devices.videoInputs || [];
      }
      if (!this.selectedVideoDeviceId && this.videoDevices.length > 0) {
        this.selectedVideoDeviceId = this.videoDevices[0].deviceId;
      }

      const voices = await this.getVoices();

      console.log('voices', this.selectedVideoDeviceId);

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
              videoInputDeviceId: this.selectedVideoDeviceId || undefined,
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

    toggleVideo() {
      try {
        this.client?.setVideoEnable(!this.isVideoEnabled);
        this.isVideoEnabled = !this.isVideoEnabled;
      } catch (error) {
        message.error('切换视频状态失败：' + error);
      }
    },

    async handleVideoDeviceChange(deviceId) {
      try {
        if (!this.client || !this.isConnected) {
          return;
        }

        // 只要切换到屏幕分享设备，或者从屏幕分享设备切换到其他设备，都需要重新连接
        if (
          RealtimeUtils.isScreenShareDevice(deviceId) ||
          RealtimeUtils.isScreenShareDevice(this.selectedVideoDeviceId)
        ) {
          // 保存当前选中的设备ID
          this.selectedVideoDeviceId = deviceId;
          // 如果是屏幕分享设备，需要重新连接
          this.handleDisconnect();
          this.client = null;
          this.handleConnect();
        } else {
          // 保存当前选中的设备ID
          this.selectedVideoDeviceId = deviceId;
          await this.client.setVideoInputDevice(deviceId);
        }
        message.success('切换视频设备成功');
      } catch (error) {
        message.error('切换视频设备失败：' + error);
      }
    },
  },

  beforeUnmount() {
    this.networkManager?.destroy();
    this.handleDisconnect();
  },
};
</script>
