import { CozeAPI } from '../src/api/index.h5';

describe('CozeAPI - h5', () => {
  it('should call onBeforeAPICall', async () => {
    const mockOnBeforeAPICall = vi.fn();

    const cozeApi = new CozeAPI({
      baseURL: 'xx',
      token: '',
      onBeforeAPICall: mockOnBeforeAPICall,
    });
    try {
      await cozeApi.workflows.runs.create({ workflow_id: 'xx' });
    } catch (e) {
      // donothing
    }
    expect(mockOnBeforeAPICall).toHaveBeenCalledOnce();
  });

  it('should refresh token', async () => {
    const cozeApi = new CozeAPI({
      baseURL: 'xx',
      token: '',
      onBeforeAPICall: () => ({ token: 'newToken' }),
    });
    expect(cozeApi.token).toEqual('');
    try {
      await cozeApi.workflows.runs.create({ workflow_id: 'xx' });
    } catch (e) {
      // donothing
    }
    expect(cozeApi.token).toEqual('newToken');
  });
});
