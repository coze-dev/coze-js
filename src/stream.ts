class Stream<T, F extends Record<string, string>> {
  private stream: ReadableStream;
  private reader: ReadableStreamDefaultReader;
  private decoder: TextDecoder;
  private handler: (message: F) => T;
  private fieldPrefixes: F;

  constructor(stream: ReadableStream, fieldPrefixes: F, handler: (message: F) => T) {
    this.stream = stream;
    this.reader = this.stream.getReader();
    this.decoder = new TextDecoder();
    this.handler = handler;
    this.fieldPrefixes = fieldPrefixes;
  }

  async *[Symbol.asyncIterator]() {
    const fieldValues: Record<string, string> = {};

    let buffer = '';
    while (true) {
      const { done, value } = await this.reader.read();
      if (done) {
        if (buffer) yield buffer;
        break;
      }
      buffer += this.decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        for (const [field, prefix] of Object.entries(this.fieldPrefixes)) {
          if (line.startsWith(prefix)) {
            const content = line.substring(prefix.length).trim();
            fieldValues[field] = content;
            if (field === 'data') {
              yield this.handler(fieldValues as F);
            }
            break;
          }
        }
      }
      buffer = lines[lines.length - 1]; // Keep the last incomplete line in the buffer
    }
  }
}

export default Stream;

// Importing the necessary module for enum
enum ChatEventType {
  // Event for creating a conversation, indicating the start of the conversation.
  // 创建对话的事件，表示对话开始。
  CONVERSATION_CHAT_CREATED = 'conversation.chat.created',

  // The server is processing the conversation.
  // 服务器正在处理对话。
  CONVERSATION_CHAT_IN_PROGRESS = 'conversation.chat.in_progress',

  // Incremental message, usually an incremental message when type=answer.
  // 增量消息，通常是 type=answer 时的增量消息。
  CONVERSATION_MESSAGE_DELTA = 'conversation.message.delta',

  // The message has been completely replied to. At this point, the streaming package contains the spliced results of all message.delta, and each message is in a completed state.
  // message 已回复完成。此时流式包中带有所有 message.delta 的拼接结果，且每个消息均为 completed 状态。
  CONVERSATION_MESSAGE_COMPLETED = 'conversation.message.completed',

  // The conversation is completed.
  // 对话完成。
  CONVERSATION_CHAT_COMPLETED = 'conversation.chat.completed',

  // This event is used to mark a failed conversation.
  // 此事件用于标识对话失败。
  CONVERSATION_CHAT_FAILED = 'conversation.chat.failed',

  // The conversation is interrupted and requires the user to report the execution results of the tool.
  // 对话中断，需要使用方上报工具的执行结果。
  CONVERSATION_CHAT_REQUIRES_ACTION = 'conversation.chat.requires_action',

  // Error events during the streaming response process. For detailed explanations of code and msg, please refer to Error codes.
  // 流式响应过程中的错误事件。关于 code 和 msg 的详细说明，可参考错误码。
  ERROR = 'error',

  // The streaming response for this session ended normally.
  // 本次会话的流式返回正常结束。
  DONE = 'done',
}

export { ChatEventType };
