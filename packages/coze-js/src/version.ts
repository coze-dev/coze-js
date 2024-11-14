import { release } from 'os';

import pkg from '../package.json';
const { version } = pkg;

const getUserAgent = (): string => {
  const nodeVersion = process.version.slice(1); // Remove 'v' prefix
  const { platform } = process;

  let osName = platform.toLowerCase();
  let osVersion = process.version;

  if (platform === 'darwin') {
    osName = 'darwin';
    osVersion = release() || process.version;
  } else if (platform === 'win32') {
    osName = 'windows';
    osVersion = release() || process.version;
  } else if (platform === 'linux') {
    osName = 'linux';
    // For Linux, we'll use the Node version as fallback since detailed distro info
    // is not easily accessible in Node without additional dependencies
    osVersion = process.version;
  }

  return `coze-js/${version} node/${nodeVersion} ${osName}/${osVersion}`.toLowerCase();
};

export { getUserAgent };
