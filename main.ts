// gta6-meme-x-01 entry, v3 — the boarding-pass meme, punchline-first.
// Runs on Node 22 with the standard library only.
//
// The entry is the X post itself: the house fetches the post named in
// POST.json and hands its first picture plus its text to the judge. This
// program's only job is to deliver POST.json into the output directory,
// where the gate picks it up.
//
// Try it locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

const source = join(BOT_DIR, 'POST.json');
const destination = join(OUTPUT_DIR, 'POST.json');

const bytes = readFileSync(source, 'utf8');
const post = JSON.parse(bytes) as { url?: unknown };
if (typeof post.url !== 'string' || !post.url.startsWith('https://x.com/')) {
  fail('POST.json does not name an X post URL; refusing to publish it.');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(destination, bytes);

// The gate reads the published copy, so read it back and confirm the bytes
// that landed are exactly the bytes we meant to publish.
if (readFileSync(destination, 'utf8') !== bytes) {
  fail('Published POST.json does not match the source; aborting.');
}

console.log(`Published ${post.url} to ${destination}`);
