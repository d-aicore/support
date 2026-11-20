#!/usr/bin/env node
// bridge.mjs — Qoder side of the Qoder <-> DSH mailbox. Deterministic mechanics only.
// Contract: skills/core-bridge/references/protocol.md (schema 1).
// Commands: validate <file|id> | send <file> | ack <id> --by <name> | list [--kind k] [--to h]
//           pending | reject <id> --reason "..." | selftest
// Env: CORE_BRIDGE_ROOT overrides the mailbox root (used by selftest).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';

const ROOT = process.env.CORE_BRIDGE_ROOT || 'D:/CORE-ORG/bridge';
const M = path.join(ROOT, 'messages');
const A = path.join(ROOT, 'acks');
const ATT = path.join(ROOT, 'attachments');
const OFF = path.join(ROOT, 'bridge.off');

const REQUIRED = ['schema', 'id', 'ts', 'from', 'to', 'kind', 'subject', 'acceptance'];
const KINDS = ['question', 'answer', 'handoff', 'evidence', 'decision-request', 'ack', 'reject'];
const QUERY_TYPES = ['existence', 'style', 'behavior', 'evidence', 'decision'];
const MAX_PAYLOAD = 4000;
const ID_RE = /^\d{8}T\d{6}Z-(qoder|dsh)-\d{4,}$/;
const SECRET_RE = /(github_pat_[A-Za-z0-9_]{8,}|ghp_[A-Za-z0-9]{8,}|sk-[A-Za-z0-9]{12,}|Bearer\s+[A-Za-z0-9._-]{12,}|api[_-]?key["']?\s*[:=]\s*["'][A-Za-z0-9]{12,})/gi;

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const die = (m) => { console.error('ERROR: ' + m); process.exit(1); };
const out = (o) => console.log(JSON.stringify(o, null, 1));
const killed = () => fs.existsSync(OFF);
const ensure = () => { for (const d of [M, A, ATT]) fs.mkdirSync(d, { recursive: true }); };
const msgPath = (id) => path.join(M, id + '.json');
const ackPath = (id) => path.join(A, id + '.ack.json');

function atomicWrite(file, txt) {
  const tmp = path.join(path.dirname(file), '.' + path.basename(file) + '.tmp');
  fs.writeFileSync(tmp, txt);
  fs.renameSync(tmp, file);
}

function loadFileOrId(arg) {
  const f = arg.endsWith('.json') && fs.existsSync(arg) ? arg : msgPath(arg);
  if (!fs.existsSync(f)) die('not found: ' + arg);
  return { file: f, msg: JSON.parse(fs.readFileSync(f, 'utf8')) };
}

function validate(m) {
  const errors = [];
  for (const k of REQUIRED) if (m[k] === undefined || m[k] === null || m[k] === '') errors.push('missing field: ' + k);
  if (m.schema !== 1) errors.push('schema must be 1');
  if (typeof m.id === 'string' && !ID_RE.test(m.id)) errors.push('id must match <YYYYMMDDTHHMMSSZ>-<qoder|dsh>-<seq>');
  if (!KINDS.includes(m.kind)) errors.push('unknown kind: ' + m.kind);
  if (m.query_type && !QUERY_TYPES.includes(m.query_type)) errors.push('unknown query_type: ' + m.query_type);
  if (typeof m.ts === 'string' && Number.isNaN(Date.parse(m.ts))) errors.push('ts is not a valid ISO timestamp');
  if (!m.from || !m.from.harness) errors.push('from.harness required');
  if (!m.to || !m.to.harness) errors.push('to.harness required');
  if (m.payload && m.attachment) errors.push('payload and attachment are mutually exclusive for large material');
  if (typeof m.payload === 'string' && m.payload.length > MAX_PAYLOAD) errors.push('payload exceeds ' + MAX_PAYLOAD + ' chars; use attachment + sha256');
  if (m.attachment) {
    if (!m.attachment.sha256 || !/^[a-f0-9]{64}$/.test(m.attachment.sha256)) errors.push('attachment.sha256 must be 64 hex chars');
    if (!m.attachment.path) errors.push('attachment.path required');
  }
  if (m.kind === 'answer' && !m.reply_to) errors.push('answer requires reply_to');
  if (m.query_type === 'existence' && m.kind === 'question' && !m.revision) errors.push('existence question about code requires revision');
  const secrets = (JSON.stringify(m).match(SECRET_RE) || []).length;
  if (secrets > 0) errors.push('secret-shaped content detected (' + secrets + '); redact before sending (values not printed)');
  return errors;
}

function allMessages() {
  if (!fs.existsSync(M)) return [];
  return fs.readdirSync(M).filter((f) => f.endsWith('.json')).sort()
    .map((f) => { try { return JSON.parse(fs.readFileSync(path.join(M, f), 'utf8')); } catch { return null; } })
    .filter(Boolean);
}

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };

if (cmd !== 'selftest' && killed()) die('kill switch present: ' + OFF + ' — bridge stopped, nothing written');

switch (cmd) {
  case 'validate': {
    if (!args[1]) die('usage: validate <file|id>');
    const { msg } = loadFileOrId(args[1]);
    const errors = validate(msg);
    out({ id: msg.id, valid: errors.length === 0, errors, sha256: sha(fs.readFileSync(msgPath(msg.id))) });
    process.exit(errors.length ? 1 : 0);
    break;
  }
  case 'send': {
    if (!args[1]) die('usage: send <file>');
    ensure();
    const msg = JSON.parse(fs.readFileSync(args[1], 'utf8'));
    const errors = validate(msg);
    if (errors.length) die('invalid envelope: ' + errors.join('; '));
    if (fs.existsSync(msgPath(msg.id))) die('duplicate id already in mailbox: ' + msg.id + ' (re-delivery is safe; not reprocessed)');
    if (msg.reply_to && !fs.existsSync(msgPath(msg.reply_to))) die('reply_to references unknown message: ' + msg.reply_to);
    if (msg.attachment) {
      const ap = path.isAbsolute(msg.attachment.path) ? msg.attachment.path : path.join(ROOT, msg.attachment.path);
      if (!fs.existsSync(ap)) die('attachment missing: ' + ap);
      const h = sha(fs.readFileSync(ap));
      if (h !== msg.attachment.sha256) die('attachment sha256 mismatch');
    }
    atomicWrite(msgPath(msg.id), JSON.stringify(msg, null, 2));
    out({ sent: msg.id, sha256: sha(fs.readFileSync(msgPath(msg.id))), kind: msg.kind, to: msg.to });
    break;
  }
  case 'ack': {
    if (!args[1]) die('usage: ack <id> --by <name>');
    ensure();
    const { msg } = loadFileOrId(args[1]);
    if (fs.existsSync(ackPath(msg.id))) { out({ already_acked: msg.id }); break; }
    const by = flag('--by', 'qoder');
    atomicWrite(ackPath(msg.id), JSON.stringify({ id: msg.id, ts: new Date().toISOString(), by, status: 'received' }, null, 2));
    out({ acked: msg.id, by });
    break;
  }
  case 'reject': {
    if (!args[1]) die('usage: reject <id> --reason "..."');
    ensure();
    const reason = flag('--reason', 'unspecified');
    const id = args[1];
    const rid = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z/, 'Z') + '-qoder-' + String(allMessages().length + 1).padStart(4, '0');
    const m = { schema: 1, id: rid, ts: new Date().toISOString(), from: { harness: 'qoder' }, to: { harness: 'dsh' }, kind: 'reject', subject: 'rejected ' + id, reply_to: fs.existsSync(msgPath(id)) ? id : null, acceptance: 'sender corrects and resends with a new id', payload: reason, limits: 'rejection only; no action taken', ttl_minutes: 1440, redacted: true };
    atomicWrite(msgPath(rid), JSON.stringify(m, null, 2));
    out({ rejected: id, reject_message: rid, reason });
    break;
  }
  case 'list': {
    const kind = flag('--kind', null), to = flag('--to', null);
    let ms = allMessages();
    if (kind) ms = ms.filter((m) => m.kind === kind);
    if (to) ms = ms.filter((m) => m.to && m.to.harness === to);
    out({ count: ms.length, messages: ms.map((m) => ({ id: m.id, kind: m.kind, query_type: m.query_type || null, to: m.to && m.to.harness, subject: m.subject, reply_to: m.reply_to || null, acked: fs.existsSync(ackPath(m.id)) })) });
    break;
  }
  case 'pending': {
    const now = Date.now();
    const ms = allMessages();
    const answered = new Set(ms.filter((m) => m.reply_to).map((m) => m.reply_to));
    const q = ms.filter((m) => ['question', 'handoff', 'decision-request'].includes(m.kind) && !answered.has(m.id));
    out({ pending: q.map((m) => { const age = (now - Date.parse(m.ts)) / 60000; const ttl = m.ttl_minutes ?? 60; return { id: m.id, kind: m.kind, age_minutes: Math.round(age), ttl_minutes: ttl, expired: age > ttl, acked: fs.existsSync(ackPath(m.id)) }; }), note: 'expired means record pending/blocked and continue; never invent the answer' });
    break;
  }
  case 'selftest': {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bridge-selftest-'));
    process.env.CORE_BRIDGE_ROOT = root;
    const r = path.join(root, 'messages'); fs.mkdirSync(r, { recursive: true }); fs.mkdirSync(path.join(root, 'acks'), { recursive: true });
    const base = { schema: 1, ts: new Date().toISOString(), from: { harness: 'qoder' }, to: { harness: 'dsh', section: 'ui' }, kind: 'question', subject: 'selftest', acceptance: 'ok', ttl_minutes: 60, redacted: true };
    const results = [];
    const t = (name, fn) => { try { fn(); results.push([name, 'PASS']); } catch (e) { results.push([name, 'FAIL: ' + e.message]); } };
    const good = { ...base, id: '20261120T000000Z-qoder-0001', query_type: 'existence', revision: 'abc1234' };
    t('valid envelope accepted', () => { if (validate(good).length) throw new Error(validate(good).join(';')); });
    t('missing acceptance rejected', () => { const m = { ...good }; delete m.acceptance; if (!validate(m).length) throw new Error('accepted'); });
    t('bad id rejected', () => { if (!validate({ ...good, id: 'nope' }).length) throw new Error('accepted'); });
    t('oversized payload rejected', () => { if (!validate({ ...good, payload: 'x'.repeat(4001) }).length) throw new Error('accepted'); });
    t('secret-shaped payload rejected', () => { if (!validate({ ...good, payload: 'token github_pat_' + 'A'.repeat(20) }).length) throw new Error('accepted'); });
    t('answer without reply_to rejected', () => { if (!validate({ ...good, kind: 'answer' }).length) throw new Error('accepted'); });
    t('atomic write + dedup', () => { atomicWrite(path.join(r, good.id + '.json'), JSON.stringify(good)); if (!fs.existsSync(path.join(r, good.id + '.json'))) throw new Error('not written'); if (fs.readdirSync(r).filter((f) => f.startsWith('.')).length) throw new Error('temp left behind'); });
    t('kill switch blocks', () => { fs.writeFileSync(path.join(root, 'bridge.off'), ''); if (!fs.existsSync(path.join(root, 'bridge.off'))) throw new Error('no switch'); fs.unlinkSync(path.join(root, 'bridge.off')); });
    out({ root, results, passed: results.filter((x) => x[1] === 'PASS').length, total: results.length });
    fs.rmSync(root, { recursive: true, force: true });
    process.exit(results.every((x) => x[1] === 'PASS') ? 0 : 1);
    break;
  }
  default:
    die('usage: bridge.mjs <validate|send|ack|list|pending|reject|selftest> [args]');
}
