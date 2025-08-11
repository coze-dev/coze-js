/**
 * 构建脚本
 * 用于编译TypeScript代码并生成声明文件
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// 项目根目录
const rootDir = path.resolve(__dirname, '..');

// 清理dist目录
console.log('清理dist目录...');
try {
  execSync('rimraf dist', { cwd: rootDir, stdio: 'inherit' });
} catch (error) {
  console.error('清理dist目录失败:', error);
  process.exit(1);
}

// 编译TypeScript
console.log('编译TypeScript...');
try {
  execSync('tsc', { cwd: rootDir, stdio: 'inherit' });
} catch (error) {
  console.error('编译TypeScript失败:', error);
  process.exit(1);
}

// 复制package.json到dist目录
console.log('复制package.json到dist目录...');
const packageJson = require('../package.json');

// 移除不需要的字段
delete packageJson.scripts;
delete packageJson.devDependencies;

// 写入dist目录
fs.writeFileSync(
  path.join(rootDir, 'dist', 'package.json'),
  JSON.stringify(packageJson, null, 2),
  'utf-8',
);

// 复制README.md和CHANGELOG.md到dist目录
console.log('复制README.md和CHANGELOG.md到dist目录...');
fs.copyFileSync(
  path.join(rootDir, 'README.md'),
  path.join(rootDir, 'dist', 'README.md'),
);
fs.copyFileSync(
  path.join(rootDir, 'CHANGELOG.md'),
  path.join(rootDir, 'dist', 'CHANGELOG.md'),
);

console.log('构建完成!');
