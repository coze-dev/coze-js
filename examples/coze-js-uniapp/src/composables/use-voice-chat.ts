/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { WsChatClient, WsChatEventNames } from '@coze/uniapp-api/ws-tools';
import {
  WebsocketsEventType,
  type CommonErrorEvent,
  type ConversationAudioTranscriptCompletedEvent,
  type ConversationMessageDeltaEvent,
} from '@coze/api';

/**
 * 实时语音聊天Hook
 * 提供语音聊天的状态管理和方法
 */
export function useVoiceChat() {
  // 聊天客户端实例
  const chatClient = ref<WsChatClient | null>(null);

  // 状态管理
  const isConnected = ref(false);
  const isRecording = ref(false);
  const isMuted = ref(false);
  const isPlaybackMuted = ref(false);
  const messages = ref<{ role: string; content: string }[]>([]);
  const errorMessage = ref('');
  const voiceId = ref('');
  const turnDetection = ref<'client_interrupt' | 'server_vad'>(
    'client_interrupt',
  );

  // 按键录音状态管理
  const isPressRecording = ref(false);
  const recordingDuration = ref(0);
  const recordTimer = ref<ReturnType<typeof setInterval> | null>(null);
  const maxRecordingTime = 60; // 最大录音时长（秒）

  // 初始化聊天客户端
  const initClient = () => {
    try {
      if (!chatClient.value) {
        chatClient.value = new WsChatClient({
          token: import.meta.env.VITE_COZE_TOKEN || '',
          botId: import.meta.env.VITE_COZE_BOT_ID || '',
          voiceId: voiceId.value,
          debug: false,
        });

        // 用户说话
        chatClient.value.on(
          WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_COMPLETED,
          (_, data) => {
            const event = data as ConversationAudioTranscriptCompletedEvent;
            if (event.data.content) {
              messages.value.push({
                role: 'user',
                content: event.data.content,
              });
            }
          },
        );

        // 智能体回复
        let isFirstDelta = true; // 标记是否是第一个增量消息

        chatClient.value.on(
          WsChatEventNames.CONVERSATION_MESSAGE_DELTA,
          (_, data) => {
            const event = data as ConversationMessageDeltaEvent;
            if (event.data.content) {
              if (isFirstDelta) {
                // 第一次增量，创建新消息
                messages.value.push({
                  role: 'assistant',
                  content: event.data.content,
                });
                isFirstDelta = false;
              } else {
                // 后续增量，追加到最后一条消息
                const lastMessage = messages.value[messages.value.length - 1];
                if (lastMessage && lastMessage.role === 'assistant') {
                  lastMessage.content += event.data.content;
                }
              }
            }
          },
        );

        chatClient.value.on(
          WsChatEventNames.CONVERSATION_MESSAGE_COMPLETED,
          () => {
            // 收到完成事件，重置标记，下一次将创建新消息
            isFirstDelta = true;
          },
        );

        // 处理连接事件
        chatClient.value.on(WsChatEventNames.CONNECTED, () => {
          isConnected.value = true;
          isRecording.value = true;

          // 添加系统提示消息
          messages.value.push({
            role: 'system',
            content: '已连接语音聊天。请开始说话...',
          });
        });

        // 处理断开连接事件
        chatClient.value.on(WsChatEventNames.DISCONNECTED, () => {
          isConnected.value = false;
          isRecording.value = false;

          // 添加系统提示消息
          messages.value.push({
            role: 'system',
            content: '语音聊天已断开连接。',
          });
        });

        // 处理音频状态变化
        chatClient.value.on(WsChatEventNames.AUDIO_MUTED, () => {
          console.log('麦克风已关闭');
          isMuted.value = true;
        });

        chatClient.value.on(WsChatEventNames.AUDIO_UNMUTED, () => {
          console.log('麦克风已打开');
          isMuted.value = false;
        });

        // 处理错误
        chatClient.value.on(WebsocketsEventType.ERROR, (_, error) => {
          errorMessage.value = `错误: ${(error as CommonErrorEvent).data?.msg || '未知错误'}`;
        });
      }
    } catch (error: any) {
      errorMessage.value = `初始化错误: ${error || '未知错误'}`;
      console.error('初始化语音聊天客户端错误:', error);
    }
  };

  // 开始聊天
  const startChat = async () => {
    errorMessage.value = '';
    messages.value = [];

    try {
      if (!chatClient.value) {
        initClient();
      }

      await chatClient.value?.connect({
        chatUpdate: {
          data: {
            chat_config: {
              auto_save_history: true,
            },
            turn_detection: {
              type: turnDetection.value,
            },
          },
        },
      });

      isConnected.value = true;
      isRecording.value = true;
    } catch (error: any) {
      errorMessage.value = `连接错误: ${error.message}`;
      console.error('连接语音聊天错误:', error);
    }
  };

  // 停止聊天
  const stopChat = async () => {
    if (isConnected.value && chatClient.value) {
      try {
        await chatClient.value.disconnect();
        isConnected.value = false;
        isRecording.value = false;
        isMuted.value = false;
      } catch (error: any) {
        errorMessage.value = `断开连接错误: ${error.message}`;
        console.error('断开语音聊天连接错误:', error);
      }
    }
  };

  // 发送文本消息
  const sendTextMessage = (text: string) => {
    if (isConnected.value && chatClient.value && text.trim()) {
      chatClient.value.sendTextMessage(text);

      // 添加用户消息到列表
      messages.value.push({
        role: 'user',
        content: text,
      });
    }
  };

  // 切换麦克风静音状态
  const toggleMute = async () => {
    if (isConnected.value && chatClient.value) {
      try {
        await chatClient.value.setAudioEnable(isMuted.value);
      } catch (error: any) {
        errorMessage.value = `切换麦克风状态错误: ${error.message}`;
        console.error('切换麦克风状态错误:', error);
      }
    }
  };

  // 中断当前对话
  const interrupt = () => {
    if (isConnected.value && chatClient.value) {
      chatClient.value.interrupt();

      // 添加系统提示消息
      messages.value.push({
        role: 'system',
        content: '已中断当前对话。',
      });
    }
  };

  // 开始按键录音
  const startPressRecord = () => {
    if (isConnected.value && chatClient.value) {
      try {
        // 重置录音状态
        isPressRecording.value = true;
        recordingDuration.value = 0;

        // 开始录音
        chatClient.value.startRecord();

        // 开始计时
        recordTimer.value = setInterval(() => {
          recordingDuration.value++;

          // 超过最大录音时长自动结束
          if (recordingDuration.value >= maxRecordingTime) {
            finishPressRecord();
          }
        }, 1000);
      } catch (error: any) {
        errorMessage.value = `开始录音错误: ${error.message}`;
        console.error('开始录音错误:', error);
      }
    }
  };

  // 结束按键录音并发送
  const finishPressRecord = () => {
    if (isPressRecording.value && chatClient.value) {
      try {
        // 停止计时
        if (recordTimer.value) {
          clearInterval(recordTimer.value);
          recordTimer.value = null;
        }

        // 如果录音时间太短（小于1秒），视为无效
        if (recordingDuration.value < 1) {
          cancelPressRecord();
          return;
        }

        // 停止录音并发送
        chatClient.value.stopRecord();
        isPressRecording.value = false;

        // 添加系统消息提示
        messages.value.push({
          role: 'system',
          content: `发送了 ${recordingDuration.value} 秒的语音消息`,
        });
      } catch (error: any) {
        errorMessage.value = `结束录音错误: ${error.message}`;
        console.error('结束录音错误:', error);
      }
    }
  };

  // 取消按键录音
  const cancelPressRecord = () => {
    if (isPressRecording.value && chatClient.value) {
      try {
        // 停止计时
        if (recordTimer.value) {
          clearInterval(recordTimer.value);
          recordTimer.value = null;
        }

        // 取消录音
        chatClient.value.stopRecord();
        isPressRecording.value = false;

        // 添加系统消息提示
        messages.value.push({
          role: 'system',
          content: '取消了语音消息',
        });
      } catch (error: any) {
        errorMessage.value = `取消录音错误: ${error.message}`;
        console.error('取消录音错误:', error);
      }
    }
  };

  // 清理资源
  const destroy = async () => {
    if (chatClient.value) {
      // 清理录音计时器
      if (recordTimer.value) {
        clearInterval(recordTimer.value);
        recordTimer.value = null;
      }

      await chatClient.value.disconnect();
      chatClient.value = null;
    }
    isConnected.value = false;
    isRecording.value = false;
    isPressRecording.value = false;
  };

  // 切换静音
  const togglePlaybackMute = () => {
    if (chatClient.value) {
      chatClient.value.setPlaybackMuted(!isPlaybackMuted.value);
      isPlaybackMuted.value = !isPlaybackMuted.value;
    } else {
      throw new Error('Chat client not initialized');
    }
  };

  return {
    isConnected,
    isRecording,
    isMuted,
    isPlaybackMuted,
    messages,
    errorMessage,
    voiceId,
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
    destroy,
    turnDetection,
    togglePlaybackMute,
  };
}
