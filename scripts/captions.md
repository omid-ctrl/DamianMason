# Caption production record for the three self-hosted demo reels

## Status

All three self-hosted keynote reels now carry default English WebVTT caption
tracks:

| Video | Length | Caption track |
|---|---:|---|
| `public/video/dm-food-waste-720p.mp4` | 89.0s | `public/video/captions/dm-food-waste-720p.vtt` |
| `public/video/dm-labor-720p.mp4` | 69.3s | `public/video/captions/dm-labor-720p.vtt` |
| `public/video/dm-innovation-720p.mp4` | 94.5s | `public/video/captions/dm-innovation-720p.vtt` |

This closes the previously documented WCAG 2.1 SC 1.2.2 Level A gap. Axe
cannot detect missing caption tracks, so the validation below is still
required even when an automated accessibility run is clean.

## How the captions were produced

The shipping MP4 files were converted locally to mono 16 kHz PCM with macOS
AVFoundation and `afconvert`. No footage or audio was uploaded to a third
party. The audio was transcribed independently with three locally cached
models:

- `mlx-community/whisper-large-v3-turbo`
- `mlx-community/whisper-large-v3-mlx-8bit`
- `mlx-community/distil-whisper-large-v3`

The three outputs were compared sentence by sentence. Disagreements were
re-decoded as short clips with both greedy and sampled decoding. Names and
domain language were retained only where the models agreed or the source frame
confirmed the wording.

Every model also produced false speech over the instrumental outro. That is a
known failure mode for speech recognition. Those hallucinated words were
removed and the audible outro is captioned as `[music]`; no caption text was
written from the topic or from page copy.

## Wiring

Each MP4 record in `content/videos.ts` owns its caption metadata. `VideoGrid`
passes that track to `VideoEmbed`, which renders a real
`<track kind="captions" ... default>` in both the scripted player and the
no-JavaScript player.

This keeps the Innovation track attached on both routes where that same source
video appears: `/keynote/` and `/collaboration-opportunities/`.

## Validation contract

Before release:

1. Parse every VTT and confirm cue times increase, do not overlap, and end
   before the corresponding MP4 duration.
2. Confirm each cue contains no more than two caption lines and each line is
   at most 42 characters.
3. Render `/keynote/` and confirm three `kind="captions"` tracks are present in
   the server HTML, including inside the no-JavaScript players.
4. Render `/collaboration-opportunities/` and confirm the Innovation reel also
   carries its track.
5. Play all three videos in a real browser, leave captions enabled, and check
   the cue changes against the spoken delivery and the final `[music]` cue.

The parser and DOM checks prove that the tracks ship and are structurally
usable. A final human listen remains the release-quality check for names,
contractions, and the two intentionally colloquial lines in the Labor and
Innovation reels.

## Burned-in legacy wordmark

All three reels carry a burned-in lower-right watermark reading “Damian Mason
· BUSINESS · AGRICULTURE · FOOD.” That is the wordmark the client asked to omit
from the rebuild. It is absent from every image and every page on the site, but
it is baked into this footage and cannot be removed without re-exporting from
the original edit.

## Episode 144 audio transcript

The restored first-party Do Business Better episode also needs a text
alternative under WCAG 2.1 SC 1.2.1. Its timestamped artifact is:

`public/transcripts/do-business-better-episode-144.txt`

It was produced locally from the archived MP3. Three speech-recognition passes
were compared and local diarization supplied the speaker changes. The file is
explicitly labeled machine-assisted, contains 92 timestamped speaker blocks,
and marks the one unresolved employer descriptor near 01:44 as `[unclear]`.
The page links the transcript directly beside the native audio player and
associates its review note with the player through `aria-describedby`.

A final human listen remains necessary before treating this transcript as
publication-grade verbatim copy. `build-first-party-downloads.mjs --check`
guards the artifact, the timestamp count, and the unresolved marker count so a
later rewrite cannot silently remove that caveat.
