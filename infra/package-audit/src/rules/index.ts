import { checkRushProjectFile } from './rush-project';
import { checkReviewerCount } from './owner';
import { checkEssentialConfigFiles } from './essential-configs';

export const presetRules = [
  checkRushProjectFile,
  checkReviewerCount,
  checkEssentialConfigFiles,
];
