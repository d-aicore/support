#!/usr/bin/env node
// payload-scan.mjs — classifies the content classes inside a Qoder request payload so a rejected
// input can be explained without reading it. Read-only; prints shapes and counts, never payload text.
//
// Usage:
//   node payload-scan.mjs <session.jsonl|sessionId> [--around <history_index>] [--window 12] [--all] [--json]
//
// Provider-side input inspection (BYOK / Token Plan) answers only "<400> InternalError.Algo
// .DataInspectionFailed" and never says which span tripped it. The classes below are the ones a
// content-safety gate is known to react to, so their position in the history localizes the cause:
//   credential   secrets, tokens, private-key blocks          (a key in the input is a leak, full stop)
//   opaque       long base64 / hex runs                      (screenshots, tarballs, digests read as noise)
//   cjk-heavy    large CJK blocks from injected catalogs     (mixed-script payloads trip text filters)
//   moderation   the rejection text itself, re-sent forever  (sticky: the error poisons its own history)
//   dump         very large unstructured tool output
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const PROJECTS = process.env.QODER_PROJECTS || path.join(os.homedir(), '.qoder', 'projects');
if (!args[0]) { console.error('usage: payload-scan.mjs <session.jsonl|sessionId> [--around N] [--window 12] [--all]'); process.exit(1); }

let file = args[0];
if (!file.endsWith('.jsonl') || !fs.existsSync(file)) {
  for (const d of fs.readdirSync(PROJECTS)) {
    const cand = path.join(PROJECTS, d, args[0] + '.jsonl');
    if (fs.existsSync(cand)) { file = cand; break; }
  }
}
if (!fs.existsSync(file)) { console.error('ERROR: transcript not found: ' + args[0]); process.exit(1); }

const SECRET = [/github_pat_[A-Za-z0-9_]{8,}/g, /gh[pousr]_[A-Za-z0-9]{8,}/g, /\bsk-[A-Za-z0-9]{10,}/g,
  /Bearer\s+[A-Za-z0-9._-]{12,}/g, /-----BEGIN [A-Z ]*PRIVATE KEY-----/g, /api[_-]?key["'\s:=]{1,3}[A-Za-z0-9]{12,}/gi];
const OPAQUE = [/[A-Za-z0-9+/]{300,}={0,2}/g, /\b[0-9a-f]{64,}\b/g];
const CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef\uac00-\ud7af]/g;
const MODERATION = [/inappropriate content/gi, /DataInspectionFailed/gi, /内容审核/g, /敏感/g];
const URLRE = /https?:\/\/\S+/g;

const raw = fs.readFileSync(file, 'utf8');
const lines = raw.split('\n').filter((x) => x.trim());

function classify(text) {
  const n = (re) => (text.match(re) || []).length;
  const cjk = n(CJK);
  const out = {
    bytes: Buffer.byteLength(text, 'utf8'),
    credential: SECRET.reduce((a, r) => a + n(r), 0),
    opaque: OPAQUE.reduce((a, r) => a + n(r), 0),
    cjkChars: cjk,
    cjkRatio: +(cjk / Math.max(1, text.length)).toFixed(3),
    moderationEcho: MODERATION.reduce((a, r) => a + n(r), 0),
    urls: n(URLRE),
  };
  out.flags = Object.entries(out).filter(([k, v]) => k !== 'bytes' && k !== 'cjkRatio' && typeof v === 'number' && v > 0)
    .map(([k, v]) => `${k}=${v}`);
  return out;
}

const recs = [];
for (let i = 0; i < lines.length; i++) {
  let j; try { j = JSON.parse(lines[i]); } catch { recs.push({ i, role: 'unparseable', text: '' }); continue; }
  const c = (j.message && j.message.content) || j.content;
  let text = '';
  if (typeof c === 'string') text = c;
  else if (Array.isArray(c)) {
    for (const b of c) {
      if (!b || b.type === 'thinking' || b.type === 'reasoning') continue;      // never scanned, never quoted
      if (b.type === 'text' && b.text) text += b.text + '\n';
      else if (b.type === 'tool_result' || b.type === 'tool_use') {
        const s = JSON.stringify(b.input ?? b.content ?? '');
        text += (typeof s === 'string' ? s : '') + '\n';
      } else if (b.type === 'image') text += 'IMAGE_BASE64_PLACEHOLDER_'.repeat(20) + '\n';
      else text += JSON.stringify(b) + '\n';
    }
  }
  recs.push({ i, role: (j.message && j.message.role) || j.role || j.type || '?', text });
}

const total = recs.length;
const around = flag('--around', null);
const window = Number(flag('--window', 12));
let sel = recs;
if (around !== null) {
  const a = Number(around);
  sel = recs.slice(Math.max(0, a - window), a + window + 1);
} else if (!args.includes('--all')) {
  sel = recs.filter((r) => classify(r.text).flags.length).slice(0, 60);
}

console.log(`payload-scan — ${path.basename(file)} · ${total} records · showing ${sel.length}` +
  (around !== null ? ` around index ${around} (±${window})` : '') + '\n');
console.log('idx    role                 bytes  credential  opaque  cjkChars  cjkRatio  moderationEcho  urls  flags');
for (const r of sel) {
  const k = classify(r.text);
  console.log(String(r.i).padStart(5) + '  ' + String(r.role).padEnd(19) + ' ' + String(k.bytes).padStart(7) +
    String(k.credential).padStart(11) + String(k.opaque).padStart(8) + String(k.cjkChars).padStart(9) +
    String(k.cjkRatio).padStart(10) + String(k.moderationEcho).padStart(16) + String(k.urls).padStart(6) + '  ' + k.flags.join(' '));
}

// first index at which each class appears — the sticky-cause question
const firstSeen = {};
for (const r of recs) for (const f of classify(r.text).flags) { const key = f.split('=')[0]; if (firstSeen[key] === undefined) firstSeen[key] = r.i; }
console.log('\nfirst record carrying each class (if a class starts before a rejection and the route keeps failing, it is in every later input):');
for (const [k, v] of Object.entries(firstSeen)) console.log('  ' + k.padEnd(15) + ' index ' + v + ' of ' + total);
console.log('\nlimits: classification is by shape, not by meaning; the provider never says which span tripped, so this narrows the cause and cannot prove it.');
if (args.includes('--json')) console.log(JSON.stringify({ total, firstSeen }, null, 1));
