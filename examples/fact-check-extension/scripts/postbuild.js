import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

// Copy public files to dist
function copyPublicToDist() {
  if (!fs.existsSync(publicDir)) {
    console.error('Public directory does not exist');
    return;
  }

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy all files from public to dist
  copyFolderRecursiveSync(publicDir, distDir);
  console.log('Public files copied to dist');
}

function copyFolderRecursiveSync(source, target) {
  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        const targetFile = path.join(target, file);
        fs.copyFileSync(curSource, targetFile);
      }
    });
  }
}

// Fix file paths in manifest.json
function fixManifestPaths() {
  const manifestPath = path.join(distDir, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.error('manifest.json not found in dist directory');
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Fix background script path
    if (manifest.background && manifest.background.service_worker) {
      manifest.background.service_worker =
        manifest.background.service_worker.replace('.ts', '.js');
    }

    // Fix content script paths
    if (manifest.content_scripts && manifest.content_scripts.length > 0) {
      manifest.content_scripts.forEach(script => {
        if (script.js) {
          script.js = script.js.map(jsPath => jsPath.replace('.ts', '.js'));
        }
      });
    }

    // Write updated manifest
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('manifest.json paths fixed');
  } catch (error) {
    console.error('Error fixing manifest paths:', error);
  }
}

// Main execution
copyPublicToDist();
fixManifestPaths();
