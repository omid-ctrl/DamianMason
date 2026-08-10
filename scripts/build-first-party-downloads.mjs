/**
 * Builds public downloads from first-party material already in this repo.
 *
 *   node scripts/build-first-party-downloads.mjs
 *   node scripts/build-first-party-downloads.mjs --check
 *
 * The checks are intentionally strict. If the retained episode source changes
 * or a selected photograph disappears, this script stops instead of silently
 * publishing a different file under the same public URL.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

const AUDIO_SOURCE = path.join(ROOT, '_source', 'media', 'VisionTechMgmt.mp3');
const AUDIO_OUTPUT = path.join(
  ROOT,
  'public',
  'audio',
  'do-business-better-episode-144.mp3',
);
const AUDIO_SHA256 = 'ab507d3c203653c9c2d72587e0fe3eba292bd2cab6413b72d1c7285188af11f5';
const AUDIO_BYTES = 34_354_476;
const TRANSCRIPT_OUTPUT = path.join(
  ROOT,
  'public',
  'transcripts',
  'do-business-better-episode-144.txt',
);

const PHOTO_OUTPUT = path.join(ROOT, 'public', 'docs', 'damian-mason-speaker-photos.zip');
const PHOTO_FILES = [
  'public/docs/speaker-photo-notes.txt',
  'public/img/photos/portrait-headshot.jpg',
  'public/img/photos/portrait-charcoal-jacket.jpg',
  'public/img/photos/portrait-window-light.jpg',
  'public/img/photos/portrait-boardroom.jpg',
  'public/img/photos/stage-blue-jacket.jpg',
  'public/img/photos/stage-crop-protection-slide.jpg',
  'public/img/photos/stage-labor-slide.jpg',
  'public/img/photos/stage-walking-the-front.jpg',
  'public/img/photos/stage-white-wall.jpg',
  'public/img/photos/audience-from-the-back.jpg',
];

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function requireFile(file) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    throw new Error(`Missing first-party source: ${path.relative(ROOT, file)}`);
  }
}

function verifyAudio(file) {
  requireFile(file);
  const size = fs.statSync(file).size;
  const hash = sha256(file);
  if (size !== AUDIO_BYTES || hash !== AUDIO_SHA256) {
    throw new Error(
      `Unexpected episode 144 audio: ${size} bytes, sha256 ${hash}. ` +
        `Expected ${AUDIO_BYTES} bytes and ${AUDIO_SHA256}.`,
    );
  }
}

function verifyTranscript(file) {
  requireFile(file);
  const text = fs.readFileSync(file, 'utf8');
  const transcript = text.split('\nTRANSCRIPT\n')[1] ?? '';
  const speakerBlocks = transcript.match(/^\[\d{2}:\d{2}\] .+:$/gm) ?? [];
  const unresolved = transcript.match(/\[unclear\]/g) ?? [];
  const required = [
    'Episode 144: A Vision to Reap ROI From Client’s Existing Technology',
    'This is a machine-assisted transcript produced locally from the first-party audio.',
    '[00:24] Damian Mason:',
    '[35:15] Announcer:',
  ];

  if (
    !required.every((needle) => text.includes(needle)) ||
    speakerBlocks.length !== 92 ||
    unresolved.length !== 1
  ) {
    throw new Error(
      `Unexpected episode 144 transcript: ${speakerBlocks.length} timestamped blocks, ` +
        `${unresolved.length} unresolved markers.`,
    );
  }
}

function zipEntries(file) {
  const result = spawnSync('/usr/bin/unzip', ['-Z1', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || 'Could not inspect photo ZIP.');
  return result.stdout.trim().split('\n').filter(Boolean).sort();
}

verifyAudio(AUDIO_SOURCE);
verifyTranscript(TRANSCRIPT_OUTPUT);
for (const relative of PHOTO_FILES) requireFile(path.join(ROOT, relative));

if (!checkOnly) {
  fs.mkdirSync(path.dirname(AUDIO_OUTPUT), { recursive: true });
  fs.copyFileSync(AUDIO_SOURCE, AUDIO_OUTPUT);

  fs.mkdirSync(path.dirname(PHOTO_OUTPUT), { recursive: true });
  fs.rmSync(PHOTO_OUTPUT, { force: true });
  const zip = spawnSync(
    '/usr/bin/zip',
    ['-q', '-j', '-X', PHOTO_OUTPUT, ...PHOTO_FILES.map((file) => path.join(ROOT, file))],
    { encoding: 'utf8' },
  );
  if (zip.status !== 0) throw new Error(zip.stderr || 'Could not build photo ZIP.');
}

verifyAudio(AUDIO_OUTPUT);
verifyTranscript(TRANSCRIPT_OUTPUT);
requireFile(PHOTO_OUTPUT);

const expectedEntries = PHOTO_FILES.map((file) => path.basename(file)).sort();
const actualEntries = zipEntries(PHOTO_OUTPUT);
if (JSON.stringify(actualEntries) !== JSON.stringify(expectedEntries)) {
  throw new Error(
    `Photo ZIP entries differ.\nExpected: ${expectedEntries.join(', ')}\n` +
      `Actual: ${actualEntries.join(', ')}`,
  );
}

console.log(
  `${checkOnly ? 'checked' : 'built'} ${path.relative(ROOT, AUDIO_OUTPUT)}, ` +
    `${path.relative(ROOT, TRANSCRIPT_OUTPUT)}, and ${path.relative(ROOT, PHOTO_OUTPUT)} ` +
    `(${actualEntries.length} ZIP files).`,
);
