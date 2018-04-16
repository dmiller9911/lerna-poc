#!/bin/bash
set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not releasing"
  exit 0
fi

if [ "$(node ./scripts/isPublishCommit)" != "false" ]; then
  echo "Commit is Lerna, not releasing"
  exit 0
fi

if [[ $TRAVIS_BRANCH == 'master' ]]; then
  yarn release:ci
fi