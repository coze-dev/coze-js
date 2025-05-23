enum EventNames {
  /**
   * en: All events
   * zh: 所有事件
   */
  ALL = 'realtime.event',
  /**
   * en: All client events
   * zh: 所有客户端事件
   */
  ALL_CLIENT = 'client.*',
  /**
   * en: All server events
   * zh: 所有服务端事件
   */
  ALL_SERVER = 'server.*',
  /**
   * en: Room info
   * zh: 房间信息
   */
  ROOM_INFO = 'client.room.info',
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
   * en: Client video on
   * zh: 客户端视频开启
   */
  VIDEO_ON = 'client.video.on',
  /**
   * en: Client video off
   * zh: 客户端视频关闭
   */
  VIDEO_OFF = 'client.video.off',
  /**
   * en: Client video event
   * zh: 客户端视频事件
   */
  PLAYER_EVENT = 'client.video.event',
  /**
   * en: Client error
   * zh: 客户端错误
   */
  ERROR = 'client.error',
  /**
   * en: Audio noise reduction enabled
   * zh: 抑制平稳噪声
   */
  SUPPRESS_STATIONARY_NOISE = 'client.suppress.stationary.noise',
  /**
   * en: Suppress non-stationary noise
   * zh: 抑制非平稳噪声
   */
  SUPPRESS_NON_STATIONARY_NOISE = 'client.suppress.non.stationary.noise',
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
   * en: Video input device changed
   * zh: 视频输入设备改变
   */
  VIDEO_INPUT_DEVICE_CHANGED = 'client.video.input.device.changed',
  /**
   * en: Network quality changed
   * zh: 网络质量改变
   */
  NETWORK_QUALITY = 'client.network.quality',
  /**
   * en: Bot joined
   * zh: Bot 加入
   */
  BOT_JOIN = 'server.bot.join',
  /**
   * en: Bot left
   * zh: Bot 离开
   */
  BOT_LEAVE = 'server.bot.leave',
  /**
   * en: Audio speech started
   * zh: 开始说话
   */
  AUDIO_AGENT_SPEECH_STARTED = 'server.audio.agent.speech_started',
  /**
   * en: Audio speech stopped
   * zh: 停止说话
   */
  AUDIO_AGENT_SPEECH_STOPPED = 'server.audio.agent.speech_stopped',
  /**
   * en: Server error
   * zh: 服务端错误
   */
  SERVER_ERROR = 'server.error',
  /**
   * en: User speech started
   * zh: 用户开始说话
   */
  AUDIO_USER_SPEECH_STARTED = 'server.audio.user.speech_started',
  /**
   * en: User speech stopped
   * zh: 用户停止说话
   */
  AUDIO_USER_SPEECH_STOPPED = 'server.audio.user.speech_stopped',
  /**
   * en: User successfully enters the room
   * zh: 用户成功进入房间后，会收到该事件
   */
  SESSION_CREATED = 'server.session.created',
  /**
   * en: Session updated
   * zh: 会话更新
   */
  SESSION_UPDATE = 'server.session.update',
}

export default EventNames;
