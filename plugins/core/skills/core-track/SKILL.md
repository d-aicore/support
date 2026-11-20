---
name: core-track
description: Measures how the Core agent network actually communicates and structures information. Use to audit delegation briefs and returns, check whether references resolve, whether reports conform to the repository contract, whether limits and classifications are present, and to quantify re-asks, owner corrections, intent drift, time to first evidence and context loss. Read-only observation; never writes into the product repository.
---

# Core network tracking

## Overview

Track the **organization**, not the product. The question is not "is the code good" but "did the
intent survive the passage, is the information structured so the next agent can use it, and what did
the coordination cost". A return that prevented a wrong test is a **useful result**, not a defect.

## Data source (verified)

Qoder session transcripts: `C:\Users\vk_do\.qoder\projects\<workspace-slug>\<sessionId>.jsonl`.
Observed record types: `user`, `assistant`, `attachment`, `active-leaf`, `runtime-config`,
`workspace-directories`. Content blocks include `text` and `thinking`/`reasoning`.

- **Exclude `thinking` and `reasoning` blocks from all evidence and all metrics.** Count them, never
  quote or summarize them.
- DSH harness transcripts (`.jsonl.zstd`) are **multi-frame zstd**: a single `zstdDecompressSync` call
  decodes only the first frame (the session header). Scan the magic `28 B5 2F FD` and decode frame by
  frame. Record kinds there include `team/task`, `subagent/catalog`, `job/registered`, `job/settled`,
  `compaction/prune`, `goal/change`, `model/selection`.
- Owner words are a **subset** of `user/message`: filter by `data.source.kind === "user"`. In one
  measured session only 19 of 116 were the owner's; the rest were time-context, subagent-settled,
  agent-message, goal and approval echoes.

## Procedure

1. Fix the observation window: session ids, workspace, start/end timestamps, model key per session.
2. Extract bounded, line-numbered evidence. Never load an oversized record whole.
3. Compute the metrics in [references/metrics.md](references/metrics.md). **Every metric publishes its
   denominator and its coverage.** A number without coverage is worse than no number.
4. Classify each finding: communication defect / structure defect / performance cost / useful return.
5. Write the observation to `D:\CORE-ORG\obs\` — **never** into `d-aicore/core`. Reference product
   evidence by `sha:file:line`; do not copy it.
6. Report to `core-coord` with one concrete, falsifiable improvement proposal per finding. Adoption is
   the owner's decision.

## Rules that are not negotiable

- **Read-only.** No writes to the product repo, no edits to skills or profiles during an observation
  window, no installs, no builds. Changing the thing being measured destroys the measurement.
- **Three times are never summed:** collection delay, wait for a response, execution time. Each is
  legitimate only when both endpoints exist; publish the percentage of intervals that have both.
- **Redaction:** never store full prompts or full tool responses. Store sha256, length, structural
  flags, and at most a bounded secret-free excerpt when strictly needed. Never read
  `~/.qoder/settings.json` (plaintext provider keys). If a secret appears in source material, report
  its presence and location **without its value**, and redact the derived copy.
- **Useful return ≠ rework.** A return that avoided a wrong test, an out-of-boundary change, or a
  conclusion without an oracle is a positive outcome. Rework is the same question coming back because
  a condition was lost.
- **No causal claims from small samples.** State N, state the limits, propose a discriminating
  experiment instead of concluding.
- **Kill switch:** if `D:\CORE-ORG\obs\track.off` exists, stop immediately and write nothing.
- One variable per comparison. Same model key, same revision, same task family; otherwise the
  comparison is not admissible.

## Mechanics (implemented, tested on a real session)

```bash
node scripts/track.mjs <session.jsonl|sessionId> [--repo D:/CORE/CORE] [--intent "owner words"]
node scripts/route-audit.mjs [--runs <dir>] [--since YYYY-MM-DD] [--files a.log,b.log]
                             [--policy <modelKey substring>] [--ceiling 8192] [--json]
node scripts/route-doctor.mjs [--since YYYY-MM-DD] [--window 6] [--policy <modelKey substring>]
node scripts/payload-scan.mjs <session.jsonl|sessionId> [--around N] [--window 12] [--all]
```

Computes objectively: record census, thinking blocks excluded and counted, tool census and failure
rate, time to first evidence with both-endpoint coverage, and **`ref_resolvability`** — every cited
`sha:file:line` checked with `git cat-file -e` plus a line-count check at the cited SHA. Keyword-based
field presence for briefs/returns is **flagged heuristic**, never presented as semantic judgment.
`--intent` enables `intent_preserved`; without it the denominator is 0 and the metric says so.
Kill switch: `D:\CORE-ORG\obs\track.off`. No full prompt or tool response is stored or printed.

Measured on the first probe session: 150 records, 14 reasoning blocks excluded, 32 refs cited and
**32/32 resolved (coverage 1.0)**, 30 tool calls with 0 failures, time to first evidence 0.48 min,
tool mix `Skill/Bash/Read/Grep/Glob` only — no Write/Edit, confirming read-only objectively.

### Route health (the infrastructure half of coordination cost)

A stage that dies on an infrastructure fault costs owner time and teaches the network nothing, so it
is measured like any other coordination defect.

`route-audit.mjs` joins every turn in `~/.qoder/logs/runs/*/qodercli.log` to its **exact model key** and
outcome, separates provider **input-gate** rejections from 403 / rate-limit / timeout / abort, and
reports per-model output ceilings. `--policy <substring>` turns the owner's single-model decision into
a measurement: on-policy vs off-policy turns, with the sessions and timestamps of the drift.
`route-doctor.mjs` adds the contrast analysis (which injected block class appears on rejected turns and
not on passed turns) and prints the recovery ladder. `payload-scan.mjs` classifies a payload by shape —
credential, opaque, CJK, moderation-echo, dump — without printing any of it, so a rejection can be
narrowed to a content class without turning the diagnosis into a leak.

**Parser hardening (measured, not assumed):** the run log also echoes the agent's own shell commands.
A command that merely mentions `turn.finished` or `DataInspectionFailed` could be counted as a real
turn outcome, so only genuine records (`] turn.started|turn.finished|attachment.generator.finished|
session.phase.finished`, plus the retry debug line) are parsed. Re-measured after the guard: identical
numbers (61 turns, BYOK 31/26/5) — no contamination had occurred, and future contamination is blocked.

Measured on 2026-11-20 (61 turns, 45 logs): input-gate rejections **5 of 31 turns on the Token Plan
`qwen4-max-preview` entry**, all between 18:45:47 and 19:37:57, **none afterwards**; `auto` **8×403 of
14**, `smodel` **2×403 of 4**, `qmodel_latest_preview` 1×403 of 9 — the system entries are
`unavailableReason:"account"` in the catalog. Policy drift baseline: **31 on-policy / 30 off-policy**.
**Limit:** `output_tokens` is logged as 0 on these turns, so `--ceiling` cannot measure truncation
pressure; `maxOut=0` means *not measured*, never *headroom*. See
`core-routing/references/model-routes.md` for the policy, the ladder and what was exonerated.


## Resources

- [references/metrics.md](references/metrics.md) — metric definitions, denominators, coverage rules,
  extraction method, and the report shape.
- [scripts/track.mjs](scripts/track.mjs) — computes the objective metrics from a Qoder transcript.
- [scripts/route-audit.mjs](scripts/route-audit.mjs) — turns → model route → outcome, from the run logs.
- [scripts/route-doctor.mjs](scripts/route-doctor.mjs) — explains a provider input-gate rejection by
  contrast and prints the repair ladder. Read-only.
- [scripts/payload-scan.mjs](scripts/payload-scan.mjs) — classifies payload content classes by shape,
  printing counts only.
