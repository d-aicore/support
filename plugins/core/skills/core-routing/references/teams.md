# Team structure — section × function matrix

Each **section is a team**. Inside a section there are three functions — **development, test, debug** —
plus survey/baseline/audit. Functions are realized as **stage instances of the five role templates**,
not as new persistent profiles. Granularity comes from scope and stage, not from profile count.

## Why this shape

- The original design separated C++ dev (Motor), test (QA áudio) and debug (Debugging) by technology.
  That splits one code path across three teams and makes cross-team handoffs the normal case.
- Organizing by **section** gives disjoint write scopes, localized refs, and free parallelism for
  read-only stages.
- Organizing functions **inside** the section preserves the one separation that genuinely matters:
  **whoever fixes never proves their own fix.** Independence is a constraint, not bureaucracy.
- The DSH round that delivered used 27 instances named `<subject>-<stage>` and zero persistent
  communicators. This matrix reproduces that shape at section granularity.

## Template mapping (5 templates, no new profiles)

| Function | Template | Stages | Writes code? |
|---|---|---|---|
| survey | `core-engine` | `survey` | no |
| baseline | `core-engine-scribe` | `baseline` | report only |
| audit | `core-guardian` | `triage` | no |
| **development** | `core-engine` | `fix`, `proof` | yes, within the section scope, authorized |
| **test** | `core-guardian` | `red`, `negctrl`, `release-proof` | tests only |
| **debug** | `core-engine` + installed `systematic-debugging` | `repro`, investigation | no (reducers in a copy) |
| coordination | `core-coord` | partition, assign, aggregate | no |
| tracking | `core-tracker` | observation window | `obs/` only |

## Naming

- Team: `S-xx` (the section id from `partition.md`).
- Instance: `S-xx-<stage>` — e.g. `S-05-survey`, `S-07-baseline`, `S-04-red`, `S-04-fix`, `S-04-negctrl`.
- Function label for reporting: `S-xx-dev`, `S-xx-test`, `S-xx-debug`. The label groups instances; it is
  not a separate agent.

## Independence rule (hard)

For the same section and contract:
- the `fix` instance and the `red`/`negctrl`/`release-proof` instances are **different instances**;
- the debug instance reduces and names the cause; the dev instance fixes; the test instance proves;
- a section's test function never validates work produced by its own dev instance in the same window;
- the guardian's negative control runs in a **copy**, never in the product tree.

## Activation — granular on demand, not idle

| Phase | Activated for | Cost |
|---|---|---|
| 1 · read-only | **all 12 sections**: survey + baseline + audit | parallel, no build, no authorization |
| 2 · per finding | dev + test + debug **only in sections with a finding worth fixing**, explicitly authorized | sequential per contract, disjoint across sections |
| 3 · close | release-proof per changed section, resume in a fresh session | one gate per clean tree |

A section that produces no finding gets **no** dev/test/debug instances. Granularity grows where the
tracker shows return, not by default. This is the answer to "as granular as possible": granular by
scope always, granular by function **when there is work of that kind**.

## Parallelism

- Read-only stages (survey, baseline, audit, tracking) parallelize freely across sections.
- Write stages parallelize only across sections with disjoint scopes and unique build dirs.
- Builds, gates and profiling never run inside a measurement window.
- One section, one stage instance, one report. No section is surveyed twice in a window.

## What this does NOT create

- No 36 persistent profiles. No per-section communicator. No per-section registry.
- No second state authority: reports go to `docs/relatorios/`, ledger lines are proposed, the scribe
  writes `ESTADO.md`.
- No new skill per function: dev/test/debug reuse `core-engine-rt`, `core-host-compat`, `core-gate`,
  `core-evidence` and the installed `systematic-debugging`.

## Open structural question for the owner

Sections S-09 (control/AI boundary) and S-11 (distribution) are small. They may merge into S-08 and
S-07 respectively without losing scope disjointness. The coordinator proposes; the owner decides.
Merging is recorded and re-assigned, never done silently mid-window.
