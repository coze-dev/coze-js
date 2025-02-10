# Coze Realtime API Examples

【English】[README.md](./README.md)

这个仓库包含了两个示例项目,展示了如何使用Coze的实时API和OAuth认证:

- realtime-quickstart-react: 基于React的实时语音对话示例
- quickstart-oauth-server: OAuth认证服务器示例

## realtime-quickstart-react

这是一个使用React和Coze Realtime API构建的实时语音对话应用示例。

### 功能特性

- 实时语音对话
- 支持文本消息显示
- 麦克风控制
- 支持视频功能(可选)
- 多种认证方式支持(PAT、Device、JWT、PKCE、Web OAuth)

### 快速开始

1. 安装依赖:
```bash
rush update
```

2. 启动开发服务器:
```bash
npm start
```

3. 在浏览器中访问 `http://localhost:3000`

### 配置说明

主要配置项在 `src/App.tsx` 中:

- `botId`: 你的Coze Bot ID
- 认证方式: 通过注释/取消注释相应的 `useToken` hook来选择认证方式
```typescript
const { getToken } = useTokenWithPat();
// const { getToken } = useTokenWithDevice();
// const { getToken } = useTokenWithJWT();
// const { getToken } = useTokenWithPKCE();
// const { getToken } = useTokenWithWeb();
```

## quickstart-oauth-server

这是一个OAuth认证服务器示例,支持多种OAuth认证流程。

### 支持的认证方式

- Device OAuth
- JWT OAuth
- PKCE OAuth
- Web OAuth

### 快速开始

1. 安装依赖:
```bash
rush update
```

2. 配置认证信息:
根据你使用的认证方式,修改对应的配置文件:
- `src/device-oauth/coze_oauth_config.json`
- `src/jwt-oauth/coze_oauth_config.json`
- `src/pkce-oauth/coze_oauth_config.json`
- `src/web-oauth/coze_oauth_config.json`

3. 启动对应的认证服务器:

```bash
# Device OAuth服务器
npm run start-device    # 端口3002

# JWT OAuth服务器
npm run start-jwt      # 端口3001

# PKCE OAuth服务器
npm run start-pkce     # 端口3003

# Web OAuth服务器
npm run start-web      # 端口3004
```

### API接口说明

#### Device OAuth
- `GET /get_device_code`: 获取设备码
- `POST /get_device_token`: 获取设备token
- `POST /refresh_device_token`: 刷新token

#### JWT OAuth
- `GET /get_jwt_token`: 获取JWT token

#### PKCE OAuth
- `GET /pkce_login`: 获取PKCE认证URL
- `POST /get_pkce_token`: 获取PKCE token
- `POST /refresh_pkce_token`: 刷新token

#### Web OAuth
- `GET /web_login`: 获取Web认证URL
- `POST /get_web_token`: 获取Web token
- `POST /refresh_web_token`: 刷新token

## 系统要求

- Node.js 16+
- npm 7+
- 现代浏览器(支持WebRTC)

## 许可证

ISC License

## 注意事项

- 请确保在生产环境中妥善保管各种密钥和认证信息
- 建议在正式环境中增加必要的安全措施
- 示例代码仅供参考,实际使用时需要根据具体需求进行调整
