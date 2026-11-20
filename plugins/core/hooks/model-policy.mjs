#!/usr/bin/env node
// model-policy.mjs — UserPromptSubmit hook. Records whether the session's model obeys the owner's
// single-model policy («apenas qwen4-max-preview») and, when it does not, says so in one line.
//
// Design constraints, all deliberate:
//   fail-open      any problem exits 0 with no output; a guard must never break the owner's turn
//   non-blocking   never exits 2, never blocks a prompt, never changes configuration
//   bounded write  appends one JSONL line to D:/CORE-ORG/obs/model-policy.jsonl and nothing else
//   no secrets     never reads settings.json, never prints prompt text; only model name + ids
//   kill switch    D:/CORE-ORG/obs/policy.off disables it entirely
//
// The model field arrives as a display name (measured in hook_input: "model":"Efficient"), so the
// policy is matched case-insensitively on the name, which covers both catalog entries of the same
// model (BYOK "qwen4-max-preview" and system "Qwen4-Max-Preview") and excludes every other model.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.env.CORE_OBS_ROOT || 'D:/CORE-ORG/obs';
const OFF = path.join(ROOT, 'policy.off');
const LOG = path.join(ROOT, 'model-policy.jsonl');
const POLICY = /qwen4[-\s]?max[-\s]?preview/i;

function done(context) {
  if (context) process.stdout.write(context + '\n');
  process.exit(0);
}

try {
  if (fs.existsSync(OFF)) process.exit(0);
  let raw = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) raw += chunk;
  if (!raw.trim()) process.exit(0);
  const j = JSON.parse(raw);
  const model = String(j.model || j.modelKey || '').trim();
  if (!model) process.exit(0);                      // nothing to judge; do not invent a verdict
  const onPolicy = POLICY.test(model);
  const rec = {
    ts: new Date().toISOString(),
    event: j.hook_event_name || 'UserPromptSubmit',
    session: j.session_id || null,
    model,
    verdict: onPolicy ? 'on-policy' : 'OFF-POLICY',
    policy: 'qwen4-max-preview',
    cwd: j.cwd || null,
  };
  fs.mkdirSync(ROOT, { recursive: true });
  fs.appendFileSync(LOG, JSON.stringify(rec) + '\n');
  if (!onPolicy) {
    done(`MODEL POLICY: the owner permits only qwen4-max-preview. This session is on "${model}". ` +
      `Do not switch model yourself (agents cannot set the preference); report the drift to the owner ` +
      `and continue under the single-model contract in core-routing/references/model-routes.md.`);
  }
  process.exit(0);
} catch {
  process.exit(0);                                  // fail-open, always
}
