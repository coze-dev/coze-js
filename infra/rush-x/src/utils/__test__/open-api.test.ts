import { beforeEach, describe, expect, test, type Mocked } from 'vitest';
import axios from 'axios';

import { GitlabOpenAPI } from '../open-api';

const mockedAxios = axios as Mocked<typeof axios>;
let gitlab: GitlabOpenAPI;

describe('gitlab open-api', () => {
  beforeEach(() => {
    gitlab = new GitlabOpenAPI({
      repoName: 'obric/bot-studio-monorepo',
      token: 'test',
      defaultBranch: 'master',
    });
  });

  describe('default branch', () => {
    test('get default branch', () => {
      const customGitlab = new GitlabOpenAPI({
        repoName: 'obric/bot-studio-monorepo',
        token: 'test',
      });
      expect(customGitlab.defaultBranch).toEqual('master');
    });
  });

  describe('create branch', () => {
    test('create new branch success', async () => {
      await gitlab.createBranch('pkg_release/11');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/projects/obric%2Fbot-studio-monorepo/repository/branches',
        {
          branch: 'pkg_release/11',
          id: 'obric%2Fbot-studio-monorepo',
          ref: 'master',
        },
      );

      await gitlab.createBranch();
      expect(mockedAxios.post).toBeCalled();
    });

    test('create exits branch success', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });
      await gitlab.createBranch('pkg_release/11');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/projects/obric%2Fbot-studio-monorepo/repository/branches',
        {
          branch: 'pkg_release/11',
          id: 'obric%2Fbot-studio-monorepo',
          ref: 'master',
        },
      );
    });

    test('create branch error', async () => {
      mockedAxios.post.mockRejectedValueOnce('error');

      try {
        await gitlab.createBranch('pkg_release/11');
      } catch (e) {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          '/projects/obric%2Fbot-studio-monorepo/repository/branches',
          {
            branch: 'pkg_release/11',
            id: 'obric%2Fbot-studio-monorepo',
            ref: 'master',
          },
        );
        expect(e).toEqual('error');
      }
    });
  });

  describe('create mr', () => {
    test('create mr success', async () => {
      const webUrl = 'https://xx.com';
      mockedAxios.post.mockResolvedValue({
        data: { web_url: webUrl },
      });

      const res = await gitlab.createMergeRequest({
        title: 'mr',
        sourceBranch: 'pkg_release/11',
        removeSourceBranch: true,
        description: 'cc',
        labels: '',
      });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/projects/obric%2Fbot-studio-monorepo/merge_requests',
        {
          source_branch: 'pkg_release/11',
          target_branch: 'master',
          title: 'mr',
          description: 'cc',
          remove_source_branch: true,
          id: 'obric%2Fbot-studio-monorepo',
          labels: '',
          squash: true,
        },
      );
      expect(res).toEqual(webUrl);
    });

    test('create mr error', async () => {
      mockedAxios.post.mockRejectedValueOnce('error');

      try {
        await gitlab.createMergeRequest({
          title: 'mr',
          sourceBranch: 'pkg_release/11',
          removeSourceBranch: true,
          description: 'cc',
          labels: '',
        });
      } catch (e) {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          '/projects/obric%2Fbot-studio-monorepo/merge_requests',
          {
            source_branch: 'pkg_release/11',
            target_branch: 'master',
            title: 'mr',
            description: 'cc',
            remove_source_branch: true,
            id: 'obric%2Fbot-studio-monorepo',
            labels: '',
            squash: true,
          },
        );
        expect(e).toEqual('error');
      }
    });
  });

  describe('updateMRState', () => {
    it('update close state', async () => {
      mockedAxios.put.mockResolvedValueOnce({
        data: {
          id: '1234',
        },
      });
      const id = await gitlab.updateMRState(
        'obric/bot-studio-monorepo',
        'close',
      );

      expect(id).toEqual('1234');
    });

    it('default state should be close', async () => {
      mockedAxios.put.mockResolvedValueOnce({
        data: {
          id: '1234',
        },
      });
      const id = await gitlab.updateMRState('obric/bot-studio-monorepo');

      expect(id).toEqual('1234');
    });
  });
});
