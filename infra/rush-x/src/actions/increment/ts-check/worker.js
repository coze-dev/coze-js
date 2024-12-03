const path = require('path');

require('sucrase/register/ts');

require(path.resolve(__dirname, './ts-check-worker.ts'));
