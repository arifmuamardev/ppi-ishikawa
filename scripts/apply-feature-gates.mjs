import { promises as fs } from 'node:fs';
import path from 'node:path';
import { featureForPath, featureState, featureStates } from '../src/config/features.mjs';

// Runs after Astro generates dist/. GitHub Pages deploys ONLY that directory.
// Unlike CSS/JS hiding, disabled routes are removed from the published artifact.
const dist = path.resolve('dist');

async function walk(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(absolute));
    else if (entry.isFile() && entry.name.endsWith('.html')) result.push(absolute);
  }
  return result;
}

function toRoute(file) {
  const relative = path.relative(dist, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  return '/' + relative.replace(/index\.html$/, '').replace(/\.html$/, '/');
}

for (const [key, state] of Object.entries(featureStates)) {
  if (!['enabled', 'hidden', 'disabled'].includes(state))
    throw new Error(`Invalid feature state ${key} = ${state}`);
}

const htmlFiles = await walk(dist);
let removed = 0;
for (const file of htmlFiles) {
  const route = toRoute(file);
  const key = featureForPath(route);
  if (featureState(key) !== 'disabled') continue;
  await fs.unlink(file);
  removed++;
  console.log(`DISABLED ${key}: ${route}`);
}

// Static assets from public/design-lab are copied outside Astro page routing.
// When disabled, remove the whole lab directory, including SVG and HTML assets.
if (featureState('designLab') === 'disabled') {
  await fs.rm(path.join(dist, 'design-lab'), { recursive: true, force: true });
}

// Avoid publishing an empty document tree or mistakenly removing the home page.
await fs.access(path.join(dist, 'index.html'));
const retained = await walk(dist);
if (!retained.length) throw new Error('Feature gating produced an empty site.');

console.log(`Feature gating: ${removed} routes removed, ${retained.length} HTML pages retained.`);
console.log('Run check-internal-links.mjs after this script. Broken links block publication.');
