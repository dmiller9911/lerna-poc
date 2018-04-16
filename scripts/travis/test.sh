
ISPublishCommit=$(node ./scripts/isPublishCommit)
if [ "$(node ./scripts/isPublishCommit)" != "false" ]; then
  echo "We are in a pull request, not releasing"
  exit 0
fi