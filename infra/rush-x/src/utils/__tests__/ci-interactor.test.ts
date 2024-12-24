import * as core from '@actions/core';

import { isCI } from '../env';
import { addIssue, addReport, CIReportConclusion } from '../ci-interactor';

vi.mock('../env', () => ({
  isCI: vi.fn(),
}));

vi.mock('@actions/core');

describe('ci-interactor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('addIssue', () => {
    it('should add issue in CI environment', () => {
      (isCI as vi.Mock).mockReturnValue(true);
      vi.stubEnv('GITHUB_STEP_SUMMARY', '/tmp/github_step_summary');

      const errorSpy = vi.spyOn(core, 'error');

      addIssue({
        path: 'test/file.ts',
        line: 1,
        message: 'test message',
        rule: 'test-rule',
        severity: 'error',
      });

      expect(process.env.GITHUB_STEP_SUMMARY).toBeDefined();
      expect(errorSpy).toHaveBeenCalledWith('test message', {
        endLine: 1,
        file: 'test/file.ts',
        startLine: 1,
        title: 'test-rule',
      });
    });
  });

  describe('addReport', () => {
    it('should add report in CI environment', () => {
      (isCI as vi.Mock).mockReturnValue(true);
      vi.stubEnv('GITHUB_STEP_SUMMARY', '/tmp/github_step_summary');

      addReport({
        name: 'Test Report',
        conclusion: CIReportConclusion.SUCCESS,
        output: {
          title: 'Test Title',
          summary: 'Test Summary',
        },
      });

      expect(process.env.GITHUB_STEP_SUMMARY).toBeDefined();
    });

    it('should handle different report conclusions', () => {
      (isCI as vi.Mock).mockReturnValue(true);
      vi.stubEnv('GITHUB_STEP_SUMMARY', '/tmp/github_step_summary');

      // 测试成功状态
      addReport({
        name: 'Success Report',
        conclusion: CIReportConclusion.SUCCESS,
        output: {
          summary: 'Success Summary',
        },
      });

      // 测试失败状态
      addReport({
        name: 'Failed Report',
        conclusion: CIReportConclusion.FAILED,
        output: {
          summary: 'Failed Summary',
        },
      });

      // 测试中立状态
      addReport({
        name: 'Neutral Report',
        conclusion: CIReportConclusion.NEUTRAL,
        output: {
          summary: 'Neutral Summary',
        },
      });

      expect(process.env.GITHUB_STEP_SUMMARY).toBeDefined();
    });
  });
});
