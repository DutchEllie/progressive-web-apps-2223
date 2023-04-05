#!/bin/bash

sed -i -r "s/[12][0-9]{3}[01][0-9][0-3][0-9][0-2][0-9][0-5][0-9][0-5][0-9]/$(date '+%Y%m%d%H%M%S')/g" ./html/serviceworker.js

rm -rf dist
mkdir dist

cp -R html/* dist/
cd dist/static/css
minify --output ./ --verbose --type=css --recursive ./
cd ../../../

cargo run