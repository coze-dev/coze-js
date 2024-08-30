module.exports = {
  '*.{ts,tsx,js,jsx,cjs,mjs}': ['prettier --write', 'eslint --cache --fix --quiet'],
  '**/package.json': ['prettier --write'],
};
