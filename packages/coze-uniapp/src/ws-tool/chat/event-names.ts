export enum WsChatEventNames {
  /**
   * en: All events
   * zh: 所有事件
   */
  ALL = 'realtime.event',
  /**
   * en: Client connected
   * zh: 客户端连接
   */
  CONNECTED = 'client.connected',
  /**
   * en: Client connecting
   * zh: 客户端连接中
   */
  CONNECTING = 'client.connecting',
  /**
   * en: Client interrupted
   * zh: 客户端中断
   */
  INTERRUPTED = 'client.interrupted',
  /**
   * en: Client disconnected
   * zh: 客户端断开
   */
  DISCONNECTED = 'client.disconnected',
  /**
   * en: Client audio unmuted
   * zh: 客户端音频未静音
   */
  AUDIO_UNMUTED = 'client.audio.unmuted',
  /**
   * en: Client audio muted
   * zh: 客户端音频静音
   */
  AUDIO_MUTED = 'client.audio.muted',
  /**
   * en: Client error
   * zh: 客户端错误
   */
  ERROR = 'client.error',

  /**
   * en: Denoiser enabled
   * zh: 降噪开启
   */
  DENOISER_ENABLED = 'client.denoiser.enabled',
  /**
   * en: Denoiser disabled
   * zh: 降噪关闭
   */
  DENOISER_DISABLED = 'client.denoiser.disabled',
  /**
   * en: Audio input device changed
   * zh: 音频输入设备改变
   */
  AUDIO_INPUT_DEVICE_CHANGED = 'client.input.device.changed',
  /**
   * en: Audio output device changed
   * zh: 音频输出设备改变
   */
  AUDIO_OUTPUT_DEVICE_CHANGED = 'client.output.device.changed',
  /**
   * en: Audio record dump
   * zh: 音频 dump
   */
  AUDIO_INPUT_DUMP = 'client.audio.input.dump',

  /**
   * en: Chat created
   * zh: 对话创建成功
   */
  CHAT_CREATED = 'server.chat.created',
  /**
   * en: Chat updated
   * zh: 对话更新
   */
  CHAT_UPDATED = 'server.chat.updated',
  /**
   * en: Conversation chat created
   * zh: 会话对话创建
   */
  CONVERSATION_CHAT_CREATED = 'server.conversation.chat.created',
  /**
   * en: Conversation chat in progress
   * zh: 对话正在处理中
   */
  CONVERSATION_CHAT_IN_PROGRESS = 'server.conversation.chat.in.progress',
  /**
   * en: Conversation message delta received
   * zh: 文本消息增量返回
   */
  CONVERSATION_MESSAGE_DELTA = 'server.conversation.message.delta',
  /**
   * en: Conversation audio delta received
   * zh: 语音消息增量返回
   */
  CONVERSATION_AUDIO_DELTA = 'server.conversation.audio.delta',
  /**
   * en: Conversation message completed
   * zh: 文本消息完成
   */
  CONVERSATION_MESSAGE_COMPLETED = 'server.conversation.message.completed',
  /**
   * en: Conversation audio completed
   * zh: 语音回复完成
   */
  CONVERSATION_AUDIO_COMPLETED = 'server.conversation.audio.completed',
  /**
   * en: Conversation chat completed
   * zh: 对话完成
   */
  CONVERSATION_CHAT_COMPLETED = 'server.conversation.chat.completed',
  /**
   * en: Conversation chat failed
   * zh: 对话失败
   */
  CONVERSATION_CHAT_FAILED = 'server.conversation.chat.failed',
  /**
   * en: Server error occurred
   * zh: 服务端错误
   */
  SERVER_ERROR = 'server.error',
  /**
   * en: Input audio buffer completed
   * zh: 语音输入缓冲区提交完成
   */
  INPUT_AUDIO_BUFFER_COMPLETED = 'server.input_audio_buffer.completed',
  /**
   * en: Input audio buffer cleared
   * zh: 语音输入缓冲区已清除
   */
  INPUT_AUDIO_BUFFER_CLEARED = 'server.input_audio_buffer.cleared',
  /**
   * en: Conversation chat cancelled
   * zh: 对话被取消
   */
  CONVERSATION_CHAT_CANCELLED = 'server.conversation.chat.cancelled',
  /**
   * en: Conversation context cleared
   * zh: 对话上下文已清除
   */
  CONVERSATION_CLEARED = 'server.conversation.cleared',
  /**
   * en: Conversation audio transcript updated
   * zh: 用户语音识别实时字幕更新
   */
  CONVERSATION_AUDIO_TRANSCRIPT_UPDATE = 'server.conversation.audio_transcript.update',
  /**
   * en: Conversation audio transcript completed
   * zh: 用户语音识别完成
   */
  CONVERSATION_AUDIO_TRANSCRIPT_COMPLETED = 'server.conversation.audio_transcript.completed',
  /**
   * en: Conversation chat requires action
   * zh: 对话需要端插件响应
   */
  CONVERSATION_CHAT_REQUIRES_ACTION = 'server.conversation.chat.requires_action',
  /**
   * en: User speech detected - started
   * zh: 检测到用户开始说话
   */
  INPUT_AUDIO_BUFFER_SPEECH_STARTED = 'server.input_audio_buffer.speech_started',
  /**
   * en: User speech detected - stopped
   * zh: 检测到用户停止说话
   */
  INPUT_AUDIO_BUFFER_SPEECH_STOPPED = 'server.input_audio_buffer.speech_stopped',
  /**
   * en: Audio dump
   * zh: 音频 dump
   */
  DUMP_AUDIO = 'server.dump.audio',
}
