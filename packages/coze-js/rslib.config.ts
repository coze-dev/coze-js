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
  lib: [
    {
      ...getLibShared('esm'),
      dts: {
        distPath: './dist/types',
      },
    },
    getLibShared('cjs'),
    getLibShared('umd'),
  ],
});
