#!/bin/bash
echo "Start Lib Taro Run Cli"


mv ./dist/lib-types/src/* ./dist/lib-types/
rm -rf ./dist/lib-types/src

cd ./dist/lib-taro/
sed -i.bak 's/__webpack_require__/__webpack_require_coze__/g' ./*.mjs
rm -r *.bak
mv export.mjs export.sjs

echo "Start Lib Taro Run success"

