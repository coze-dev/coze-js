import { CozeAPI, ChatEventType, RoleType, COZE_CN_BASE_URL } from '@coze/api';

// 初始化 Coze 客户端
function initClient(apiKey: string) {
  return new CozeAPI({
    token: apiKey,
    baseURL: COZE_CN_BASE_URL,
    allowPersonalAccessTokenInBrowser: true,
    debug: true,
  });
}

// 验证新闻文本真实性（流式接口）
/* eslint-disable */
export async function factCheckNewsStreaming(
  apiKey: string,
  botId: string,
  text: string,
  onStart: () => void,
  onStream: (content: string) => void,
  onError: (error: string) => void,
) {
  try {
    // 初始化 Coze 客户端
    const client = await initClient(apiKey);

    // 调用流式聊天 API
    const stream = await client.chat.stream({
      bot_id: botId,
      auto_save_history: false,
      additional_messages: [
        {
          role: RoleType.User,
          content: text,
          content_type: 'text',
        },
      ],
    });

    // 处理流式响应
    for await (const part of stream) {
      if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
        onStart();
      } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        // 流式输出部分内容
        onStream(part.data.content);
      } else if (part.event === ChatEventType.CONVERSATION_CHAT_FAILED) {
        // 发生错误
        onError(part.data.last_error?.msg || '核查过程中发生错误');
      } else if (part.event === ChatEventType.ERROR) {
        // 发生错误
        onError(part.data.msg || '核查过程中发生错误');
      }
    }
  } catch (error) {
    onError((error as Error).message || '核查过程中发生未知错误');
  }
}
