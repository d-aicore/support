---
name: core-routing
description: Maps a Core DAW request to the responsible team and the real code paths, and enforces the minimum-branch rule. Use when asked who owns Pattern Maker, Tools, MIDI, automation, persistence, project recovery, plugin hosting, the engine, the UI, or the build gates, or when a request must be routed before any work starts. Not for writing code or reports.
---

# Core routing

## Overview

Route one intent to one branch. The network has 11 teams and 24 designed profiles; only four are active
in this slice. Consulting a second branch "just in case" is a defect.

## Procedure

1. Read the owner's intent literally. Identify the **product domain**, not the technology.
2. Look up the domain in [references/domain-map.md](references/domain-map.md). It gives the team, the
   active profile, and the real paths at the working revision.
3. Verify the paths exist at that revision before delegating (`git ls-tree`, `Grep`). A path from an
   older document is a hypothesis, not a fact.
4. Delegate to one profile with the intent, task id, revision and acceptance criterion.
5. If the domain is not in the map, say so and ask the owner. Do not invent a team.

## Decision rules

- **Engine first.** The owner's current priority is engine quality and reliability (D99/D115). A request
  that could go to the engine or to the UI goes to the engine unless the owner says otherwise.
- **Data before real time before performance before compatibility** (D54/D115). When two domains
  conflict, this order decides.
- **Hosting, not authoring.** A request about "a plugin" means a third-party VST3 hosted by Core. Core
  has no instruments or effects of its own. If the request assumes a bundled creative plugin, the
  premise is false — re-scope to hosting, state, automation or recovery.
- **Tools are musical, not agentic.** "Tools" in this project means reusable plugin chains with exposed
  parameters inside the DAW. It never means agent tools, Qoder plugins or skills. Say this explicitly
  when routing a Tools request; the two vocabularies collide in every passage.
- **Out-of-tree surfaces stay out.** Master vertical/selection, visual refinement, the DSP window and
  the interface mockup are outside the tree by owner order (D83); re-entry needs a numbered decision.
  UX work follows D102 (Pulse concepts, Core look/menus/colours) and D103 (piano scope).
- **One model, one entry.** Owner decision: only `qwen4-max-preview`, on the **Token Plan BYOK** entry
  (`byok:qoder-custom-0f384ab2-…/qwen4-max-preview`) — the only Qwen entry enabled on this account; the
  system entries are `unavailableReason: "account"` and measurably return 403. Do not switch model to
  escape a failure: on `DataInspectionFailed` change the *input* (handoff + `resume`), never the model.
  Profiles stay `model: inherit`; agents cannot set the preference, so drift is measured with
  `route-audit --policy qwen4-max-preview`. Table, constraints (8192 output ceiling, armed input gate)
  and ladder: [references/model-routes.md](references/model-routes.md).
- **AICORE is separate and optional.** Creative AI belongs to AICORE, not to the DAW. No crossing
  without a decision (`docs/FRONTEIRA-CORE-AICORE.md`).

## Resources

- [references/domain-map.md](references/domain-map.md) — domain → team → profile → paths, and the
  active-slice limits.
- [references/partition.md](references/partition.md) — the 12-section project partition for the first
  coordinated task: section ids, paths, the function question each survey answers, the stage plan
  (survey → baseline → triage → red/fix/proof), and the baseline report shape.
- [references/teams.md](references/teams.md) — section × function matrix: each section is a team with
  development/test/debug functions realized as stage instances of the five templates; the independence
  rule (whoever fixes never proves their own fix); activation on demand, not idle granularity.
- [references/model-routes.md](references/model-routes.md) — the single-model policy (only
  `qwen4-max-preview`, Token Plan entry), the measured availability of every catalog entry including
  the account-disabled ones and their 403 counts, the two constraints that remain (armed input gate,
  8192 output ceiling), how drift is measured, the recovery ladder that changes the input instead of
  the model, and the hypotheses already exonerated by experiment.
