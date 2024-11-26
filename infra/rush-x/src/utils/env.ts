import os from 'os';

import { exec } from './exec';

export const isCI = (): boolean => !!process.env.CI;

export const setOutputAvailable = process.env.CI || process.env.BUILD_VERSION;

export const getCPUSize = (): number => {
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
