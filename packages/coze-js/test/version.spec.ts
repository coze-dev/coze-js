/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import os from 'os';

import {
  getUserAgent,
  getNodeClientUserAgent,
  getBrowserClientUserAgent,
  getUniAppClientUserAgent,
} from '../src/version';

// Mock process before all tests
const originalProcess = process;

vi.mock('os', () => ({
  default: {
    release: vi.fn(),
  },
}));

vi.mock('../package.json', () => ({
  default: {
    version: '1.0.0',
  },
}));

// Mock uni global object
const mockUni = {
  getSystemInfoSync: vi.fn(),
};

// @ts-expect-error: Mock uni global
global.uni = mockUni;

// Use actual implementation for version.ts but mock specific functions
vi.mock('../src/version', async () => {
  const mod =
    await vi.importActual<typeof import('../src/version')>('../src/version');
  return {
    getUserAgent: vi.fn().mockImplementation(mod.getUserAgent),
    getNodeClientUserAgent: vi
      .fn()
      .mockImplementation(mod.getNodeClientUserAgent),
    getBrowserClientUserAgent: vi
      .fn()
      .mockImplementation(mod.getBrowserClientUserAgent),
    getUniAppClientUserAgent: vi
      .fn()
      .mockImplementation(mod.getUniAppClientUserAgent),
  };
});

describe('Version utilities', () => {
  beforeEach(() => {
    // Create a clean mock of process for each test
    const mockProcess = {
      version: 'v16.14.0',
      platform: 'linux',
      env: {},
    };

    // @ts-expect-error: Partial process mock
    global.process = Object.assign({}, originalProcess, mockProcess);
    vi.mocked(os.release).mockReturnValue('5.4.0-1234-generic');
  });

  afterEach(() => {
    // Restore original process after each test
    // @ts-expect-error: Restore process
    global.process = originalProcess;
    vi.clearAllMocks();
  });

  describe('getUserAgent', () => {
    it('should return correct user agent string for Linux', () => {
      const userAgent = getUserAgent();
      expect(userAgent).toBe(
        'coze-js/1.0.0 node/16.14.0 linux/5.4.0-1234-generic',
      );
    });

    it('should return correct user agent string for macOS', () => {
      // @ts-expect-error
      process.platform = 'darwin';
      vi.mocked(os.release).mockReturnValue('20.0.0');

      const userAgent = getUserAgent();
      expect(userAgent).toBe('coze-js/1.0.0 node/16.14.0 macos/10.11.0');
    });

    it('should return correct user agent string for Windows', () => {
      // @ts-expect-error
      process.platform = 'win32';
      vi.mocked(os.release).mockReturnValue('10.0.19042');

      const userAgent = getUserAgent();
      expect(userAgent).toBe('coze-js/1.0.0 node/16.14.0 windows/10.0.19042');
    });
  });

  describe('getNodeClientUserAgent', () => {
    it('should return correct JSON string for Linux', () => {
      const userAgent = getNodeClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        lang: 'node',
        lang_version: '16.14.0',
        os_name: 'linux',
        os_version: '5.4.0-1234-generic',
      });
    });
  });

  describe('getBrowserClientUserAgent', () => {
    const mockNavigator = {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    beforeEach(() => {
      // @ts-expect-error
      global.navigator = mockNavigator;
    });

    it('should return correct JSON string for Chrome on macOS', () => {
      const userAgent = getBrowserClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        browser: 'chrome',
        browser_version: '120.0.0.0',
        os_name: 'macos',
        os_version: '10.15.7',
      });
    });

    it('should return correct JSON string for Firefox', () => {
      // @ts-expect-error
      global.navigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0';

      const userAgent = getBrowserClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        browser: 'firefox',
        browser_version: '120.0',
        os_name: 'windows',
        os_version: '10.0',
      });
    });

    it('should return correct JSON string for Safari', () => {
      // @ts-expect-error
      global.navigator.userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15';

      const userAgent = getBrowserClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        browser: 'safari',
        browser_version: '16.1',
        os_name: 'macos',
        os_version: '10.15.7',
      });
    });

    it('should handle unknown browser and OS', () => {
      // @ts-expect-error
      global.navigator.userAgent = 'Unknown Browser';

      const userAgent = getBrowserClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        browser: 'unknown',
        browser_version: 'unknown',
        os_name: 'unknown',
        os_version: 'unknown',
      });
    });
  });

  describe('getUniAppClientUserAgent', () => {
    beforeEach(() => {
      // Reset mock for each test
      vi.mocked(mockUni.getSystemInfoSync).mockReset();
    });

    it('should return correct JSON string for Android app', () => {
      vi.mocked(mockUni.getSystemInfoSync).mockReturnValue({
        platform: 'android',
        system: 'Android 13',
        AppPlatform: 'APP-PLUS',
        appVersion: '1.2.3',
        screenWidth: 1080,
        screenHeight: 2400,
        model: 'Pixel 6',
        brand: 'Google',
      });

      const userAgent = getUniAppClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        framework: 'uniapp',
        platform: 'app-plus',
        platform_version: '1.2.3',
        os_name: 'android',
        os_version: 'Android 13',
        screen_width: 1080,
        screen_height: 2400,
        device_model: 'Pixel 6',
        device_brand: 'Google',
      });
    });

    it('should return correct JSON string for iOS app', () => {
      vi.mocked(mockUni.getSystemInfoSync).mockReturnValue({
        platform: 'ios',
        system: 'iOS 17.2.1',
        AppPlatform: 'APP-PLUS',
        appVersion: '2.0.0',
        screenWidth: 1170,
        screenHeight: 2532,
        model: 'iPhone 14 Pro',
        brand: 'Apple',
      });

      const userAgent = getUniAppClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        framework: 'uniapp',
        platform: 'app-plus',
        platform_version: '2.0.0',
        os_name: 'ios',
        os_version: 'iOS 17.2.1',
        screen_width: 1170,
        screen_height: 2532,
        device_model: 'iPhone 14 Pro',
        device_brand: 'Apple',
      });
    });

    it('should return correct JSON string for WeChat Mini Program', () => {
      vi.mocked(mockUni.getSystemInfoSync).mockReturnValue({
        platform: 'ios',
        system: 'iOS 17.2.1',
        uniPlatform: 'mp-weixin',
        SDKVersion: '3.0.0',
        screenWidth: 375,
        screenHeight: 812,
        model: 'iPhone 14 Pro',
        brand: 'Apple',
      });

      const userAgent = getUniAppClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        framework: 'uniapp',
        platform: 'mp-weixin',
        platform_version: '3.0.0',
        os_name: 'ios',
        os_version: 'iOS 17.2.1',
        screen_width: 375,
        screen_height: 812,
        device_model: 'iPhone 14 Pro',
        device_brand: 'Apple',
      });
    });

    it('should handle unknown platform with appName', () => {
      vi.mocked(mockUni.getSystemInfoSync).mockReturnValue({
        platform: 'unknown',
        system: 'Unknown OS',
        appName: 'CustomApp',
        appVersion: '1.0.0',
        screenWidth: 1024,
        screenHeight: 768,
        model: 'Unknown Model',
        brand: 'Unknown Brand',
      });

      const userAgent = getUniAppClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        framework: 'uniapp',
        platform: 'customapp',
        platform_version: '1.0.0',
        os_name: 'unknown',
        os_version: 'Unknown OS',
        screen_width: 1024,
        screen_height: 768,
        device_model: 'Unknown Model',
        device_brand: 'Unknown Brand',
      });
    });

    it('should handle missing version information', () => {
      vi.mocked(mockUni.getSystemInfoSync).mockReturnValue({
        platform: 'android',
        system: 'Android',
        screenWidth: 1080,
        screenHeight: 2400,
        model: 'Test Model',
        brand: 'Test Brand',
      });

      const userAgent = getUniAppClientUserAgent();
      const parsed = JSON.parse(userAgent);

      expect(parsed).toEqual({
        version: '1.0.0',
        framework: 'uniapp',
        platform: 'unknown',
        platform_version: 'unknown',
        os_name: 'android',
        os_version: 'Android',
        screen_width: 1080,
        screen_height: 2400,
        device_model: 'Test Model',
        device_brand: 'Test Brand',
      });
    });
  });
});
