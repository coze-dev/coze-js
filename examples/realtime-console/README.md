# Coze Realtime Console

> A real-time voice/video bot interaction console
> Online Demo: [https://coze.cn/open-platform/realtime/playground](https://coze.cn/open-platform/realtime/playground)

![realtime-console](./assets/realtime-console.png)

## Project Structure

- `src/pages/main/`: Main console page and core interaction logic
- `src/pages/login/`: Login and authentication logic
- `src/utils/`: Utilities and local storage management


## Key Features

- **Real-time voice/video/text bot interaction** with interruption, reconnection, and event tracking
- **Multiple Bot/Voice/Workspace configuration**, supports voice cloning
- **Microphone and audio device management** with switching and debugging
- **Detailed event logs and debug console** for development and troubleshooting
- **Comprehensive settings panel** for API Base URL, Token, Bot ID, Voice ID, etc.
- **Optional video stream support** (controlled by environment variable)
- **Responsive for both mobile and desktop**

## Quick Start

### 1. Prerequisites

- Node.js 18 or above

### 2. Install Dependencies

```bash
npm run run-preinstall
npm install
```

### 3. Start the Project

- Video stream disabled by default:

  ```bash
  npm run start
  ```

- Enable video stream (optional):

  ```bash
  REACT_APP_ENABLE_VIDEO=true npm run start  # macOS/Linux
  set "REACT_APP_ENABLE_VIDEO=true" && npm run start  # Windows CMD
  $env:REACT_APP_ENABLE_VIDEO="true"; npm run start   # Windows PowerShell
  ```

- Visit [http://localhost:3000](http://localhost:3000)

### 4. Configuration

On first launch or by clicking the "Settings" button in the top right, fill in the following:

Supports switching between multiple Workspaces, Bots, and Voices. Voice cloning is supported (paid feature, see [documentation](https://www.coze.cn/open/docs/developer_guides/clone_voices?from=search)).

### 5. Common Operations

- **Connect/Disconnect**: One-click connect to bot, supports disconnect and reconnect
- **Microphone control**: Enable/disable local microphone
- **Bot interruption**: Interrupt bot response in real time
- **Event monitoring**: Upper panel for real-time event logs, lower panel for bot responses


## FAQ

- **Token expired/authentication failed**: The app will auto-redirect to login or prompt for reconfiguration
- **Unable to select Bot/Voice/Workspace**: Please ensure you have created the relevant resources on the Coze platform
- **Voice cloning failed**: Check audio format and token permissions

## Related Links

- [Coze Official Documentation](https://www.coze.cn/open/docs/)
- [GitHub Source Code](https://github.com/coze-dev/coze-js/tree/main/examples/realtime-console)


