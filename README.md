# support — how the Core network works

This repository is the **system side** of the Core project. The application lives in
[`d-aicore/core-org`](https://github.com/d-aicore/core-org) and is kept as clean as possible: source,
tests, CI and the repository's own governance contract — nothing else. Everything about *how the work
is organised, verified and repaired* lives here.

## Map

| Path | What it is |
|---|---|
| `docs/ARCHITECTURE.md` | how every piece connects: owner → coordinator → section teams → evidence → gates → tracker → bridge |
| `docs/SYSTEM.md` | plain-language explanation of plugins, skills, profiles, hooks, proof stages and the model policy |
| `docs/RUNBOOK.md` | symptom → diagnosis → fix, with the exact commands |
| `docs/PUBLISH.md` | how to change a skill/plugin safely, validate, install, measure, commit and publish |
| `docs/TESTS.md` | the test catalogue, how to re-run it, and the measured baseline |
| `plugins/core/` | the **working network plugin**: 5 agent profiles, 8 skills, hooks, diagnostic scripts |
| `plugins/core-support/` | the **maintenance plugin**: a team that diagnoses and repairs the network itself |
| `legacy/` | historical planning documents, addenda, surveys and the session test log. Read for origin, not as current contract |

## Install

```bash
qodercli plugins validate plugins/core
qodercli plugins install  plugins/core          # working network
qodercli plugins install  plugins/core-support  # maintenance team
```

Both are local-scope plugins. After installing or editing profiles, **restart the Desktop app** before
trusting discovery (measured: new agents are not visible until restart).

## Rules that bind this repository

- **Never publish secrets.** No tokens, no API keys, no full prompts, no full tool responses. The DSH
  transcript extracts (`dsh-*-extracted.jsonl`) and the old tarball are deliberately **not** here: they
  contain revoked PATs. Scan before every commit (`docs/PUBLISH.md`).
- **One source of truth per fact.** The product's state ledger (`ESTADO.md`) lives in the application
  repository and is scribe-only. This repository never writes it.
- **Observation is read-only.** The tracker and the maintenance verifier never edit the thing they
  measure during a window.
- **Kill switches:** `D:/CORE-ORG/obs/track.off`, `D:/CORE-ORG/obs/policy.off`,
  `D:/CORE-ORG/bridge/bridge.off`.
