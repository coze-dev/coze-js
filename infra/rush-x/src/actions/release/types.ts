import { type RushConfigurationProject } from '@rushstack/rush-sdk';

export interface ReleaseOptions {
  commit: string;
  dryRun?: boolean;
  registry?: string;
}

export interface PackageToPublish {
  packageName: string;
  version: string;
}

export interface ReleaseManifest {
  project: RushConfigurationProject;
  version: string;
}
