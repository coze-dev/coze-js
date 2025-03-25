import { type RushConfigurationProject } from '@rushstack/rush-sdk';

export enum BumpType {
  ALPHA = 'alpha',
  BETA = 'beta',
  PATCH = 'patch',
  MINOR = 'minor',
  MAJOR = 'major',
}

export interface PublishOptions {
  version?: string;
  dryRun?: boolean;
  to?: string[]; // 发布指定包及其下游依赖
  from?: string[]; // 发布指定包及其上下游依赖
  only?: string[]; // 仅发布指定包
  bumpType?: BumpType; // 版本升级类型
  skipCommit?: boolean; // 是否跳过提交
  skipPush?: boolean; // 是否跳过推送
}

export interface PublishManifest {
  project: RushConfigurationProject;
  currentVersion: string;
  newVersion: string;
}

export type ApplyPublishManifest = (
  manifests: PublishManifest[],
) => Promise<string[]>;
