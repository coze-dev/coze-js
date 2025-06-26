# 扣子同声传译 (Coze Simultaneous Interpretation) 使用文档

## 功能概述

扣子同声传译是一个基于 WebRTC 技术的实时音频翻译服务，主要包含两个端：

1. **发布端（Publishing Side）**：配置和发起翻译任务的一方，通过 `RealtimeClient` 类实现
2. **订阅端（Subscribing Side）**：收听原始或翻译后的音频流的一方，通过 `WebLiveClient` 类实现

该服务支持实时语音翻译，可以将一种语言实时翻译成另一种语言，适用于多语言会议、跨语言直播等场景。

## 安装

```bash
npm install @coze/realtime-api
```

## 一、发布端使用指南 (Publishing Side)

发布端负责配置翻译参数和发起直播。使用 `RealtimeClient` 类来设置和启动翻译服务。

### 1.1 导入模块

```typescript
import { RealtimeClient, EventNames } from '@coze/realtime-api';
import { RoomMode } from '@coze/api';
```

### 1.2 初始化客户端

```typescript
// 创建客户端实例，启用翻译模式
const client = new RealtimeClient({
  accessToken: 'your_access_token', // 访问令牌
  botId: 'your_bot_id', // 智能体ID
  connectorId: '1024', // 渠道ID
  // 关键配置：设置房间模式为 translate
  roomMode: 'translate' as RoomMode,
  // 翻译配置：指定源语言和目标语言
  translateConfig: {
    from: 'zh', // 源语言，例如：中文
    to: 'en', // 目标语言，例如：英文
  },
  // 其他可选配置
  debug: true,
  baseURL: 'https://api.coze.cn',
  suppressStationaryNoise: true,
  suppressNonStationaryNoise: true,
});
```

### 1.3 绑定事件监听器，获取 liveId

```typescript
// 监听 LIVE_CREATED 事件以获取 liveId
let liveId = '';
client.on(EventNames.LIVE_CREATED, (_: string, event: any) => {
  if (event?.data?.live_id) {
    liveId = event.data.live_id;
    console.log('生成了直播ID:', liveId);

    // 生成分享链接供订阅端使用
    const shareUrl = `https://your-domain.com/subscribe?liveId=${liveId}`;

    // 可以生成二维码或其他分享方式
    // generateQRCode(shareUrl); // 调用生成二维码的函数
  }
});
```

### 1.4 连接服务并开始直播

```typescript
// 连接服务
try {
  await client.connect();
  console.log('连接成功，可以开始说话');

  // 这里可以启动UI上的“开始说话”开关
} catch (error) {
  console.error('连接失败:', error);
}
```

### 1.5 结束直播

```typescript
// 断开连接，结束翻译会话
try {
  await client.disconnect();
  console.log('直播已结束');
} catch (error) {
  console.error('断开连接失败:', error);
}
```

## 二、订阅端使用指南 (Subscribing Side)

订阅端负责接收和播放音频流。使用 `WebLiveClient` 类来订阅和管理音频流。

### 2.1 导入模块

```typescript
import { WebLiveClient, ResourceStatus } from '@coze/realtime-api/live';
```

### 2.2 初始化客户端

```typescript
// liveId 是从发布端获取的直播会话的唯一标识符
const client = new WebLiveClient(liveId);
```

### 2.3 监听状态变化

```typescript
client.onStatusChange((status: ResourceStatus) => {
  console.log('RTC 状态变化：', status);

  // 可以根据不同状态更新UI
  switch (status) {
    case ResourceStatus.CONNECTING:
      // 处理连接中状态
      break;
    case ResourceStatus.CONNECTED:
      // 处理已连接状态
      break;
    case ResourceStatus.FAILED:
      // 处理连接失败状态
      break;
  }
});
```

### 2.4 获取可用的音频流

```typescript
// 从服务器获取直播数据，包含可订阅的音频流
try {
  const data = await client.getLiveData();

  // 获取 appId 和可用的音频流列表
  const appId = data.app_id;
  const streams = data.stream_infos; // 包含原始和翻译后的音频流

  console.log('原始及翻译音频流：', streams);

} catch (error) {
  console.error('获取直播数据失败:', error);
}
```

### 2.5 订阅音频流

```typescript
// 订阅特定的音频流
const streamId = streams[0].stream_id; // 选择要订阅的流ID，可以是原始流或翻译流

// 生成唯一的客户端ID
const clientId = `client-${Date.now()}`;

try {
  // 订阅音频流
  await client.subscribe(appId, streamId, clientId);
  console.log('订阅成功，开始播放音频');
} catch (error) {
  console.error('订阅失败:', error);
}
```

### 2.6 控制静音

```typescript
// 设置静音
client.setMuted(true);
console.log('已静音');

// 取消静音
client.setMuted(false);
console.log('已取消静音');
```

### 2.7 取消订阅

```typescript
// 取消订阅当前音频流
try {
  await client.unsubscribe();
  console.log('已取消订阅');
} catch (error) {
  console.error('取消订阅失败:', error);
}
```

### 2.8 关闭客户端

```typescript
// 关闭客户端并释放资源
client.close();
console.log('客户端已关闭');
```
## 资源状态

`ResourceStatus` 枚举定义了音频资源的不同状态：

- `ResourceStatus.IDLE`: 初始状态
- `ResourceStatus.CONNECTING`: 连接中
- `ResourceStatus.CONNECTED`: 已连接
- `ResourceStatus.FAILED`: 连接失败
- `ResourceStatus.CLOSING`: 关闭中
- `ResourceStatus.CLOSED`: 已关闭

## 完整示例

以下是一个完整的 React 组件示例，展示如何实现同声传译功能：

```typescript
import { useState, useEffect, useRef } from 'react';
import { WebLiveClient, ResourceStatus } from '@coze/realtime-api/live';
import { RetrieveLiveData } from '@coze/api';

function SimultaneousInterpretation() {
  // 状态管理
  const [isMuted, setIsMuted] = useState(false);
  const [currentStreamId, setCurrentStreamId] = useState('');
  const [status, setStatus] = useState<ResourceStatus>(ResourceStatus.IDLE);
  const clientRef = useRef<WebLiveClient | null>(null);
  const [liveData, setLiveData] = useState<RetrieveLiveData | null>(null);

  // 初始化客户端
  useEffect(() => {
    async function initialize() {
      // 假设 liveId 从 URL 参数或其他地方获取
      const liveId = 'your_live_id';

      // 创建客户端实例
      const client = new WebLiveClient(liveId);

      // 监听状态变化
      client.onStatusChange(setStatus);

      // 获取直播信息
      const data = await client.getLiveData();
      setLiveData(data);

      // 保存客户端引用
      clientRef.current = client;
    }

    initialize();

    // 组件卸载时清理资源
    return () => {
      if (clientRef.current) {
        clientRef.current.offStatusChange(setStatus);
        clientRef.current.close();
        clientRef.current = null;
      }
    };
  }, []);

  // 订阅音频流
  const handleSubscribe = async (streamId: string) => {
    if (currentStreamId === streamId) return;

    // 如果当前有订阅，先取消
    if (currentStreamId) {
      await clientRef.current?.unsubscribe();
    }

    // 设置当前流 ID
    setCurrentStreamId(streamId);

    // 生成随机客户端 ID
    const clientId = `client_${Math.random().toString(36).substring(2, 9)}`;

    // 订阅新的音频流
    await clientRef.current?.subscribe(
      liveData?.app_id ?? '',
      streamId,
      clientId,
    );
  };

  // 切换静音状态
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    clientRef.current?.setMuted(!isMuted);
  };

  // 渲染 UI
  return (
    <div>
      <h1>同声传译</h1>

      {/* 音频流列表 */}
      {liveData?.stream_infos.map(stream => (
        <div key={stream.stream_id}>
          <button
            onClick={() => handleSubscribe(stream.stream_id)}
            style={{
              background:
                currentStreamId === stream.stream_id ? 'blue' : 'gray',
            }}
          >
            {stream.name} {/* 显示语言名称，如"中文"、"English" */}
          </button>
        </div>
      ))}

      {/* 静音控制 */}
      <button onClick={handleToggleMute}>
        {isMuted ? '取消静音' : '静音'}
      </button>

      {/* 显示当前状态 */}
      <div>当前状态: {status}</div>
    </div>
  );
}

```


## API 参考

### 发布端 - RealtimeClient

| 配置选项 | 描述 | 类型/示例 |
|---------|------|----------|
| `roomMode` | 房间模式，设置为 `translate` 启用翻译功能 | `'translate'` |
| `translateConfig` | 翻译配置对象 | `{ from: 'zh', to: 'en' }` |

### 订阅端 - WebLiveClient

| 方法 | 描述 | 参数 |
|------|------|------|
| `constructor(liveId)` | 初始化客户端 | `liveId`: 直播会话 ID |
| `getStatus()` | 获取当前连接状态 | 无 |
| `onStatusChange(callback)` | 添加状态变化监听器 | `callback`: 状态变化回调函数 |
| `offStatusChange(callback)` | 移除状态变化监听器 | `callback`: 要移除的回调函数 |
| `subscribe(appId, streamId, clientId)` | 订阅音频资源 | `appId`: 应用 ID<br>`streamId`: 流 ID<br>`clientId`: 可选，客户端 ID |
| `unsubscribe()` | 销毁订阅资源 | 无 |
| `setMuted(muted)` | 设置是否静音 | `muted`: 布尔值，是否静音 |
| `close()` | 关闭并清理资源 | 无 |
| `getLiveData()` | 获取直播信息 | 无 |

### ResourceStatus

| 状态 | 描述 |
|------|------|
| `IDLE` | 初始状态 |
| `CONNECTING` | 连接中 |
| `CONNECTED` | 已连接 |
| `FAILED` | 连接失败 |
| `CLOSING` | 关闭中 |
| `CLOSED` | 已关闭 |

