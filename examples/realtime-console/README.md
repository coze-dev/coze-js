# Quick Start

Preview: [https://coze.cn/open-platform/realtime/playground](https://coze.cn/open-platform/realtime/playground)

## Prerequisites
1. Ensure you have Node.js (v18+) installed
2. Git clone the coze-js repository

## Install Dependencies

```bash
git clone https://github.com/coze-dev/coze-js
cd  examples/realtime-console
npm run run-preinstall
npm install
```

## Configure
modify the `config.json` file with your own config
```bash
{
  "access_token": "pat_KWQlw2nvTlLTMISAzsRu7rV8DRXEJoKLRUgcLP6DL8xPlFFPZ**",
  "bot_id": "742817732159***",
  "voice_id": "742894224871***"
}

```


## Run the Demo
```bash
npm run start # disable video by default

# or set enable video to true
REACT_APP_ENABLE_VIDEO=true npm run start  # for macos/linux
# Windows users should use either:
set "REACT_APP_ENABLE_VIDEO=true" && npm run start  # for windows cmd
$env:REACT_APP_ENABLE_VIDEO="true"; npm run start   # for windows powershell
```

## Run with HTTPS

```bash
HTTPS=true npm run start
# or
set "HTTPS=true" && npm run start # for windows cmd
$env:HTTPS="true"; npm run start   # for windows powershell
```

![realtime-console](./assets/realtime-console.png)

## Demo Features
1. Visit [http://localhost:3000](http://localhost:3000)
2. Configure your credentials in the settings panel:
   - Access Token
   - Bot ID
   - Voice ID
   - API Base URL
3. Optional: Use browser extensions for custom headers during testing
4. Grant microphone permissions when prompted
5. Initialize connection via the "Connect" button

## Available Operations
- Microphone control (toggle on/off)
- Bot interaction interruption
- Connection management
- Audio debugging tools:
  - Playback device monitoring
  - Device status logging
  - Diagnostic features


