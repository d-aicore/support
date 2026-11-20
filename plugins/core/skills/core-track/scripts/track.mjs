#!/usr/bin/env node
// track.mjs — computes core-track metrics from a Qoder session transcript. Read-only.
// Usage: node track.mjs <session.jsonl|sessionId> [--repo D:/CORE/CORE] [--intent "owner words"] [--json]
// Env: CORE_TRACK_ROOT (kill switch dir, default D:/CORE-ORG/obs), QODER_PROJECTS (default ~/.qoder/projects)
// Every metric publishes a denominator. Heuristic metrics are flagged. Reasoning blocks are excluded and counted.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const ROOT = process.env.CORE_TRACK_ROOT || 'D:/CORE-ORG/obs';
if (fs.existsSync(path.join(ROOT, 'track.off'))) { console.error('ERROR: kill switch present, nothing computed'); process.exit(1); }
if (!args[0]) { console.error('usage: track.mjs <session.jsonl|sessionId> [--repo path] [--intent "words"]'); process.exit(1); }

const PROJECTS = process.env.QODER_PROJECTS || path.join(os.homedir(), '.qoder', 'projects');
function resolveFile(a) {
  if (a.endsWith('.jsonl') && fs.existsSync(a)) return a;
  for (const d of fs.readdirSync(PROJECTS)) {
    const f = path.join(PROJECTS, d, a + '.jsonl');
    if (fs.existsSync(f)) return f;
  }
  console.error('ERROR: transcript not found for ' + a); process.exit(1);
}
const file = resolveFile(args[0]);
const repo = flag('--repo', null);
const intent = flag('--intent', null);
const raw = fs.readFileSync(file, 'utf8');
const lines = raw.split('\n').filter((x) => x.trim());

let thinking = 0, unparseable = 0;
const recs = [];
for (const l of lines) {
  let j; try { j = JSON.parse(l); } catch { unparseable++; continue; }
  const c = (j.message && j.message.content) || j.content;
  if (Array.isArray(c)) for (const b of c) if (b.type === 'thinking' || b.type === 'reasoning') thinking++;
  recs.push(j);
}

const ts = (j) => j.timestamp || j.ts || (j.message && j.message.timestamp) || null;
const texts = [];
const tools = [];
for (const j of recs) {
  const c = (j.message && j.message.content) || j.content;
  if (!Array.isArray(c)) continue;
  for (const b of c) {
    if (b.type === 'text' && typeof b.text === 'string') texts.push({ role: j.type || (j.message && j.message.role), ts: ts(j), text: b.text });
    if (b.type === 'tool_use') tools.push({ name: b.name, input: b.input || {}, ts: ts(j), id: b.id });
    if (b.type === 'tool_result') tools.push({ name: 'result', isError: !!b.is_error, ts: ts(j), id: b.tool_use_id });
  }
}

const REF_RE = /\b([0-9a-f]{7,40}):([A-Za-z0-9_./\\-]+\.(?:cpp|h|hpp|c|md|ps1|cmake|txt|json|mjs)):(\d+)/g;
const finalText = texts.filter((t) => t.role === 'assistant').map((t) => t.text).join('\n');
const refs = [...finalText.matchAll(REF_RE)].map((m) => ({ sha: m[1], file: m[2], line: +m[3] }));

function resolves(r) {
  if (!repo) return null;
  try {
    execFileSync('git', ['-C', repo, 'cat-file', '-e', r.sha + ':' + r.file], { stdio: 'ignore' });
    const n = execFileSync('git', ['-C', repo, 'show', r.sha + ':' + r.file], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\n').length;
    return r.line <= n;
  } catch { return false; }
}
const refResults = refs.map((r) => ({ ...r, resolves: resolves(r) }));
const refChecked = refResults.filter((r) => r.resolves !== null);

const agentCalls = tools.filter((t) => t.name === 'Agent' || t.name === 'Task');
const briefFields = (p) => ({
  intent: /intent|verbatim|literal/i.test(p),
  revision: /\b[0-9a-f]{7,40}\b|rev-parse|revision/i.test(p),
  acceptance: /acceptance|critério|criterion|must contain|aceitação/i.test(p),
  scope: /scope|âmbito|only inside|write only|do not write/i.test(p),
  prohibitions: /do not|must not|never|proibido|não /i.test(p),
});
const briefs = agentCalls.map((t) => {
  const p = String(t.input.prompt || t.input.description || '');
  const f = briefFields(p);
  return { name: t.input.name || t.input.subagent_type || null, chars: p.length, fields_present: Object.values(f).filter(Boolean).length, fields: f };
});

const has = (re) => re.test(finalText);
const returnFields = {
  refs: refs.length > 0,
  classification: /confirmed in code|proven by test|reported only|not verified|confirmado|comprovado|reportado|não verificado/i.test(finalText),
  limits: /\blimits?\b|limitações|limites|not verified|por verificar/i.test(finalText),
  next: /next (task|stage|step)|próxima|next owner|dono/i.test(finalText),
};

const firstUser = texts.find((t) => t.role === 'user');
const firstResult = tools.find((t) => t.name === 'result');
const t0 = firstUser && ts(firstUser) ? Date.parse(ts(firstUser)) : null;
const t1 = firstResult && firstResult.ts ? Date.parse(firstResult.ts) : null;
const toolCalls = tools.filter((t) => t.name !== 'result');
const failed = tools.filter((t) => t.name === 'result' && t.isError).length;
const results = tools.filter((t) => t.name === 'result').length;

const report = {
  source: { file, bytes: raw.length, records: lines.length, unparseable, thinking_blocks_excluded: thinking },
  window: { first_user_ts: firstUser ? ts(firstUser) : null, last_ts: recs.length ? ts(recs[recs.length - 1]) : null },
  A_communication: {
    delegations: agentCalls.length,
    brief_completeness: { denominator: briefs.length, mean_fields_present: briefs.length ? +(briefs.reduce((s, b) => s + b.fields_present, 0) / briefs.length).toFixed(2) : null, per_brief: briefs, heuristic: true, note: 'field presence detected by keyword; a present keyword is not proof the field is well formed' },
    return_completeness: { denominator: 1, fields_present: Object.values(returnFields).filter(Boolean).length, fields: returnFields, heuristic: true },
    intent_preserved: intent ? { denominator: 1, preserved: finalText.includes(intent) } : { denominator: 0, note: 'pass --intent with the owner literal words to measure' },
    branch_minimality: { denominator: agentCalls.length, distinct_subagent_types: [...new Set(agentCalls.map((t) => t.input.subagent_type).filter(Boolean))], heuristic: true },
  },
  B_structure: {
    refs_cited: refs.length,
    ref_resolvability: { denominator: refChecked.length, resolved: refChecked.filter((r) => r.resolves).length, unresolved: refChecked.filter((r) => !r.resolves).length, coverage: refs.length ? +(refChecked.length / refs.length).toFixed(2) : null, note: repo ? 'checked with git at the cited sha' : 'not checked: pass --repo' },
    refs: refResults.slice(0, 40),
    reported_as_measured: { denominator: 1, heuristic: true, note: 'requires judgment; not auto-decided' },
  },
  C_performance: {
    tool_calls: toolCalls.length,
    tool_calls_by_name: toolCalls.reduce((m, t) => (m[t.name] = (m[t.name] || 0) + 1, m), {}),
    failed_tool_rate: { denominator: results, failed, coverage: results ? 1 : 0 },
    time_to_first_evidence_minutes: t0 && t1 ? +((t1 - t0) / 60000).toFixed(2) : null,
    both_endpoints_coverage: t0 && t1 ? 1 : 0,
    text_blocks: texts.length,
    note: 'collection delay, wait and execution are never summed; only time_to_first_evidence is computed here',
  },
  limits: [
    'reasoning blocks excluded and counted, never quoted',
    'brief/return field presence is keyword-heuristic, not semantic judgment',
    'delegation pairing (brief -> its own return) is not reconstructed; per-pair latency needs stage names in the transcript',
    'owner corrections and re-asks need the owner message subset; not computed in this pass',
    'no full prompt or tool response is stored or printed',
  ],
};
console.log(JSON.stringify(report, null, 1));
