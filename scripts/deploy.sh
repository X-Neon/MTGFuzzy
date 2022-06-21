#!/usr/bin/env bash

set -euxo pipefail

rm -rf .parcel-cache/ dist/
mkdir /tmp/mtgdeploy

python3 scripts/process.py src/cards.json
npx parcel build --no-source-maps --dist-dir /tmp/mtgdeploy --public-url ./ src/index.html
rm src/cards.json

git checkout gh-pages
shopt -s extglob
rm -r -- !(node_modules)
rm -r .parcel-cache/
cp -r /tmp/mtgdeploy/* .
rm -r /tmp/mtgdeploy
git add -A
git reset node_modules
git commit -m "Deploy $(date +%F)"