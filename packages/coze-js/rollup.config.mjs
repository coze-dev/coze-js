import { readFileSync } from 'fs';

import externals from 'rollup-plugin-node-externals';
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// Node.js 内置模块列表
const builtinModules = [
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'https',
  'net',
  'os',
  'path',
  'punycode',
  'querystring',
  'readline',
  'stream',
  'string_decoder',
  'timers',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib',
];

// 基础的外部依赖配置
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...builtinModules,
  /^node:/,
];

// 生成路径映射，防止添加 node: 前缀
const getOutputPaths = () => {
  const paths = {};
  builtinModules.forEach(mod => {
    paths[`node:${mod}`] = mod;
  });
  return paths;
};

// 共享的插件配置
const getPlugins = (tsconfig = './tsconfig.build.json') => [
  externals({
    deps: true,
    devDeps: true,
    peerDeps: true,
  }),
  nodeResolve({
    preferBuiltins: true,
    exportConditions: ['node', 'default', 'module', 'import'],
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

// 生成主入口的配置
const createMainConfig = () => [
  // ESM 格式
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm/index.mjs',
      format: 'esm',
      sourcemap: false,
      preserveModules: false,
      paths: getOutputPaths(),
    },
    external,
    plugins: getPlugins(),
  },
  // CJS 格式
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: false,
      preserveModules: false,
      exports: 'named',
      paths: getOutputPaths(),
    },
    external,
    plugins: getPlugins(),
  },
  // UMD 格式
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      name: 'CozeJs',
      sourcemap: false,
      exports: 'named',
      paths: getOutputPaths(),
      globals: {
        axios: 'axios',
      },
    },
    external: ['axios'],
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        browser: true,
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
        declarationMap: false,
      }),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  },
  // 类型声明文件
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/types/index.d.ts',
      format: 'esm',
      paths: getOutputPaths(),
    },
    external,
    plugins: [dts()],
  },
];

// 生成 ws-tools 子包的配置
const createWsToolsConfig = () => [
  // ESM 格式
  {
    input: 'src/ws-tools/index.ts',
    output: {
      file: 'dist/esm/ws-tools/index.mjs',
      format: 'esm',
      sourcemap: false,
      preserveModules: false,
      paths: getOutputPaths(),
    },
    external,
    plugins: getPlugins(),
  },
  // CJS 格式
  {
    input: 'src/ws-tools/index.ts',
    output: {
      file: 'dist/cjs/ws-tools/index.js',
      format: 'cjs',
      sourcemap: false,
      preserveModules: false,
      exports: 'named',
      paths: getOutputPaths(),
    },
    external,
    plugins: getPlugins(),
  },
  // 类型声明文件
  {
    input: 'src/ws-tools/index.ts',
    output: {
      file: 'dist/types/ws-tools/index.d.ts',
      format: 'esm',
      paths: getOutputPaths(),
    },
    external,
    plugins: [dts()],
  },
];

// 生成 ws-tools 子包的配置
const createSpeechConfig = () => [
  // ESM 格式
  {
    input: 'src/ws-tools/speech/index.ts',
    output: {
      file: 'dist/esm/ws-tools/speech/index.mjs',
      format: 'esm',
      sourcemap: false,
      preserveModules: false,
      paths: getOutputPaths(),
    },
    external,
    plugins: getPlugins(),
  },
  // CJS 格式
  {
    input: 'src/ws-tools/speech/index.ts',
    output: {
      file: 'dist/cjs/ws-tools/speech/index.js',
      format: 'cjs',
      sourcemap: false,
      preserveModules: false,
      exports: 'named',
      paths: getOutputPaths(),
    },
    external,
    plugins: getPlugins(),
  },
  // 类型声明文件
  {
    input: 'src/ws-tools/speech/index.ts',
    output: {
      file: 'dist/types/ws-tools/speech/index.d.ts',
      format: 'esm',
      paths: getOutputPaths(),
    },
    external,
    plugins: [dts()],
  },
];

export default [
  ...createMainConfig(),
  ...createWsToolsConfig(),
  ...createSpeechConfig(),
];
