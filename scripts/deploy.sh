#!/usr/bin/env bash

set -euxo pipefail

mkdir /tmp/mtgdeploy

cp -r assets/* /tmp/mtgdeploy
python3 scripts/process.py /tmp/mtgdeploy/cards.json
npx esbuild src/index.js --bundle --minify --outfile=/tmp/mtgdeploy/index.js
npx esbuild src/sw.js --bundle --minify --outfile=/tmp/mtgdeploy/sw.js

git checkout gh-pages
shopt -s extglob
rm -r -- !(node_modules)
cp -r /tmp/mtgdeploy/* .
rm -r /tmp/mtgdeploy
git add -A
git reset node_modules
git commit -m "Deploy $(date +%F)"