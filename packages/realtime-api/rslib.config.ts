import { defineConfig, type LibConfig } from '@rslib/core';

function getLibShared(format: LibConfig['format'], dts = false, subpath = '') {
  const shared: LibConfig = {
    autoExtension: false,
    output: {
      distPath: {
        root: `./dist/${format}`,
        js: `${subpath}`,
      },
    },
    format,
    dts: dts
      ? {
          distPath: `./dist/types/${subpath}`,
        }
      : false,
    syntax: 'es6',
    bundle: format === 'esm' ? false : true,
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
  output: {
    target: 'web',
  },
  lib: [
    // {
    //   ...getLibShared('umd'),
    //   umdName: 'CozeRealtimeApi',
    // },
    // getLibShared('cjs', true),
    getLibShared('esm', false),
    // getLibShared('cjs', true, 'event-names'),
    // getLibShared('esm', false, 'event-names'),
    // getLibShared('cjs', true, 'live'),
    // getLibShared('esm', false, 'live'),
  ],
});
