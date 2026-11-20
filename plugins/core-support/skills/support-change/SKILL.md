---
name: support-change
description: Applies one safe change to the Core network's own assets (skills, profiles, hooks, docs) and proves it with a before/after measurement. Use after support-diagnose has produced a measured cause. Enforces validate-install-probe-measure, one variable per comparison, version bump, secret scan, and independent verification by support-verifier.
---

# Support change

One change, one variable, one verifier that is not you.

## Procedure

1. **Precondition:** a measured cause from `support-diagnose`, written down with N and limits. If the
   cause is still a hypothesis, run the discriminating check first; do not edit on a guess.
2. **Edit one asset** in the support repository (`plugins/core/**` or `plugins/core-support/**` or
   `docs/**`). Never product code, never the product ledger, never account/model configuration.
3. **Validate:** `qodercli plugins validate plugins/<name>`; require the expected component counts and
   zero errors. A validation warning is a finding, not noise.
4. **Install:** `qodercli plugins install plugins/<name>`. Remember discovery needs an app **restart**
   before it can be judged; schedule the probe accordingly instead of concluding "unsupported".
5. **Probe:** fresh session, self-contained brief, objective transcript checks (first tool call,
   skills activated, refs resolving). The agent's self-label is not evidence.
6. **Measure after** with the same command, model, tools and revision as before. Publish both numbers
   with denominators. If anything else drifted, the comparison is inadmissible — say so.
7. **Record + version:** append expected/obtained/config to the test log; bump
   `.qoder-plugin/plugin.json`; secret-scan the tree (`docs/PUBLISH.md`); commit in support only.
8. **Hand to `support-verifier`** (different instance) with the before/after commands and the adjacent
   contract to check. Do not certify your own change.

## Stop conditions

- The fix requires product code, the ledger, a permission grant or account configuration → stop, ask
  the owner.
- An observation window is open → wait; changing the measured thing destroys the measurement.
- Validation or install fails → report literally; do not work around the validator.
- A secret pattern appears in the tree → redact the derived copy, report presence/location without
  the value, and do not commit.

## Reversibility

Every change must be revertible by disabling the plugin (`qodercli plugins disable <name>`) or by
reverting the single commit. Kill switches (`obs/track.off`, `obs/policy.off`, `bridge/bridge.off`)
stay available and are never removed by a change.
