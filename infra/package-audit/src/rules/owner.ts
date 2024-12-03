import path from 'path';

import { isFileExists, readYamlFile } from '@coze-infra/fs-enhance';

import { type AuditDetectResult, type AuditRule } from '../types';

interface ReviewerDeclaration {
  reviewers?: string[];
  approvals_required?: number;
}
type CodeOwnerDeclaration = ReviewerDeclaration & {
  patterns?: Record<string, ReviewerDeclaration>;
};

const DEFAULT_MIN_REVIEWER_COUNT = 2;
const DEFAULT_MIN_APPROVALS_REQUIRED = 1;

const deepCalCount = (dec: CodeOwnerDeclaration) =>
  [dec, ...Object.values(dec.patterns || {})].reduce(
    (
      acc: { reviewers: number; approvalsRequired: number },
      reviewerDec: ReviewerDeclaration,
    ) => {
      acc.reviewers += reviewerDec?.reviewers?.length || 0;
      acc.approvalsRequired = Math.max(
        acc.approvalsRequired,
        Number.isNaN(Number(reviewerDec?.approvals_required))
          ? 1
          : Number(reviewerDec?.approvals_required),
      );
      return acc;
    },
    {
      reviewers: 0,
      approvalsRequired: 0,
    },
  );

export const checkReviewerCount: AuditRule<{
  requireReviewers: number;
  requireApprovals: number;
}> = {
  name: 'owners',
  async fn(project, config?) {
    const { projectFolder } = project;
    const res: AuditDetectResult[] = [];
    const ownerFilePath = path.resolve(projectFolder, 'OWNERS');
    const {
      requireReviewers = DEFAULT_MIN_REVIEWER_COUNT,
      requireApprovals = DEFAULT_MIN_APPROVALS_REQUIRED,
    } = config || {};
    // The detection of the presence of the owners file is already implemented in `essential-configs`, so it is not repeated here.
    if (!(await isFileExists(ownerFilePath))) {
      return res;
    }

    try {
      const ownersContent =
        await readYamlFile<CodeOwnerDeclaration>(ownerFilePath);
      const stats = deepCalCount(ownersContent);
      if (
        stats.reviewers < requireReviewers ||
        stats.approvalsRequired < requireApprovals
      ) {
        res.push({
          content: `"OWNERS" should at least has ${requireReviewers} reviewers and ${requireApprovals} approvals_required`,
        });
      }
    } catch (err) {
      res.push({
        content: `Parse failure: \n${err}\nPlease check it manually`,
      });
    }

    return res;
  },
};
