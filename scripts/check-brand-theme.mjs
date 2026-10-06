import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const brandPath = path.join(root, 'src', 'data', 'brand.ts');
const srcRoot = path.join(root, 'src');
const brandSource = fs.readFileSync(brandPath, 'utf8');

const periodMatch = brandSource.match(/period:\s*['"`]([^'"`]+)['"`]/);
if (!periodMatch) {
  console.error('Theme guard: could not read brandTheme.period from src/data/brand.ts');
  process.exit(1);
}

const period = periodMatch[1];
const colorKeys = ['primary', 'secondary', 'accent', 'surface', 'ink'];
const colors = new Map();

for (const key of colorKeys) {
  const match = brandSource.match(new RegExp(`${key}:\\s*['"](#(?:[0-9a-fA-F]{6}))['"]`));
  if (!match) {
    console.error(`Theme guard: missing or invalid brandTheme.colors.${key}`);
    process.exit(1);
  }
  colors.set(key, match[1].toLowerCase());
}

const extensions = new Set(['.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.html', '.mdx']);
const violations = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const files = walk(srcRoot).filter((file) => path.resolve(file) !== path.resolve(brandPath));
const amberPattern = /\b(?:bg|text|border|ring|outline|from|via|to|decoration|divide|shadow|fill|stroke)-amber-[0-9]{2,3}\b/g;

for (const file of files) {
  const relative = path.relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, index) => {
    const lowered = line.toLowerCase();

    if (line.includes(period)) {
      violations.push({
        file: relative,
        line: index + 1,
        type: 'period',
        detail: `Hardcoded active period "${period}". Use site.period or brandTheme.period.`
      });
    }

    for (const [key, hex] of colors) {
      if (lowered.includes(hex)) {
        violations.push({
          file: relative,
          line: index + 1,
          type: 'color',
          detail: `Hardcoded ${key} color ${hex}. Use semantic theme tokens.`
        });
      }
    }

    const amber = line.match(amberPattern);
    if (amber) {
      violations.push({
        file: relative,
        line: index + 1,
        type: 'legacy-amber',
        detail: `Legacy amber utility: ${amber.join(', ')}. Use semantic brand tokens.`
      });
    }
  });
}

if (violations.length) {
  console.error('Theme guard failed:\n');
  for (const item of violations) {
    console.error(`- ${item.file}:${item.line} [${item.type}] ${item.detail}`);
  }
  console.error(`\n${violations.length} violation(s) found.`);
  process.exit(1);
}

console.log(`Theme guard passed: ${files.length} source files checked; active period and five brand colors remain centralized in src/data/brand.ts.`);
