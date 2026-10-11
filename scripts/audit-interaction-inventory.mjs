#!/usr/bin/env node
// Non-blocking source inventory. Presence of a token does NOT prove runtime/a11y compliance.
// Run from repository root: node scripts/audit-interaction-inventory.mjs [--json]
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const roots = ['src/pages', 'src/components'];
const root = process.cwd();

async function astroFiles(directory) {
  const entries = await readdir(join(root, directory), { withFileTypes: true });
  const groups = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return astroFiles(path);
    return entry.isFile() && entry.name.endsWith('.astro') ? [path] : [];
  }));
  return groups.flat();
}

function occurrences(source, re) {
  return [...source.matchAll(re)].length;
}

const files = (await Promise.all(roots.map(astroFiles))).flat().sort();
const entries = await Promise.all(files.map(async (path) => {
  const source = await readFile(join(root, path), 'utf8');
  return {
    path: relative(root, join(root, path)).split(sep).join('/'),
    forms: occurrences(source, /<form\b/gi),
    buttons: occurrences(source, /<button\b/gi),
    status: occurrences(source, /role\s*=\s*["']status["']/gi),
    alerts: occurrences(source, /role\s*=\s*["']alert["']/gi),
    live: occurrences(source, /aria-live\s*=/gi),
    busy: occurrences(source, /aria-busy\s*=/gi),
    invalid: occurrences(source, /aria-invalid\s*=/gi),
    messageContainers: occurrences(source, /id\s*=\s*["'][^"']*(?:message|feedback)["']/gi),
    eventHandlers: occurrences(source, /addEventListener\s*\(/gi)
  };
}));

const pageRows = entries.filter((e) => e.path.startsWith('src/pages/'));
const componentRows = entries.filter((e) => e.path.startsWith('src/components/'));
const formRows = pageRows.filter((e) => e.forms > 0);
const report = {
  sourceOnly: true,
  note: 'Counts reflect literal Astro source markup; script-built controls, imported components, keyboard behavior, network responses, and visible accessible feedback still require manual/browser verification.',
  pages: pageRows.length,
  components: componentRows.length,
  formFiles: formRows.length,
  formElements: formRows.reduce((sum, e) => sum + e.forms, 0),
  formFilesWithoutLiteralBusy: formRows.filter((e) => e.busy === 0).length,
  forms: formRows
};

if (process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
} else {
  process.stdout.write('# Interaction-state source inventory\n\n');
  process.stdout.write('Not a compliance pass/fail test: review runtime states, imported components and screen-reader behavior separately.\n\n');
  process.stdout.write(`Pages: ${report.pages}; Components: ${report.components}; Form elements: ${report.formElements} across ${report.formFiles} files.\n\n`);
  process.stdout.write('| Page source | Forms | Live | Status | Alert | Busy | Error field | Message containers |\n');
  process.stdout.write('|---|---:|---:|---:|---:|---:|---:|---:|\n');
  for (const r of formRows) {
    process.stdout.write(`| \`${r.path}\` | ${r.forms} | ${r.live} | ${r.status} | ${r.alerts} | ${r.busy} | ${r.invalid} | ${r.messageContainers} |\n`);
  }
}
