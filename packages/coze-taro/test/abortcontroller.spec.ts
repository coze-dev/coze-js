import { AbortControllerPonyfill } from '../src/helpers/abortcontroller';

describe('AbortControllerPonyfill', () => {
  it('should have signal property', () => {
    const controller = new AbortControllerPonyfill();
    expect(controller.signal).not.toBeNull();
  });

  it('should fire callback when abort', () => {
    const controller = new AbortControllerPonyfill();
    const mockFn = vi.fn();
    controller.signal.addEventListener('abort', mockFn);
    controller.abort();
    expect(mockFn).toHaveBeenCalledOnce();
  });
});
