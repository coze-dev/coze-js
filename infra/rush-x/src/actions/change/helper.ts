import path from 'path';

import type { RushConfigurationProject } from '@rushstack/rush-sdk/lib/api/RushConfigurationProject';
import type { RushConfiguration } from '@rushstack/rush-sdk/lib/api/RushConfiguration';
import { ChangeFile } from '@rushstack/rush-sdk/lib/api/ChangeFile';
import { logger } from '@coze-infra/rush-logger';
import type { Commit, Parser, ParserOptions } from '@commitlint/types';

import { getRushConfiguration } from '../../utils/project-analyzer';
import { getChangedFilesFromCached } from '../../utils/git-command';
import { exec } from '../../utils/exec';
import { whoAmI } from '../../utils/env';

// 这两个包没有 module 导出
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { sync } = require('conventional-commits-parser');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const defaultChangelogOpts = require('conventional-changelog-angular');

const VERSIONS = ['major', 'minor', 'patch'];

/**
 * 收集需要更新 changes 的包
 * @returns  RushConfigurationProject[]
 */
export const collectShouldUpdateChangesProjects = async (): Promise<
  RushConfigurationProject[]
> => {
  const changedFiles = await getChangedFilesFromCached();
  const rushConfiguration: RushConfiguration = getRushConfiguration();
  const lookup = rushConfiguration.getProjectLookupForRoot(
    rushConfiguration.rushJsonFolder,
  );

  const relativeChangesFolder = path.relative(
    rushConfiguration.rushJsonFolder,
    rushConfiguration.changesFolder,
  );
  const ignorePackage: string[] = [];
  const shouldUpdateChangesProjects: Set<RushConfigurationProject> = new Set();

  for (const file of changedFiles) {
    // 收集有 common/changes 下变更的包
    if (file.startsWith(relativeChangesFolder)) {
      const packageName = path.relative(
        relativeChangesFolder,
        path.dirname(file),
      );
      ignorePackage.push(packageName);
    }

    const project = lookup.findChildPath(file);
    // 按是否发布提取相关包信息，同时过滤掉changes包含在本次变更内的文件（该策略是手动更改优先级大于自动生成）
    if (project && !ignorePackage.includes(project.packageName)) {
      if (!shouldUpdateChangesProjects.has(project) && project.shouldPublish) {
        shouldUpdateChangesProjects.add(project);
      }
    }
  }

  return [...shouldUpdateChangesProjects];
};

/**
 * 解析 commit-mag
 * @param message
 * @param parser
 * @param parserOpts
 * @returns
 */
// https://github.com/conventional-changelog/commitlint/blob/8b8a6e62f57511c0be05346d14959247851cdfeb/%40commitlint/parse/src/index.ts#L6
export async function parseCommit(
  message: string,
  parser: Parser = sync,
  parserOpts?: ParserOptions,
): Promise<Commit> {
  const defaultOpts = (await defaultChangelogOpts).parserOpts;
  const opts = {
    ...defaultOpts,
    ...(parserOpts || {}),
    fieldPattern: null,
  };
  const parsed = parser(message, opts) as Commit;
  parsed.raw = message;
  return parsed;
}

/**
 * 生成可能更新的版本类型
 * @param commits
 * @returns
 */
// https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-recommended-bump/index.js
export function whatBump(commits: Commit[]): {
  level: number;
  releaseType: string;
  reason: string;
} {
  const DEFAULT_LEVEL = 2;
  let level = DEFAULT_LEVEL;
  let breakings = 0;
  let features = 0;

  commits.forEach(commit => {
    if (commit.notes.length > 0) {
      breakings += commit.notes.length;
      level = 0;
    } else if (commit.type === 'feat') {
      features += 1;
      if (level === DEFAULT_LEVEL) {
        level = 1;
      }
    }
  });

  return {
    level,
    releaseType: VERSIONS[level],
    reason:
      breakings === 1
        ? `There is ${breakings} BREAKING CHANGE and ${features} features`
        : `There are ${breakings} BREAKING CHANGES and ${features} features`,
  };
}

export async function analysisCommitMsg(
  msg: string,
): Promise<{ type: string; content: string }> {
  const parsedCommit = await parseCommit(msg);
  const bumpInfo = whatBump([parsedCommit]);

  return { type: bumpInfo.releaseType, content: parsedCommit.subject };
}

/**
 * 生成 changes
 */
export async function generateAllChangesFile(
  comment: string,
  patchType: string,
): Promise<void> {
  const rushConfiguration: RushConfiguration = getRushConfiguration();
  const needUpdateProjects = await collectShouldUpdateChangesProjects();
  const { email } = await whoAmI();

  // 重新组织已有 change 文件和待新增的 change
  for (const project of needUpdateProjects) {
    const { packageName } = project;
    // TODO: ChangeFile 需要的 IChangeInfo 类型和当前规范存在属性差异，暂时先忽略 email
    const changeFile = new ChangeFile(
      { changes: [], packageName, email },
      rushConfiguration,
    );
    changeFile.addChange({ packageName, comment, type: patchType });
    changeFile.writeSync();

    const updateChangesPath = path.resolve(
      rushConfiguration.changesFolder,
      packageName,
    );
    await exec(`git add ${updateChangesPath}`);
    logger.success(`Success update ${packageName} changes file`);
  }
}
