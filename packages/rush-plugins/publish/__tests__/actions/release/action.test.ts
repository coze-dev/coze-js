import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type RushConfigurationProject } from '@rushstack/rush-sdk';
import { logger } from '@coze-infra/rush-logger';

import { type ReleaseOptions, type PackageToPublish } from '../types';
import { releasePackages } from '../release';
import { checkReleasePlan } from '../plan';
import { buildReleaseManifest } from '../manifest';
import { getPackagesToPublish } from '../git';
import { release } from '../action';
import { getCurrentBranchName } from '../../../utils/git-command';
import { exec } from '../../../utils/exec';

// Mock dependencies
vi.mock('@coze-infra/rush-logger');
vi.mock('../../../utils/git-command');
vi.mock('../../../utils/exec');
vi.mock('../release');
vi.mock('../plan');
vi.mock('../manifest');
vi.mock('../git');

describe('release action', () => {
  const mockCommit = 'abc123';
  const mockBranchName = 'main';
  const mockRegistry = 'https://registry.npmjs.org/';

  const createMockProject = (name: string): RushConfigurationProject => {
    const project = {
      _shouldPublish: true,
      _versionPolicy: null,
      _dependencyProjects: new Set<RushConfigurationProject>(),
      _consumingProjects: new Set<RushConfigurationProject>(),
      _packageJson: {},
      projectRelativeFolder: `packages/${name}`,
      projectRushConfigFolder: '/mock/rush/config',
      projectRushTempFolder: '/mock/rush/temp',
      tempProjectName: name,
      unscopedTempProjectName: name,
      skipRushCheck: false,
      publishFolder: `/mock/project/${name}/dist`,
      isMainProject: false,
      dependencyProjects: new Set<RushConfigurationProject>(),
      consumingProjects: new Set<RushConfigurationProject>(),
      shouldPublish: true,
      versionPolicyName: undefined,
      decoupledLocalDependencies: [],
      packageName: name,
      projectFolder: `/mock/project/${name}`,
      rushConfiguration: {} as any,
      reviewCategory: undefined,
      packageJson: {} as any,
      packageJsonEditor: {} as any,
      isPublished: true,
      statusValue: 0,
      statusMessage: '',
      cyclicDependencyProjects: new Set<RushConfigurationProject>(),
      localDependencyProjects: new Set<RushConfigurationProject>(),
      tags: [],
    } as unknown as RushConfigurationProject;
    return project;
  };

  const mockProject1 = createMockProject('package-1');
  const mockProject2 = createMockProject('package-2');

  const mockPackagesToPublish: PackageToPublish[] = [
    {
      packageName: 'package-1',
      version: '1.1.0',
    },
    {
      packageName: 'package-2',
      version: '2.1.0',
    },
  ];

  const mockReleaseManifests = [
    {
      project: mockProject1,
      version: '1.1.0',
    },
    {
      project: mockProject2,
      version: '2.1.0',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(exec).mockResolvedValue({ stdout: '', stderr: '', code: 0 });
    vi.mocked(getCurrentBranchName).mockResolvedValue(mockBranchName);
    vi.mocked(getPackagesToPublish).mockResolvedValue(mockPackagesToPublish);
    vi.mocked(buildReleaseManifest).mockReturnValue(mockReleaseManifests);
    vi.mocked(checkReleasePlan).mockReturnValue(undefined);
    vi.mocked(releasePackages).mockResolvedValue(undefined);
  });

  it('should release packages successfully', async () => {
    const options: ReleaseOptions = {
      commit: mockCommit,
      registry: mockRegistry,
    };

    await release(options);

    // 验证流程
    expect(exec).toHaveBeenCalledWith(`git checkout ${mockCommit}`);
    expect(getPackagesToPublish).toHaveBeenCalledWith(mockCommit);
    expect(buildReleaseManifest).toHaveBeenCalledWith(mockPackagesToPublish);
    expect(getCurrentBranchName).toHaveBeenCalled();
    expect(checkReleasePlan).toHaveBeenCalledWith(
      mockReleaseManifests,
      mockBranchName,
    );
    expect(releasePackages).toHaveBeenCalledWith(mockReleaseManifests, {
      commit: mockCommit,
      dryRun: false,
      registry: mockRegistry,
    });

    // 验证日志输出
    expect(logger.info).toHaveBeenCalledWith('Release manifests:');
    expect(logger.info).toHaveBeenCalledWith(
      'package-1@1.1.0, package-2@2.1.0',
      false,
    );
    expect(logger.success).toHaveBeenCalledWith(
      'All packages published successfully!',
    );
    expect(logger.success).toHaveBeenCalledWith(
      '- package-1@1.1.0\n- package-2@2.1.0',
      false,
    );
  });

  it('should handle no packages to publish', async () => {
    vi.mocked(getPackagesToPublish).mockResolvedValue([]);

    await release({ commit: mockCommit, registry: mockRegistry });

    expect(logger.warning).toHaveBeenCalledWith('No packages to publish');
    expect(buildReleaseManifest).not.toHaveBeenCalled();
    expect(checkReleasePlan).not.toHaveBeenCalled();
    expect(releasePackages).not.toHaveBeenCalled();
  });

  it('should respect dryRun option', async () => {
    await release({ commit: mockCommit, dryRun: true, registry: mockRegistry });

    expect(releasePackages).toHaveBeenCalledWith(mockReleaseManifests, {
      commit: mockCommit,
      dryRun: true,
      registry: mockRegistry,
    });
  });

  it('should respect registry option', async () => {
    await release({ commit: mockCommit, registry: mockRegistry });

    expect(releasePackages).toHaveBeenCalledWith(mockReleaseManifests, {
      commit: mockCommit,
      dryRun: false,
      registry: mockRegistry,
    });
  });

  it('should handle release plan check error', async () => {
    vi.mocked(checkReleasePlan).mockImplementation(() => {
      throw new Error('Invalid release plan');
    });

    await expect(
      release({ commit: mockCommit, registry: mockRegistry }),
    ).rejects.toThrow('Invalid release plan');
    expect(releasePackages).not.toHaveBeenCalled();
  });

  it('should handle release packages error', async () => {
    vi.mocked(releasePackages).mockRejectedValue(new Error('Release failed'));

    await expect(
      release({ commit: mockCommit, registry: mockRegistry }),
    ).rejects.toThrow('Release failed');
    expect(logger.success).not.toHaveBeenCalled();
  });
});
