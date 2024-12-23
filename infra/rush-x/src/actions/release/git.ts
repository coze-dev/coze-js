import { exec } from '../../utils/exec';
import { type PackageToPublish } from './types';

/**
 * 从 git tag 中解析需要发布的包信息
 */
export const getPackagesToPublish = async (
  commit: string,
): Promise<PackageToPublish[]> => {
  // 获取指定 commit 的所有 tag
  const { stdout } = await exec(`git tag --points-at ${commit}`);
  const tags = stdout.split('\n').filter(Boolean);

  // 解析符合 v/{packagename}@{version} 格式的 tag
  const packagePattern = /^v\/(.+)@(.+)$/;
  const packages: PackageToPublish[] = [];

  for (const tag of tags) {
    const match = tag.match(packagePattern);
    if (match) {
      const [, packageName, version] = match;
      packages.push({
        packageName,
        version,
      });
    }
  }

  return packages;
};
