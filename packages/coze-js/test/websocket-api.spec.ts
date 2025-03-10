import WS from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { WebSocketAPI } from '../src/websocket-api';
import * as utils from '../src/utils';
import { WebsocketsEventType } from '../src/resources/websockets/types';

// Mock modules
vi.mock('ws');
vi.mock('reconnecting-websocket');
vi.mock('../src/utils', () => ({
  isBrowser: vi.fn(),
}));

describe('WebSocketAPI', () => {
  let wsApi: WebSocketAPI<any, any>;
  const mockUrl = 'wss://example.com/socket';
  const mockOptions = {
    headers: {
      authorization: 'Bearer test-token',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks
    (ReconnectingWebSocket as jest.Mock).mockClear();
    (WS as jest.Mock).mockClear();
  });

  describe('constructor', () => {
    beforeEach(() => {
      global.window = {
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        WebSocket: class MockWebSocket {},
      } as any;
    });

    afterEach(() => {
      // Clean up
      delete (global as any).window;
    });

    it('should initialize correctly in browser environment', () => {
      vi.spyOn(utils, 'isBrowser').mockReturnValue(true);

      wsApi = new WebSocketAPI(mockUrl, mockOptions);

      expect(ReconnectingWebSocket).toHaveBeenCalledWith(
        `${mockUrl}?authorization=Bearer test-token`,
        [],
        expect.objectContaining({
          WebSocket: window.WebSocket,
        }),
      );
    });

    it('should initialize correctly in node environment', () => {
      vi.spyOn(utils, 'isBrowser').mockReturnValue(false);

      wsApi = new WebSocketAPI(mockUrl, mockOptions);

      expect(ReconnectingWebSocket).toHaveBeenCalledWith(
        `${mockUrl}?authorization=Bearer test-token`,
        [],
        expect.objectContaining({
          WebSocket: expect.any(Function),
        }),
      );
    });

    it('should handle URL with existing query parameters', () => {
      const urlWithQuery = 'wss://example.com/socket?param=value';
      wsApi = new WebSocketAPI(urlWithQuery, mockOptions);

      expect(ReconnectingWebSocket).toHaveBeenCalledWith(
        `${urlWithQuery}&authorization=Bearer test-token`,
        expect.any(Array),
        expect.any(Object),
      );
    });
  });

  describe('event handlers', () => {
    let mockRws: any;

    beforeEach(() => {
      mockRws = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      (ReconnectingWebSocket as jest.Mock).mockImplementation(() => mockRws);
      wsApi = new WebSocketAPI(mockUrl, mockOptions);
    });

    it('should handle message events', () => {
      const mockHandler = vi.fn();
      const mockEvent = {
        data: JSON.stringify({ message: 'test' }),
      };

      wsApi.onmessage = mockHandler;

      // Simulate message event
      const messageCallback = mockRws.addEventListener.mock.calls.find(
        call => call[0] === 'message',
      )[1];
      messageCallback(mockEvent);

      expect(mockHandler).toHaveBeenCalledWith(
        { message: 'test' },
        expect.any(Object),
      );
    });

    it('should handle message error', () => {
      const mockHandler = vi.fn();
      const mockEvent = {
        data: 'abc',
      };

      wsApi.onmessage = mockHandler;

      // Simulate message event
      const messageCallback = mockRws.addEventListener.mock.calls.find(
        call => call[0] === 'message',
      )[1];
      messageCallback(mockEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should handle open event', () => {
      const mockHandler = vi.fn();
      const mockEvent = {
        data: 'abc',
      };

      wsApi.onopen = mockHandler;

      // Simulate message event
      const openCallback = mockRws.addEventListener.mock.calls.find(
        call => call[0] === 'open',
      )[1];
      openCallback(mockEvent);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should handle close event', () => {
      const mockHandler = vi.fn();
      const mockEvent = {
        data: 'abc',
      };

      wsApi.onclose = mockHandler;

      // Simulate message event
      const closeCallback = mockRws.addEventListener.mock.calls.find(
        call => call[0] === 'close',
      )[1];
      closeCallback(mockEvent);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should handle error with readyState 3', () => {
      mockRws = {
        send: vi.fn(),
        close: vi.fn(),
        readyState: 3,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      (ReconnectingWebSocket as jest.Mock).mockImplementation(() => mockRws);
      const wsApi2 = new WebSocketAPI(mockUrl, mockOptions);

      const mockHandler = vi.fn();
      const mockEvent = {
        data: 'abc',
      };

      wsApi2.onerror = mockHandler;

      // Simulate message event
      const errorCallback = mockRws.addEventListener.mock.calls.find(
        call => call[0] === 'error',
      )[1];
      errorCallback(mockEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should handle error events with 401 status', () => {
      const mockHandler = vi.fn();
      const mockEvent = {
        target: {
          _req: {
            res: {
              statusCode: 401,
              rawHeaders: [],
            },
          },
        },
      };

      wsApi.onerror = mockHandler;

      // Simulate error event
      const errorCallback = mockRws.addEventListener.mock.calls.find(
        call => call[0] === 'error',
      )[1];
      errorCallback(mockEvent);

      expect(mockHandler).toHaveBeenCalledWith(
        {
          id: '0',
          event_type: WebsocketsEventType.ERROR,
          data: {
            code: 401,
            msg: 'Unauthorized',
          },
          detail: {
            logid: undefined,
          },
        },
        expect.any(Object),
      );
    });

    it('should handle error events with 403 status', () => {
      const mockHandler = vi.fn();
      const mockEvent = {
        target: {
          _req: {
            res: {
              statusCode: 403,
              rawHeaders: [],
            },
          },
        },
      };

      wsApi.onerror = mockHandler;

      // Simulate error event
      const errorCallback = mockRws.addEventListener.mock.calls.find(
        call => call[0] === 'error',
      )[1];
      errorCallback(mockEvent);

      expect(mockHandler).toHaveBeenCalledWith(
        {
          id: '0',
          event_type: WebsocketsEventType.ERROR,
          data: {
            code: 403,
            msg: 'Forbidden',
          },
          detail: {
            logid: undefined,
          },
        },
        expect.any(Object),
      );
    });

    it('should handle error events with 500 status', () => {
      const mockHandler = vi.fn();
      const mockEvent = {
        target: {
          _req: {
            res: {
              statusCode: 500,
              rawHeaders: [],
            },
          },
        },
      };

      wsApi.onerror = mockHandler;

      // Simulate error event
      const errorCallback = mockRws.addEventListener.mock.calls.find(
        call => call[0] === 'error',
      )[1];
      errorCallback(mockEvent);

      expect(mockHandler).toHaveBeenCalledWith(
        {
          id: '0',
          event_type: WebsocketsEventType.ERROR,
          data: {
            code: 500,
            msg: 'WebSocket error',
          },
          detail: {
            logid: undefined,
          },
        },
        expect.any(Object),
      );
    });
  });

  describe('WebSocket methods', () => {
    let mockRws: any;

    beforeEach(() => {
      mockRws = {
        send: vi.fn(),
        close: vi.fn(),
        readyState: 1,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      (ReconnectingWebSocket as jest.Mock).mockImplementation(() => mockRws);
      wsApi = new WebSocketAPI(mockUrl, mockOptions);
    });

    it('should get readyState', () => {
      expect(wsApi.readyState).toBe(1);
    });

    it('should send data', () => {
      const testData = { message: 'test' };
      wsApi.send(testData);

      expect(mockRws.send).toHaveBeenCalledWith(JSON.stringify(testData));
    });

    it('should close connection', () => {
      const code = 1000;
      const reason = 'test close';
      wsApi.close(code, reason);

      expect(mockRws.close).toHaveBeenCalledWith(code, reason);
    });

    it('should add event listener', () => {
      const mockListener = vi.fn();
      wsApi.addEventListener('message', mockListener);

      expect(mockRws.addEventListener).toHaveBeenCalledWith(
        'message',
        mockListener,
      );
    });

    it('should remove event listener', () => {
      const mockListener = vi.fn();
      wsApi.removeEventListener('message', mockListener);

      expect(mockRws.removeEventListener).toHaveBeenCalledWith(
        'message',
        mockListener,
      );
    });
  });
});
