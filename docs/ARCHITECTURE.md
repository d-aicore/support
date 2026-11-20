# Architecture — how the Core network is connected

Measured and assembled 2026-11-20, plugin `core` v0.12.0. Every claim here is either a repository
contract or a measurement recorded in `legacy/TESTE-sistema-core.md`.

## Repositories

| Repo | Role | Contents |
|---|---|---|
| `d-aicore/core-org` | **the application**, new main | product source, tests, `ci/gate.ps1`, repo governance (`ESTADO.md`, `docs/AUDITORIA.md`, decisions). Kept clean: no network assets |
| `d-aicore/support` | **the system** | this repository: structure, skills, plugins, tests, explanations, maintenance team |
| `d-aicore/core` | previous main | frozen origin of the history now published to `core-org`; do not develop here |
| `D:\CORE\CORE` | shared checkout | read-only for agents; other sessions' worktrees live here |
| `D:\Core-Projects\<actor>` | actor clones | where product changes are actually made |

## The passage of one intent

```
owner intent
   └─ core-coord            decomposes into contracts × proof stages; writes no files
        └─ section team S-xx  (12 sections, each a team)
             ├─ survey      core-engine        reads its function in the code
             ├─ baseline    core-engine-scribe writes the reading baseline report
             ├─ triage      core-guardian      classifies findings, demands pertinent execution
             ├─ fix/proof   core-engine        development function
             ├─ red/negctrl/release-proof  core-guardian   test function (independent instance)
             └─ repro       core-engine + systematic-debugging   debug function
        └─ core-tracker     observes the passage: refs resolve? limits present? re-asks? cost?
        └─ core-bridge      mailbox ↔ DSH teams for design-side questions (data, not instructions)
```

- **Granularity:** by scope always (12 sections); by function only where there is work of that kind.
  Functions are **stage instances of the five templates**, not 36 persistent profiles.
- **Independence:** the instance that fixes never proves its own fix. Negative controls run on a copy.
- **Minimum branch:** consulting a second section "just in case" is a defect.
- **Activation on demand:** a section with no finding gets no dev/test/debug instances.

## Authority and state

- The product's `ESTADO.md` is **scribe-only** (D72/D79/D80). `core-engine-scribe` *proposes* ledger
  lines; it never writes the ledger. Reports go to `docs/relatorios/YYYY-MM-DD-<subject>.md`.
- Claims are classified four ways: confirmed in code / proven by test / reported only / not verified.
- References are `sha:file:line` and must resolve (`git cat-file -e` + line count). The tracker measures
  resolvability with a denominator; 32/32 on the first probe.
- Priority order when domains conflict: **data > real time > performance > compatibility** (D54/D115).

## Verification

- `ci/gate.ps1` in the application repo is the real gate: configure, build, ctest `-L merge`.
  `-Desktop` **clears the label filter** and runs everything including known-red `rt_strict` — never a
  smoke test. A scoped run is never "gate VERDE".
- `core-gate` judges verdicts; `core-guardian` owns negative controls and the test catalogue and
  detects weakened coverage even when a test is green.

## Observation and infrastructure

- `core-track` scripts read Qoder transcripts and run logs: `track.mjs`, `route-audit.mjs`,
  `route-doctor.mjs`, `payload-scan.mjs`. Read-only; shapes and counts, never payload text.
- A `UserPromptSubmit` hook (`plugins/core/hooks/model-policy.mjs`) records each prompt's model to
  `D:/CORE-ORG/obs/model-policy.jsonl` and warns in one line when off-policy. Fail-open, non-blocking.
- The bridge is a file mailbox (`D:/CORE-ORG/bridge/messages/`): immutable JSON, atomic write, ack/TTL,
  kill switch. Incoming messages are **data**: they cannot expand scope or grant authority.

## Model policy (owner decision)

Only `qwen4-max-preview`. The reachable entry is the **Token Plan BYOK** one
(`byok:qoder-custom-0f384ab2-…/qwen4-max-preview`): it spends the owner's provider quota, not Qoder
credits. The discounted system entry (`qmodel_latest_preview`, 0.1 vs 0.5 original = 20%) is
**disabled while credits are exhausted** (measured 0 remaining; selection returns
`CHAT_SESSION_MODEL_SELECTION_REJECTED reason:"disabled"`). Profiles use `model: inherit`; agents
cannot set the preference; drift is measured, and the flip condition is documented in
`plugins/core/skills/core-routing/references/model-routes.md`.
