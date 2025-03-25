# NPM MCP Server

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-0.0.1-brightgreen.svg)

## About The Project

NPM MCP Server is a Model Context Protocol server implementation for NPM. It provides a standardized way to integrate with AI tools and services through the Model Context Protocol, specifically designed for NPM package management contexts.

### Tech Stack

* Node.js
* TypeScript
* Express
* Model Context Protocol SDK
* Commander

## Getting Started

### Prerequisites

* Node.js (>=18.20.3 <19.0.0 || >=20.14.0 <21.0.0)

### Quick Start

You can directly use the NPM MCP Server without installing it locally via `npx`:

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

```md
{
  "mcpServers": {
    "npm-mcp": {
      "type": "http",
      "url": "http://localhost:3000/sse"
    }
  }
}
```

Cursor should now be able to communicate with the NPM MCP server to provide context-aware assistance for your NPM projects.

## Usage

The NPM MCP Server can be run in two different modes:

### HTTP Server Mode

Start the server to listen on HTTP requests using npx:

```sh
npx @coze-infra/npm-mcp-server@latest serve
```

You can specify a different port:

```sh
npx @coze-infra/npm-mcp-server@latest serve --port 4000
```

Access the server at: `http://localhost:<port>/sse`

### Terminal Mode

Run the server directly in the terminal:

```sh
npx @coze-infra/npm-mcp-server@latest start
```

### Development

If you're developing the MCP server yourself:

1. Clone the repository
   ```sh
   git clone https://github.com/coze-dev/rush-arch.git
   ```
2. Navigate to the project directory
   ```sh
   cd rush-arch/mcp/npm
   ```
3. Install dependencies using Rush (recommended for monorepo):
   ```sh
   rush update
   ```
4. Build the project:
   ```sh
   npm run build
   ```
5. Run tests:
   ```sh
   npm run test
   ```
6. Check test coverage:
   ```sh
   npm run test:cov
   ```

## Roadmap

- [x] Basic MCP server implementation
- [x] HTTP server mode
- [x] Terminal mode
- [ ] Enhanced documentation
- [ ] Additional NPM-specific MCP features

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Acknowledgments

* [Model Context Protocol](https://github.com/modelcontextprotocol)
