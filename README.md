# Monorepo of Coze Orz
[![codecov](https://codecov.io/gh/coze-dev/coze-js/graph/badge.svg?token=W5EBMZ0NUE)](https://codecov.io/gh/coze-dev/coze-js) ![ci](https://github.com/coze-dev/coze-js/actions/workflows/ci@main.yml/badge.svg)

## 📦 Packages

This monorepo contains the following packages:

| Package | Description | Version |
|---------|------------|---------|
| [@coze/api](./packages/coze-js) | Coze API | [![npm](https://img.shields.io/npm/v/@coze/api.svg)](https://www.npmjs.com/package/@coze/api) |
| [@coze/realtime-api](./packages/realtime-api) | Realtime API | [![npm](https://img.shields.io/npm/v/@coze/realtime-api.svg)](https://www.npmjs.com/package/@coze/realtime-api) |


## 🎮 Examples

Find usage examples for each package in the [examples](./examples) directory:

- [coze-js-node](./examples/coze-js-node) - Node.js Demo for @coze/coze-js
- [coze-js-web](./examples/coze-js-web) - React Web Demo for @coze/coze-js
- [realtime-console](./examples/realtime-console) - Full Console Demo for @coze/realtime-api
- [realtime-call-up](./examples/realtime-call-up) - Sample Call Up Demo for @coze/realtime-api


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

- [Contributing Guidelines](./CONTRIBUTING.md)
- [How to publish](./docs/publish.md)

## 📄 License

[MIT](./LICENSE)
