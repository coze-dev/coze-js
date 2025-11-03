# Coze.js 快应用示例 - 语音转写

这是一个使用Coze.js在快应用平台上实现实时语音转写功能的示例项目。该示例展示了如何使用WebSocket连接进行实时语音转写，包括开始、暂停、恢复和停止录音等功能。

## 功能特点

- 实时语音转写
- 录音状态管理（开始、暂停、恢复、停止）
- 错误处理和状态指示
- 简洁直观的用户界面

## 项目结构

```
├── src/
│   ├── app.ux                # 应用入口文件
│   ├── manifest.json         # 应用配置文件
│   ├── common/               # 公共资源
│   │   ├── styles/           # 样式文件
│   │   │   └── common.css    # 公共样式
│   │   ├── js/               # JavaScript文件
│   │   │   └── use-transcription.js  # 语音转写功能模块
│   │   ├── images/           # 图片资源
│   │   └── logo.png          # 应用图标
│   └── pages/                # 页面文件
│       ├── index/            # 首页
│       │   └── index.ux      # 首页组件
│       └── transcription/    # 语音转写页面
│           └── index.ux      # 语音转写组件
└── package.json              # 项目配置文件
```

## 使用方法

### 前提条件

- 安装Node.js和npm
- 安装快应用开发工具（hap-toolkit）

### 安装依赖

```bash
npm install
```

### 配置API令牌

在使用前，请复制`src/config.example.js`文件为`src/config.js`，并替换`YOUR_API_TOKEN_HERE`为您的实际API令牌：

```javascript
export default {
  // 语音转写API令牌
  transcriptionToken: 'YOUR_API_TOKEN_HERE',
  
  // 调试模式
  debug: true
};
```

### 运行项目

```bash
npm start
```

### 构建项目

```bash
npm run build
```

## 技术栈

- 快应用框架
- Coze.js WebSocket API
- 快应用录音API（@system.record）

## 注意事项

- 该示例需要麦克风权限才能正常工作
- WebSocket连接需要网络权限
- 在真机上测试时，请确保设备支持快应用框架

## 许可证

MIT