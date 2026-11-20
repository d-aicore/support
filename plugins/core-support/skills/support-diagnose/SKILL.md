---
name: support-diagnose
description: Locates and runs the Core network's diagnostic tools to explain a functioning problem before anything is changed. Use when a skill does not activate, an agent is missing after install, model drift or a provider rejection appears, a gate verdict is suspect, or cited references stop resolving. Read-only; produces measurements with denominators, never payload text.
---

# Support diagnose

Measure first. A symptom without a measurement is a hypothesis, and hypotheses are not edited into
skills.

## Locate the working plugin

```bash
node scripts/locate.mjs
```

Prints the root of the installed/working `core` plugin (env `CORE_PLUGIN_ROOT`, then the support
repository's `plugins/core`, then the legacy live directory). Every command below uses that root as
`$CORE`. If none resolves, stop and report — do not guess a path.

## The instruments

| Question | Command |
|---|---|
| Did the passage preserve intent, refs, limits? | `node $CORE/skills/core-track/scripts/track.mjs <session> [--repo <clone>]` |
| Which model route ran, and what failed? | `node $CORE/skills/core-track/scripts/route-audit.mjs --since <date> [--policy qwen4-max-preview]` |
| Why was an input rejected, and what is the ladder? | `node $CORE/skills/core-track/scripts/route-doctor.mjs --since <date>` |
| What content classes does a payload carry? | `node $CORE/skills/core-track/scripts/payload-scan.mjs <session> [--around N]` |
| Is the bridge healthy / what is pending? | `node $CORE/skills/core-bridge/scripts/bridge.mjs selftest` / `pending` |
| Is the plugin structurally valid? | `qodercli plugins validate <plugin-dir>` |

## Rules

- Read-only. No installs, no edits, no builds during diagnosis.
- Publish N, coverage and limits with every number. `maxOut=0` means *not measured*, not headroom.
- Only genuine log records are parsed; echoed shell commands are excluded by the parser guard.
- n=1 co-occurrence is a lead, not a cause. Say which experiment would discriminate.
- Never read `~/.qoder/settings.json`; never print prompt text or secret values.
- Kill switches honoured: `obs/track.off`, `obs/policy.off`, `bridge/bridge.off`.

## Output

One paragraph per finding: symptom, measurement (command + N + coverage), classification
(communication / structure / performance / useful return), and the single falsifiable cause or the
discriminating check still needed. Hand to `support-maintainer` only with that shape.
