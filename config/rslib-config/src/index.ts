import { defineConfig, LibConfig } from '@rslib/core';

type LibFormat = LibConfig['format'];
export type BundleType = boolean | 'excludeExternal';

interface Options {
  format?: LibFormat[];
  bundle?: BundleType;
  tsconfigPath?: string;
  umdName?: string;
}
const defaultOptions = {
  format: ['esm', 'cjs'] as LibFormat[],
  bundle: true,
};

function getRslibConfig(options: Options) {
  const { format, bundle, umdName, tsconfigPath } = {
    ...defaultOptions,
    ...options,
  };

  const libs = format.map(libFormat => {
    const lib = getLibShared(libFormat, bundle);
    if (libFormat === 'umd') {
      if (!umdName) {
        throw new Error(
          'getRslibConfig: umdName is required when using UMD format',
        );
      }
      lib.umdName = umdName;
      lib.bundle = true;
    }
    return lib;
  });

  libs[0].dts = {
    distPath: './dist/types',
  };

  return defineConfig({
    source: {
      tsconfigPath,
    },
    output: {
      target: 'web',
    },
    lib: libs,
  });
}

function getLibShared(format: LibFormat, bundleType: BundleType) {
  const shared: LibConfig = {
    output: {
      distPath: {
        root: `./dist/${format}`,
      },
    },
    format,
    syntax: 'es6',
    bundle: !!bundleType,
    autoExternal: bundleType === 'excludeExternal',
  };
  return shared;
}

export default getRslibConfig;
