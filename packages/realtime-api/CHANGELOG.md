# @coze/realtime-api

## 1.3.0 - 2025-06-17

### New Features

- Support mobile device front/back camera selection with friendly labels
- add room mode configuration option
- Add ROOM_INFO event to expose room connection details
- Add prologue content support
- Add some event names
- Add screen sharing event support and downgrade RTC SDK

### Bug Fixes

- setup release config
- Publish feat/device
- add test code
- Fix share screen bug
- Upgrade vitest to version 2.1.9 for security bug
- Add TrackEnded event
- Added await for setVideoInputDevice to ensure proper async handling
- enhance video state management and error handling


## 1.2.0 - 2025-04-16

### New Features

- UI/UX improvements to realtime-websocket example
- add error handling for non-stationary noise suppression
- add event-names subpath export

### Bug Fixes

- add test code
- move EventNames enum to separate file
- Publish fix/module-error
- normalize file extensions in package config


## 1.1.1 - 2025-03-31

### New Features

- add mobile support and network error handling
- add getRoomInfo customization option to RealtimeClient
- add screen sharing support and video device persistence
- Add test code
- add unit test

### Bug Fixes

- Hard code test_app_id for Debug
- add unit test
- Remove type: module from package.json files


## 1.0.5 - 2025-02-12

### New Features

- add custom user ID and conversation ID support
- realtime-api 源码引入到 examples
- rebase 0109
- cozePublishConfig
- taro dev source
- feat: add getRtcEngine method to expose RTC engine instance
- add workflow ID support to realtime console

### Bug Fixes

- add test code
- Add Windows-specific environment variable commands for CMD and PowerShell


## 1.0.4 - 2025-01-09

### New Features

- add screen sharing support to realtime API

### Bug Fixes

- add Chinese translations for README files
- update to dist dep
- setup correct versions
- screen sharing bug
- Add check for video support before throwing device error

