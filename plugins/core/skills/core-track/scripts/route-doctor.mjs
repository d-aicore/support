#!/usr/bin/env node
// route-doctor.mjs — explains and repairs a provider-side input rejection. Read-only.
//
//   node route-doctor.mjs [--runs <dir>] [--projects <dir>] [--since YYYY-MM-DD] [--window 6]
//
// Problem this solves: on a BYOK / Token Plan route the provider answers
//   Responses <400> InternalError.Algo.DataInspectionFailed: Input text data may contain inappropriate content
// It never says which span tripped, it cannot be switched off from the client, and the client re-sends
// the *identical* input several times, so the retry is wasted and the symptom looks random.
//
// Method: the verdict belongs to the whole assembled input, so localize it by contrast instead of by
// guessing. Rejections are compared with the turns that passed on the same route, using the per-turn
// injection record in the session transcript. A class that appears only with rejections is a candidate
// cause; a class present on both sides is exonerated with evidence.
//
// Privacy: only record indices, types, byte sizes and name counts leave this script. No prompt text,
// no tool output, no credential value is printed or written.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const RUNS = flag('--runs', path.join(os.homedir(), '.qoder', 'logs', 'runs'));
const PROJECTS = flag('--projects', path.join(os.homedir(), '.qoder', 'projects'));
const SINCE = flag('--since', '2026-11-01');
const WIN = Number(flag('--window', 6));
const POLICY = flag('--policy', null);
const AUDIT_ARGS = [path.join(HERE, 'route-audit.mjs'), '--runs', RUNS, '--since', SINCE, '--json'];
if (POLICY) AUDIT_ARGS.push('--policy', POLICY);
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));

// route-audit prints a human table then the JSON body; read the body from one call.
const raw = execFileSync(process.execPath, AUDIT_ARGS, { encoding: 'utf8', maxBuffer: 64 << 20 });
const start = raw.indexOf('{\n "generated"');
if (start < 0) { console.error('ERROR: no JSON body from route-audit'); process.exit(1); }
const audit = JSON.parse(raw.slice(start));

const mods = audit.moderationTurns || [];
if (!mods.length) {
  console.log(raw.slice(0, start));
  console.log('route-doctor — no DataInspectionFailed rejection found in the window. Nothing to repair.');
  process.exit(0);
}

console.log(raw.slice(0, start));                               // the measured route table, verbatim

// ---- locate the transcripts that hold the compared turns
function transcriptFor(sessionId) {
  if (!fs.existsSync(PROJECTS)) return null;
  for (const d of fs.readdirSync(PROJECTS)) {
    const f = path.join(PROJECTS, d, sessionId + '.jsonl');
    if (fs.existsSync(f)) return f;
  }
  return null;
}
const cache = new Map();
function records(file) {
  if (cache.has(file)) return cache.get(file);
  const out = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let j; try { j = JSON.parse(line); } catch { continue; }
    out.push(j);
  }
  cache.set(file, out);
  return out;
}
function near(file, tsIso) {
  const recs = records(file);
  const t0 = Date.parse(tsIso), lo = t0 - WIN * 1000;
  const hits = [];
  recs.forEach((j, i) => {
    if (j.type !== 'attachment') return;
    const t = Date.parse(j.timestamp || '');
    if (!(t >= lo && t <= t0)) return;
    const a = j.attachment || {};
    hits.push({ i, kind: String(a.type || '?'), bytes: Buffer.byteLength(a.content || '', 'utf8'), added: (a.addedNames || []).length });
  });
  return { total: recs.length, injected: hits };
}

const sessions = [...new Set(mods.map((m) => m.session))];
const files = new Map(sessions.map((s) => [s, transcriptFor(s)]));
console.log('\ntranscripts: ' + sessions.map((s) => s.slice(0, 8) + (files.get(s) ? ' found' : ' NOT FOUND')).join(', '));

// ---- compare: injections carried by rejected turns vs turns that passed on the same route
const rejected = mods.filter((m) => files.get(m.session));
const passed = (audit.routeSample || []).filter((t) => t.outcome !== 'error' && files.get(t.session));
function cooccur(list) {
  const agg = new Map();
  let withInjection = 0;
  for (const t of list) {
    const f = files.get(t.session);
    if (!f) continue;
    const { injected } = near(f, t.ts);
    if (injected.length) withInjection++;
    for (const h of injected) {
      const a = agg.get(h.kind) || { turns: 0, bytes: 0, added: 0 };
      a.turns++; a.bytes += h.bytes; a.added += h.added;
      agg.set(h.kind, a);
    }
  }
  return { agg, n: list.length, withInjection };
}
const R = cooccur(rejected), P = cooccur(passed);
console.log(`\ninjected block classes — rejected turns (n=${R.n}, ${R.withInjection} carried one) vs passed turns on the same route (n=${P.n}, ${P.withInjection} carried one):`);
console.log('  class                      rejected: turns  meanBytes  addedNames    passed: turns  meanBytes  addedNames   reading');
for (const kind of [...new Set([...R.agg.keys(), ...P.agg.keys()])].sort()) {
  const r = R.agg.get(kind) || { turns: 0, bytes: 0, added: 0 };
  const p = P.agg.get(kind) || { turns: 0, bytes: 0, added: 0 };
  const onlyRej = r.turns > 0 && p.turns === 0, onlyPass = r.turns === 0 && p.turns > 0;
  const reading = onlyRej ? 'CANDIDATE — never on a passed turn' : onlyPass ? 'EXONERATED — present only where the request passed'
    : 'present on both sides — cannot carry the cause alone';
  console.log('  ' + kind.padEnd(26) + String(r.turns).padStart(8) + String(r.turns ? Math.round(r.bytes / r.turns) : 0).padStart(11) + String(r.added).padStart(11) +
    '   ' + String(p.turns).padStart(11) + String(p.turns ? Math.round(p.bytes / p.turns) : 0).padStart(11) + String(p.added).padStart(11) + '   ' + reading);
}

const byR = audit.byRoute.find((r) => r.route === audit.routeName) || {};
console.log(`\nverdict: route ${audit.routeName} — ${byR.ok || 0} passed, ${byR.moderation || 0} rejected by provider input inspection` +
  ` (${byR.turns ? (100 * (byR.moderation || 0) / byR.turns).toFixed(0) : '?'}% of its turns). The route works; the assembled input does not always pass.`);
console.log('The classes above are correlations over a small N. They narrow the cause; they do not prove a span.');
console.log('\nrepair ladder — in order, stop at the first that works:');
console.log(' 1. Do not re-send the identical input. Retries reproduce the verdict; the client already burned its own retries.');
console.log(' 2. Change the route, not the words: select the Qoder system entry (displayName Qwen4-Max-Preview, modelKey qmodel_latest_preview)');
console.log('    over the BYOK entry (qwen4-max-preview). Same model, no provider input inspection, no 8192 output ceiling, price factor 0.1.');
console.log('    The two entries differ only by source; the BYOK one is what carries the moderation gate.');
console.log(' 3. If the Token Plan route is required: change the input instead of retrying it. Hand the intent to a fresh session through the');
console.log('    repository (core-evidence handoff + proof stage resume), or shrink the injected surface the comparison above flags as CANDIDATE');
console.log('    by disconnecting the MCP server or plugin that produced it. A CANDIDATE with turns=1 is a lead, not a cause: widen --window/--since.');
console.log('    That surface costs context on every turn anyway.');
console.log(' 4. On this route every stage return must fit 8192 output tokens: one stage per agent, report written by the scribe, never a paste.');
console.log(' 5. Profiles must not pin a byok: model key. model: inherit keeps the route a session-level decision (defect fixed in v0.3.0).');
console.log('\nlimits:');
console.log(' - a rejection with no matching transcript, or an attachment injected before the window, is invisible to this comparison.');
console.log(' - outcome !== error counts as passed, including turns the owner stopped.');
console.log(' - the provider verdict is per assembled input; two byte-identical inputs are not guaranteed the same answer.');
