import path from 'path';

import { exec as _exec } from 'shelljs';
import lodash from 'lodash';
import { logger as log } from '@coze-infra/rush-logger';

import { getRushConfiguration } from '../../../utils/project-analyzer';
import { getCPUSize } from '../../../utils/env';
import { report } from './report';

// 限制单次执行分析的文件数，防止单次命令行超过 terminal 限制导致命令失败
const LINT_BATCH_SIZE = 30;

// 并行执行的 eslint 实例数
const PARALLEL_SIZE = Math.max(getCPUSize() - 1, 1);

const isNeedLint = (file: string) =>
  file?.length > 0 && /\.(js|ts|jsx|tsx|json|cjs|mjs)$/.test(file);

const DISABLED_RULES: string[] = [];

const DISABLED_PACKAGES = ['@coze-infra/eslint-config'];

interface ExecResult {
  code: number;
  stdout: string;
  stderr: string;
}
const exec = (cmd: string, { cwd }: { cwd: string }): Promise<ExecResult> =>
  new Promise((r, j) => {
    _exec(
      cmd,
      {
        cwd,
        fatal: false,
      },
      (code, stdout, stderr) => {
        r({ code, stdout, stderr });
      },
    );
  });

const splitBatchJobs = (
  changedFiles: Record<string, string[]>,
  batchSize = LINT_BATCH_SIZE,
) => {
  const packages = Object.keys(changedFiles);
  return packages.reduce((acc: [string, string[]][], packageName: string) => {
    const files = changedFiles[packageName].filter(r => isNeedLint(r));
    while (files.length > 0) {
      acc.push([packageName, files.splice(0, batchSize)]);
    }
    return acc;
  }, []);
};

const batchRun = <T>(
  jobs: (() => Promise<T>)[],
  parallelSize: number,
): Promise<T[]> => {
  const emptyFlag = Symbol('empty flag');
  let cursor = 0;
  let runningJobSize = 0;
  const jobSize = jobs.length;
  return new Promise(resolve => {
    const result: T[] = new Array(jobs.length).fill(emptyFlag);
    const moveForward = () => {
      if (result.filter(r => r !== emptyFlag).length === jobSize) {
        resolve(result);
        return;
      }
      while (jobs.length > 0 && runningJobSize < parallelSize) {
        const job = jobs.shift();

        (async index => {
          runningJobSize += 1;
          try {
            const res = await job();
            result[index] = res;
          } catch (e) {
            result[index] = e as T;
          } finally {
            runningJobSize -= 1;
            moveForward();
          }
        })(cursor);
        cursor += 1;
      }
    };
    moveForward();
  });
};

// lint 比较特殊，需要按文件粒度跑
// @params batchSize: 单次执行 lint 的文件数
export const runLint = async (
  changedFileGroup: Record<string, string[]>,
): Promise<void> => {
  const rushConfiguration = getRushConfiguration();
  const root = rushConfiguration.rushJsonFolder;

  const runLintInProject = async (
    packageName: string,
    changedFiles: string[],
  ): Promise<ExecResult> => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { projectFolder } = rushConfiguration.getProjectByName(packageName)!;
    const files = changedFiles.map(file =>
      path.relative(projectFolder, path.resolve(root, file)),
    );

    const command = `eslint --quiet ${files.join(
      ' ',
    )} --no-error-on-unmatched-pattern ${DISABLED_RULES.map(
      r => `--rule '${r}: 0'`,
    )}`;
    log.info(`cd ${projectFolder}`);
    log.info(command);

    const res = await exec(`npx ${command}`, {
      cwd: projectFolder,
    });
    return res;
  };
  const batchJobs = splitBatchJobs(changedFileGroup);
  log.info(`batchJobs:${JSON.stringify(batchJobs)}`);
  const batchResult = await batchRun<{
    packageName: string;
    diagnostics: string;
    code: number;
  }>(
    batchJobs
      .filter(([packageName]) => !DISABLED_PACKAGES.includes(packageName))
      .map(([packageName, batchFiles]) => async () => {
        log.debug(`Run Lint in ${packageName}`);
        const res = await runLintInProject(packageName, batchFiles);
        return {
          packageName,
          diagnostics: res.stdout || res.stderr,
          code: res.code,
        };
      }),
    PARALLEL_SIZE,
  );

  // combined results
  const result = lodash(batchResult)
    .groupBy(r => r.packageName)
    .mapValues(values => ({
      packageName: values[0].packageName,
      diagnostics: values.map(r => r.diagnostics).join(''),
      hasError: values.some(r => r.code !== 0),
    }))
    .values()
    .value();

  await report(result);
};
