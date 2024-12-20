import { type ReleaseManifest } from './types';

export enum ReleaseType {
  ALPHA = 'alpha',
  BETA = 'beta',
  LATEST = 'latest',
}

export const calReleaseType = (version: string) => {
  const tag = version.includes('alpha')
    ? ReleaseType.ALPHA
    : version.includes('beta')
      ? ReleaseType.BETA
      : ReleaseType.LATEST;
  return tag;
};

const calReleasePlan = (releaseManifests: ReleaseManifest[]) => {
  const plan = releaseManifests.map(r => calReleaseType(r.version));
  if (plan.some(p => p === ReleaseType.LATEST)) {
    return ReleaseType.LATEST;
  }
  if (plan.some(p => p === ReleaseType.BETA)) {
    return ReleaseType.BETA;
  }
  return ReleaseType.ALPHA;
};

export const checkReleasePlan = (
  releaseManifests: ReleaseManifest[],
  branchName: string,
) => {
  const releasePlan = calReleasePlan(releaseManifests);
  if (releasePlan === ReleaseType.LATEST && branchName !== 'main') {
    throw new Error('For LATEST release, should be on main branch only.');
  }
  return true;
};
