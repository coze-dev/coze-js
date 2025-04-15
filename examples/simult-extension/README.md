# Simultaneous Interpretation Browser Extension

A browser extension for simultaneous interpretation built with React, TypeScript, and Vite.

## Features

- Basic popup UI with Ant Design
- Content script that injects a notification
- Background script for handling extension state

## Development

### Prerequisites

- Node.js and npm/yarn
- A modern browser that supports Chrome extensions (Chrome, Edge, Brave, etc.)

### Setup

```bash
# Navigate to the extension directory
cd examples/realtime-websocket/simult-extension

# Install dependencies
npm install

# Start development server
npm run dev
```

### Loading the extension in Chrome

1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `dist` directory from the build output
5. The extension should now be installed and visible in your browser's toolbar

## Project Structure

- `src/popup`: Extension popup UI
- `src/background`: Background script
- `src/content`: Content script that runs on web pages
- `src/components`: Shared React components
- `src/utils`: Utility functions and helpers

## License

MIT
