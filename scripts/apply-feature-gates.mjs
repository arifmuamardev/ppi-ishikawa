import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { featureForPath, featureState, featureStates, FEATURE_MODES } from '../src/config/features.mjs';

async function walk(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(absolute));
    else if (entry.isFile() && entry.name.endsWith('.html')) result.push(absolute);
  }
  return result;
}

function toRoute(root, file) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  return '/' + relative.replace(/index\.html$/, '').replace(/\.html$/, '/');
}

// Used by both the actual build and isolated fixture tests.
export async function applyFeatureGates(root = path.resolve('dist'), states = featureStates) {
  for (const [key, value] of Object.entries(states)) {
    if (!FEATURE_MODES.includes(value))
      throw new Error(`Invalid feature state ${key} = ${value}`);
  }
  const htmlFiles = await walk(root);
  let removed = 0;

  for (const file of htmlFiles) {
    const route = toRoute(root, file);
    const key = featureForPath(route);
    if (featureState(key, states) !== 'disabled') continue;
    await fs.unlink(file);
    removed++;
    console.log(`DISABLED ${key}: ${route}`);
  }

  // The Design Lab includes copied non-HTML assets which must also disappear.
  if (featureState('designLab', states) === 'disabled')
    await fs.rm(path.join(root, 'design-lab'), { recursive: true, force: true });

  // Don't accidentally upload an empty or homepage-less website.
  await fs.access(path.join(root, 'index.html'));
  const retained = await walk(root);
  if (!retained.length) throw new Error('Feature gating produced an empty site.');
  console.log(`Feature gating: ${removed} routes removed, ${retained.length} HTML pages retained.`);
  return { removed, retained: retained.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await applyFeatureGates();
  console.log('The internal-link audit runs AFTER gating; dangling links block publication.');
}
