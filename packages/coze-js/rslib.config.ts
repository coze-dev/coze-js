import { defineConfig, type LibConfig } from '@rslib/core';

function getLibShared(format: LibConfig['format'], dts = false, subpath = '') {
  const shared: LibConfig = {
    output: {
      distPath: {
        root: `./dist/${format}/${subpath}`,
      },
    },
    format,
    dts: dts
      ? {
          distPath: `./dist/types/${subpath}`,
        }
      : false,
    syntax: 'es6',
    source: {
      entry: { index: subpath ? `./src/${subpath}` : './src' },
    },
  };
  return shared;
}

export default defineConfig({
  source: {
    tsconfigPath: './tsconfig.build.json',
  },
  lib: [
    {
      ...getLibShared('umd'),
      umdName: 'CozeJs',
    },
    getLibShared('cjs', true),
    getLibShared('esm', false),
    getLibShared('cjs', true, 'ws-tools'),
    getLibShared('esm', false, 'ws-tools'),
    getLibShared('cjs', true, 'ws-tools/speech'),
    getLibShared('esm', false, 'ws-tools/speech'),
  ],
});
