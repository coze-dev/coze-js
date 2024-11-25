import { setEnv, setOutput } from '../codebase-env';

describe('codebase-env', () => {
  it('setEnv', () => {
    expect(setEnv('1', '2')).toBeUndefined();
  });
  it('setOutput', () => {
    expect(setOutput('1', '2')).toBeUndefined();
  });
});
