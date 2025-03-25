import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { logger } from '../utils/logger';
import { createServer } from '../mcp/server';

/**
 * Start MCP service in CLI mode
 * @param componentsDir Components documentation directory
 */
export const startAction = async (): Promise<void> => {
  try {
    const server = createServer();
    const transport = new StdioServerTransport();
    logger.debug('Connecting to StdioServerTransport');
    server.connect(transport);

    logger.success('MDC MCP service started (CLI mode)');

    logger.info('Use Ctrl+C to exit the service');
    // Keep the process running until manually exited by user
    return new Promise<void>(resolve => {
      process.on('SIGINT', () => {
        resolve();
        logger.info('Closing MCP service...');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(
      `Failed to start MCP service: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
};
