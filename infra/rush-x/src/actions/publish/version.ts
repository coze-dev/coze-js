import semver from 'semver';
import { type RushConfigurationProject } from '@rushstack/rush-sdk';

import { randomHash } from '../../utils/random';
import { BumpType } from './types';
import { type PublishManifest } from './types';
import { requstBumpType } from './request-bump-type';

interface VersionOptions {
  version?: string;
  bumpType?: BumpType;
  sessionId: string;
}

/**
 * 根据当前版本和发布类型计算新版本号
 */
const calculateNewVersion = (
  currentVersion: string,
  bumpType: BumpType,
  sessionId?: string,
): string => {
  // 解析当前版本
  const parsed = semver.parse(currentVersion);
  if (!parsed) {
    throw new Error(`Invalid current version: ${currentVersion}`);
  }

  const { major, minor, patch, prerelease } = parsed;

  switch (bumpType) {
    case BumpType.PATCH:
    case BumpType.MINOR:
    case BumpType.MAJOR: {
      // 如果当前是预发布版本，去掉预发布标识
      const cc =
        prerelease.length > 0 ? `${major}.${minor}.${patch}` : currentVersion;
      // 否则增加 patch 版本
      return semver.inc(cc, bumpType) || currentVersion;
    }
    case BumpType.BETA: {
      // 如果当前已经是 beta 版本，增加 beta 版本号
      if (prerelease[0] === 'beta') {
        const nextVersion = semver.inc(currentVersion, 'prerelease', 'beta');
        return nextVersion || currentVersion;
      }
      // 否则基于当前版本创建新的 beta 版本
      const baseVersion = `${major}.${minor}.${patch}`;
      return `${baseVersion}-beta.1`;
    }
    case BumpType.ALPHA: {
      // 否则基于当前版本创建新的 alpha 版本
      const baseVersion = `${major}.${minor}.${patch}`;
      // 生成随机哈希值
      return `${baseVersion}-alpha.${sessionId || randomHash(6)}`;
    }
    default: {
      throw new Error(
        `Invalid bump type: ${bumpType}, should be one of ${Object.values(BumpType).join(', ')}`,
      );
    }
  }
};

/**
 * 生成新版本号
 * 策略优先级:
 * 1. 指定版本号
 * 2. 指定发布类型
 * 3. 交互式选择
 */
const generateNewVersionForPackage = (
  project: RushConfigurationProject,
  options: VersionOptions,
): string => {
  const currentVersion = project.packageJson.version;
  // 1. 如果指定了版本号，直接使用
  if (options.version) {
    return options.version;
  }

  // 1. 如果指定了发布类型，计算新版本号
  const { bumpType } = options;
  if (!bumpType) {
    throw new Error('Version selection was cancelled');
  }
  const newVersion = calculateNewVersion(
    currentVersion,
    bumpType,
    options.sessionId,
  );

  return newVersion;
};

const calBumpPolicy = (options: VersionOptions) => {
  const { version, bumpType } = options;
  if (version) {
    return version;
  }
  return bumpType;
};

/**
 * 生成发布清单
 */
export const generatePublishManifest = async (
  packages: Set<RushConfigurationProject>,
  options: VersionOptions,
): Promise<{
  manifests: PublishManifest[];
  bumpPolicy: BumpType | string;
}> => {
  const manifests: PublishManifest[] = [];
  const { version, bumpType } = options;
  if (version && !semver.valid(version)) {
    throw new Error(`Invalid version specified: ${version}`);
  } else if (!bumpType) {
    const newBumpType = await requstBumpType();
    if (!newBumpType) {
      throw new Error('Version selection was cancelled!');
    }
    options.bumpType = newBumpType;
  }
  for (const pkg of packages) {
    const currentVersion = pkg.packageJson.version;
    const newVersion = await generateNewVersionForPackage(pkg, options);
    manifests.push({
      project: pkg,
      newVersion,
      currentVersion,
    });
  }
  const bumpPolicy = calBumpPolicy(options);
  return {
    manifests,
    bumpPolicy,
  };
};
