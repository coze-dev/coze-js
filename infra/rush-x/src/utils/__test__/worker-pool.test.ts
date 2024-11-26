import { Worker } from 'worker_threads';

import { isFileExists } from '@coze-infra/fs-enhance';

import { WorkerPool } from '../worker-pool';

vi.mock('worker_threads');
vi.mock('@coze-infra/fs-enhance');
vi.mock('../env', () => ({
  getCPUSize: vi.fn().mockReturnValue(2),
}));

describe('WorkerPool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (Worker as unknown as vi.Mock).mockImplementation(() => ({
      postMessage: vi.fn(),
      on: vi.fn(),
      removeAllListeners: vi.fn(),
      terminate: vi.fn(),
    }));
    (isFileExists as vi.Mock).mockResolvedValue(true);
  });

  describe('createPool', () => {
    it('should create a worker pool successfully', async () => {
      const pool = await WorkerPool.createPool('test-worker.js', 2);
      expect(pool).toBeInstanceOf(WorkerPool);
    });

    it('should throw error if worker file does not exist', async () => {
      (isFileExists as vi.Mock).mockResolvedValue(false);
      await expect(WorkerPool.createPool('not-exist.js')).rejects.toThrow(
        'not-exist.js is not exists, please confirm it.',
      );
    });

    it('should use CPU_SIZE if size not specified', async () => {
      const pool = await WorkerPool.createPool('test-worker.js');
      expect(pool).toBeInstanceOf(WorkerPool);
    });
  });

  describe('run', () => {
    it('should execute single task successfully', async () => {
      const mockResult = { type: 'finish', payload: 'test result' };
      (Worker as unknown as vi.Mock).mockImplementation(() => ({
        postMessage: vi.fn(),
        on: vi.fn((event, cb) => {
          if (event === 'message') {
            setTimeout(() => cb(mockResult), 0);
          }
        }),
        removeAllListeners: vi.fn(),
        terminate: vi.fn(),
      }));

      const pool = await WorkerPool.createPool('test-worker.js', 1);
      const result = await pool.run({ test: 'data' });
      expect(result).toBe('test result');
    });

    it('should handle worker errors', async () => {
      const mockError = new Error('worker error');
      (Worker as unknown as vi.Mock).mockImplementation(() => ({
        postMessage: vi.fn(),
        on: vi.fn((event, cb) => {
          if (event === 'error') {
            setTimeout(() => cb(mockError), 0);
          }
        }),
        removeAllListeners: vi.fn(),
        terminate: vi.fn(),
      }));

      const pool = await WorkerPool.createPool('test-worker.js', 1);
      const result = await pool.run({ test: 'data' });
      expect(result).toEqual(mockError);
    });
  });

  describe('runJobs', () => {
    it('should execute multiple tasks in parallel', async () => {
      const mockResults = [
        { type: 'finish', payload: 'result 1' },
        { type: 'finish', payload: 'result 2' },
      ];
      let currentJob = 0;

      (Worker as unknown as vi.Mock).mockImplementation(() => ({
        postMessage: vi.fn(),
        on: vi.fn((event, cb) => {
          if (event === 'message') {
            setTimeout(() => cb(mockResults[currentJob++]), 0);
          }
        }),
        removeAllListeners: vi.fn(),
        terminate: vi.fn(),
      }));

      const pool = await WorkerPool.createPool('test-worker.js', 2);
      const results = await pool.runJobs([{ id: 1 }, { id: 2 }]);
      expect(results).toEqual(['result 1', 'result 2']);
    });

    it('should handle partial task failures correctly', async () => {
      const mockError = new Error('job 2 failed');
      const mockResults = [
        { type: 'finish', payload: 'result 1' },
        { type: 'error', payload: mockError },
      ];
      let currentJob = 0;

      (Worker as unknown as vi.Mock).mockImplementation(() => ({
        postMessage: vi.fn(),
        on: vi.fn((event, cb) => {
          if (event === 'message') {
            setTimeout(() => cb(mockResults[currentJob++]), 0);
          }
        }),
        removeAllListeners: vi.fn(),
        terminate: vi.fn(),
      }));

      const pool = await WorkerPool.createPool('test-worker.js', 2);
      const results = await pool.runJobs([{ id: 1 }, { id: 2 }]);
      expect(results[0]).toBe('result 1');
      expect(results[1]).toEqual(mockError);
    });
  });

  describe('stop', () => {
    it('should terminate all workers correctly', async () => {
      const pool = await WorkerPool.createPool('test-worker.js', 2);
      pool.stop();

      const mockWorker = Worker as unknown as vi.Mock;
      const workerInstances = mockWorker.mock.results;
      workerInstances.forEach(instance => {
        expect(instance.value.terminate).toHaveBeenCalled();
        expect(instance.value.removeAllListeners).toHaveBeenCalled();
      });
    });
  });
});
