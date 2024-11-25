import os from 'os';

import { exec } from './exec';

export const isCI = (): boolean => !!process.env.CI;
// 是否在 CI 或者 SCM 内
export const setOutputAvailable = process.env.CI || process.env.BUILD_VERSION;

// 获取 CPU 核数
// 考虑到 docker 内 os.cpus 获取到的是物理机的核数，直接调用 os.cpus 可能跟 docker 环境对不上
// 因此根据是否在 CI 内做个简单区分
export const getCPUSize = (): number => {
  // 下面的 32 根据 .codebase/pipelines/ci.yaml 文件  jobs.run_all.runs-on.spec 字段值 m1.8xlarge 推算而来
  // reference: https://bytedance.feishu.cn/wiki/wikcnrU4rRBZ3WMYNVxwdCp4Mhd
  const PRESET_CI_POD_OS_CORE = 32;
  const osCpuSize = os.cpus().length;
  return isCI() ? Math.min(osCpuSize, PRESET_CI_POD_OS_CORE) : osCpuSize;
};

export const whoAmI = async (): Promise<{ name: string; email: string }> => {
  const [name, email] = await Promise.all([
    exec('git config user.name', { cwd: __dirname, silent: true }),
    exec('git config user.email', { cwd: __dirname, silent: true }),
  ]);
  return {
    name: name.stdout.toString().replace('\n', ''),
    email: email.stdout.toString().replace('\n', ''),
  };
};
