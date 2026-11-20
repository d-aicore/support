#!/usr/bin/env node
// route-audit.mjs — joins Qoder run-log turns to their model route and outcome, and reports where
// provider-side input moderation rejects a request. Read-only. Nothing is written unless --out is given.
//
// Usage:
//   node route-audit.mjs [--runs <dir>] [--since YYYY-MM-DD] [--files <a.log,b.log>]
//                        [--policy <modelKey substring>] [--ceiling 8192] [--json] [--out file.json]
//
// Why: a Token Plan (BYOK custom provider) model rejects with
//   400 InternalError.Algo.DataInspectionFailed: Input text data may contain inappropriate content
// The client cannot disable that inspection, so the only actionable question is deterministic and
// local: does the rejection depend on the ROUTE (then the route is unusable) or on the PAYLOAD
// (then the network must keep payloads inside what the route tolerates)? This answers it from logs.
//
// Privacy: prompt text is never kept. Only lengths, timestamps and a 12-char sha256 prefix.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const has = (n) => args.includes(n);
const RUNS = flag('--runs', path.join(os.homedir(), '.qoder', 'logs', 'runs'));
const SINCE = flag('--since', null);
const FILES = flag('--files', null);

const RE_START = /turn\.started model="([^"]+)"[^\n]*/;
const RE_KV = /(\w+)=(?:"([^"]*)"|(\d+))/g;
const RE_FINISH = /turn\.finished/;
const RE_RETRY = /\[custom-model-retry\] replaying inference/;

function routeOf(model) {
  if (/^qoder-custom-/.test(model)) return 'BYOK custom provider (Token Plan)';
  if (/^qmodel/.test(model)) return 'Qoder system route';
  if (/efficient/.test(model)) return 'efficient (free)';
  return model;
}

function collectFiles() {
  if (FILES) return FILES.split(',').map((f) => f.trim()).filter(Boolean);
  if (!fs.existsSync(RUNS)) { console.error('ERROR: runs dir not found: ' + RUNS); process.exit(1); }
  return fs.readdirSync(RUNS)
    .map((d) => ({ dir: d, log: path.join(RUNS, d, 'qodercli.log') }))
    .filter((x) => fs.existsSync(x.log))
    .filter((x) => !SINCE || (x.dir.slice(0, 10) >= SINCE))
    .map((x) => x.log);
}

const turns = new Map();          // turnId -> {run, session, model, route, promptLength, historyLength, startedAt, retries}
let retryLines = 0, inspectionLines = 0, filesRead = 0, bytes = 0;

// Per-turn attachment profile: which generators produced content and how much. This is how a
// rejection is attributed without the request body: the payload is history + per-turn attachments,
// and only the attachments change shape between adjacent turns.
const attach = new Map();         // turnId -> { label: count }
const totals = new Map();         // turnId -> total attachment count
function noteAttach(turnId, label, count) {
  if (!turnId) return;
  if (!attach.has(turnId)) attach.set(turnId, {});
  const a = attach.get(turnId);
  a[label] = (a[label] || 0) + Number(count);
}

// Only genuine log records are parsed. The log also echoes the agent's own shell commands
// (tool.requested / tool.shell.started / hook_input), and a command that merely *mentions*
// "turn.finished" or "DataInspectionFailed" would otherwise be counted as a real turn outcome.
const RECORD = /\] (turn\.started|turn\.finished|attachment\.generator\.finished|session\.phase\.finished) |debug\.message \[custom-model-retry\]/;

function processLine(line, run) {
  if (!RECORD.test(line)) return;
  if (line.includes('attachment.generator.finished')) {
    const tid = /turn=([^\s\]]+)/.exec(line);
    const label = /label="([^"]+)"/.exec(line);
    const count = /count=(\d+)/.exec(line);
    if (tid && label && count) noteAttach(tid[1], label[1], count[1]);
    return;
  }
  if (line.includes('session.phase.finished') && line.includes('phase="input.attachments.collect"')) {
    const tid = /turn_id="([^\s"]+)"/.exec(line);
    const count = /count=(\d+)/.exec(line);
    if (tid && count) totals.set(tid[1], Number(count[1]));
    return;
  }
  if (line.includes('turn.started model=')) {
    const m = RE_START.exec(line);
    if (!m) return;
    const ts = line.slice(0, 24).trim();
    const sess = /session=([^\s\]]+)/.exec(line);
    const tid = /turn=([^\s\]]+)/.exec(line);
    const kv = {};
    for (const pair of line.matchAll(/(\w+)=(?:"([^"]*)"|(\d+))/g)) kv[pair[1]] = pair[2] !== undefined ? pair[2] : Number(pair[3]);
    if (!tid) return;
    turns.set(tid[1], {
      run, ts, session: sess ? sess[1] : '?', model: m[1], route: routeOf(m[1]),
      promptLength: kv.prompt_length ?? null, historyLength: kv.history_length ?? null, retries: 0,
    });
    return;
  }
  if (RE_RETRY.test(line)) { retryLines++; for (const [, v] of turns) if (v.route.startsWith('BYOK') && !v.outcome) v.retries++; return; }
  if (RE_FINISH.test(line)) {
    const tid = /turn=([^\s\]]+)/.exec(line);
    if (!tid || !turns.has(tid[1])) return;
    const t = turns.get(tid[1]);
    const kv = {};
    for (const pair of line.matchAll(/(\w+)=(?:"([^"]*)"|(-?\d+))/g)) kv[pair[1]] = pair[2] !== undefined ? pair[2] : Number(pair[3]);
    const err = kv.error || '';
    t.outcome = err ? 'error' : (kv.reason || 'finished');
    t.reason = kv.reason || null;
    t.inputTokens = kv.input_tokens ?? null;
    t.outputTokens = kv.output_tokens ?? null;
    if (err) {
      if (/DataInspectionFailed/.test(err)) inspectionLines++;
      t.errorClass = /DataInspectionFailed/.test(err) ? 'input moderation 400 (DataInspectionFailed)'
        : /status[_ ]?429|rate/i.test(err) ? 'rate limit'
        : /timeout|deadline/i.test(err) ? 'timeout'
        : err.slice(0, 60);
      t.errorHash = crypto.createHash('sha256').update(err).digest('hex').slice(0, 12);
      t.billed = (kv.input_tokens ?? 0) + (kv.output_tokens ?? 0);
      t.durationMs = kv.duration_ms ?? null;
      t.numTurns = kv.num_turns ?? null;
    }
  }
}

function streamFile(file) {
  return new Promise((resolve) => {
    const run = path.basename(path.dirname(file));
    const rl = fs.createReadStream(file, { encoding: 'utf8' });
    let buf = '';
    rl.on('data', (chunk) => {
      bytes += chunk.length;
      buf += chunk;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 1);
        if (/turn\.started model=|turn\.finished|DataInspectionFailed|custom-model-retry|attachment\.generator\.finished|input\.attachments\.collect/.test(line)) {
          processLine(line, run);
        }
      }
    });
    rl.on('end', () => { filesRead++; resolve(); });
    rl.on('error', () => { filesRead++; resolve(); });
  });
}

const list = collectFiles();
for (const f of list) await streamFile(f);

// ---- aggregate per route
const byRoute = new Map();
for (const t of turns.values()) {
  if (!byRoute.has(t.route)) byRoute.set(t.route, { route: t.route, turns: 0, ok: 0, err: 0, moderation: 0, hlOk: [], hlErr: [], days: new Set() });
  const a = byRoute.get(t.route);
  a.turns++;
  a.days.add(t.ts.slice(0, 10));
  if (t.outcome === 'error') {
    a.err++;
    if (t.errorClass === 'input moderation 400 (DataInspectionFailed)') { a.moderation++; if (t.historyLength != null) a.hlErr.push(t.historyLength); }
    else a.hlErr.push(t.historyLength);
  } else { a.ok++; if (t.historyLength != null) a.hlOk.push(t.historyLength); }
}
const stat = (xs) => xs.length ? `n=${xs.length} min=${Math.min(...xs)} med=${xs.sort((p, q) => p - q)[Math.floor(xs.length / 2)]} max=${Math.max(...xs)}` : 'n=0';

const rows = [...byRoute.values()].sort((x, y) => y.moderation - x.moderation || y.turns - x.turns);
console.log(`route-audit — ${filesRead}/${list.length} logs, ${(bytes / 1e6).toFixed(1)} MB, ${turns.size} turns\n`);
console.log('route                                  turns   ok  err  moderation-400   history (ok)          history (err)         days');
for (const r of rows) {
  console.log(
    r.route.padEnd(36) + String(r.turns).padStart(6) + String(r.ok).padStart(6) + String(r.err).padStart(5) +
    String(r.moderation).padStart(16) + '   ' + stat(r.hlOk).padEnd(22) + ' ' + stat(r.hlErr).padEnd(20) + ' ' + [...r.days].join(','));
}

const POLICY = flag('--policy', null);   // substring of the only permitted modelKey, e.g. qwen4-max-preview
const CEILING = Number(flag('--ceiling', 8192));

// Per-model breakdown: the route family hides which Token Plan model actually ran.
const byModel = new Map();
for (const t of turns.values()) {
  if (!byModel.has(t.model)) byModel.set(t.model, { model: t.model, turns: 0, ok: 0, err: 0, moderation: 0, maxOut: 0, nearCeiling: 0, errors: {} });
  const a = byModel.get(t.model);
  a.turns++;
  if (t.outcome === 'error') {
    a.err++;
    const k = (t.errorClass || 'unknown').slice(0, 46);
    a.errors[k] = (a.errors[k] || 0) + 1;
    if (t.errorClass === 'input moderation 400 (DataInspectionFailed)') a.moderation++;
  } else a.ok++;
  if (t.outputTokens != null) {
    a.maxOut = Math.max(a.maxOut, t.outputTokens);
    if (t.outputTokens >= CEILING * 0.95) a.nearCeiling++;
  }
}
console.log('\nper model (maxOut = largest measured output_tokens; nearCeiling = turns at >=95% of --ceiling):');
console.log('model                                                        turns   ok  err  mod400  maxOut  nearCeiling');
for (const a of [...byModel.values()].sort((x, y) => y.turns - x.turns)) {
  console.log(a.model.slice(0, 60).padEnd(61) + String(a.turns).padStart(5) + String(a.ok).padStart(5) + String(a.err).padStart(5) +
    String(a.moderation).padStart(8) + String(a.maxOut).padStart(8) + String(a.nearCeiling).padStart(13) +
    (a.err ? '   ' + JSON.stringify(a.errors) : ''));
}

if (POLICY) {
  const off = [...turns.values()].filter((t) => !t.model.includes(POLICY));
  const on = [...turns.values()].filter((t) => t.model.includes(POLICY));
  console.log(`\npolicy: only model keys containing "${POLICY}" are permitted.`);
  console.log(`  on-policy ${on.length} turns · OFF-POLICY ${off.length} turns (${turns.size ? (100 * off.length / turns.size).toFixed(1) : 0}% of ${turns.size})`);
  const offModels = new Map();
  for (const t of off) {
    const a = offModels.get(t.model) || { n: 0, first: t.ts, last: t.ts, sessions: new Set() };
    a.n++; a.last = t.ts; a.sessions.add(t.session.slice(0, 8)); offModels.set(t.model, a);
  }
  for (const [m, a] of [...offModels].sort((x, y) => y[1].n - x[1].n)) {
    console.log('  ' + m.slice(0, 58).padEnd(60) + String(a.n).padStart(4) + ' turns  ' + a.first.slice(0, 19) + ' → ' + a.last.slice(0, 19) + '  sessions ' + [...a.sessions].join(','));
  }
  if (!off.length) console.log('  no drift measured in this window.');
  else console.log('  Drift is a policy finding, not a model-quality finding: report it with the session and timestamp so the owner can re-select.');
}

const mods = [...turns.values()].filter((t) => t.errorClass === 'input moderation 400 (DataInspectionFailed)');
if (mods.length) {
  console.log('\nmoderation-400 turns (no prompt text kept, only shapes):');
  console.log('run                             turn        model                                       prompt  history  numTurns  billed  retry');
  for (const t of mods.slice(-20)) {
    console.log(t.run.slice(0, 30).padEnd(32) + t.run.slice(0, 0) + (t.session.slice(0, 8) + '/' + '').padEnd(0) + (t.run.slice(11, 19) + '').padEnd(12) + t.model.padEnd(46) +
      String(t.promptLength).padStart(6) + String(t.historyLength).padStart(9) + String(t.numTurns).padStart(9) + String(t.billed).padStart(8) + String(t.retries).padStart(7));
  }
  const without = [...turns.values()].filter((t) => t.route === mods[0].route && t.outcome !== 'error');
  console.log(`\nverdict-input: same route succeeded ${without.length} times, rejected ${mods.length} times` +
    (without.length ? ' -> the ROUTE is not dead; the PAYLOAD decides.' : ' -> the route never works: payload-independent, do not route agents through it.'));
}
// Attachment profile compared across outcomes on the rejected route: the deterministic part of
// "what changed between the turn that passed and the turn that did not".
const routeName = mods[0] && mods[0].route;
function profile(pred) {
  const agg = {}, res = { turns: 0, totals: [] };
  for (const [id, t] of turns) {
    if (!pred(t, id)) continue;
    res.turns++;
    const a = attach.get(id) || {};
    for (const [label, c] of Object.entries(a)) agg[label] = (agg[label] || 0) + c;
    if (totals.has(id)) res.totals.push(totals.get(id));
  }
  res.labels = agg;
  return res;
}
if (routeName) {
  const isMod = (t, id) => t.route === routeName && t.outcome === 'error' && t.errorClass === 'input moderation 400 (DataInspectionFailed)';
  const pErr = profile(isMod);
  const pOk = profile((t) => t.route === routeName && t.outcome !== 'error');
  console.log('\nattachment profile on ' + routeName + ' (generator counts summed; per-turn = mean):');
  console.log('  generator                         rejected   passed   per-turn rejected  per-turn passed');
  for (const l of [...new Set([...Object.keys(pErr.labels), ...Object.keys(pOk.labels)])].sort()) {
    const e = pErr.labels[l] || 0, o = pOk.labels[l] || 0;
    if (!e && !o) continue;
    console.log('  ' + l.padEnd(32) + String(e).padStart(9) + String(o).padStart(9) +
      '        ' + (e / (pErr.turns || 1)).toFixed(2).padStart(11) + (o / (pOk.turns || 1)).toFixed(2).padStart(16));
  }
  console.log(`  collected total: rejected med=${stat(pErr.totals)} passed med=${stat(pOk.totals)}`.replace('n=', 'n='));
  console.log('\nverdict-attach: a generator whose per-turn count is present on rejected turns and ~0 on passed turns is the injected span carrying the cause; one that matches on both sides is not.');
}
console.log('\nlimits:');
console.log(' - the log never contains the request body, so this proves correlation (which turn, which shape), not the offending span.');
console.log(' - turn.finished without error is counted as ok; an aborted or user-stopped turn is not distinguishable here.');
console.log(' - retries are counted per file, not per turn, and only when the retry line follows an unresolved BYOK turn.');

if (has('--json')) {
  const sample = [...turns.values()].filter((t) => t.route === (mods[0] && mods[0].route)).map((t) => ({
    ts: t.ts, session: t.session, model: t.model, route: t.route, outcome: t.outcome || 'unknown',
    errorClass: t.errorClass || null, promptLength: t.promptLength, historyLength: t.historyLength,
  }));
  const out = {
    generated: new Date().toISOString(), filesRead, bytes, byRoute: rows,
    byModel: [...byModel.values()],
    policy: POLICY ? {
      permittedSubstring: POLICY,
      onPolicy: [...turns.values()].filter((t) => t.model.includes(POLICY)).length,
      offPolicy: [...turns.values()].filter((t) => !t.model.includes(POLICY)).map((t) => ({ ts: t.ts, session: t.session, model: t.model, outcome: t.outcome })),
    } : null,
    moderationTurns: mods.map((t) => ({ ...t })), routeSample: sample, routeName: mods[0] && mods[0].route,
  };
  const body = JSON.stringify(out, null, 1);
  const dest = flag('--out', null);
  if (dest) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, body); console.log('\nwrote ' + dest); }
  else console.log(body);
}
