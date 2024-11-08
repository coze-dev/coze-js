import { mergeConfig, type ViteUserConfig } from 'vitest/config';

import { webPreset } from './preset-web.ts';
import { nodePreset } from './preset-node.ts';
import { defaultVitestConfig } from './preset-default.ts';

export interface VitestConfig extends ViteUserConfig {
  /**
   * A string representing the project root directory.
   */
  dirname: string;
  /**
   * A string representing the preset configuration style, which can be one of 'default', 'node', or 'web'.
   */
  preset: 'default' | 'node' | 'web';
}

const calBasePreset = (preset: string) => {
  switch (preset) {
    case 'node':
      return nodePreset;
    case 'web':
      return webPreset;
    default:
      return defaultVitestConfig;
  }
};

export const defineConfig = (config: VitestConfig): ViteUserConfig => {
  const { dirname, preset, ...userVitestConfig } = config;

  if (typeof dirname !== 'string') {
    throw new Error(
      'VitestConfig requires a valid dirname string for the project root.',
    );
  }

  if (!['default', 'node', 'web'].includes(preset)) {
    throw new Error(
      `Invalid preset "${preset}". Must be one of: default, node, web`,
    );
  }

  const baseConfig = calBasePreset(preset);
  return mergeConfig(baseConfig, userVitestConfig);
};
