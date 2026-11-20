# Tests — catalogue, re-run commands, measured baseline

The full session-by-session log is `legacy/TESTE-sistema-core.md` (T1…T12). This file is the index and
the current baseline. Every number below was measured on this machine on 2026-11-20.

## Re-run

```bash
CORE=plugins/core
node $CORE/skills/core-track/scripts/track.mjs <session.jsonl|sessionId> [--repo D:/CORE/CORE]
node $CORE/skills/core-track/scripts/route-audit.mjs  --since 2026-11-20 --policy qwen4-max-preview
node $CORE/skills/core-track/scripts/route-doctor.mjs --since 2026-11-20 --policy qwen4-max-preview
node $CORE/skills/core-track/scripts/payload-scan.mjs <session.jsonl|sessionId> [--around N]
node $CORE/skills/core-bridge/scripts/bridge.mjs selftest
qodercli plugins validate plugins/core
qodercli plugins validate plugins/core-support
```

## Baseline (plugin core v0.12.0)

| Check | Result |
|---|---|
| Plugin validate | skills 8, agents 5, hooks 1 — valid |
| T1 routing probe | passed; 32/32 cited refs resolved (coverage 1.0); read-only tool mix confirmed |
| Bridge selftest | 8/8 |
| Policy hook standalone | 5/5 exit 0 (on-policy silent, off-policy warns, both spellings, bad JSON, missing model); kill switch verified (no record written) |
| Route audit, 2026-11-20 | 61 turns: BYOK qwen 31 (26 ok, **5 input-gate rejections**, all 18:45:47–19:37:57, none after); `auto` 8×403 of 14; `smodel` 2×403 of 4; `qmodel_latest_preview` 1×403 of 9 |
| Policy drift | 31 on-policy / 30 off-policy (baseline at decision time; most predate it) |
| Credits | 0 remaining: 2000/2000, 2400/2400, packages 10000+8000 exhausted → paid system models disabled |
| Discounted entry selection | `CHAT_SESSION_MODEL_SELECTION_REJECTED reason:"disabled"` |
| Exonerated hypotheses | rejected prompt texts verbatim, credential scan (0), CJK catalog block, MCP GitHub block — all passed in a clean session on the same route; size ranges overlap |
| Refuted earlier diagnosis | "Downloads filenames in history determine rejection": those records were present in 21 later passing BYOK turns |
| Parser guard | echoed shell commands excluded; re-measurement identical (61 turns, 31/26/5) |

## Known limits (state them in every report)

- `output_tokens` is logged as 0 → output-ceiling pressure is **not measurable** from logs.
- The provider never names the offending span → co-occurrence narrows, never proves; n=1 is a lead.
- `turn.finished` without error counts as passed, including owner-stopped turns.
- Hook stdout injection as context is unverified until observed firing; the JSONL record is reliable.
- New agents/skills need an app restart before discovery can be judged.

## Pending system tests

T2 delegation coord→engine · T3 `skills:` bounding per profile · T4 resume in a fresh session (same
refs **and** same limits) · T5 whether plugin-provided agents keep hooks/mcpServers/permissionMode ·
T7 reversibility (disable → nothing loads → reactivate). Then the first coordinated task: coordinator
partitions the 12 sections, each surveys its function, reading baseline, triage; fixes need separate
owner authorization.
