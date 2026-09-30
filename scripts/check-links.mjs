import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const files = [];

async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && (entry.name.endsWith('.astro') || entry.name.endsWith('.ts'))) files.push(full);
  }
}

await walk(root);

const refs = new Map();
const regex = /https?:\/\/[^'"\s)]+/g;

for (const file of files) {
  const text = await fs.readFile(file, 'utf8');
  for (const match of text.matchAll(regex)) {
    const url = match[0];
    if (!refs.has(url)) refs.set(url, []);
    refs.get(url).push(path.relative(process.cwd(), file));
  }
}

let broken = 0;
let warnings = 0;

async function check(url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: { 'user-agent': 'PPI-Ishikawa-LinkChecker/1.0 (+GitHub Actions)' },
    });

    if (response.status === 404 || response.status === 410) {
      broken += 1;
      console.error(`BROKEN ${response.status} ${url} :: ${refs.get(url).join(', ')}`);
    } else if (response.status >= 400) {
      warnings += 1;
      console.warn(`WARN   ${response.status} ${url} :: server may block automated checks`);
    } else {
      console.log(`OK     ${response.status} ${url}`);
    }
  } catch (error) {
    warnings += 1;
    console.warn(`WARN   ERR ${url} :: ${error.message}`);
  }
}

const queue = [...refs.keys()];
const workers = Array.from({ length: 6 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    if (url) await check(url);
  }
});

await Promise.all(workers);
console.log(`Checked ${refs.size} unique external links. Broken: ${broken}. Warnings: ${warnings}.`);
if (broken > 0) process.exit(1);
