# Project partition — sections for the first coordinated task

Paths measured at `c40ed0f8` (and stable at `0d7d8ce` for `engine/`, `app/`). **Re-verify every path at
the working SHA before assigning a stage.** The coordinator assigns one section per stage instance,
named `<section>-<stage>` (e.g. `S-05-survey`, `S-07-baseline`, `S-04-red`).

| Id | Section | Paths | Function question the survey must answer |
|---|---|---|---|
| S-01 | Engine core & graph | `engine/src/core/{engine,graph,render_job,project}.cpp/.hpp` | how transport, the node graph, render jobs and engine-side project state actually work |
| S-02 | Real-time workers | `engine/src/core/{workers,rt_workers}.hpp`, `qualify.cpp` | how multicore/M5 is gated, what the workers do, where RT safety is enforced |
| S-03 | Tempo & timing | `engine/src/core/{tempo_map,server}.cpp` | tempo map, scheduling, latency compensation seams |
| S-04 | Device & backend | `engine/src/io/{device.cpp,miniaudio_impl.c}`, `engine/third_party/miniaudio.h` | the audio callback, device lifecycle, backend behaviour |
| S-05 | Plugin host | `engine/src/plugins/juce_host.cpp`, `app/selftest-plugins/TestPlugins.cpp` | VST3 scan/instantiate, state save/restore, crash isolation, the intentional-leak policy |
| S-06 | Engine process & protocol | `engine/src/app/{main,measure}.cpp`, `app/engine-client/src/engine_client.cpp/.hpp` | serve loop, pipe protocol, message limits, close/exit paths, measure CLI |
| S-07 | Domain & persistence | `app/domain/src/{document,autosave,history,edit,assets,bounce}.cpp` | song model, save/reopen, undo, crash recovery, export refusal, sample integrity |
| S-08 | Musical surfaces | `app/domain/src/{groove,follow,core_plugins}.cpp`, `patterns/`, `pcore/styles.json`, `templates/` | Pattern Maker, Tools, role map, pattern catalogue and alignment |
| S-09 | Control & AI boundary | `app/control/src/{calls,bridge,presets}.cpp` | control calls, presets, the Core/AICORE boundary as implemented |
| S-10 | Desktop shell & windows | `app/desktop/src/{MainComponent,Mixer,LibraryPanel,PatternEditor,WindowLayout,EngineSession}.cpp` | UI shell, detachable windows, layout persistence, engine session |
| S-11 | Distribution & fixtures | `app/installer/Setup.cpp`, `app/selftest-plugins/` | installer flow, sample protection, test plugins |
| S-12 | Verification & build | `tests/`, `ci/`, `cmake/`, `CMakeLists.txt` | registered tests and labels, gates, sanitizers, canaries, build identity |

## Stage plan per section

1. **`survey`** — read the code, state the section's function with `sha:file:line`. Reuse and revalidate
   the existing maps (`docs/plan/realtime-map.md`, `plugin-hosting-map.md`, `data-loss-map.md`,
   `dead-code-inventory.md`, `ux-pulse-spec.md`) instead of writing competing ones.
2. **`baseline`** — record the starting point (shape below). Two kinds, never conflated:
   - **reading baseline**: what the code does, which registered tests cover the section, what is known
     red, what is unverified. Produced read-only, no build.
   - **measured baseline**: gate/suite execution with per-suite counts, exit codes, wall time, build
     identity. **Requires authorization and machine time**; never implied by the reading baseline.
3. **`triage` / audit** — classify findings against the current SHA: confirmed in code / proven by test /
   reported only / not verified. Separate bug from product/architecture decision. Check the existing
   triage ledger (`TRIAGEM-TESTES.md`) for already-refuted findings before re-reporting them.
4. **`red` → `fix` → `proof` → `negctrl` → `release-proof`** — only for bugs, only with explicit owner
   authorization and scope, in the owner order **data > real time > performance > compatibility**.

## Baseline report shape (per section)

```text
section: S-xx · name · revision (sha) · stage instance name
function: 2-5 sentences, each claim with sha:file:line
paths: the files actually read
registered tests: names + labels from tests/CMakeLists.txt at this SHA, or "none found" + the search
known red: e.g. s7_rt_strict (owner-decision gate), with the report that measured it
covered / not covered: which function claims have a test and which do not
limits: what was not read, not run, not verified
priority relevance: which of data / real time / performance / compatibility this section serves
next stage: id + owner + prerequisites satisfied
```

## Rules for the partition

- **One section, one stage instance, one report.** No section is surveyed twice in the same window.
- **Disjoint scopes.** Two sections may run in parallel only if their write scopes and build dirs are
  disjoint. Surveys are read-only and parallelize freely.
- **Minimum branch.** A section consults only its own paths plus the shared contracts
  (`AGENTS.md`, `ESTADO.md`, `docs/AUDITORIA.md`, `MODELO.md`). Cross-section questions go through the
  coordinator, not by wandering.
- **No implementation during survey/baseline/triage.** Those stages read and measure; they propose.
- **Free-model stress test:** with `efficient` (200k context, no effort control), long dossiers must be
  read in parts and reports written in sections. A section that exceeds context is split, not truncated
  silently.
- **The partition is a proposal.** The owner may merge or split sections; the coordinator records the
  change and re-assigns, never silently re-partitions mid-window.
