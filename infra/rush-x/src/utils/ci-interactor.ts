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
  const { output, conclusion, name } = message;

  if (conclusion) {
    setOutput('conclusion', conclusion);
  }

  // TODO: ignore warning for now
  if (conclusion === CIReportConclusion.FAILED) {
    await appendToStepSummary(output.summary);
    setEnv('REPORT_RESULT', 'failed');
    core.setFailed(`${name} FAILED`);
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
  rule: string;
  severity: 'info' | 'warning' | 'error';
  // file path relative to repo root.
  path?: string;
  line?: number;
  message: string;
}
