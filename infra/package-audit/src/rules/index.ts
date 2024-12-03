import { checkRushProjectFile } from './rush-project';
// import { checkReviewerCount } from './owner';
import { checkEssentialConfigFiles } from './essential-configs';

export const presetRules = [
  checkRushProjectFile,
  // TODO: modify the rule to adjust github code owner
  // checkReviewerCount,
  checkEssentialConfigFiles,
];
