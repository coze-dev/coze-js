import { CozeAPI } from '../src/index';

describe('CozeAPI', () => {
  let api: CozeAPI;
  beforeEach(() => {
    api = new CozeAPI({ token: 'test-api-key' });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with the correct API key', () => {
    expect(api.getConfig().token).toEqual('test-api-key');
  });

  it('should have all the expected resources', () => {
    expect(api.bots).toBeDefined();
    expect(api.chat).toBeDefined();
    expect(api.conversations).toBeDefined();
    expect(api.files).toBeDefined();
    expect(api.knowledge).toBeDefined();
    expect(api.workflows).toBeDefined();
    expect(api.workspaces).toBeDefined();
    expect(api.audio).toBeDefined();
  });
});
