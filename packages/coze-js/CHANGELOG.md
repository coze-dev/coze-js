# @coze/api

## 1.3.0 - 2025-06-17

### New Features

- improve LocalLookback implementation
- Add unit test
- Add Users API with me() method, support chat with files/images
- improve authentication error handling for regional base URLs
- add room mode configuration option
- init project
- chat websocket support opus coder
- chat websocket support g711a&g711u coder
- Add G.711a and G.711u codec support to WavStreamPlayer
- Add prologue content support
- optimize local audio loopback and chat client config
- Add client_interrupt support
- add sentence-level audio streaming support
- Add query params
- simult interpretation
- add translation and audio playback controls
- add simult example
- add speech rate and opus config support
- Add coze uniapp api support
- Add Variables api
- Add voiceprint API
- Add onApiError callback option to ClientOptions and RequestOptions interfaces
- add voice print group support and move turn detection to event input
- Fix ci bug
- Add voiceprint Readme
- UI and websocket improvements
- Add Websocket WebSocket implementation for better UniApp compatibility
- Fix unit test error
- Add PcmRecorder & Transcription API
- Add WsChatClient  API
- fix ci bug
- Add screen sharing event support and downgrade RTC SDK
- typo issue for chat api in @coze/api
-  feat: Implement playback volume control

### Bug Fixes

- setup release config
- convert JavaScript files to TypeScript
- add test code
- cr bug
- test error
- rename LocalLookback to LocalLoopback and fix typos
- deviceId error
- eslint bug
- move
- CR bug
- Publish feat/voiceprint
- Fix Websoket  bug in Uniapp
- fix sample_rate error
- Publish feat/weex-realtime
- Fix microphone permission check in browsers without permissions API
- Fix type error
- security bug
- Publish fix/bug
- Upgrade vitest to version 2.1.9 for security bug
- workflow resumt bug
- implement audioDeltaList for sequential audio processing
- Publish fix/uniapp-api


## 1.2.0 - 2025-04-16

### New Features

- add local plugin example  for chat API
- Add websocket realtime demo
- add       echoCancellation support
- add chat realtime demo
- tmp
- add transcription SDK and update documentation
- UI/UX improvements to realtime-websocket example
- add default audio mute option and improve audio handling
- Add coze uniapp api support

### Bug Fixes

- replace MediaRecorder with Web Audio API for PCM recording
- eslint
- move new project
- rush build error
- add unit test
- add test code
- renmae
- unit test
- remove unpkg
- Publish feat/realtime-quickstart
- CR bug
- update ESM file extensions from .js to .mjs


## 1.1.1 - 2025-03-31

### New Features

- Add playback timing and state management
- update README.md
- add unit test
- add screen sharing support and video device persistence
- add WebSocket speech and transcription clients
- ws-tools rslib config
- Update readme
- feat: add async workflow execution and history tracking

### Bug Fixes

- Hard code test_app_id for Debug
- CR bug
- add unit test
- Websocket bug
- Add shortcut command support and update file object types
- Add unit test
- Remove type: module from package.json files
- file path error
- fix speech bug
- Publish fix/speech


## 1.0.21 - 2025-02-24

### New Features

- eslint处理
- 修改问题
- add proxy example for coze-api
- add accountId support for JWT token generation
- Add  plugin_id_list and workflow_id_list to UpdateBotReq

### Bug Fixes

- change document list endpoint from GET to POST


## 1.0.20 - 2025-02-12

### New Features

- Add Websocket Support
- add realtime-quickstart-react & quickstart-oauth-server demo
- add WebSocket chat examples and documentation
- add workflow ID support to realtime console

### Bug Fixes

- Fix  chat-x websocket  bug
- Add workspaceId to getWebAuthenticationUrl
- add unit test
- Add error handling for JWT token exchange
- Add Windows-specific environment variable commands for CMD and PowerShell


## 1.0.19 - 2025-02-07

### Bug Fixes

- downgrade node-fetch from ^3.3.2 to ^2.7.0
- downgrade node-fetch from ^3.3.2 to ^2.x


## 1.0.18 - 2025-02-06

### New Features

- add translation api
- Add description and space_id parameters to voices.clone api
- coze-js remove import .js
- @coze/api 源码引入到coze-js-web、coze-js-node
- rebase 0109
- cozePublishConfig
- rebase 0113
- add node-fetch for streaming support in older Node.js  versions

### Bug Fixes

- update error handling and remove help_doc field
- voice ASR bug
- fix version
- add test code


## 1.0.16 - 2025-01-09

### New Features

- Add browser user agent and template support
- add chat workflow support
- add image dataset support and improve dataset APIs

### Bug Fixes

- add Chinese translations for README files
- update to dist dep
- setup correct versions
- support nodejs 16 version when  using crypto
- bump version

