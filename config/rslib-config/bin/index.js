#!/usr/bin/env node
import nodeModule from 'node:module';

import { logger, prepareCli, runCli } from '@rslib/core';

// enable on-disk code caching of all modules loaded by Node.js
// requires Nodejs >= 22.8.0
const { enableCompileCache } = nodeModule;
if (enableCompileCache) {
  try {
    enableCompileCache();
  } catch {
    // ignore errors
  }
}
prepareCli();
try {
  runCli();
} catch (err) {
  logger.error(err);
}
