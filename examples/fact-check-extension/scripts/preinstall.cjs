const path = require('path');
const fs = require('fs');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = require(packageJsonPath);

// Update dependencies
if (packageJson.dependencies) {
  for (const [key, value] of Object.entries(packageJson.dependencies)) {
    if (value === 'workspace:*') {
      packageJson.dependencies[key] = 'latest';
    }
  }
}

// Remove workspace dependencies from devDependencies
if (packageJson.devDependencies) {
  for (const [key, value] of Object.entries(packageJson.devDependencies)) {
    if (value === 'workspace:*') {
      delete packageJson.devDependencies[key];
    }
  }
}

// Write back to package.json
fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

console.log('Updated package.json: workspace dependencies modified');
