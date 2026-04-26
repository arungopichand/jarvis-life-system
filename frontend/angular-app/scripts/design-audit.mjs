#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = [
  join(ROOT, 'src', 'app', 'components'),
  join(ROOT, 'src', 'app')
];

const FILE_EXTS = new Set(['.ts', '.scss']);
const HARD_HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const HARD_RGBA_RE = /rgba\((?!\s*var\()[^)]+\)/g;
const HARD_RGB_RE = /rgb\((?!\s*var\()[^)]+\)/g;
const LINEAR_GRADIENT_RE = /(linear-gradient\([^;]+?\))/g;
const RADIAL_GRADIENT_RE = /(radial-gradient\([^;]+?\))/g;
const BOX_SHADOW_DECL_RE = /box-shadow:\s*([^;]+);/g;

const ignorePathPart = ['node_modules', 'dist', '.angular'];
const APP_SHELL_FILE = 'src/app/app.scss';

// Intentional integration-level literals in app shell. Keep this list small.
const ALLOWED_SHELL_COLOR_LITERALS = new Set([
  'rgba(255, 255, 255, 0.06)',
  'rgba(21, 26, 34, 0.97)',
  'rgba(13, 16, 22, 0.98)',
  'rgba(18, 22, 30, 0.98)',
  'rgba(22, 27, 36, 0.96)',
  'rgba(16, 20, 28, 0.98)',
  'rgba(15, 25, 31, 0.96)',
  'rgba(18, 22, 30, 0.97)',
  'rgba(9, 12, 17, 0.99)'
]);

function walk(dir, out = []) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (ignorePathPart.some((p) => full.includes(`${p}`))) continue;
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
      continue;
    }
    const ext = extname(full).toLowerCase();
    if (FILE_EXTS.has(ext)) out.push(full);
  }
  return out;
}

function addMapCount(map, key, file) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(file);
}

function collectMatches(content, re) {
  const matches = content.match(re);
  return matches ?? [];
}

const files = Array.from(
  new Set(TARGET_DIRS.flatMap((d) => walk(d)))
).filter((f) => !f.endsWith('.spec.ts'));

const hardcodedFindings = [];
const componentHardcodedErrors = [];
const allowedShellWarnings = [];
const gradientCounts = new Map();
const shadowCounts = new Map();

for (const file of files) {
  const rel = relative(ROOT, file).replaceAll('\\', '/');
  const content = readFileSync(file, 'utf8');

  const isComponentFile = rel.startsWith('src/app/components/');
  const isShellFile = rel === APP_SHELL_FILE;

  const colorMatches = [
    ...collectMatches(content, HARD_HEX_RE).map((value) => ({ type: 'hex', value })),
    ...collectMatches(content, HARD_RGBA_RE).map((value) => ({ type: 'rgba', value })),
    ...collectMatches(content, HARD_RGB_RE).map((value) => ({ type: 'rgb', value }))
  ];

  for (const m of colorMatches) {
    const finding = { ...m, file: rel };
    hardcodedFindings.push(finding);

    if (isComponentFile) {
      componentHardcodedErrors.push(finding);
      continue;
    }

    if (isShellFile && ALLOWED_SHELL_COLOR_LITERALS.has(m.value)) {
      allowedShellWarnings.push(finding);
    }
  }

  for (const m of collectMatches(content, LINEAR_GRADIENT_RE)) {
    addMapCount(gradientCounts, `linear-gradient:${m}`, rel);
  }
  for (const m of collectMatches(content, RADIAL_GRADIENT_RE)) {
    addMapCount(gradientCounts, `radial-gradient:${m}`, rel);
  }
  for (const m of content.matchAll(BOX_SHADOW_DECL_RE)) {
    addMapCount(shadowCounts, m[1].trim(), rel);
  }
}

function printSection(title) {
  process.stdout.write(`\n[design:audit] ${title}\n`);
}

process.stdout.write('[design:audit] Starting design system audit...\n');
process.stdout.write(`[design:audit] Scanned ${files.length} files.\n`);
process.stdout.write(
  `[design:audit] Hardcoded color findings: ${hardcodedFindings.length} total, ${componentHardcodedErrors.length} component-level errors.\n`
);

if (hardcodedFindings.length === 0) {
  printSection('No hardcoded hex/rgb/rgba values found in scanned files.');
} else {
  printSection('Hardcoded color literals found:');
  for (const f of hardcodedFindings.slice(0, 120)) {
    process.stdout.write(`- ${f.file} :: ${f.type} ${f.value}\n`);
  }
  if (hardcodedFindings.length > 120) {
    process.stdout.write(`...and ${hardcodedFindings.length - 120} more findings.\n`);
  }
}

if (allowedShellWarnings.length > 0) {
  printSection(`Allowed shell exceptions (${allowedShellWarnings.length}) in ${APP_SHELL_FILE}:`);
  for (const f of allowedShellWarnings) {
    process.stdout.write(`- ${f.type} ${f.value}\n`);
  }
}

const repeatedGradients = [...gradientCounts.entries()]
  .filter(([, set]) => set.size > 1)
  .sort((a, b) => b[1].size - a[1].size);

if (repeatedGradients.length === 0) {
  printSection('No repeated gradient literals across files.');
} else {
  printSection('Repeated gradient literals (consider token/utility extraction):');
  for (const [gradient, filesSet] of repeatedGradients.slice(0, 40)) {
    process.stdout.write(`- Used in ${filesSet.size} files :: ${gradient}\n`);
  }
}

const repeatedShadows = [...shadowCounts.entries()]
  .filter(([, set]) => set.size > 1)
  .sort((a, b) => b[1].size - a[1].size);

if (repeatedShadows.length === 0) {
  printSection('No repeated box-shadow literals across files.');
} else {
  printSection('Repeated box-shadow literals (consider token/utility extraction):');
  for (const [shadow, filesSet] of repeatedShadows.slice(0, 40)) {
    process.stdout.write(`- Used in ${filesSet.size} files :: box-shadow: ${shadow}\n`);
  }
}

printSection('Audit complete.');
if (componentHardcodedErrors.length > 0) {
  printSection(
    `FAIL: ${componentHardcodedErrors.length} component-level hardcoded color findings. Replace with tokens/utilities.`
  );
  process.exit(2);
}

printSection('PASS: no component-level hardcoded color findings.');
process.exit(0);
