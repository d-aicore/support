---
name: core-host-compat
description: Host-side compatibility contract for third-party VST3 plugins in the Core DAW. Use when plugin state or automation is lost on save/reopen or across plugin versions, when presets recall wrong values, when latency/PDC or bus routing is wrong, when bypass or offline export misbehaves, or when a hosted plugin crashes. Core hosts plugins; it does not author them.
---

# Core host compatibility

## Overview

Core is the host. The plugins are third-party and may be badly written. The job is to **detect and
survive** their failure modes, not to fix their code. The contract below is the oracle: each row is a
plugin defect, its consequence in the host, and where Core must prove it handles it.

## Procedure

1. Fix the revision. Read `engine/src/plugins/juce_host.cpp` at that SHA — line numbers move between
   revisions (see the reference for both measured sets).
2. Read the existing map `docs/plan/plugin-hosting-map.md` and revalidate it; do not rewrite it from
   memory.
3. Identify which contract row the symptom belongs to. Load
   [references/host-compat-contract.md](references/host-compat-contract.md).
4. Find the registered test that protects that row, with its oracle and tolerance. If none exists, say
   **no coverage** — do not estimate coverage.
5. Prove with a pertinent execution: expected, obtained, tolerance, configuration. A green test with a
   widened tolerance is a finding, not a pass.
6. Hand the passage to `core-engine-scribe`.

## Decision rules

- **State is the JUCE binary XML that `getStateInformation` writes.** This host loads VST3 only. Any
  claim about state must resolve to the save/restore pair in `juce_host.cpp`, not to a generic VST3
  description.
- **A parameter ID that is not stable across versions breaks automation silently.** When a project
  recalls wrong values, suspect ID mapping before suspecting the curve.
- **Latency must be reported by the plugin and compensated by the host.** A missing
  `getLatencySamples()` breaks PDC; the host's own block size adds to it.
- **Bypass is not failure.** An export whose needed plugin failed to load or failed during render is
  refused before publish; a bypassed plugin is not a failed plugin.
- **Offline is a different mode.** `kOfflineProcessing` mishandled by a plugin shows up as export
  defects, not live defects. Test both paths.
- **A crashed instance is leaked on purpose** (M1). Never release or delete it. The host must keep the
  song playing and must still exit by itself.
- **No bundled creative plugins.** A request to "update a VST included with Core" rests on a false
  premise: Core has no instruments or effects of its own (D91/D104). Re-scope to third-party hosting.

## Resources

- [references/host-compat-contract.md](references/host-compat-contract.md) — the defect → consequence →
  Core reference table, the measured code locations at two revisions, and the registered tests that
  protect each row.
