# Publish — changing the system safely

## The loop

1. **Reproduce** the symptom with a measurement, not an opinion (`docs/RUNBOOK.md`).
2. **Change one thing** in `plugins/core/` or `plugins/core-support/`. One variable per comparison.
3. **Validate:** `qodercli plugins validate plugins/<name>` — must report the expected component counts
   (skills/agents/hooks) and zero errors.
4. **Install:** `qodercli plugins install plugins/<name>`, then **restart the Desktop app** before
   trusting discovery.
5. **Probe:** a fresh session with a self-contained brief; check the objective transcript facts
   (first tool call, skills activated, refs resolving), not the agent's self-label.
6. **Measure:** `track.mjs` / `route-audit.mjs` before and after; publish denominators and coverage.
7. **Record:** append the result to `legacy/TESTE-sistema-core.md` (or a new dated test log) with
   expected/obtained/config, and bump the plugin version in `.qoder-plugin/plugin.json`.
8. **Commit and push** this repository. The application repository is never touched by this loop.

## Secret hygiene (non-negotiable)

Before every commit, scan the tree; publish filenames of hits, never values:

```bash
grep -rlE 'github_pat_[A-Za-z0-9_]{10,}|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY|Bearer [A-Za-z0-9._-]{20,}' .
```

Never commit: `~/.qoder/settings.json`, DSH transcript extracts (`dsh-*-extracted.jsonl`), tarballs of
sessions, full prompts or full tool responses. If a secret appears in source material, report its
presence and location **without its value** and redact the derived copy.

## What never changes here

- The product ledger (`ESTADO.md`) and product code: authority lives in the application repository.
- Account/model configuration and permission grants: owner-only.
- Anything during an observation window: the tracker and verifier stay read-only.

## Repository topology

`core-org` = application, clean. `support` = everything about how the work functions. If a new asset
helps the *product build*, it belongs in `core-org`'s own `ci/`/`tests/`; if it helps the *network
function*, it belongs here. When in doubt, ask the owner rather than cluttering the application.
