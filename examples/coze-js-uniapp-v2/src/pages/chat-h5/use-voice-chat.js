/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import {
  WsChatClient,
  WsChatEventNames,
  WsToolsUtils,
} from '@coze/api/ws-tools';
import { WebsocketsEventType } from '@coze/api';

/**
 * 实时语音聊天Hook (Vue 2版本)
 * 提供语音聊天的状态管理和方法
 */
export function createVoiceChatMixin() {
  return {
    data() {
      return {
        // 聊天客户端实例
        chatClient: null,

        // 状态管理
        isConnected: false,
        isMuted: false,
        playbackVolume: 1.0, // Volume level from 0.0 to 1.0
        messages: [],
        errorMessage: '',
        voiceId: '',

        // 文本消息
        textMessage: '',

        // 滚动控制
        scrollTop: 0,
      };
    },

    methods: {
      // 初始化聊天客户端
      async initClient() {
        try {
          const devices = await WsToolsUtils.getAudioDevices();

          const deviceId = devices.audioInputs.find(
            device => device.label === 'Headset earpiece',
          )?.deviceId;

          if (!this.chatClient) {
            this.chatClient = new WsChatClient({
              token: process.env.VUE_APP_COZE_TOKEN,
              botId: process.env.VUE_APP_COZE_BOT_ID,
              // voiceId: this.voiceId,
              deviceId,
              allowPersonalAccessTokenInBrowser: true,
            });

            // 用户说话
            this.chatClient.on(
              WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_COMPLETED,
              (_, data) => {
                const event = data;
                if (event.data.content) {
                  this.messages.push({
                    role: 'user',
                    content: event.data.content,
                  });
                }
              },
            );

            // 智能体回复
            let isFirstDelta = true; // 标记是否是第一个增量消息

            this.chatClient.on(
              WsChatEventNames.CONVERSATION_MESSAGE_DELTA,
              (_, data) => {
                const event = data;
                if (event.data.content) {
                  if (isFirstDelta) {
                    // 第一次增量，创建新消息
                    this.messages.push({
                      role: 'assistant',
                      content: event.data.content,
                    });
                    isFirstDelta = false;
                  } else {
                    // 后续增量，追加到最后一条消息
                    const lastMessage = this.messages[this.messages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                      Vue.set(
                        lastMessage,
                        'content',
                        lastMessage.content + event.data.content,
                      );
                    }
                  }
                }
              },
            );

            this.chatClient.on(
              WsChatEventNames.CONVERSATION_MESSAGE_COMPLETED,
              () => {
                // 收到完成事件，重置标记，下一次将创建新消息
                isFirstDelta = true;
              },
            );

            // 处理连接事件
            this.chatClient.on(WsChatEventNames.CONNECTED, () => {
              this.isConnected = true;

              // 添加系统提示消息
              this.messages.push({
                role: 'system',
                content: '已连接语音聊天。请开始说话...',
              });
            });

            // 处理断开连接事件
            this.chatClient.on(WsChatEventNames.DISCONNECTED, () => {
              this.isConnected = false;

              // 添加系统提示消息
              this.messages.push({
                role: 'system',
                content: '语音聊天已断开连接。',
              });
            });

            // 处理音频状态变化
            this.chatClient.on(WsChatEventNames.AUDIO_MUTED, () => {
              console.log('麦克风已关闭');
              this.isMuted = true;
            });

            this.chatClient.on(WsChatEventNames.AUDIO_UNMUTED, () => {
              console.log('麦克风已打开');
              this.isMuted = false;
            });

            // 处理错误
            this.chatClient.on(WsChatEventNames.ERROR, (_, data) => {
              const event = data;
              console.error('聊天错误:', event);
              this.errorMessage = `错误: ${event.data.message || '未知错误'}`;

              // 添加系统错误消息
              this.messages.push({
                role: 'system',
                content: `发生错误: ${event.data.message || '未知错误'}`,
              });
            });
          }
        } catch (error) {
          console.error('初始化聊天客户端错误:', error);
          this.errorMessage = `初始化错误: ${error.message || '未知错误'}`;
        }
      },

      // 开始聊天
      async startChat() {
        try {
          const permission = await WsToolsUtils.checkDevicePermission();
          if (!permission.audio) {
            uni.showToast({
              title: '麦克风权限被拒绝',
              icon: 'none',
            });
            return;
          }
          await this.initClient();

          if (this.chatClient) {
            await this.chatClient.connect({
              chatUpdate: {
                data: {
                  input_audio: {
                    format: 'pcm',
                    codec: 'pcm',
                    sample_rate: 48000,
                  },
                  output_audio: {
                    codec: 'pcm',
                    pcm_config: {
                      sample_rate: 24000,
                    },
                  },
                  need_play_prologue: true,
                },
              },
            });
          }
        } catch (error) {
          console.error('开始聊天错误:', error);
          this.errorMessage = `开始聊天错误: ${error.message || '未知错误'}`;
        }
      },

      // 停止聊天
      async stopChat() {
        if (this.isConnected && this.chatClient) {
          await this.chatClient.disconnect();
          this.chatClient = null;
          this.isConnected = false;
        }
      },

      // 发送文本消息
      sendTextMessage(text) {
        if (this.isConnected && this.chatClient && text) {
          this.chatClient.sendTextMessage(text);
          this.messages.push({
            role: 'user',
            content: text,
          });
        }
      },

      // 切换麦克风静音状态
      async toggleMute() {
        if (this.isConnected && this.chatClient) {
          try {
            if (this.isMuted) {
              await this.chatClient.setAudioEnable(true);
            } else {
              await this.chatClient.setAudioEnable(false);
            }
          } catch (error) {
            this.errorMessage = `切换麦克风状态错误: ${error.message || '未知错误'}`;
            console.error('切换麦克风状态错误:', error);
          }
        }
      },

      // 中断当前对话
      async interrupt() {
        if (this.isConnected && this.chatClient) {
          await this.chatClient.interrupt();

          // 添加系统提示消息
          this.messages.push({
            role: 'system',
            content: '已中断当前对话。',
          });
        }
      },

      // 清理资源
      async destroy() {
        if (this.chatClient) {
          await this.chatClient.disconnect();
          this.chatClient = null;
        }
        this.isConnected = false;
        this.isRecording = false;
      },

      // 设置播放音量
      setPlaybackVolume(volume) {
        if (this.chatClient) {
          // Ensure volume is between 0 and 1
          const normalizedVolume = Math.max(0, Math.min(1, volume));
          this.chatClient.setPlaybackVolume(normalizedVolume);
          this.playbackVolume = normalizedVolume;
        } else {
          throw new Error('Chat client not initialized');
        }
      },

      // 获取当前播放音量
      getPlaybackVolume() {
        return this.playbackVolume;
      },

      // 获取当前状态文本
      getStatusText() {
        if (!this.isConnected) {
          return '未连接';
        }

        if (this.isMuted) {
          return '麦克风已关闭';
        }

        return '正在聊天中';
      },

      // 获取消息样式类
      getMessageClass(role) {
        switch (role) {
          case 'user':
            return 'user-message';
          case 'assistant':
            return 'assistant-message';
          default:
            return 'system-message';
        }
      },

      // 获取角色显示名称
      getRoleName(role) {
        switch (role) {
          case 'user':
            return '我';
          case 'assistant':
            return '助手';
          default:
            return '系统';
        }
      },
      // 发送文本消息
      handleSendText() {
        if (this.textMessage.trim()) {
          this.sendTextMessage(this.textMessage);
          this.textMessage = '';
        }
      },

      // 处理音量变化
      handleVolumeChange(e) {
        try {
          // Slider returns value from 0-100, convert to 0-1
          const volume = e.detail.value / 100;
          this.setPlaybackVolume(volume);
        } catch (error) {
          console.error('Error setting audio volume:', error);
          this.errorMessage = `设置音量失败: ${error.message}`;
        }
      },
    },

    // 组件卸载时清理资源
    beforeDestroy() {
      this.destroy();
    },

    // 监听消息变化，自动滚动到底部
    watch: {
      messages() {
        // 在下一个渲染周期滚动到底部
        setTimeout(() => {
          this.scrollTop = 9999999;
        }, 100);
      },
    },
  };
}
