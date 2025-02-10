# Coze Realtime API Examples

【中文版】[README.zh-CN.md](./README.zh-CN.md)

This repository contains two example projects demonstrating how to use Coze's Realtime API and OAuth authentication:

- realtime-quickstart-react: A React-based real-time voice conversation example
- quickstart-oauth-server: OAuth authentication server example

## realtime-quickstart-react

This is a real-time voice conversation application example built using React and Coze Realtime API.

### Features

- Real-time voice conversation
- Text message display support
- Microphone control
- Video functionality support (optional)
- Multiple authentication methods support (PAT, Device, JWT, PKCE, Web OAuth)

### Quick Start

1. Install dependencies:
```bash
rush update
```

2. Start the development server:
```bash
npm start
```

3. Visit `http://localhost:3000` in your browser

### Configuration

Main configuration items are in `src/App.tsx`:

- `botId`: Your Coze Bot ID
- Authentication method: Choose by commenting/uncommenting the corresponding `useToken` hook
```typescript
const { getToken } = useTokenWithPat();
// const { getToken } = useTokenWithDevice();
// const { getToken } = useTokenWithJWT();
// const { getToken } = useTokenWithPKCE();
// const { getToken } = useTokenWithWeb();
```

## quickstart-oauth-server

This is an OAuth authentication server example supporting various OAuth authentication flows.

### Supported Authentication Methods

- Device OAuth
- JWT OAuth
- PKCE OAuth
- Web OAuth

### Quick Start

1. Install dependencies:
```bash
rush update
```

2. Configure authentication information:
Modify the corresponding configuration file based on your authentication method:
- `src/device-oauth/coze_oauth_config.json`
- `src/jwt-oauth/coze_oauth_config.json`
- `src/pkce-oauth/coze_oauth_config.json`
- `src/web-oauth/coze_oauth_config.json`

3. Start the corresponding authentication server:

```bash
# Device OAuth server
npm run start-device    # port 3002

# JWT OAuth server
npm run start-jwt      # port 3001

# PKCE OAuth server
npm run start-pkce     # port 3003

# Web OAuth server
npm run start-web      # port 3004
```

### API Endpoints

#### Device OAuth
- `GET /get_device_code`: Get device code
- `POST /get_device_token`: Get device token
- `POST /refresh_device_token`: Refresh token

#### JWT OAuth
- `GET /get_jwt_token`: Get JWT token

#### PKCE OAuth
- `GET /pkce_login`: Get PKCE authentication URL
- `POST /get_pkce_token`: Get PKCE token
- `POST /refresh_pkce_token`: Refresh token

#### Web OAuth
- `GET /web_login`: Get Web authentication URL
- `POST /get_web_token`: Get Web token
- `POST /refresh_web_token`: Refresh token

## System Requirements

- Node.js 16+
- npm 7+
- Modern browser (with WebRTC support)

## License

ISC License

## Notes

- Ensure proper management of keys and authentication information in production environments
- Recommended to add necessary security measures in production environments
- Example code is for reference only and should be adjusted according to specific requirements
