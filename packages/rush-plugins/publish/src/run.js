#!/usr/bin/env node

process.env.SUCRASE_OPTIONS = '{"preserveDynamicImport":true}';
require('sucrase/register/ts');
const path = require('path');

require(path.resolve(__dirname, '../src/index.ts'));
