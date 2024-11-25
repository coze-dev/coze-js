import childProcess from 'child_process';

import { vi, type Mocked } from 'vitest';

import {
  isShallowRepository,
  fetchBranchByShallow,
  getBranchCommitSha,
  getCurrentBranchName,
  serializeFilesName,
  getChangedFilesFromCached,
  getCurrentCommitFiles,
  setRemoteBranch,
  rebase,
  resetChangedFiles,
  getCommitTime,
  getDirLatestCommitTime,
  getGitTagSha,
  checkTagExists,
  addGitTag,
} from '../git-command';

vi.mock('child_process');
const mockedChildProcess = childProcess as Mocked<typeof childProcess>;

describe('git-command', () => {
  beforeEach(() => {
    mockedChildProcess.spawnSync.mockReturnValue({ stdout: '' } as any);
  });

  test('isShallowRepository', () => {
    expect(isShallowRepository()).toEqual(false);
  });

  test('fetchBranchByShallow', () => {
    expect(fetchBranchByShallow('master')).toBeUndefined();
  });

  test('getBranchCommitSha', () => {
    expect(getBranchCommitSha('master')).toEqual('');
  });

  test('getCurrentBranchName', () => {
    expect(getCurrentBranchName()).toEqual('');
  });

  test('serializeFilesName', () => {
    const testFileStr = `packages/a/b
  infra/c/d
  node/a/b
  `;
    const result = serializeFilesName(testFileStr);
    expect(result).toEqual(['packages/a/b', 'infra/c/d', 'node/a/b']);
  });

  test('getChangedFilesFromCached', () => {
    const result = getChangedFilesFromCached();
    expect(result).toEqual([]);
  });

  test('getCurrentCommitFiles', () => {
    const result = getCurrentCommitFiles();
    expect(result).toEqual([]);
  });

  test('setRemoteBranch', () => {
    const result = setRemoteBranch('feat/test');
    expect(result).toBeUndefined();
  });

  test('rebase', () => {
    const result = rebase('feat/test');
    expect(result).toBeUndefined();
  });

  test('resetChangedFiles', () => {
    const result = resetChangedFiles();
    expect(result).toBeUndefined();
  });

  test('getCommitTime', () => {
    const result = getCommitTime('1234');
    expect(result).toEqual('');
  });

  test('getDirLatestCommitTime', () => {
    const result = getDirLatestCommitTime('/tmp/test');
    expect(result).toEqual('');
  });

  test('getGitTagSha', () => {
    const result = getGitTagSha('package1');
    expect(result).toEqual('');
  });

  test('getGitTagSha empty', () => {
    mockedChildProcess.spawnSync.mockReturnValue({
      stdout: '',
      status: 2,
    } as any);

    const result = getGitTagSha('package1');
    expect(result).toEqual('');
  });

  test('getGitTagSha', () => {
    const result = checkTagExists('package1@1.1.0');
    expect(result).toEqual(false);
  });

  test('getGitTagSha', () => {
    const result = addGitTag('package1@1.1.0');
    expect(result).toBeUndefined();
  });
});
