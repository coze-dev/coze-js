import { readFileSync } from 'fs';

import externals from 'rollup-plugin-node-externals';
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// 基础的外部依赖配置
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

// 共享的插件配置
const getPlugins = (tsconfig = './tsconfig.build.json') => [
  externals({
    deps: true,
    devDeps: true,
    peerDeps: true,
  }),
  nodeResolve({
    browser: true,
    exportConditions: ['browser', 'default', 'module', 'import'],
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig,
    declaration: false,
    declarationMap: false,
    sourceMap: false,
    inlineSources: false,
  }),
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  }),
];

// 生成入口配置的工厂函数
const createEntryConfig = (input, outputPath, fileName = 'index') => [
  // ESM 格式
  {
    input,
    output: {
      file: `dist/esm/${outputPath}/${fileName}.js`,
      format: 'esm',
      sourcemap: false,
      preserveModules: false,
    },
    external,
    plugins: getPlugins(),
  },
  // CJS 格式
  {
    input,
    output: {
      file: `dist/cjs/${outputPath}/${fileName}.js`,
      format: 'cjs',
      sourcemap: false,
      preserveModules: false,
      exports: 'named',
    },
    external,
    plugins: getPlugins(),
  },
];

// 生成类型声明配置的工厂函数
const createDtsConfig = (input, outputPath, fileName = 'index') => ({
  input,
  output: {
    file: `dist/types/${outputPath}/${fileName}.d.ts`,
    format: 'esm',
  },
  external,
  plugins: [dts()],
});

// 主入口配置
const mainConfig = createEntryConfig('src/index.ts', '.');

// event-names 配置
const eventNamesConfig = createEntryConfig('src/event-names.ts', 'event-names');

// live 配置
const liveConfig = createEntryConfig('src/live/index.ts', 'live');

// 类型声明文件配置
const dtsConfigs = [
  createDtsConfig('src/index.ts', '.'),
  createDtsConfig('src/event-names.ts', 'event-names', 'event-names'),
  createDtsConfig('src/live/index.ts', 'live/live'),
];

export default [
  ...mainConfig,
  ...eventNamesConfig,
  ...liveConfig,
  ...dtsConfigs,
];
