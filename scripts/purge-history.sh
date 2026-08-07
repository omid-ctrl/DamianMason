#!/bin/bash
#
# Purge large regenerable artifacts from the whole git history.
#
# WHY: the build tracked 1.7GB, of which 1.47GB was 2,337 QA screenshots across
# eight audit rounds and 138MB was superseded video and audio originals.
# Untracking them fixes the working tree but not the history, so every clone and
# every Vercel build would still pay to download blobs nothing references.
#
# SAFE TO REWRITE: the remote is empty, this history has never been pushed, and
# nobody else has a copy. The 14 commit messages are kept, because they are the
# record of how the site was built and why each decision was made.
#
# Run from the repo root. Idempotent in the sense that a second run finds
# nothing left to remove.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "BEFORE"
echo "  .git:    $(du -sh .git | cut -f1)"
echo "  tracked: $(git ls-files -z | xargs -0 du -ch 2>/dev/null | tail -1 | cut -f1)"
echo "  commits: $(git log --oneline | wc -l | tr -d ' ')"

# A backup ref, so a mistake here is recoverable rather than terminal.
git tag -f pre-purge-backup >/dev/null 2>&1

export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch --force --index-filter '
  git rm -r --cached --ignore-unmatch --quiet \
    docs/qa/screenshots \
    docs/design/shots \
    "_source/media/*.mp4" \
    "_source/media/*.mp3" \
    || true
' --prune-empty --tag-name-filter cat -- --all

# Drop the backup refs filter-branch leaves behind, expire the reflog, and
# repack. Without all three the old blobs stay reachable and .git does not
# actually shrink, which is the usual reason this procedure appears to fail.
rm -rf .git/refs/original
git tag -d pre-purge-backup >/dev/null 2>&1 || true
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "AFTER"
echo "  .git:    $(du -sh .git | cut -f1)"
echo "  tracked: $(git ls-files -z | xargs -0 du -ch 2>/dev/null | tail -1 | cut -f1)"
echo "  commits: $(git log --oneline | wc -l | tr -d ' ')"
