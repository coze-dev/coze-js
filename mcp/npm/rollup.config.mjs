import { createRequire } from 'module';

import sucrase from '@rollup/plugin-sucrase';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// 找出所有带 workspace:* 标记的依赖
const workspaceDeps = Object.keys(pkg.dependencies || {}).filter(
  dep => pkg.dependencies[dep] === 'workspace:*',
);

console.log('Workspace dependencies to be bundled:', workspaceDeps);

export default {
  input: 'src/cli.ts',
  output: [
    {
      file: 'dist/cli.js',
      format: 'cjs',
      sourcemap: false,
    },
  ],
  external: [
    // 排除不需要打包的依赖
    ...Object.keys(pkg.dependencies || {}).filter(
      dep => !workspaceDeps.includes(dep),
    ),
    // Node.js 内置模块
    'fs',
    'path',
    'os',
    'util',
    'events',
    'stream',
    'http',
    'https',
    'child_process',
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      // 确保解析 workspace 依赖
      resolveOnly: module => workspaceDeps.some(dep => module.includes(dep)),
    }),
    commonjs({
      // 确保CommonJS模块能正确被处理
      include: ['node_modules/**', '**/node_modules/**'],
      // 转换为ES模块
      transformMixedEsModules: true,
    }),
    sucrase({
      exclude: [], // 不排除任何文件，包括node_modules
      include: [
        /\.[tj]sx?$/, // 处理所有.ts, .tsx, .js, .jsx文件
      ],
      transforms: ['typescript'],
    }),
    json(),
    // 添加自定义插件以记录打包进来的所有文件
    {
      name: 'log-bundled-files',
      generateBundle() {
        console.log('Successfully bundled workspace dependencies.');
      },
    },
  ],
};
