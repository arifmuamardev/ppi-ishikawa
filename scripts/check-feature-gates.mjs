import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { applyFeatureGates } from './apply-feature-gates.mjs';
import { featureStates } from '../src/config/features.mjs';

const temp = await fs.mkdtemp(path.join(tmpdir(), 'ppi-feature-fixture-'));
const make = async (name) => {
  const file = path.join(temp, name);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, '<!doctype html><title>Fixture</title>');
};
const exists = async (name) => fs.access(path.join(temp, name)).then(() => true, () => false);

try {
  for (const name of [
    'index.html',
    'member/index.html',
    'member/admin/events/index.html',
    'member/card/index.html',
    'stories/index.html',
    'community/kampus/index.html',
    'life-in-ishikawa/family-anak/index.html',
    'life-in-ishikawa/places/index.html',
    'design-lab/unnes-inspired/index.html',
    'design-lab/unnes-inspired/map.svg',
    'verify/member/index.html',
  ]) await make(name);

  const states = { ...featureStates, membership: 'disabled', stories: 'disabled', places: 'disabled', familyGuide: 'hidden', designLab: 'disabled' };
  const result = await applyFeatureGates(temp, states);
  assert.equal(result.removed, 6, 'Five HTML routes + Design Lab HTML should be removed');
  for (const name of [
    'member/index.html', 'member/admin/events/index.html', 'member/card/index.html',
    'stories/index.html', 'life-in-ishikawa/places/index.html',
    'design-lab/unnes-inspired/index.html', 'design-lab/unnes-inspired/map.svg',
  ]) assert.equal(await exists(name), false, name);
  for (const name of [
    'index.html', 'community/kampus/index.html', 'life-in-ishikawa/family-anak/index.html',
    'verify/member/index.html',
  ]) assert.equal(await exists(name), true, name);

  console.log('Feature build-gate fixture passed (disabled, hidden, nested routes and lab assets).');
} finally {
  await fs.rm(temp, { recursive: true, force: true });
}
