import { defineConfig, type LibConfig } from '@rslib/core';

function getLibShared(format: LibConfig['format']) {
  const shared: LibConfig = {
    output: {
      distPath: {
        root: `./dist/${format}`,
      },
    },
    format,
    syntax: 'es6',
    dts: true,
    autoExternal: false,
  };
  return shared;
}

export default defineConfig({
  source: {
    tsconfigPath: './tsconfig.build.json',
  },
  output: {
    target: 'web',
  },
  lib: ['esm', 'cjs', 'umd'].map(r => getLibShared(r as LibConfig['format'])),
});
