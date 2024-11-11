import { mergeConfig } from 'vitest/config';

import { defaultVitestConfig } from './preset-default.ts';

export const nodePreset = mergeConfig(defaultVitestConfig, {});
