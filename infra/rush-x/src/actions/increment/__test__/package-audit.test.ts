import { type Mock } from 'vitest';
import { auditPackage } from '@coze-infra/package-audit';

import { report } from '../package-audit/report';
import { runPackageAudit } from '../package-audit';

vi.mock('@coze-infra/package-audit');
vi.mock('../package-audit/report');
vi.mock('../../../utils/project-analyzer', () => ({
  getRushConfiguration: vi.fn(() => ({
    rushJsonFolder: 'path/to/rushJsonFolder',
    getProjectByName: vi.fn(packageName => ({
      packageName,
      projectFolder: `path/to/${packageName}`,
    })),
  })),
}));

describe('increment run package rule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should run owner checker correctly', async () => {
    const changedFileGroup = {
      package1: [],
      package2: [],
      package3: [],
    };
    (auditPackage as Mock).mockImplementation(async r => {
      const { packageName } = r;
      await Promise.resolve();
      switch (packageName) {
        case 'package1': {
          return [
            {
              level: 'error',
              content: 'foo bar pkg1',
              packageName,
              rule: 'rule-1',
            },
          ];
        }
        case 'package2': {
          return [
            {
              level: 'error',
              content: 'foo bar pkg2',
              packageName,
              rule: 'rule-2',
            },
          ];
        }
        default: {
          return [];
        }
      }
    });

    await runPackageAudit(changedFileGroup);

    expect(report).toBeCalledWith([
      {
        level: 'error',
        content: 'foo bar pkg1',
        packageName: 'package1',
        rule: 'rule-1',
      },
      {
        level: 'error',
        content: 'foo bar pkg2',
        packageName: 'package2',
        rule: 'rule-2',
      },
    ]);
  });
});
