import { type Mock } from 'vitest';
import { isFileExists, readYamlFile } from '@coze-infra/fs-enhance';

import { checkReviewerCount } from '../../src/rules/owner';

vi.mock('@coze-infra/fs-enhance');

const mockProject = {
  projectFolder: '/path/to/project',
};

describe('checkReviewerCount', () => {
  it('Should report empty if file not exits', async () => {
    (isFileExists as Mock).mockResolvedValue(false);
    const res = await checkReviewerCount.fn(mockProject);
    expect(res.length).equal(0);
  });

  it('Should report errors if mis-match requirements', async () => {
    (isFileExists as Mock).mockResolvedValue(true);
    (readYamlFile as Mock).mockResolvedValue({});
    const res = await checkReviewerCount.fn(mockProject);
    expect(res.length).equal(1);
  });

  it('Should read pattern deeply', async () => {
    (isFileExists as Mock).mockResolvedValue(true);
    (readYamlFile as Mock).mockResolvedValue({
      reviewers: ['a', 'b'],
      patterns: { 'pattern-a': { reviewers: ['a'], approvals_required: 1 } },
    });
    const res = await checkReviewerCount.fn(mockProject, {
      requireReviewers: 3,
    });
    expect(res.length).equal(0);
  });

  it('Should report error if parse failure', async () => {
    (isFileExists as Mock).mockResolvedValue(true);
    (readYamlFile as Mock).mockRejectedValue(new Error('parse failure'));
    const res = await checkReviewerCount.fn(mockProject);
    expect(res.length).equal(1);
  });

  it('Should use config', async () => {
    (isFileExists as Mock).mockResolvedValue(true);
    (readYamlFile as Mock).mockResolvedValue({
      reviewers: ['a', 'b'],
    });
    const res = await checkReviewerCount.fn(mockProject, {
      requireReviewers: 3,
    });
    expect(res.length).equal(1);
  });
});
