# Captions for the three self-hosted demo reels

## The problem, stated plainly

`public/video/` holds three demo reels that ship with no caption track:

| File | Length |
|---|---|
| `dm-food-waste-720p.mp4` | 89.0s |
| `dm-labor-720p.mp4` | 69.3s |
| `dm-innovation-720p.mp4` | 94.5s |

That is a **WCAG 2.1 SC 1.2.2 Captions (Prerecorded) failure at Level A**, the strictest conformance level.
It is the only known WCAG failure on the site.

Note that `axe` reports zero violations across every route. Automated tools cannot detect a missing caption
track, so a clean axe run is not evidence of conformance here. The other 13 videos on the site are YouTube
embeds and carry YouTube's own captions, so this is the whole of the exposure.

## Why there are no captions yet

Producing captions requires a transcript, and a transcript requires either a person listening or a speech
recognition model. Neither was available during the build:

- No `whisper`, `whisper.cpp` or `ffmpeg` on the build machine.
- macOS on-device speech recognition via `Speech.framework` was attempted and **aborts with SIGABRT** from a
  command line binary. `SFSpeechRecognizer.requestAuthorization` needs `NSSpeechRecognitionUsageDescription`
  in a bundle `Info.plist` and an interactive privacy grant, which a CLI cannot satisfy.

Captions were **not** fabricated from the video's topic, and should not be. Captions that do not match the
audio are worse than no captions: a deaf viewer has no way to know they are being misled, and they will make
a decision based on words the speaker never said.

## Fixing it: three routes, cheapest first

### 1. A captioning service (recommended, about 15 minutes of work)

Upload each MP4 to Rev, Descript, 3Play Media, Otter, or similar. Ask for **WebVTT** output. Human-verified
transcription of four minutes of speech costs very little. Then jump to "Wiring the files in" below.

### 2. YouTube as a transcription tool, free

If these reels are already on the YouTube channel, YouTube has auto-captioned them. Open the video in YouTube
Studio, go to Subtitles, correct the auto-caption errors (ag terminology is where it will slip), and download
as `.vtt`. If they are not on the channel, upload them unlisted, let the auto-captions run, correct, download,
then delete the unlisted copies.

### 3. Whisper locally, free, best accuracy

```bash
brew install ffmpeg
pipx install openai-whisper        # or: pip install -U openai-whisper

for f in food-waste labor innovation; do
  whisper "public/video/dm-$f-720p.mp4" \
    --model small.en \
    --language en \
    --output_format vtt \
    --output_dir public/video/captions
done
```

`small.en` is a good accuracy-to-speed tradeoff on four minutes of clear stage audio. Use `medium.en` if the
room tone is difficult. **Read every generated file before shipping it.** Whisper is strong on general English
and weak on names and ag jargon: expect it to mangle "agronomist", "Ag", commodity names, and any organization
Damian names from the stage.

If you have no `ffmpeg`, macOS can extract the audio on its own, and Whisper will accept the `.m4a`:

```bash
avconvert --source public/video/dm-food-waste-720p.mp4 \
          --output /tmp/food-waste.m4a --preset PresetAppleM4A --replace
```

## Wiring the files in

The component work is already done. `VideoEmbed` takes a first-class `captions` prop and renders a real
`<track kind="captions" ... default>` on the MP4 branch, so this is a data change and nothing else.

1. Put the files in `public/video/captions/` as `dm-food-waste-720p.vtt`, and so on.
2. In `content/videos.ts`, add a `captions` object to each of the three MP4 entries:

```ts
captions: {
  src: '/video/captions/dm-food-waste-720p.vtt',
  srcLang: 'en',
  label: 'English captions',
  isDefault: true,
},
```

3. Verify. Play each reel, turn captions on in the player, and confirm the cues track the audio. Then confirm
   the track element is actually in the DOM:

```bash
curl -s http://localhost:3100/keynote/ | grep -c 'kind="captions"'   # expect 3
```

## What ships in the meantime

Each reel carries an accurate text description in `content/videos.ts`, written from frames sampled at four
points across each video and verified by eye. A description is **not** a caption and does not satisfy SC 1.2.2.
It does mean a visitor who cannot hear the audio still learns what the reel contains and where it was filmed,
which is better than a bare title, which is what shipped before.

## One more thing about these files

All three reels carry a burned-in lower-right watermark reading **"Damian Mason · BUSINESS · AGRICULTURE ·
FOOD"**. That is the wordmark the client asked to omit from the rebuild. It is absent from every image and
every page on the site, but it is baked into this footage and cannot be removed without re-encoding, which
would mean re-exporting from the original edit. Logged in `docs/OPEN-ITEMS.md`.
