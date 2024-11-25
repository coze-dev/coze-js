import { exec as _exec, type ExecOptions } from 'shelljs';

export interface ExecResult {
  code: number;
  stdout: string;
  stderr: string;
}

class ExecError extends Error {
  code: number;
  stderr: string;
  stdout: string;
  constructor(result: ExecResult) {
    super(result.stderr || result.stdout);
    this.code = result.code;
    this.stderr = result.stderr;
    this.stdout = result.stdout;
  }
}

export const exec = (cmd: string, options?: ExecOptions): Promise<ExecResult> =>
  new Promise((r, j) => {
    _exec(cmd, options, (code, stdout, stderr) => {
      if (code === 0) {
        r({ code, stdout, stderr });
      } else {
        j(new ExecError({ code, stderr, stdout }));
      }
    });
  });
