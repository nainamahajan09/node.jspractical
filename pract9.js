import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const nodeModulesPath = path.resolve('node_modules');
const visited = new Map();

function sha256OfDir(dir) {
  const hash = crypto.createHash('sha256');

  function processDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        processDir(fullPath);
      } else if (/\.(js|json|ts|mjs|cjs)$/.test(entry.name)) {
        const data = fs.readFileSync(fullPath);
        hash.update(data);
      }
    }
  }

  processDir(dir);
  return hash.digest('hex');
}

function detectLicense(pkgDir, pkgJson) {
  if (pkgJson.license) return pkgJson.license;

  const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'];
  for (const file of licenseFiles) {
    const filePath = path.join(pkgDir, file);
    if (fs.existsSync(filePath)) return `Detected in ${file}`;
  }

  return null;
}

function scanPackage(pkgDir) {
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) return null;

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  const name = pkgJson.name || path.basename(pkgDir);
  const version = pkgJson.version || 'unknown';
  const key = `${name}@${version}`;

  if (visited.has(key)) return visited.get(key);

  const license = detectLicense(pkgDir, pkgJson);
  const sha256 = sha256OfDir(pkgDir);

  const dependencies = pkgJson.dependencies || {};
  const deps = {};

  for (const depName of Object.keys(dependencies)) {
    const depDir = path.join(pkgDir, 'node_modules', depName);
    if (fs.existsSync(depDir)) {
      const subPkg = scanPackage(depDir);
      if (subPkg) deps[depName] = subPkg;
    } else {
      const topDepDir = path.join(nodeModulesPath, depName);
      if (fs.existsSync(topDepDir)) {
        const subPkg = scanPackage(topDepDir);
        if (subPkg) deps[depName] = subPkg;
      }
    }
  }

  const info = { name, version, license, sha256, dependencies: deps };
  visited.set(key, info);
  return info;
}

function scanAll() {
  const results = {};
  const topPackages = fs.readdirSync(nodeModulesPath);

  for (const dir of topPackages) {
    if (dir.startsWith('.')) continue;
    const pkgPath = path.join(nodeModulesPath, dir);
    if (fs.statSync(pkgPath).isDirectory()) {
      if (dir.startsWith('@')) {
        for (const scopedPkg of fs.readdirSync(pkgPath)) {
          const subPath = path.join(pkgPath, scopedPkg);
          const pkg = scanPackage(subPath);
          if (pkg) results[pkg.name] = pkg;
        }
      } else {
        const pkg = scanPackage(pkgPath);
        if (pkg) results[pkg.name] = pkg;
      }
    }
  }

  return results;
}

function reportNoLicense(graph) {
  const missing = [];

  function walk(pkg) {
    if (!pkg.license) missing.push(`${pkg.name}@${pkg.version}`);
    for (const dep of Object.values(pkg.dependencies)) {
      walk(dep);
    }
  }

  for (const pkg of Object.values(graph)) {
    walk(pkg);
  }

  return missing;
}

const dependencyGraph = scanAll();
const noLicensePkgs = reportNoLicense(dependencyGraph);

fs.writeFileSync('dependency-graph.json', JSON.stringify(dependencyGraph, null, 2));
fs.writeFileSync('missing-licenses.json', JSON.stringify(noLicensePkgs, null, 2));

console.log('✅ Dependency graph saved to dependency-graph.json');
console.log('⚠️ Packages without license saved to missing-licenses.json');
