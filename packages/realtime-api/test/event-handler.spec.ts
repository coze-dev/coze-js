import { RealtimeEventHandler, EventNames } from '../src/event-handler';
import { RealtimeAPIError } from '../src/error';

describe('RealtimeEventHandler', () => {
  let handler: RealtimeEventHandler;

  beforeEach(() => {
    handler = new RealtimeEventHandler();
  });

  describe('on', () => {
    it('should add event listener', () => {
      const callback = jest.fn();
      handler.on(EventNames.CONNECTED, callback);
      handler.dispatch(EventNames.CONNECTED, {});
      expect(callback).toHaveBeenCalledWith(EventNames.CONNECTED, {});
    });
  });

  describe('off', () => {
    it('should remove specific event listener', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      handler.on(EventNames.CONNECTED, callback1);
      handler.on(EventNames.CONNECTED, callback2);
      handler.off(EventNames.CONNECTED, callback1);
      handler.dispatch(EventNames.CONNECTED, {});
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should throw error when trying to remove non-existent listener', () => {
      const callback = jest.fn();
      expect(() => handler.off(EventNames.CONNECTED, callback)).toThrow(
        RealtimeAPIError,
      );
    });

    it('should remove all listeners for an event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      handler.on(EventNames.CONNECTED, callback1);
      handler.on(EventNames.CONNECTED, callback2);
      handler.off(EventNames.CONNECTED, callback1);
      handler.off(EventNames.CONNECTED, callback2);
      handler.dispatch(EventNames.CONNECTED, {});
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  describe('dispatch', () => {
    it('should call specific event listeners', () => {
      const callback = jest.fn();
      handler.on(EventNames.CONNECTED, callback);
      handler.dispatch(EventNames.CONNECTED, { data: 'test' });
      expect(callback).toHaveBeenCalledWith(EventNames.CONNECTED, {
        data: 'test',
      });
    });

    it('should call ALL event listeners', () => {
      const callback = jest.fn();
      handler.on(EventNames.ALL, callback);
      handler.dispatch(EventNames.CONNECTED, { data: 'test' });
      expect(callback).toHaveBeenCalledWith(EventNames.CONNECTED, {
        data: 'test',
      });
    });

    it('should call ALL_CLIENT event listeners for client events', () => {
      const callback = jest.fn();
      handler.on(EventNames.ALL_CLIENT, callback);
      handler.dispatch(EventNames.CONNECTED, { data: 'test' });
      expect(callback).toHaveBeenCalledWith(EventNames.CONNECTED, {
        data: 'test',
      });
    });

    it('should call ALL_SERVER event listeners for server events', () => {
      const callback = jest.fn();
      handler.on(EventNames.ALL_SERVER, callback);
      handler.dispatch('server.test', { data: 'test' });
      expect(callback).toHaveBeenCalledWith('server.test', { data: 'test' });
    });
  });

  describe('clearEventHandlers', () => {
    it('should remove all event listeners', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      handler.on(EventNames.CONNECTED, callback1);
      handler.on(EventNames.DISCONNECTED, callback2);
      handler.clearEventHandlers();
      handler.dispatch(EventNames.CONNECTED, {});
      handler.dispatch(EventNames.DISCONNECTED, {});
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  describe('_log', () => {
    it('should log messages when debug is true', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const debugHandler = new RealtimeEventHandler(true);
      debugHandler._log('Test message');
      expect(consoleSpy).toHaveBeenCalledWith('[RealtimeClient] Test message');
      consoleSpy.mockRestore();
    });

    it('should not log messages when debug is false', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      handler._log('Test message');
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
