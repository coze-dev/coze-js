import { Worker } from 'worker_threads';

import { isFileExists } from '@coze-infra/fs-enhance';

import { getCPUSize } from './env';

const CPU_SIZE = Math.max(getCPUSize() - 1, 1);

enum WorkerState {
  RUNNING = 'running',
  IDLE = 'idle',
}
interface LocalWorker {
  exec: (params: unknown) => Promise<unknown>;
  state: WorkerState;
  close: () => void;
}

const createLocalWorker = (workerPath: string) => {
  let worker: Worker = null;
  const execJob = (params: unknown) => {
    // 延迟初始化
    if (!worker) {
      worker = new Worker(workerPath, {});
    }
    return new Promise((r, j) => {
      worker.removeAllListeners();
      worker.postMessage(params);
      worker.on('message', (res: Record<string, unknown>) => {
        if (res.type === 'finish') {
          r(res.payload);
        } else if (res.type === 'error') {
          j(res.payload);
        }
      });
      worker.on('error', (err: Error) => j(err));
      worker.on('exit', (code: number) => {
        if (code !== 0) {
          j(new Error(`Worker stopped with exit code ${code}.`));
        }
      });
    });
  };
  const close = () => {
    if (worker) {
      worker.removeAllListeners();
      worker = null;
      // parentPort.postMessage('closed');
    }
  };

  let working = false;
  const exec = async (params: unknown) => {
    if (working) {
      throw new Error(
        'This worker is executing async jobs, it means there should be some parallel invoke in this pool.',
      );
    }
    working = true;
    try {
      const res = await execJob(params);
      return res;
    } finally {
      working = false;
    }
  };
  return new Proxy(Object.create(null), {
    get(target, prop: string) {
      switch (prop) {
        case 'exec':
          return exec;
        case 'state':
          return working ? WorkerState.RUNNING : WorkerState.IDLE;
        case 'close':
          return close;
        default:
          return Reflect.get(target, prop);
      }
    },
  }) as LocalWorker;
};

export class WorkerPool {
  #workers: LocalWorker[] = [];
  // 等待执行的异步任务
  #tasks: ((worker: LocalWorker) => Promise<unknown>)[] = [];

  constructor(workerFile: string, size: number) {
    const workers = new Array(size)
      .fill(0)
      .map(() => createLocalWorker(workerFile));
    this.#workers = workers;
  }

  static async createPool(
    workerFile: string,
    size: number = CPU_SIZE,
  ): Promise<WorkerPool> {
    if ((await isFileExists(workerFile)) === false) {
      throw new Error(`${workerFile} is not exists, please confirm it.`);
    }

    const instance = new WorkerPool(workerFile, size);
    return instance;
  }

  #moveForward() {
    const jobs = this.#tasks;
    const idleWorkers = this.#workers.filter(r => r.state === WorkerState.IDLE);
    while (jobs.length > 0 && idleWorkers.length > 0) {
      const job = jobs.shift();
      const worker = idleWorkers.shift();
      job(worker).finally(() => {
        this.#moveForward();
      });
    }
  }

  runJobs(jobParams: unknown[]): Promise<unknown[]> {
    const result = new Array(jobParams.length).fill(null);
    return new Promise(resolve => {
      const jobs = jobParams.map(
        (param, index) => async (worker: LocalWorker) => {
          try {
            const res = await worker.exec(param);
            result[index] = res;
          } catch (e) {
            result[index] = e;
          }
          if (result.every(r => !!r)) {
            resolve(result);
          }
        },
      );
      this.#tasks.push(...jobs);

      this.#moveForward();
    });
  }

  async run(jobParam: unknown): Promise<unknown> {
    const [result] = await this.runJobs([jobParam]);
    return result;
  }

  stop(): void {
    this.#workers.forEach(r => r.close());
  }
}
