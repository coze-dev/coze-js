# Rush Architecture

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-0.0.1-brightgreen.svg)

## About The Project

Rush Architecture is a monorepo template for building and managing Model Context Protocol (MCP) servers and related packages. This project uses Microsoft Rush for monorepo management, providing a structured approach to developing, testing, and deploying MCP servers.

### Tech Stack

* Rush - Monorepo management
* Node.js - JavaScript runtime
* TypeScript - Programming language
* Rollup - Module bundler
* Vitest - Testing framework

## Getting Started

### Prerequisites

* Node.js (>=18.20.3 <19.0.0 || >=20.14.0 <21.0.0)

### Using NPM MCP Server

You can directly use the NPM MCP Server without cloning this repository:

```sh
npx @coze-infra/npm-mcp-server@latest serve
```

This will start the MCP server on port 3000 by default. You can access it at `http://localhost:3000/sse`.

### Configuring in Cursor

To configure this MCP server in Cursor:

1. Open Cursor IDE
2. Go to Settings (`Ctrl+,` or `Cmd+,`)
3. Search for "MCP" in the settings search bar
4. Under "Model Context Protocol", add a new MCP server with the following URL:
   ```
   http://localhost:3000/sse
   ```
5. Save your settings and restart Cursor

### Development Setup

If you want to contribute or develop with this monorepo:

1. Install Rush globally (if not already installed)
   ```sh
   npm install -g @microsoft/rush
   ```
2. Clone the repository
   ```sh
   git clone https://github.com/coze-dev/rush-arch.git
   ```
3. Update and install dependencies
   ```sh
   rush update
   ```
4. Build all projects
   ```sh
   rush build
   ```

## Usage

### Running the NPM MCP Server

The repository includes an MCP server for npm. You can run it in two modes:

#### HTTP Server Mode
Using npx:
```sh
npx @coze-infra/npm-mcp-server@latest serve
# Access the server at http://localhost:3000/sse
```

Or if developing locally:
```sh
cd mcp/npm
npm run serve
```

#### Terminal Mode
Using npx:
```sh
npx @coze-infra/npm-mcp-server@latest start
```

Or if developing locally:
```sh
cd mcp/npm
npm run start
```

### Testing the Project

Run tests for all projects:
```sh
rush test
```

For test coverage:
```sh
rush test:cov
```

## Roadmap

- [x] Basic monorepo setup with Rush
- [x] NPM MCP server implementation
- [ ] Additional MCP server implementations
- [ ] Comprehensive documentation
- [ ] CI/CD integration

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Acknowledgments

* [Microsoft Rush](https://rushjs.io/)
* [Model Context Protocol](https://github.com/modelcontextprotocol)
