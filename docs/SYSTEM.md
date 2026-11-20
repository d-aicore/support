# The system, explained

For a human joining the project, or a maintenance agent that must not guess.

## The four kinds of asset

- **Plugin** — a directory with `.qoder-plugin/plugin.json` plus `agents/`, `skills/`, `hooks/`.
  Installing it makes its profiles and skills available to sessions. Two exist here: `core` (the
  working network) and `core-support` (the maintenance team).
- **Agent profile** (`agents/*.md`) — a frontmatter contract: `name`, `description`, `tools`, `skills`,
  `model`, `permissionMode`. All five working profiles set **`model: inherit`**: the session chooses
  the model, the profile never pins one. Pinning was a real defect (v0.2.0) that hard-routed every
  agent to a gated endpoint.
- **Skill** (`skills/<name>/SKILL.md`) — declarative knowledge plus optional `references/` and
  `scripts/`. The description is what makes it activate; it must name the situations, not the theory.
  Scripts are deterministic tools; the skill explains when and why to run them.
- **Hook** (`hooks/hooks.json`) — code the app runs at an event, not something the model invokes. The
  model-policy hook runs on `UserPromptSubmit`; it records and warns, never blocks.

## Proof stages

Work is ordered by what it proves, not by who does it:
`triage · survey · baseline · red · repro · build · fix · proof · negctrl · release-proof · resume`.

- **survey** reads a section's function in the code; **baseline** writes what was read (a *reading*
  baseline) or what was measured (a *measured* baseline) — the two are never conflated.
- **red** shows a test failing for the right reason before **fix**; **proof** shows it passing after.
- **negctrl** shows the proof can fail: the criterion is exercised on a copy where the fix is absent.
- **release-proof** re-runs the real gate on the released configuration; **resume** re-enters work in
  a fresh session from a handoff artifact, carrying the same refs *and the same limits*.

A stage return that prevented a wrong test is a **useful result**, not a defect. Rework is the same
question returning because a condition was lost.

## Why one model, and what it costs

The owner chose `qwen4-max-preview` for everything, for the 20% spend bonus. Two catalog entries carry
that name; only the Token Plan BYOK entry is selectable while Qoder credits are exhausted. Consequences
the network designs around:

1. **Provider input inspection** on that entry cannot be disabled. It refuses before the model runs
   (`input_tokens=0`) and identical retries reproduce the verdict. Recovery changes the *input*
   (handoff + `resume`), never the model.
2. **Declared max output** is a client setting in the BYOK «Edit model» dialog (128K option seen);
   whether the provider honors it is unverified until a long output is measured. Until then: one stage
   per agent, scribe writes the report, bounded returns.
3. **Effort is the lever**, set on the session (`--reasoning-effort`), never invented as a profile
   field. The BYOK entry supports `minimal…max`.

## What the maintenance team may and may not do

`core-support` diagnoses the **network's functioning**: activation, discovery, drift, broken scripts,
stale references, gate misreporting. It may change skills, profiles, hooks and docs **in this
repository**, then validate → install → probe → measure. It may **not** change product code, the
product ledger, or account/model configuration, and it may not edit anything during an observation
window. One variable per comparison; the verifier is a different instance from the changer.
