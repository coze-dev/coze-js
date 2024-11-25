// References: https://bytedance.feishu.cn/wiki/wikcnf0gD0OiSOh0qPykmz6iTpb
import path from 'path';
import os from 'os';
import fs from 'fs/promises';

import { isCI } from './env';

export enum CIMessageLevel {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warning',
}

/**
 * @description 一个 step 最多 256 个 (key, value)
 * @param key key 最长 64 个字节
 * @param value 最长：平均 141 个字节（个别 value 可以超过 141）
 */
export const setOutput = (key: string, value: string): void => {
  console.log(`::set-output name=${key}::${value}`);
};

// 输出信息到用户
export const addMessage = (level: CIMessageLevel, message: string): void => {
  console.log(`::add-message level=${level}::${message}`);
};

// 设置环境变量到后面的 step 中（当前 step 不会生效，使用 export 指定）
export const setEnv = (envName: string, envValue: string): void => {
  console.log(`::set-env name=${envName}::${envValue}`);
};

// success，neutral,warning 被认为是成功状态，其他状态可能会阻塞合入
export enum CIReportConclusion {
  SUCCESS = 'success',
  NEUTRAL = 'neutral',
  WARNING = 'warning',
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  // 这不是 typo，文档就这么写的
  CANCELED = 'canceld',
  TIMED_OUT = 'timed_out',
  FAILED = 'failed',
  ACTION_REQUIRED = 'action_required',
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

// 这个元语提供一个接口，让 CI 创建一个挂件（挂件就是 MR 里面可以展开的一个一个小卡片）。action 可以在挂件里面展示复杂的内容，挂件本身支持展示 HTML，Markdown（不支持 JavaScript)。
export const addReport = async (message: CIReportDefinition): Promise<void> => {
  const conclusion = message.conclusion || CIReportConclusion.NEUTRAL;
  const formattedMsg = { ...message, conclusion };
  const tmpReportFile = path.resolve(
    os.tmpdir(),
    `ci-${formattedMsg.name.replace(/[\s/]/g, '_')}-${Date.now()}.${
      isCI() ? 'json' : 'md'
    }`,
  );
  await fs.writeFile(
    tmpReportFile,
    // 出于调试方便，本地环境直接输出 md 内容
    isCI()
      ? JSON.stringify(formattedMsg, null, '  ')
      : formattedMsg.output.summary,
    'utf-8',
  );
  console.log(`::update-check-run ::${tmpReportFile}`);
};

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
export const addIssue = (issue: CIIssueDef): void => {
  const { rule, message, line, path: file, severity } = issue;
  const msg = `::add-issue path=${file},line=${line},severity=${severity},rule=${rule}::${message}`;
  console.log(msg);
};
