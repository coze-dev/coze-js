import { z } from 'zod';
// eslint-disable-next-line @typescript-eslint/naming-convention
import _ from 'lodash';
import axios, { AxiosError } from 'axios';

import { logger } from '../utils/logger';
import { type McpTool, type NpmInfo } from '../types';

const schema = z.object({
  packageNames: z.array(z.string()).min(1),
  registry: z.string().url().default('https://registry.npmjs.org'),
});

const fetchPackage = async (
  packageName: string,
  registry: string,
): Promise<NpmInfo> => {
  try {
    const response = await axios.get<NpmInfo>(`${registry}/${packageName}`);

    return response.data as NpmInfo;
  } catch (error) {
    logger.error(
      `[npm] Failed to fetch package ${packageName}: ${(error as Error).message}`,
    );
    throw error;
  }
};

const simply = (result: NpmInfo) => {
  const simplyVersion = versionDescription =>
    _.pick(versionDescription, [
      'name',
      'version',
      'description',
      'author',
      'bugs',
    ]);
  const distTags = result['dist-tags'];
  const tags = Object.keys(distTags);
  // version 内容过多了，需要简化一下
  const tagVersions = Object.keys(result.versions)
    .filter(v => tags.includes(v))
    .reduce(
      (acc, v) => ({
        ...acc,
        [v]: simplyVersion(result.versions[v]),
      }),
      {},
    );

  return {
    ..._.pick(result, [
      'name',
      'description',
      'author',
      'bugs',
      'license',
      'homepage',
      'keywords',
      'repository',
      'contributors',
      'maintainers',
      'distTags',
    ]),
    versions: tagVersions,
    latest: simplyVersion(result.versions[distTags.latest || distTags[0]]),
    distTags,
  };
};

type PackageResult = ReturnType<typeof simply>;

const format = (result: unknown) => JSON.stringify(result);

export const fetchNpmPackages: McpTool = {
  name: 'fetchNpmPackages',
  description:
    'Fetch multiple npm packages information. Use this tool when you need detailed metadata about specific npm packages, such as version history, dependencies, maintainers, and other package.json information. This is ideal for comparing package details, checking package compatibility, verifying package authenticity, or gathering comprehensive information about packages before installing them. You can specify a custom registry if needed.',
  schema,
  execute: async ({ packageNames, registry }) => {
    logger.info(
      `[npm] Starting to fetch package info for ${packageNames.length} packages from registry: ${registry}`,
    );

    // 使用 Promise.all 并发请求，但限制并发数为 5
    const batchSize = 5;
    const results: PackageResult[] = [];

    for (let i = 0; i < packageNames.length; i += batchSize) {
      const batch = packageNames.slice(i, i + batchSize);
      logger.info(
        `[npm] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(packageNames.length / batchSize)}, containing ${batch.length} packages`,
      );

      const batchResults = await Promise.all(
        batch.map(async packageName => {
          try {
            const result = await fetchPackage(packageName, registry);
            const simplyResult = simply(result);
            logger.success(
              `[npm] Successfully fetched package info: ${packageName}, latest version: ${simplyResult.latest.version}`,
            );
            return simplyResult;
          } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 404) {
              logger.error(`[npm] Package not found: ${packageName}`);
              return { success: false, message: 'Package not found' };
            }
            logger.error(
              `[npm] Failed to fetch package info: ${packageName}, error: ${(e as Error).message}`,
            );
            return { success: false, message: (e as Error).message };
          }
        }),
      );

      logger.info(`[npm] Batch ${Math.floor(i / batchSize) + 1} completed`);
      results.push(...batchResults);
    }

    logger.success(
      `[npm] All package info fetched, total results: ${results.length}`,
    );
    const content = format(results);
    return { content: [{ type: 'text', text: content }] };
  },
};
