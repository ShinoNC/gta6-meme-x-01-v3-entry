// gta6-meme-x-01 entry, v3 (boarding pass meme, punchline-first redesign).
// Node 22, standard library only.
//
// The entry is the X post itself: the house reads the post named in POST.json
// from X and hands its first picture and its text to the judge. All this
// program does is deliver POST.json to the output directory, where the gate
// reads it.
//
// Local check:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const repoDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(repoDir, 'POST.json');
const targetPath = join(outDir, 'POST.json');

const raw = readFileSync(sourcePath, 'utf8');
const parsed = JSON.parse(raw) as { url?: unknown };
if (typeof parsed.url !== 'string' || !parsed.url.startsWith('https://x.com/')) {
  console.error('POST.json does not name an X post URL; refusing to publish it.');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(targetPath, raw);

// Read the published copy back: the gate reads this file, so confirm the
// bytes that landed are exactly the bytes we meant to publish.
const published = readFileSync(targetPath, 'utf8');
if (published !== raw) {
  console.error('Published POST.json does not match the source; aborting.');
  process.exit(1);
}
console.log(`Published ${parsed.url} to ${targetPath}`);
