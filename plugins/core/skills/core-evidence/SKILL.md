---
name: core-evidence
description: Produces evidence and reports that conform to the d-aicore/core repository contract. Use when recording a passage, writing a delivery report, classifying claims, proposing ESTADO.md ledger lines, planning a red-to-green proof, or handing work to the next agent. Enforces scribe-only ledger authority, English-only repo material, and the four claim classifications.
---

# Core evidence contract

## Overview

The repository already has a documentation authority. Do not build a second one. Evidence is a report
in the existing format plus proposed ledger lines; the ledger itself is written only by its scribe.

## Procedure

1. Read `AGENTS.md`, `docs/AUDITORIA.md` and `docs/relatorios/MODELO.md` in the working checkout before
   writing. Follow them; do not invent a format.
2. Fix branch and SHA, platform and scope. Revalidate each pending item against the **current** code;
   an old report is not a description of HEAD.
3. Classify every claim with one of four labels: **confirmed in code / proven by test / reported only /
   not verified**. Cite `sha:file:line` or an execution. No label, no claim.
4. Separate a bug from a product or architecture decision. An audit task does not implement.
5. Write `docs/relatorios/YYYY-MM-DD-<subject>-<stage>.md` using the five `MODELO.md` sections — one
   report per stage. If two reports share subject and day, use a descriptive suffix.
6. Add the index entry in `docs/relatorios/README.md`. Preserve other sessions' uncommitted lines
   exactly; resolve by union and report the byte delta.
7. Propose the ledger lines **inside the report**, with quote and source, and open or update the
   pendência. Only the ledger scribe writes `ESTADO.md` (D72/D79/D80).
8. Close with the six-field handover so the next agent needs no chat history.

See [references/report-contract.md](references/report-contract.md) for the section shape, the handover
fields, the red→green requirements and the privacy rules.

## Rules that are not negotiable

- **No competing state summary.** No `docs/rede/`, no parallel `ESTADO.md`, no second registry.
- **English** for everything written into `d-aicore/core` (D101): code, identifiers, comments, test
  names and output, log and error messages, script and tool output, commit messages, new documentation.
  Owner quotes stay verbatim; the existing ledger and history are never translated or edited.
- **Never present a plan as implemented, an existing test as run, or a build as a UI test.**
- **Raw logs, temporary files and builds stay outside the repository.** Only small, necessary,
  secret-free evidence goes in.
- **Never read, copy or commit `~/.qoder/settings.json`** — it holds plaintext provider API keys.
  Never write secrets, tokens, full prompts or full tool responses into a report or evidence file.
- A previous report stays. A factual correction is a **dated addendum**, not a silent rewrite. Avoid
  full copies and "summary of the summary".
- Proposals use `P-F*`; bugs use `BUG-`. **Never allocate `D` numbers** — the ledger scribe does, and
  ratification needs a verbatim owner quote, a date and a source. Silence is not approval (D48/D50).
- Do not commit without explicit authorization for this delivery. Stage named files only.
- Conclude with concrete next steps. If blocked by platform, data or decision, leave the proof available
  and the exact question; do not mark it corrected or verified.

## Resources

- [references/proof-stages.md](references/proof-stages.md) — the unit of work and of evidence: one
  session per domain, stable role templates with stage-named instances, the stage contract table
  (`triage`, `survey`, `red`, `repro`, `build`, `fix`, `proof`, `negctrl`, `release-proof`, `resume`),
  ordering rules, and effort-not-model-switching.
- [references/report-contract.md](references/report-contract.md) — report sections, handover fields,
  red→green requirements, privacy and retention rules.

**One report per stage**, written by the stage that produced the evidence. There is no separate
communicator role and no passage dossier to assemble.
