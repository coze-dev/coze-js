import path from 'path';
import fs from 'fs/promises';

import {
  readJsonFile,
  writeJsonFile,
  isFileExists,
  isDirExists,
} from '@coze-infra/fs-enhance';

import { getRushConfiguration } from '../../utils/project-analyzer';
import {
  generateChangelog as core,
  type ChangeFile,
  type ChangeLog,
} from '../../generate-changelog/generate-changelog';
import { type PublishManifest, type ApplyPublishManifest } from './types';

const deleteFiles = async (files: string[]): Promise<void> => {
  await Promise.all(
    files.map(async file => {
      await fs.unlink(file);
    }),
  );
};

const readChangeFiles = async (changedFolderOfPkg: string) => {
  if (!(await isDirExists(changedFolderOfPkg))) {
    return [];
  }
  const changeFiles = (await fs.readdir(changedFolderOfPkg)).filter(r =>
    r.endsWith('.json'),
  );
  return changeFiles.map(r => path.resolve(changedFolderOfPkg, r));
};

const readChanges = async (changeFiles: string[]) => {
  const changes = (
    await Promise.all(
      changeFiles.map(r => {
        try {
          return readJsonFile<ChangeFile>(r);
        } catch (e) {
          return null;
        }
      }),
    )
  ).filter(r => r !== null);
  return changes;
};

const readPreviousChangelog = async (
  changelogJsonPath: string,
  packageName: string,
) => {
  if (!(await isFileExists(changelogJsonPath))) {
    return { name: packageName, entries: [] as ChangeLog['entries'] };
  }
  const changelog = await readJsonFile<ChangeLog>(changelogJsonPath);
  return changelog;
};

const generateChangelogForProject = async (manifest: PublishManifest) => {
  const { project, newVersion } = manifest;
  const rushConfiguration = getRushConfiguration();
  const { changesFolder } = rushConfiguration;
  const changedFolderOfPkg = path.resolve(changesFolder, project.packageName);
  const changelogJsonPath = path.resolve(
    project.projectFolder,
    'CHANGELOG.json',
  );
  const changelogMarkdownPath = path.resolve(
    project.projectFolder,
    'CHANGELOG.md',
  );

  const changeFiles = await readChangeFiles(changedFolderOfPkg);
  const changes = await readChanges(changeFiles);

  const previousChangelog = await readPreviousChangelog(
    changelogJsonPath,
    project.packageName,
  );
  const { changelog, report: changelogMarkdown } = await core({
    packageName: project.packageName,
    version: newVersion,
    commingChanges: changes,
    previousChangelog,
  });

  // side effects
  await writeJsonFile(changelogJsonPath, changelog);
  await fs.writeFile(changelogMarkdownPath, changelogMarkdown);
  await deleteFiles(changeFiles);
  return [changelogJsonPath, changelogMarkdownPath, ...changeFiles];
};

export const generateChangelog: ApplyPublishManifest = async (
  manifests: PublishManifest[],
) => {
  const modifiedFiles = await Promise.all(
    manifests.map(manifest => generateChangelogForProject(manifest)),
  );
  return modifiedFiles.flat();
};
