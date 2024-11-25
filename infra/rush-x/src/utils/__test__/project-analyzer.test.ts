import { vi } from 'vitest';

import {
  printUpdatedPackages,
  getRushConfiguration,
  getChangedFilesFromRemote,
  getChangedProjectsFromRemote,
  getChangedProjectsNameByTag,
} from '../project-analyzer';

vi.mock('child_process');

const rushConfiguration = getRushConfiguration();
rushConfiguration.versionPolicyConfiguration.update = () => {
  // mock update
};

describe('project-analyzer', () => {
  beforeAll(() => {
    const packageChanges = new Map();
    packageChanges.set('@/rush-x', {
      packageName: '@/rush-x',
      changeType: 2,
      order: 0,
      changes: [
        {
          packageName: '@/rush-x',
          comment: 'fix npm version',
          type: 'patch',
          changeType: 3,
        },
      ],
      newVersion: '0.1.250',
      newRangeDependency: '>=0.1.250 <1.0.0',
    });
    const versionPolicyChanges = new Map();
    versionPolicyChanges.set('@/rush-x', {
      changeType: 3,
      newVersion: '1.1.1',
      versionPolicyName: 'MyBigFramework',
    });
  });

  it('getRushConfiguration', () => {
    const config = getRushConfiguration();
    expect(config).toBeTruthy();
  });

  it('printUpdatedPackages', () => {
    const fn = vi.fn(printUpdatedPackages);
    fn([
      {
        name: 'test',
        newVersion: '1.1.1',
        oldVersion: '1.1.0',
        versionType: 'patch',
        changeInfo: { changes: [], packageName: 'test' },
      },
    ]);
    expect(fn).toHaveBeenCalled();
  });

  it('getChangedFilesFromRemote', () => {
    const result = getChangedFilesFromRemote('[.codebase/pipelines/ci.yaml]');
    expect(result).toEqual(['.codebase/pipelines/ci.yaml']);

    const changedProjects = getChangedProjectsFromRemote(
      '[.codebase/pipelines/ci.yaml,infra/rush-x/README.md,infra/rush-x/src/index.ts]',
    );
    expect(changedProjects).toBeTruthy();

    const changedProjectsFromPackages = getChangedProjectsFromRemote([
      '@/rush-x',
    ]);
    expect(changedProjectsFromPackages).toBeTruthy();
  });

  it('getChangedFilesFromRemote empty', () => {
    const result = getChangedFilesFromRemote('');
    expect(result).toEqual([]);
  });

  it('getChangedProjectsNameByTag', () => {
    expect(getChangedProjectsNameByTag(['rush-x'])).toEqual(['@/rush-x']);
  });
});
