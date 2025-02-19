
#!/bin/bash



while [ ! -d "./dist/lib-source/src/" ]; do
    sleep 2
    echo "文件仍不存在，再次等待5秒"
done
mkdir -p ./dist/lib-source/temp

cp -rf ./src/libs ./dist/lib-source/temp/
cp -rf ./src/chatflow ./dist/lib-source/temp/
cp -rf ./src/exports ./dist/lib-source/temp/

find ./dist/lib-source/temp/ -name "*.ts" -type f | while read file; do
  rm -f $file
done
find ./dist/lib-source/temp/ -name "*.tsx" -type f | while read file; do
  rm -f $file
done
find ./dist/lib-source/temp/ -name "*.js" -type f | while read file; do
  rm -f $file
done
find ./dist/lib-source/temp/ -name "*.jsx" -type f | while read file; do
  rm -f $file
done

cp -rf ./dist/lib-source/temp/* ./dist/lib-source/src/
rm -rf ./dist/lib-source/temp


