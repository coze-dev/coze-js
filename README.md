# Monorepo of Coze Orz
[![codecov](https://codecov.io/gh/coze-dev/coze-js/graph/badge.svg?token=W5EBMZ0NUE)](https://codecov.io/gh/coze-dev/coze-js) ![ci](https://github.com/coze-dev/coze-js/actions/workflows/ci@main.yml/badge.svg)

English | [简体中文](./README.zh-CN.md)

## 📦 Packages

This monorepo contains the following packages:

| Package | Description | Version |
|---------|------------|---------|
| [@coze/api](./packages/coze-js) | Coze API SDK | [![npm](https://img.shields.io/npm/v/@coze/api.svg)](https://www.npmjs.com/package/@coze/api) |
| [@coze/realtime-api](./packages/realtime-api) | Realtime API SDK | [![npm](https://img.shields.io/npm/v/@coze/realtime-api.svg)](https://www.npmjs.com/package/@coze/realtime-api) |
| [@coze/taro-api](./packages/coze-taro) | Taro Mini Program Coze API SDK | [![npm](https://img.shields.io/npm/v/@coze/taro-api.svg)](https://www.npmjs.com/package/@coze/taro-api) |
| [@coze/uniapp-api](./packages/coze-uniapp) | UniApp Mini Program Coze API SDK | [![npm](https://img.shields.io/npm/v/@coze/uniapp-api.svg)](https://www.npmjs.com/package/@coze/uniapp-api) |


## 🎮 Examples

Find usage examples for each package in the [examples](./examples) directory:

- [coze-js-node](./examples/coze-js-node) - Node.js Demo for @coze/api
- [coze-js-web](./examples/coze-js-web) - React Web Demo for @coze/api, [Preview](https://coze-js-web-example.surge.sh/)
- [coze-js-taro](./examples/coze-js-taro) - Taro4 Mini Program Demo for @coze/taro-api
- [coze-js-taro3](./examples/coze-js-taro3) - Taro3 Mini Program Demo for @coze/taro-api
- [realtime-console](./examples/realtime-console) - Full Console Demo for @coze/realtime-api, [Preview](https://coze.cn/open-platform/realtime/playground)
- [realtime-call-up](./examples/realtime-call-up) - Sample Call Up Demo for @coze/realtime-api
- [realtime-quickstart-react](./examples/realtime-quickstart-react) - Quickstart React Demo for @coze/realtime-api
- [realtime-quickstart-vue](./examples/realtime-quickstart-vue) - Quickstart Vue Demo for @coze/realtime-api
- [quickstart-oauth-server](./examples/quickstart-oauth-server) - Quickstart OAuth Server Demo for Coze SDK
- [realtime-websocket](./examples/realtime-websocket) - Websocket realtime Demo for @coze/api/ws-tools
- [simult-extendsion](./examples/simult-extendsion) - Simult interpretation Extension Demo for @coze/api/ws-tools

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS/Hydrogen recommended)
- pnpm 9.12.0
- Rush 5.140.0

### Installation

1. **Install Node.js 18+**

``` bash
nvm install lts/hydrogen
nvm alias default lts/hydrogen # set default node version
nvm use lts/hydrogen
```

2. **Clone the repository**

``` bash
git clone git@github.com:coze-dev/coze-js.git
```

3. **Install required global dependencies**

``` bash
npm i -g pnpm@9.12.0 @microsoft/rush@5.140.0
```

4. **Install project dependencies**

``` bash
rush update
```

5. **Build the project**

``` bash
rush build
```

After that, you can start to develop projects inside this repository.

Enjoy it!

## 🔨 Development

Each package in this monorepo can be developed and published independently. To start developing:

1. Navigate to the package directory:

``` bash
cd packages/<package-name>
```

2. Start development:

``` bash
npm run start
```

## 📖 Documentation

- [Official Documentation](https://www.coze.com/docs/developer_guides/nodejs_overview)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [How to publish](./docs/publish.md)

## 📄 License

[MIT](./LICENSE)
