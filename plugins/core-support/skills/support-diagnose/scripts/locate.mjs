#!/usr/bin/env node
// locate.mjs — resolves the root of the working `core` plugin so support skills run the real
// instruments instead of guessing paths. Read-only; prints one path or fails loudly.
// Order: env CORE_PLUGIN_ROOT -> support repo plugins/core -> legacy live dir -> installed cache.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const supportPlugins = path.resolve(here, '..', '..', '..', '..');    // .../plugins
const candidates = [
  process.env.CORE_PLUGIN_ROOT,
  path.join(supportPlugins, 'core'),
  'D:/CORE-ORG/core',
].filter(Boolean);

const cache = path.join(os.homedir(), '.qoder', 'plugins', 'cache');
if (fs.existsSync(cache)) {
  for (const scope of fs.readdirSync(cache)) {
    const p = path.join(cache, scope, 'core');
    if (fs.existsSync(p)) for (const v of fs.readdirSync(p)) candidates.push(path.join(p, v));
  }
}

const marker = path.join('skills', 'core-track', 'scripts', 'route-audit.mjs');
for (const c of candidates) {
  if (fs.existsSync(path.join(c, marker))) {
    console.log(c);
    process.exit(0);
  }
}
console.error('ERROR: no working core plugin found. Set CORE_PLUGIN_ROOT or install plugins/core.');
process.exit(1);
