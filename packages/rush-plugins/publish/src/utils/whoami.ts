import { exec } from './exec';

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
