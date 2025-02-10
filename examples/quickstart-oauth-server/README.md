# Coze OAuth Server Quickstart

【中文版】[README.zh-CN.md](./README.zh-CN.md)

This is a sample OAuth server implementation demonstrating different OAuth authentication flows for Coze API integration. It includes examples for Device Code Flow, JWT Authentication, PKCE Flow, and Web OAuth Flow.

## Features

- Device Code Flow (`/device-oauth`)
- JWT Authentication (`/jwt-oauth`)
- PKCE Flow (`/pkce-oauth`)
- Web OAuth Flow (`/web-oauth`)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Coze Developer Account and API credentials

## Setup

1. Clone the repository
2. Install dependencies:

```bash
rush update
```

3. Configure OAuth credentials:
   - Navigate to each OAuth flow directory under `src/`
   - Update the corresponding `coze_oauth_config.json` with your credentials:
     - Device OAuth: `src/device-oauth/coze_oauth_config.json`
     - JWT OAuth: `src/jwt-oauth/coze_oauth_config.json`
     - PKCE OAuth: `src/pkce-oauth/coze_oauth_config.json`
     - Web OAuth: `src/web-oauth/coze_oauth_config.json`

## Running the Servers

Each OAuth flow runs on a different port. You can start them individually:
```bash
# Device OAuth Server (Port 3002)
npm run start-device

# JWT OAuth Server (Port 3001)
npm run start-jwt

# PKCE OAuth Server (Port 3003)
npm run start-pkce

# Web OAuth Server (Port 3004)
npm run start-web
```

## API Endpoints

### Device OAuth Flow (Port 3002)

- `GET /get_device_code` - Get device code
- `POST /get_device_token` - Get access token using device code
- `POST /refresh_device_token` - Refresh access token

### JWT OAuth Flow (Port 3001)

- `POST /get_jwt_token` - Get JWT access token

### PKCE OAuth Flow (Port 3003)

- `GET /pkce_login` - Initiate PKCE login flow
- `POST /get_pkce_token` - Exchange authorization code for access token
- `POST /refresh_pkce_token` - Refresh access token

### Web OAuth Flow (Port 3004)

- `GET /web_login` - Initiate web OAuth flow
- `POST /get_web_token` - Exchange authorization code for access token
- `POST /refresh_web_token` - Refresh access token

## Configuration Files

Each OAuth flow requires its own configuration file. Here's what you need to set up:

### Device OAuth Config
```json
{
  "client_id": "YOUR_CLIENT_ID",
  "coze_api_base": "https://api.coze.cn"
}
```

### JWT OAuth Config
```json
{
  "client_id": "YOUR_CLIENT_ID",
  "public_key_id": "YOUR_PUBLIC_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "coze_api_base": "https://api.coze.cn"
}
```

### PKCE OAuth Config
```json
{
  "client_id": "YOUR_CLIENT_ID",
  "coze_api_base": "https://api.coze.cn"
}
```

### Web OAuth Config
```json
{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "coze_api_base": "https://api.coze.cn"
}
```

## Security Notes

- Never commit your actual OAuth credentials to version control
- Keep your client secrets and private keys secure
- Use environment variables for sensitive information in production

## License

ISC

## Support

For support, please refer to the Coze API documentation or contact the Coze developer support team.
