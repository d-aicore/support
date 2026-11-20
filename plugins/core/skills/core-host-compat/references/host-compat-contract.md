# Host-side compatibility contract

Adapted as **knowledge** from the violation table of the public `kunitoki/sonic-skills@vst3-review`
skill (inspected 2026-11-20). That skill reviews plugin *implementations*, which Core does not write;
it was **not installed**. Its table is reused here inverted: each row is a third-party defect and the
consequence the **host** must detect and survive. No code was copied.

## Contract rows

| Plugin defect | Consequence in the host | Where Core must prove it | Registered test (at `59275d2`) |
|---|---|---|---|
| Latency not reported via `getLatencySamples()` | host PDC broken → early mixdown or timing drift | `juce_host.cpp` `latencySamples()` adds the host block; graph PDC | `timing_proof_tests` (`tests/CMakeLists.txt:311`) |
| `ParamID` not stable across save/load and versions | automation and presets silently map to the wrong parameter | relink must identify the instance and preserve state + automation | `state_recovery_tests` (`:328`) |
| `setComponentState` not applied by the controller on load | editor shows stale values after preset load | parameter surface exposed by Tools | **no coverage identified** — declare it |
| `setState`/`getState` asymmetric between component and controller | preset corruption: one side saves what the other ignores | save/restore pair in `juce_host.cpp` | `state_recovery_tests` (`:328`) |
| `IParamValueQueue` not fully consumed each `process()` | parameter updates lost → automation steps skipped | sub-block automation landing | `timing_proof_tests` (`:311`) |
| Bypass parameter does not pass audio through cleanly | artifacts or silence when the host automates bypass | mute/bypass path; bypass is not failure | `s9_mute_block_tests` (`:286`), `export_plugin_failure_tests` (`:84`) |
| `kOfflineProcessing` not handled separately from realtime | offline rendering broken: timing, denormals, lookahead | live vs export equivalence | `export_plugin_failure_tests` (`:84`), `cli_plugin_crash_render` (`:175`) |
| Allocation or lock inside `process()` | xruns and glitches | audio-thread purity, proven by tooling | `s7_rt_probe_tests` (`:255`), `s7_rt_strict_tests` (`:262`, known RED) |
| Bus arrangement differs from what was negotiated | channel count mismatch → buffer overread or silent output | bus negotiation and routing | **no coverage identified** — declare it |
| Plugin crashes in `processBlock` | must not hang the engine or take the song down | SEH guard + intentional leak (M1) | `cli_plugin_crash_render` (`:175`), `engine_process_tests` (`:162`) |
| Plugin crashes outside `processBlock` (state, reset, editor, parameter getter) | host guards around those entry points must hold | Fault seams | `engine_process_tests` with `CoreTestFault_VST3` (`:187-191`) |
| Plugin throws while playing | must be retryable into a new instance that plays | Throw seams | `engine_process_tests` with `CoreTestThrow_VST3` (`:195-199`) |
| Plugin asks for component restart then crashes | vendored JUCE gate + `markCrashedByHost()` wiring | CrashRestart seams, D113 patch | `engine_process_tests` with `CoreTestCrashRestart_VST3` (`:204-208`) |

Rows marked **no coverage identified** are gaps to register in the catalogue, not to estimate. They were
not exhaustively searched; treat them as "not found in this pass".

## Measured code locations

`engine/src/plugins/juce_host.cpp`, target `core_plugin_host`. Line numbers differ between revisions —
always cite the SHA.

| Symbol | at `0d7d8ce` (pin) | at `59275d2` (HEAD) |
|---|---|---|
| `latencySamples()` (`getLatencySamples() + block_`) | `:162` | `:162` |
| VST3 scan `findAllTypesForFile` | `:335`, `:656` | `:335`, `:670` |
| `setStateInformation` | `:348`, `:351` | `:348`, `:365` |
| `getStateInformation` | `:392`, `:484` | `:406`, `:498` |
| crash marking `getVST3Client()->markCrashedByHost()` | `:136` (reported at HEAD) | `:136` |
| intentional leak (M1) destructor | `:100-122` | `:100-122` |

The host's own comment at HEAD states: "This host loads VST3 only (above): its state is the JUCE binary
XML `getStateInformation` writes."

## Registration is conditional

`cli_plugin_crash_render`, `m5_bitexact_tests`, `s7_rt_probe_tests`, `s7_rt_strict_tests`,
`s9_mute_block_tests` and `timing_proof_tests` register only when the test plugins and `core_plugin_host`
exist (`CoreTestSynth_VST3`, `CoreTestGain_VST3`, and the crash/fault/throw/restart variants).
`state_recovery_tests` needs `core_engine_client` **and** `juce_events`. Without the app build the
plugin-dependent tests are absent — that is a configuration gap, not a coverage regression.

The test plugins live in `app/selftest-plugins/TestPlugins.cpp` and are built with JUCE. Some probes used
by `timing_proof_tests --evidence` and `s9_mute_block_tests` are **out-of-repo** builds
(`CoreTimingDelay`, `CoreTimingClick`, `CoreTestDelay`) with no repo target.

## External oracle (candidate, owner decision)

`pluginval` 2.0.0 (2026-10-14, built on JUCE 9.0.3) validates plugins at strictness 1–10 with crash
backtraces. Licence **GPL-3.0**: run it as an external out-of-process tool, **never copy its code**.
Useful to characterize a misbehaving third-party plugin before blaming the host. Not adopted yet.
