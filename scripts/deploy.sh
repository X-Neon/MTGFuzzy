#!/usr/bin/env bash

set -euxo pipefail

mkdir /tmp/mtgdeploy

cp -r assets/* /tmp/mtgdeploy
python3 scripts/process.py
npx esbuild src/index.js --bundle --minify --outfile=/tmp/mtgdeploy/index.js

git checkout gh-pages
rm -r *
cp -r /tmp/mtgdeploy/* .
rm -r /tmp/mtgdeploy
git add -A
git commit -m "Deploy $(date +%F)"