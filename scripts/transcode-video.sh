#!/bin/bash
# Transcode the three self-hosted demo reels to 720p H.264 for the web.
#
# HISTORY, so nobody repeats it: this script used to call macOS `avconvert`
# with --preset Preset1280x720. That preset is an AVAssetExportSession quality
# target, not a bitrate target, and it re-encoded the 1080p sources UP: the
# 89 second food waste reel went from 32MB at 2915kbps to 75MB at 6775kbps.
# All three "720p" outputs were larger than the 1080p files they replaced.
# Do not use avconvert for this.
#
# What shipped instead, and what this script now does: libx264 at CRF 25 with
# the slow preset and a faststart atom, which put the set at
#   food waste  32.5MB -> 7.0MB
#   innovation  41.0MB -> 7.9MB
#   labor       37.2MB -> 7.1MB
#   total      110.7MB -> 22.0MB
# with duration, framing and audio intact. Verified by decoding each output in
# Chromium and seeking across the timeline before the originals were deleted.
#
# ffmpeg is not installed system-wide on the build machine. The one-liner that
# provides it without touching this project's package.json:
#   npm install ffmpeg-static --prefix /tmp/ffmpeg-host
#   FFMPEG=/tmp/ffmpeg-host/node_modules/ffmpeg-static/ffmpeg
#
# The 1080p sources are no longer in the repo. Re-running this needs them
# restored from the media mirror in _source/media/ first.
set -e

FFMPEG="${FFMPEG:-ffmpeg}"
command -v "$FFMPEG" >/dev/null 2>&1 || {
  echo "No ffmpeg at '$FFMPEG'. See the header of this file for how to get one." >&2
  exit 1
}

cd "$(dirname "$0")/../public/video"

for name in dm-food-waste dm-innovation dm-labor; do
  src="$name-1080p.mp4"
  out="$name-720p.mp4"
  [ -f "$src" ] || { echo "skip $src, not present"; continue; }
  echo "=== $src -> $out"
  "$FFMPEG" -y -i "$src" \
    -vf "scale=-2:720" \
    -c:v libx264 -preset slow -crf 25 -profile:v high -level 4.0 -pix_fmt yuv420p \
    -c:a aac -b:a 96k -ac 2 \
    -movflags +faststart \
    "$out"
  echo "  $(du -h "$src" | cut -f1) -> $(du -h "$out" | cut -f1)"
done

echo "DONE. Verify each output actually decodes before deleting any original."
