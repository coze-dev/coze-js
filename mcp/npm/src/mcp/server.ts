import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { logger } from '../utils/logger';
import { searchNpmPackages } from './search';
import { fetchNpmPackages } from './fetch';
import { type McpTool } from '../types';

const SERVER_NAME = 'npm-mcp';

const SERVER_DESCRIPTION = `NPM MCP Server - A tool for LLMs to interact with npm registry.

Capabilities:
1. Search for npm packages with advanced filtering by quality, popularity, and maintenance scores
2. Fetch detailed metadata for specific npm packages including version history, dependencies, and author information
3. Support for custom npm registries, including private registries and mirrors like npmmirror.com

Use cases:
- When you need to find suitable packages for a specific use case or development requirement
- When you need to compare similar packages based on quality metrics and popularity
- When you need to analyze package dependencies and compatibility before installation
- When you need to verify package authenticity and maintenance status
- When you need to retrieve comprehensive metadata from specific npm packages`;

export const createServer = () => {
  logger.debug(`Creating MCP server: ${SERVER_NAME}`);
  const server = new McpServer({
    name: SERVER_NAME,
    description: SERVER_DESCRIPTION,
    version: '1.0.0',
  });
  const tools: McpTool[] = [fetchNpmPackages, searchNpmPackages];

  tools.forEach(tool => {
    server.tool(tool.name, tool.description, tool.schema.shape, tool.execute);
  });

  return server;
};
