import {
  defineConfig as _defineConfig,
  type LibConfig,
  type RsbuildConfigOutputTarget,
} from '@rslib/core';

type LibFormat = LibConfig['format'];
export type BundleType = boolean | 'excludeExternal';

const defineConfig: typeof _defineConfig = _defineConfig;

export { defineConfig };

interface Options {
  format?: LibFormat[];
  bundle?: BundleType;
  tsconfigPath?: string;
  umdName?: string;
  target?: RsbuildConfigOutputTarget;
}
const defaultOptions = {
  format: ['esm', 'cjs'] as LibFormat[],
  bundle: true,
  target: 'web' as RsbuildConfigOutputTarget,
  tsconfigPath: './tsconfig.build.json',
};

export function getRslibConfig(options: Options) {
  const { format, bundle, umdName, tsconfigPath, target } = {
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
      target,
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

export default defineConfig(getRslibConfig({}));
