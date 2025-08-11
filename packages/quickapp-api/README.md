# @coze/quickapp-api

快应用（Quick App）版本的Coze API SDK，提供WebSocket工具用于语音转写、语音合成和聊天功能。

## 安装

```bash
npm install @coze/quickapp-api
```

## 功能

### WebSocket工具

@coze/quickapp-api提供了以下WebSocket工具：

- **WsTranscriptionClient**: 用于语音转写（语音转文字）
<!-- - **WsSpeechClient**: 用于语音合成（文字转语音）
- **WsChatClient**: 用于WebSocket聊天
- **PcmRecorder**: 用于PCM格式音频录制
- **PcmStreamPlayer**: 用于PCM格式音频流播放 -->

## 使用示例

### 语音转写

```javascript
import { WsTranscriptionClient, RecordingStatus } from '@coze/quickapp-api/ws-tools';

// 创建转写客户端
const transcriptionClient = new WsTranscriptionClient({
  token: 'YOUR_API_TOKEN',
  debug: true
});

// 监听转写结果更新
transcriptionClient.on('transcriptions.message.update', (message) => {
  console.log('转写中:', message.data.text);
});

// 监听转写完成
transcriptionClient.on('transcriptions.message.completed', (message) => {
  console.log('转写完成:', message.data.text);
});

// 开始录音和转写
async function startRecording() {
  try {
    await transcriptionClient.start();
    console.log('开始录音和转写');
  } catch (error) {
    console.error('启动失败:', error);
  }
}

// 停止录音和转写
function stopRecording() {
  transcriptionClient.stop();
  console.log('停止录音和转写');
}

// 暂停录音
function pauseRecording() {
  transcriptionClient.pause();
  console.log('暂停录音');
}

// 恢复录音
function resumeRecording() {
  transcriptionClient.resume();
  console.log('恢复录音');
}

// 清理资源
function destroy() {
  transcriptionClient.destroy();
  console.log('资源已清理');
}
```

<!-- ### 语音合成

```javascript
import { WsSpeechClient } from '@coze/quickapp-api/ws-tools';

// 创建语音合成客户端
const speechClient = new WsSpeechClient({
  token: 'YOUR_API_TOKEN',
  debug: true
});

// 监听语音合成事件
speechClient.on('speech.end', () => {
  console.log('语音播放完成');
});

// 文字转语音
async function speak(text) {
  try {
    await speechClient.speak({
      text: text,
      voice: 'zh-CN-XiaoxiaoNeural', // 可选，默认为小小
      rate: 1.0, // 可选，语速，范围0.5-2.0
      pitch: 1.0 // 可选，音调，范围0.5-2.0
    });
  } catch (error) {
    console.error('语音合成失败:', error);
  }
}

// 停止播放
function stopSpeaking() {
  speechClient.stop();
}

// 暂停播放
function pauseSpeaking() {
  speechClient.pause();
}

// 恢复播放
function resumeSpeaking() {
  speechClient.resume();
}

// 清理资源
async function destroy() {
  await speechClient.destroy();
  console.log('资源已清理');
}
```

### 聊天客户端

```javascript
import { WsChatClient } from '@coze/quickapp-api/ws-tools';

// 创建聊天客户端
const chatClient = new WsChatClient({
  token: 'YOUR_API_TOKEN',
  debug: true
});

// 连接WebSocket
async function connect() {
  try {
    await chatClient.connect();
    console.log('WebSocket已连接');
  } catch (error) {
    console.error('连接失败:', error);
  }
}

// 监听消息
chatClient.on('chat.message', (message) => {
  console.log('收到消息:', message);
});

// 发送消息
async function sendMessage(text) {
  try {
    await chatClient.send({
      type: 'chat.message',
      data: {
        text: text
      }
    });
  } catch (error) {
    console.error('发送失败:', error);
  }
}

// 关闭连接
function disconnect() {
  chatClient.close();
  console.log('WebSocket已关闭');
}

// 清理资源
function destroy() {
  chatClient.destroy();
  console.log('资源已清理');
}
``` -->

## 注意事项

- 使用前请确保您已获取有效的Coze API令牌
- 本SDK专为快应用环境设计，依赖快应用提供的系统能力
- 使用完毕后请调用相应的destroy方法释放资源

## 许可证

MIT
