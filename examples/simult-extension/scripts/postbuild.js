import path from 'path';
import fs from 'fs';

// Read the current manifest.json from dist directory
const manifestPath = path.resolve('dist/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Ensure popup path is correct
manifest.action.default_popup = 'src/popup/index.html';
console.log(`Set popup path to: ${manifest.action.default_popup}`);

// Find the actual background.js file
const backgroundDir = path.resolve('dist/assets/background');
const backgroundFiles = fs.readdirSync(backgroundDir);
const backgroundJsFile = backgroundFiles.find(file => file.endsWith('.js'));

// Find the actual content.js file
const contentDir = path.resolve('dist/assets/content');
const contentFiles = fs.readdirSync(contentDir);
const contentJsFile = contentFiles.find(file => file.endsWith('.js'));

// Update the manifest with the correct file paths
if (backgroundJsFile) {
  manifest.background.service_worker = `assets/background/${backgroundJsFile}`;
  console.log(
    `Updated background service_worker to: ${manifest.background.service_worker}`,
  );
}

if (contentJsFile) {
  manifest.content_scripts[0].js = [`assets/content/${contentJsFile}`];
  console.log(
    `Updated content script to: ${manifest.content_scripts[0].js[0]}`,
  );
}

// Write the updated manifest back to the file
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Manifest file updated successfully');
