import path from 'path';

import { runLintInProject } from '../stylelint/stylelint';
import { report } from '../stylelint/report';
import { runStylelint } from '../stylelint';

vi.mock('../stylelint/stylelint', () => ({ runLintInProject: vi.fn() }));
vi.mock('../stylelint/report', () => ({ report: vi.fn() }));
vi.mock('../../../utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));
vi.mock('path', () => ({ default: { relative: vi.fn() } }));

vi.mock('../../../utils/project-analyzer', () => ({
  getRushConfiguration: vi.fn(() => ({
    rushJsonFolder: 'path/to/rushJsonFolder',
    getProjectByName: vi.fn(packageName => ({
      packageName,
      projectFolder: `/path/to/${packageName}`,
      projectRelativeFolder: packageName,
    })),
  })),
}));

describe('increment run stylelint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should batch run stylelint', async () => {
    const changedFileGroup = {
      foo: ['src/file.less', 'src/file2.less'],
      bar: ['src/file3.less', 'src/file4.less'],
      bar2: ['src/file3.js'],
    };
    path.relative.mockImplementation((_, r) => r);
    runLintInProject.mockResolvedValueOnce([{ warnings: [{ text: 'error' }] }]);
    runLintInProject.mockResolvedValueOnce([]);

    await runStylelint(changedFileGroup);

    // assets
    expect(report.mock.calls[0][0]).toEqual([
      {
        packageName: 'foo',
        errors: [{ warnings: [{ text: 'error' }] }],
        files: ['src/file.less', 'src/file2.less'],
        projectFolder: '/path/to/foo',
      },
      {
        packageName: 'bar',
        errors: [],
        files: ['src/file3.less', 'src/file4.less'],
        projectFolder: '/path/to/bar',
      },
    ]);
    expect(runLintInProject.mock.calls.length).toBe(2);
  });
});
