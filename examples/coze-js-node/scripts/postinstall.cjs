const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(__dirname, '../src/config/config.ts');
const DEFAULT_CONFIG_PATH = path.join(
  __dirname,
  '../src/config/config.default.ts',
);

// check if config.ts exists
if (!fs.existsSync(CONFIG_PATH)) {
  try {
    // check if config.default.ts exists
    if (fs.existsSync(DEFAULT_CONFIG_PATH)) {
      // copy file
      fs.copyFileSync(DEFAULT_CONFIG_PATH, CONFIG_PATH);
      console.log('Successfully created config.ts from config.default.ts');
    } else {
      console.error('Error: config.default.ts does not exist');
    }
  } catch (error) {
    console.error('Error copying config file:', error);
  }
} else {
  console.log('config.ts already exists, skipping copy');
}
