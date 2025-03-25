import morgan from 'morgan';
import express from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

import { logger } from '../utils/logger';
import { createServer } from '../mcp/server';

const createApp = () => {
  const app = express();
  app.use(morgan('tiny'));
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));
  logger.debug('Express application created successfully');
  return app;
};

/**
 * Start HTTP server
 * @param port Port number
 * @param componentsDir Components documentation directory
 */
export const serveAction = (port: number) => {
  const server = createServer();
  try {
    const app = createApp();

    let transport: SSEServerTransport;
    app.get('/sse', async (req, res) => {
      logger.debug(`Received SSE connection request: ${req.ip}`);
      transport = new SSEServerTransport('/messages', res);
      await server.connect(transport);
    });

    app.post('/messages', async (req, res) => {
      // Note: to support multiple simultaneous connections, these messages will
      // need to be routed to a specific matching transport. (This logic isn't
      // implemented here, for simplicity.)
      logger.debug(`Received message request: ${req.ip}`);
      await transport.handlePostMessage(req, res);
    });

    app.listen(port, () => {
      logger.success(`MCP server started, listening on port: ${port}`);
    });
  } catch (error) {
    logger.error(
      `Failed to start MCP server: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
};
