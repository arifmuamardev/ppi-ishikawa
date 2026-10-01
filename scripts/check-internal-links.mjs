import { promises as fs } from 'node:fs';
import path from 'node:path';

const srcRoot = path.resolve('src');
const pagesRoot = path.join(srcRoot, 'pages');

async function walk(dir, filter = () => true) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full, filter));
    else if (entry.isFile() && filter(entry.name)) out.push(full);
  }
  return out;
}

const pageFiles = await walk(pagesRoot, (name) => name.endsWith('.astro'));
const sourceFiles = await walk(srcRoot, (name) => name.endsWith('.astro') || name.endsWith('.ts'));

function routeFromPage(file) {
  const relative = path.relative(pagesRoot, file).replaceAll(path.sep, '/');
  if (relative.includes('[')) return null;

  let route = '/' + relative.replace(/\.astro$/, '');
  route = route.replace(/\/index$/, '/');
  if (!route.endsWith('/')) route += '/';
  route = route.replace(/\/+/g, '/');
  return route;
}

const routes = new Set(['/']);
for (const file of pageFiles) {
  const route = routeFromPage(file);
  if (route) routes.add(route);
}

const refs = new Map();
const literalPath = /['"`](\/(?!\/)[A-Za-z0-9_./#-]+)['"`]/g;

for (const file of sourceFiles) {
  const text = await fs.readFile(file, 'utf8');
  for (const match of text.matchAll(literalPath)) {
    const raw = match[1];
    if (
      raw.startsWith('/brand/') ||
      raw.startsWith('/images/') ||
      raw.startsWith('/illustrations/') ||
      raw.startsWith('/favicon') ||
      /\.[a-z0-9]{2,5}(?:#.*)?$/i.test(raw)
    ) continue;

    const pathname = raw.split('#')[0].split('?')[0];
    if (!pathname || pathname.includes('$') || pathname.includes('{')) continue;

    const normalized = pathname === '/'
      ? '/'
      : (pathname.endsWith('/') ? pathname : pathname + '/');

    if (!refs.has(normalized)) refs.set(normalized, new Set());
    refs.get(normalized).add(path.relative(process.cwd(), file));
  }
}

let broken = 0;
for (const [target, files] of refs) {
  if (routes.has(target)) {
    console.log(`OK     ${target}`);
  } else {
    broken += 1;
    console.error(`BROKEN ${target} :: ${[...files].join(', ')}`);
  }
}

console.log(`Checked ${refs.size} unique internal route literals. Broken: ${broken}.`);
if (broken > 0) process.exit(1);
