#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

import { Command } from 'commander';

import { logger } from './utils/logger';
import { startAction } from './actions/start';
import { serveAction } from './actions/serve';

const main = () => {
  // Create command line program
  const program = new Command();
  const programName = 'npm-mcp-server';

  // Set version and description
  program
    .name(programName)
    .description('MCP server for npm')
    .version(
      JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'),
      ).version,
    );

  // Add serve command - Start HTTP server
  program
    .command('serve')
    .description('Start the MCP HTTP server')
    .option('-p, --port <port>', 'Port to listen on', '3000')
    .action(async options => {
      const port = parseInt(options.port, 10);
      logger.info(`Starting HTTP service, port: ${port}`);
      await serveAction(port);
      logger.info(`You can access MCP service at http://localhost:${port}/sse`);
    });

  program
    .command('start')
    .description('Start the MCP server in terminal')
    .action(async () => {
      await startAction();
    });

  const SPLIT_LINE = `${'='.repeat(35)}`;
  // Parse command line arguments
  logger.success(
    `${SPLIT_LINE}\n🎉 Welcome to npm MCP CLI! 🎉\n${SPLIT_LINE}`,
    false,
  );
  program.parse(process.argv);

  // If no command is provided, show help information
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

// Execute main function
main();
