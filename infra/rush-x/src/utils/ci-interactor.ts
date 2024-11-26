import { promises as fs } from 'fs';

import * as core from '@actions/core';

const appendToStepSummary = async (content: string) => {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    throw new Error('GITHUB_STEP_SUMMARY 环境变量未定义');
  }

  await fs.appendFile(summaryPath, `${content}\n`);
};

export const setOutput = (key: string, value: string): void => {
  core.setOutput(key, value);
};

export const setEnv = (envName: string, envValue: string): void => {
  core.exportVariable(envName, envValue);
};

export const addReport = async (message: CIReportDefinition): Promise<void> => {
  const { output, conclusion } = message;

  await appendToStepSummary(output.summary);

  if (conclusion) {
    setOutput('conclusion', conclusion);
  }
};

export const addIssue = (issue: CIIssueDef): void => {
  const { rule, message, line, path: file, severity } = issue;

  const severityActionMap = {
    error: core.error,
    warning: core.warning,
    info: core.notice,
  } as const;

  const config = {
    file,
    startLine: line,
    endLine: line,
    title: rule,
  };

  severityActionMap[severity](message, config);
};

export const setFailed = (message: string): void => {
  core.setFailed(message);
};

export const error = (message: string): void => {
  core.error(message);
};

export const warning = (message: string): void => {
  core.warning(message);
};

export enum CIMessageLevel {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warning',
}

export enum CIReportConclusion {
  SUCCESS = 'success',
  WARNING = 'warning',
  FAILED = 'failed',
}

interface CIReportDefinition {
  name: string;
  details_url?: string;
  conclusion?: CIReportConclusion;
  output: {
    summary: string;
    description?: string;
  };
}

export interface CIIssueDef {
  // 规则名称，自定义
  rule: string;
  // issue的等级
  severity: 'info' | 'warning' | 'error';
  // issue 指定的文件，相对于仓库根目录的路径，如 main.go、handler/handle.go
  path?: string;
  // issue 出现的行
  line?: number;
  // issue 信息
  message: string;
}
