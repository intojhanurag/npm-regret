import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import fg from 'fast-glob';

const jsLikeGlobs = [
  '**/*.{js,jsx,ts,tsx,cjs,mjs}',
  '**/*.{vue,svelte}',
];

function readJSONSafe(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function collectImportsFromText(text) {
  const results = new Set();
  const patterns = [
    /import\s+[^\"\'\`]*[\"\'\`]([^\"\'\`]+)[\"\'\`]/g,
    /require\(\s*[\"\'\`]([^\"\'\`]+)[\"\'\`]\s*\)/g,
    /from\s+[\"\'\`]([^\"\'\`]+)[\"\'\`]/g,
    /\bimport\(\s*[\"\'\`]([^\"\'\`]+)[\"\'\`]\s*\)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text))) {
      results.add(m[1]);
    }
  }
  return Array.from(results);
}

function isExternalPackage(specifier) {
  if (!specifier) return false;
  if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('~')) return false;
  const first = specifier.split('/')[0];
  return !!first;
}

export async function analyzeProject(cwd) {
  const pkgPath = path.join(cwd, 'package.json');
  const pkg = readJSONSafe(pkgPath) || {};
  const deps = Object.keys({ ...(pkg.dependencies||{}), ...(pkg.devDependencies||{}) });

  const ignore = [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/.nuxt/**',
  ];
  const files = await fg([...jsLikeGlobs, '**/*.{json,yaml,yml}', 'package.json'], { cwd, ignore, absolute: true });

  const usedPackages = new Set();
  for (const file of files) {
    try {
      const text = fs.readFileSync(file, 'utf8');
      for (const spec of collectImportsFromText(text)) {
        if (isExternalPackage(spec)) {
          const pkgName = spec.startsWith('@') ? spec.split('/').slice(0,2).join('/') : spec.split('/')[0];
          usedPackages.add(pkgName);
        }
      }
    } catch {}
  }

  const unused = deps.filter(d => !usedPackages.has(d));

  const installed = new Set(Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {})));
  const missing = Array.from(usedPackages).filter(name => !installed.has(name));

  const outdated = [];
  try {
    const res = spawnSync('npm', ['outdated', '--json'], { cwd, encoding: 'utf8' });
    if (res.status === 0 || res.status === 1) {
      if (res.stdout && res.stdout.trim()) {
        const data = JSON.parse(res.stdout);
        for (const [name, info] of Object.entries(data)) {
          outdated.push({ name, current: info.current, latest: info.latest });
        }
      }
    }
  } catch {}

  return { unused, missing, outdated };
}
