import { describe, type Mocked } from 'vitest';
import axios from 'axios';

import { CodeBaseOpenAPI } from '../codebase-api';

const mockedAxios = axios as Mocked<typeof axios>;

describe('codebase api', () => {
  test('getBranchDiffFiles', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { files: [] },
    });
    const codebase = new CodeBaseOpenAPI({
      token: 'token',
      repoName: 'apaas/monorepo',
    });
    const res = await codebase.getBranchDiffFiles({
      fromSha: '123',
      toSha: '456',
    });
    expect(res).toEqual([]);
  });

  test('getBranchDiffFiles Error', async () => {
    mockedAxios.get.mockResolvedValueOnce({});
    const codebase = new CodeBaseOpenAPI({
      token: 'token',
      repoName: 'apaas/monorepo',
    });
    const res = await codebase.getBranchDiffFiles({
      fromSha: '123',
      toSha: '456',
    });
    expect(res).toEqual([]);
  });

  test('patchProtectRules', async () => {
    mockedAxios.patch.mockResolvedValueOnce({ data: {} });
    const codebase = new CodeBaseOpenAPI({
      token: 'token',
      repoName: 'apaas/monorepo',
    });
    const res = await codebase.patchProtectRules({
      rule_id: 1234,
      push_access_level: 'master',
      merge_access_level: 'master',
    });
    expect(res).toBeTruthy();
  });

  test('getProtectRules', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    const codebase = new CodeBaseOpenAPI({
      token: 'token',
      repoName: 'apaas/monorepo',
    });
    const res = await codebase.getProtectRules();
    expect(res).toBeTruthy();
  });
});
