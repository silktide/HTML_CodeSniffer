#!/usr/bin/env bash

if git diff --exit-code; then
    echo "No changes can staged and not committed pre-push in this repository"
    exit 1
fi

git checkout build/HTMLCS.js
node_modules/.bin/grunt build-debug

if git diff --exit-code build/HTMLCS.js; then
    git add build/HTMLCS.js
    git commit -m "updated build"
fi