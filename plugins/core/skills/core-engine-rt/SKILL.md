---
name: core-engine-rt
description: Real-time safety and shutdown behaviour of the Core DAW engine. Use for the audio callback, overruns/xruns, workers and buffers, allocation or locks on the audio thread, the Debug "code 259" / STILL_ACTIVE shutdown failure, engine-client close timeouts, the intentional leaked-crashed-plugin policy, or the JUCE MidiEventList audio-thread lock. Not for UI, not for authoring plugins, not for creating instruments or effects.
---

# Core engine real-time rules

## Overview

The engine is a vendored miniaudio callback in a separate process, driven by a pipe client. Most
"engine hangs" in Debug are **not hangs**: they are a slow-but-finite CRT exit path racing a client
timeout. Diagnose before proposing.

## Procedure

1. Fix the revision and read the actual code at that SHA. Do not reuse a line number from an older report.
2. Classify the symptom:
   - **audio-thread violation** (alloc/lock/I/O/blocking) → prove with tooling, not by reading;
   - **shutdown / exit-code** → measure the timeline: close → stdout EOF → real process exit;
   - **throughput / multicore** → M5 is OFF by default (D51); every parallel run opts in explicitly.
3. For shutdown, read [references/env03-debug-259.md](references/env03-debug-259.md) first. It contains
   the proven cause, the measured timeline, the captured stacks, and the two different wait paths.
4. Measure a red before proposing a change. The owner's dispatch for this class of work is explicit:
   reproduce at the current SHA and measure pipe closure, process exit and teardown **before** proposing
   a timeout change.
5. Propose; do not implement without explicit authorization and scope.

## Rules that are not negotiable

- **No allocation, lock, I/O or blocking call on the audio thread.** This is owner criterion 3, and it
  counts as met only when proven by measurement.
- **A crashed plugin instance is leaked on purpose** (policy M1). Under `/EHsc`, the SEH catch skips the
  destructors of the frames it cuts through, so every lock held around the call stays held. JUCE's VST3
  host takes a spin lock around `processBlock` and the same lock in `releaseResources()` and `reset()`;
  releasing the instance waited forever on the message thread and the engine then answered nothing and
  never exited. **Never release or delete a crashed instance.** The leak is the fix, not the defect.
- **The Debug CRT leak dump is a cost, not a hang.** Each leaked block costs roughly 0.3–1 ms in
  `_CrtDumpMemoryLeaks` (DBWIN synchronization + SEH probe + `vsnprintf` + hex). Two leaked instances
  mean thousands of blocks. The engine still exits by itself with code 0.
- **Two wait paths, two behaviours.** `engine_client.cpp:167` waits `options_.closeTimeout` and has a
  not-signalled branch. `engine_client.cpp:333` waits a hardcoded `2000` and then only reads
  `GetExitCodeProcess` — it does **not** terminate. A genuine post-EOF hang on that path is reported as
  259, not killed. Any fix must add the missing regression guard.
- **`s7_rt_strict_tests` is a known measured RED**, label `rt_strict`, excluded from `merge` by the
  ENV-03 precedent. It goes green only by an authorized fix or explicit owner acceptance.
- **Do not disable the automatic leak report to make Debug fast** without an owner decision. It is
  currently the only automatic channel reporting those intentional leaks, and this repository's canary
  rule is that a detector which does not trip makes the green meaningless.

## Known upstream defect

JUCE's `MidiEventList` uses `Array<Vst::Event, CriticalSection>`, which locks on the audio thread.
[JUCE issue #1588](https://github.com/juce-framework/JUCE/issues/1588) (opened 2025-10-29) carries an
RTSan trace of exactly this path and was still open with no accepted upstream fix at survey time.
A fix here would be a local vendored patch hunk (the D113 mechanism) or a wrapper-level bypass —
**an owner decision, not an agent choice**. Secondary locks to audit: `listenerLock` in
`sendValueChangedMessageToListeners`, and SysEx allocation in `MidiMessage` paths.

## Resources

- [references/env03-debug-259.md](references/env03-debug-259.md) — the proven Debug-259 dossier:
  timeline, stacks, proportionality controls, code references, proposals A/A2/B/C, red→green plan,
  and the evidence label of every claim.
