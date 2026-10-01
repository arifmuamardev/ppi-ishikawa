import { promises as fs } from 'node:fs';
import path from 'node:path';

const distRoot = path.resolve('dist');
const base = '/ppi-ishikawa';

async function walk(dir, filter = () => true) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full, filter));
    else if (entry.isFile() && filter(entry.name)) out.push(full);
  }
  return out;
}

function routeFromHtml(file) {
  let relative = path.relative(distRoot, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  relative = relative.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  return '/' + relative.replace(/^\/+/, '');
}

function normalizeInternalHref(raw) {
  if (!raw || raw.startsWith('#')) return null;
  if (/^(?:https?:|mailto:|tel:|javascript:)/i.test(raw)) return null;

  const [beforeHash, fragment = ''] = raw.split('#');
  const pathname = beforeHash.split('?')[0];

  const assetPath = pathname.startsWith(base + '/') ? pathname.slice(base.length) : pathname;
  if (
    assetPath.startsWith('/_astro/') ||
    assetPath.startsWith('/brand/') ||
    assetPath.startsWith('/images/') ||
    assetPath.startsWith('/illustrations/') ||
    /\.[a-z0-9]{2,8}$/i.test(assetPath)
  ) return null;

  let normalized = pathname;
  if (normalized.startsWith(base + '/')) normalized = normalized.slice(base.length);
  else if (normalized === base) normalized = '/';

  if (!normalized.startsWith('/')) return null;
  if (normalized !== '/' && !normalized.endsWith('/')) normalized += '/';

  return { route: normalized, fragment };
}

const htmlFiles = await walk(distRoot, (name) => name.endsWith('.html'));
const routes = new Map();

for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  const route = routeFromHtml(file);
  const ids = new Set();

  for (const match of html.matchAll(/\sid=["']([^"']+)["']/g)) {
    ids.add(match[1]);
  }

  routes.set(route, { file, html, ids });
}

let checkedRoutes = 0;
let checkedFragments = 0;
let broken = 0;

for (const [sourceRoute, page] of routes) {
  for (const match of page.html.matchAll(/\shref=["']([^"']+)["']/g)) {
    const raw = match[1];

    if (raw.startsWith('#')) {
      const fragment = raw.slice(1);
      if (!fragment) continue;
      checkedFragments += 1;
      if (!page.ids.has(fragment)) {
        broken += 1;
        console.error(`BROKEN #${fragment} :: ${sourceRoute}`);
      }
      continue;
    }

    const target = normalizeInternalHref(raw);
    if (!target) continue;

    checkedRoutes += 1;
    const destination = routes.get(target.route);

    if (!destination) {
      broken += 1;
      console.error(`BROKEN ${target.route} :: linked from ${sourceRoute}`);
      continue;
    }

    if (target.fragment) {
      checkedFragments += 1;
      if (!destination.ids.has(target.fragment)) {
        broken += 1;
        console.error(`BROKEN ${target.route}#${target.fragment} :: linked from ${sourceRoute}`);
      }
    }
  }
}

console.log(
  `Checked ${routes.size} rendered routes, ${checkedRoutes} internal links, and ${checkedFragments} fragment links. Broken: ${broken}.`
);

if (broken > 0) process.exit(1);
