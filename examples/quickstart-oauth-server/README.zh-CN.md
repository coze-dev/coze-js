# Coze OAuth 服务端快速入门

【English】[README.md](./README.md)

这是一个示例 OAuth 服务端实现，演示了用于 Coze API 集成的不同 OAuth 认证流程。包括设备码认证、JWT 认证、PKCE 认证和 Web OAuth 认证的示例。

## 功能特性

- 设备码认证 (`/device-oauth`)
- JWT 认证 (`/jwt-oauth`)
- PKCE 认证 (`/pkce-oauth`)
- Web OAuth 流程 (`/web-oauth`)

## 前置要求

- Node.js (v16 或更高版本)
- Coze 开发者账号和 API 凭证

## 设置

1. 克隆仓库
2. 安装依赖：

```bash
npm run run-preinstall
npm install
```

3. 配置 OAuth 凭证：
   - 导航到 `src/` 下的各个 OAuth 流程目录
   - 使用您的凭证更新相应的 `coze_oauth_config.json`：
     - 设备 OAuth：`src/device-oauth/coze_oauth_config.json`
     - JWT OAuth：`src/jwt-oauth/coze_oauth_config.json`
     - PKCE OAuth：`src/pkce-oauth/coze_oauth_config.json`
     - Web OAuth：`src/web-oauth/coze_oauth_config.json`

## 运行服务器

每个 OAuth 流程运行在不同的端口上。您可以单独启动它们：
```bash
# 设备 OAuth 服务器（端口 3002）
npm run start-device

# JWT OAuth 服务器（端口 3001）
npm run start-jwt

# PKCE OAuth 服务器（端口 3003）
npm run start-pkce

# Web OAuth 服务器（端口 3004）
npm run start-web
```

## API 端点

### 设备 OAuth 流程（端口 3002）

- `GET /get_device_code` - 获取设备码
- `POST /get_device_token` - 使用设备码获取访问令牌
- `POST /refresh_device_token` - 刷新访问令牌

### JWT OAuth 流程（端口 3001）

- `POST /get_jwt_token` - 获取 JWT 访问令牌

### PKCE OAuth 流程（端口 3003）

- `GET /pkce_login` - 初始化 PKCE 登录流程
- `POST /get_pkce_token` - 使用授权码交换访问令牌
- `POST /refresh_pkce_token` - 刷新访问令牌

### Web OAuth 流程（端口 3004）

- `GET /web_login` - 初始化 Web OAuth 流程
- `POST /get_web_token` - 使用授权码交换访问令牌
- `POST /refresh_web_token` - 刷新访问令牌

## 配置文件

每个 OAuth 流程都需要其自己的配置文件。以下是您需要设置的内容：

### 设备 OAuth 配置
```json
{
  "client_id": "您的客户端ID",
  "coze_api_base": "https://api.coze.cn"
}
```

### JWT OAuth 配置
```json
{
  "client_id": "您的客户端ID",
  "public_key_id": "您的公钥ID",
  "private_key": "您的私钥",
  "coze_api_base": "https://api.coze.cn"
}
```

### PKCE OAuth 配置
```json
{
  "client_id": "您的客户端ID",
  "coze_api_base": "https://api.coze.cn"
}
```

### Web OAuth 配置
```json
{
  "client_id": "您的客户端ID",
  "client_secret": "您的客户端密钥",
  "coze_api_base": "https://api.coze.cn"
}
```

## 安全注意事项

- 切勿将实际的 OAuth 凭证提交到版本控制系统
- 确保客户端密钥和私钥的安全
- 在生产环境中使用环境变量存储敏感信息

## 许可证

ISC

## 支持

如需支持，请参考 Coze API 文档或联系 Coze 开发者支持团队。
