import stylelint from 'stylelint';
import { isFileExists } from '@coze-infra/fs-enhance';

import { runLintInProject } from '../stylelint/stylelint';

vi.mock('@coze-infra/fs-enhance');

vi.mock('../../../utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));
vi.mock('stylelint', () => ({
  default: {
    resolveConfig: vi.fn().mockResolvedValue({
      rules: {
        'plugin/disallow-first-level-global': [true, { severity: 'error' }],
      },
    }),
    lint: vi.fn(),
  },
}));

describe('increment run stylelint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should run stylelint by files', async () => {
    isFileExists.mockResolvedValue(true);

    stylelint.lint.mockResolvedValue({
      results: [{ warnings: [{ text: 'error' }] }, { warnings: [] }],
    });

    const res = await runLintInProject({
      cwd: '/path/to/project',
      files: ['src/files1.less', 'src/files2.css'],
    });

    // assets
    expect(res).toEqual([{ warnings: [{ text: 'error' }] }]);
    expect(stylelint.resolveConfig).toBeCalledWith(
      '/path/to/project/.stylelintrc.js',
    );
    expect(stylelint.lint).toBeCalledWith({
      config: {
        rules: {
          'plugin/disallow-first-level-global': [true, { severity: 'error' }],
        },
        allowEmptyInput: true,
      },
      cwd: '/path/to/project',
      files: ['src/files1.less', 'src/files2.css'],
      fix: false,
      quiet: true,
    });
  });

  it('should skip stylelint if stylelint config not exists', async () => {
    isFileExists.mockResolvedValue(false);

    const res = await runLintInProject({
      cwd: '/path/to/project',
      files: ['src/files1.less', 'src/files2.css'],
    });

    // assets
    expect(res).toEqual([]);
    expect(stylelint.resolveConfig).not.toBeCalled();
    expect(stylelint.lint).not.toBeCalled();
  });
});
