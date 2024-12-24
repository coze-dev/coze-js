import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type RushConfigurationProject } from '@rushstack/rush-sdk';
import { logger } from '@coze-infra/rush-logger';

import { type ReleaseOptions, type ReleaseManifest } from '../types';
import { releasePackages } from '../release';
import { applyPublishConfig } from '../package';
import { exec } from '../../../utils/exec';

// Mock dependencies
vi.mock('@coze-infra/rush-logger');
vi.mock('../../../utils/exec');
vi.mock('../package');

describe('release', () => {
  const mockRegistry = 'https://registry.npmjs.org/';
  const mockToken = 'mock-token';

  const createMockProject = (
    name: string,
    version: string,
  ): RushConfigurationProject => {
    const project = {
      packageName: name,
      projectFolder: `/mock/project/${name}`,
      packageJson: {
        version,
      },
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
      rushConfiguration: {} as any,
      reviewCategory: undefined,
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

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_AUTH_TOKEN = mockToken;
  });

  afterEach(() => {
    delete process.env.NODE_AUTH_TOKEN;
  });

  describe('releasePackages', () => {
    it('should build and publish packages successfully', async () => {
      const mockProject1 = createMockProject('package-1', '1.1.0');
      const mockProject2 = createMockProject('package-2', '2.1.0');

      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject1,
          version: '1.1.0',
        },
        {
          project: mockProject2,
          version: '2.1.0',
        },
      ];

      const options: ReleaseOptions = {
        commit: 'abc123',
        registry: mockRegistry,
      };

      await releasePackages(releaseManifests, options);

      // 验证构建过程
      expect(exec).toHaveBeenCalledWith(
        'rush build --to package-1 --to package-2',
      );

      // 验证发布过程
      expect(applyPublishConfig).toHaveBeenCalledWith(mockProject1);
      expect(applyPublishConfig).toHaveBeenCalledWith(mockProject2);

      expect(exec).toHaveBeenCalledWith(
        `NODE_AUTH_TOKEN=${mockToken} npm publish --tag latest --registry=${mockRegistry}`,
        {
          cwd: mockProject1.projectFolder,
        },
      );
      expect(exec).toHaveBeenCalledWith(
        `NODE_AUTH_TOKEN=${mockToken} npm publish --tag latest --registry=${mockRegistry}`,
        {
          cwd: mockProject2.projectFolder,
        },
      );

      // 验证日志输出
      expect(logger.info).toHaveBeenCalledWith(
        'Preparing release for package: package-1',
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Preparing release for package: package-2',
      );
      expect(logger.success).toHaveBeenCalledWith(
        '- Published package-1@1.1.0',
      );
      expect(logger.success).toHaveBeenCalledWith(
        '- Published package-2@2.1.0',
      );
    });

    it('should handle alpha versions correctly', async () => {
      const mockProject = createMockProject('package-alpha', '1.0.0-alpha.1');
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject,
          version: '1.0.0-alpha.1',
        },
      ];

      await releasePackages(releaseManifests, {
        commit: 'abc123',
        registry: mockRegistry,
      });

      expect(exec).toHaveBeenCalledWith(
        `NODE_AUTH_TOKEN=${mockToken} npm publish --tag alpha --registry=${mockRegistry}`,
        {
          cwd: mockProject.projectFolder,
        },
      );
    });

    it('should handle beta versions correctly', async () => {
      const mockProject = createMockProject('package-beta', '1.0.0-beta.1');
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject,
          version: '1.0.0-beta.1',
        },
      ];

      await releasePackages(releaseManifests, {
        commit: 'abc123',
        registry: mockRegistry,
      });

      expect(exec).toHaveBeenCalledWith(
        `NODE_AUTH_TOKEN=${mockToken} npm publish --tag beta --registry=${mockRegistry}`,
        {
          cwd: mockProject.projectFolder,
        },
      );
    });

    it('should respect dryRun option', async () => {
      const mockProject = createMockProject('package-1', '1.1.0');
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject,
          version: '1.1.0',
        },
      ];

      await releasePackages(releaseManifests, {
        commit: 'abc123',
        registry: mockRegistry,
        dryRun: true,
      });

      expect(exec).toHaveBeenCalledWith(
        `NODE_AUTH_TOKEN=${mockToken} npm publish --tag latest --dry-run --registry=${mockRegistry}`,
        {
          cwd: mockProject.projectFolder,
        },
      );
    });

    it('should handle build errors', async () => {
      const mockProject = createMockProject('package-1', '1.1.0');
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject,
          version: '1.1.0',
        },
      ];

      vi.mocked(exec).mockRejectedValueOnce(new Error('Build failed'));

      await expect(
        releasePackages(releaseManifests, {
          commit: 'abc123',
          registry: mockRegistry,
        }),
      ).rejects.toThrow('Build failed');

      expect(applyPublishConfig).not.toHaveBeenCalled();
    });

    it('should handle publish errors', async () => {
      const mockProject = createMockProject('package-1', '1.1.0');
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject,
          version: '1.1.0',
        },
      ];

      // 模拟构建成功但发布失败
      vi.mocked(exec)
        .mockResolvedValueOnce({ stdout: '', stderr: '', code: 0 }) // build 成功
        .mockRejectedValueOnce(new Error('Publish failed')); // publish 失败

      await expect(
        releasePackages(releaseManifests, {
          commit: 'abc123',
          registry: mockRegistry,
        }),
      ).rejects.toThrow('Publish failed');

      expect(logger.success).not.toHaveBeenCalled();
    });

    it('should handle missing auth token', async () => {
      const mockProject = createMockProject('package-1', '1.1.0');
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject,
          version: '1.1.0',
        },
      ];

      delete process.env.NODE_AUTH_TOKEN;

      await releasePackages(releaseManifests, {
        commit: 'abc123',
        registry: mockRegistry,
      });

      expect(exec).toHaveBeenCalledWith(
        'NODE_AUTH_TOKEN=undefined npm publish --tag latest --registry=https://registry.npmjs.org/',
        {
          cwd: mockProject.projectFolder,
        },
      );
    });

    it('should handle multiple packages in parallel', async () => {
      const projects = Array.from({ length: 5 }, (_, i) =>
        createMockProject(`package-${i + 1}`, `1.0.${i}`),
      );
      const releaseManifests: ReleaseManifest[] = projects.map(project => ({
        project,
        version: project.packageJson.version,
      }));

      await releasePackages(releaseManifests, {
        commit: 'abc123',
        registry: mockRegistry,
      });

      expect(exec).toHaveBeenCalledWith(
        `rush build ${projects.map(project => `--to ${project.packageName}`).join(' ')}`,
      );

      // 验证所有包都被构建和发布
      projects.forEach(project => {
        expect(exec).toHaveBeenCalledWith(
          `NODE_AUTH_TOKEN=${mockToken} npm publish --tag latest --registry=${mockRegistry}`,
          {
            cwd: project.projectFolder,
          },
        );
        expect(logger.success).toHaveBeenCalledWith(
          `- Published ${project.packageName}@${project.packageJson.version}`,
        );
      });
    });
  });
});
