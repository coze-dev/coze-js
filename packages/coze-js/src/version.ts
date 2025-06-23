import os from 'os';

import pkg from '../package.json';
const { version } = pkg;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const uni: any;

const getEnv = () => {
  const nodeVersion = process.version.slice(1); // Remove 'v' prefix
  const { platform } = process;

  let osName = platform.toLowerCase();
  let osVersion = os.release();

  if (platform === 'darwin') {
    osName = 'macos';
    // Try to parse the macOS version
    try {
      const darwinVersion = os.release().split('.');
      if (darwinVersion.length >= 2) {
        const majorVersion = parseInt(darwinVersion[0], 10);
        if (!isNaN(majorVersion) && majorVersion >= 9) {
          const macVersion = majorVersion - 9;
          osVersion = `10.${macVersion}.${darwinVersion[1]}`;
        }
      }
    } catch (error) {
      // Keep the default os.release() value if parsing fails
    }
  } else if (platform === 'win32') {
    osName = 'windows';
    osVersion = os.release();
  } else if (platform === 'linux') {
    osName = 'linux';
    osVersion = os.release();
  }

  return { osName, osVersion, nodeVersion };
};

const getUserAgent = (): string => {
  const { nodeVersion, osName, osVersion } = getEnv();

  return `coze-js/${version} node/${nodeVersion} ${osName}/${osVersion}`.toLowerCase();
};

const getNodeClientUserAgent = (): string => {
  const { osVersion, nodeVersion, osName } = getEnv();

  const ua = {
    version,
    lang: 'node',
    lang_version: nodeVersion,
    os_name: osName,
    os_version: osVersion,
  };

  return JSON.stringify(ua);
};

const getBrowserClientUserAgent = (): string => {
  const browserInfo = {
    name: 'unknown',
    version: 'unknown',
  };
  const osInfo = {
    name: 'unknown',
    version: 'unknown',
  };

  const { userAgent } = navigator;

  if (userAgent) {
    // 检测操作系统及版本
    if (userAgent.indexOf('Windows') > -1) {
      osInfo.name = 'windows';
      const windowsVersion =
        userAgent.match(/Windows NT ([0-9.]+)/)?.[1] || 'unknown';
      osInfo.version = windowsVersion;
    } else if (userAgent.indexOf('Mac OS X') > -1) {
      osInfo.name = 'macos';
      // 将 10_15_7 格式转换为 10.15.7
      osInfo.version = (
        userAgent.match(/Mac OS X ([0-9_]+)/)?.[1] || 'unknown'
      ).replace(/_/g, '.');
    } else if (userAgent.indexOf('Linux') > -1) {
      osInfo.name = 'linux';
      osInfo.version = userAgent.match(/Linux ([0-9.]+)/)?.[1] || 'unknown';
    }

    // 检测浏览器及版本
    if (userAgent.indexOf('Chrome') > -1) {
      browserInfo.name = 'chrome';
      browserInfo.version =
        userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'unknown';
    } else if (userAgent.indexOf('Firefox') > -1) {
      browserInfo.name = 'firefox';
      browserInfo.version =
        userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'unknown';
    } else if (userAgent.indexOf('Safari') > -1) {
      browserInfo.name = 'safari';
      browserInfo.version =
        userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'unknown';
    }
  }

  const ua = {
    version,
    browser: browserInfo.name,
    browser_version: browserInfo.version,
    os_name: osInfo.name,
    os_version: osInfo.version,
  };

  return JSON.stringify(ua);
};

// Get UniApp client user agent
const getUniAppClientUserAgent = (): string => {
  // Get system info
  if (!uni?.getSystemInfoSync) {
    return JSON.stringify({});
  }
  const systemInfo = uni.getSystemInfoSync();

  const platformInfo = {
    name: 'unknown',
    version: 'unknown',
  };

  const osInfo = {
    name: 'unknown',
    version: 'unknown',
  };

  // Handle operating system info
  if (systemInfo.platform === 'android') {
    osInfo.name = 'android';
    osInfo.version = systemInfo.system || 'unknown';
  } else if (systemInfo.platform === 'ios') {
    osInfo.name = 'ios';
    osInfo.version = systemInfo.system || 'unknown';
  } else if (systemInfo.platform === 'windows') {
    osInfo.name = 'windows';
    osInfo.version = systemInfo.system || 'unknown';
  } else if (systemInfo.platform === 'mac') {
    osInfo.name = 'macos';
    osInfo.version = systemInfo.system || 'unknown';
  } else {
    // Other platforms use platform name directly
    osInfo.name = systemInfo.platform;
    osInfo.version = systemInfo.system || 'unknown';
  }

  // Handle app/platform info
  if (systemInfo.AppPlatform) {
    // App environment
    platformInfo.name = systemInfo.AppPlatform.toLowerCase();
    platformInfo.version = systemInfo.appVersion || 'unknown';
  } else if (systemInfo.uniPlatform) {
    // UniApp recognized platform
    platformInfo.name = systemInfo.uniPlatform;
    platformInfo.version = systemInfo.SDKVersion || 'unknown';
  } else {
    // Try to determine platform type from environment
    const { appName, appVersion } = systemInfo;
    if (appName) {
      platformInfo.name = appName.toLowerCase();
      platformInfo.version = appVersion || 'unknown';
    }
  }

  const ua = {
    version,
    framework: 'uniapp',
    platform: platformInfo.name,
    platform_version: platformInfo.version,
    os_name: osInfo.name,
    os_version: osInfo.version,
    screen_width: systemInfo.screenWidth,
    screen_height: systemInfo.screenHeight,
    device_model: systemInfo.model,
    device_brand: systemInfo.brand,
  };

  return JSON.stringify(ua);
};

export {
  getUserAgent,
  getNodeClientUserAgent,
  getBrowserClientUserAgent,
  getUniAppClientUserAgent,
};
