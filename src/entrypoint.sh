#!/bin/sh -l

# Generate indices
cd /
node index.js $GITHUB_WORKSPACE

# Commit and push generated indices
cd $GITHUB_WORKSPACE
git config --global user.email "actions@github.com"
git config --global user.name "$GITHUB_ACTOR"
git add .
git commit -m "Autogenerated indices"
git remote add originWithAuth https://x-access-token:$CI_AUTH_TOKEN@github.com/$GITHUB_REPOSITORY.git
git push originWithAuth $GITHUB_REF
