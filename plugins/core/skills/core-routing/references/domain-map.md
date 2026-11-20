# Domain map — Core DAW

Paths measured in `D:\CORE\CORE`. Revisions: `0d7d8ce` (owner-pinned tooling version) and `59275d2`
(HEAD). `ci/` and `CMakeLists.txt` are identical between them; `tests/` differs (22 registered tests at
the pin, 31 at HEAD). **Re-verify every path at the working SHA before delegating.**

## Active slice (four profiles)

| Domain | Team | Active profile | Real paths |
|---|---|---|---|
| Engine / real time / graph / workers | Motor C++/miniaudio | `core-engine` | `engine/src/core/{engine,graph,workers,rt_workers,render_job,tempo_map,project,server,qualify}.cpp` |
| Device / miniaudio backend | Motor | `core-engine` | `engine/src/io/device.cpp` (callback `:79`, wiring `:160` at pin / `:177` at HEAD), `engine/src/io/miniaudio_impl.c`, `engine/third_party/miniaudio.h` |
| Engine process / client protocol | Motor | `core-engine` | `engine/src/app/main.cpp`, `app/engine-client/src/engine_client.{cpp,hpp}` |
| VST3 hosting of third-party plugins | Host VST | `core-engine` (host competence) | `engine/src/plugins/juce_host.cpp` (target `core_plugin_host`), `app/selftest-plugins/TestPlugins.cpp`, `docs/plan/plugin-hosting-map.md` |
| Persistence, integrity, recovery | Motor/Host + QA | `core-engine` | `app/domain/src/{document,autosave,history,edit,bounce,assets}.cpp`, `docs/plan/data-loss-map.md` |
| Test catalogue / gates / sanitizers | Verificação Qualidade | `core-guardian` | `tests/CMakeLists.txt`, `tests/*.cpp`, `ci/gate.ps1`, `ci/review-env/**`, `ci/tidy_scope.py`, `TRIAGEM-TESTES.md` |
| Passage report / ledger proposals | Verificação Registo | `core-engine-scribe` | `docs/relatorios/**`, `docs/relatorios/MODELO.md`, `docs/AUDITORIA.md`, `AGENTS.md`, `ESTADO.md` (read-only) |
| Routing / aggregation | Coordenação | `core-coord` | — |

## Designed but not active in this slice

| Domain | Team | Paths | Why not active |
|---|---|---|---|
| Pattern Maker | JUCE/UI + QA UX (surface); Motor (kick/bass/cymbal alignment) | `patterns/{bass,break,cymbals,drop,drums,hats,lead,perc}`, `pcore/styles.json`, `app/domain/src/{groove,follow}.cpp` | no UI work authorized in this slice |
| Tools (musical) | Host (parameters/state) + JUCE/UI (surface) | `app/domain/src/core_plugins.cpp`, `app/control/src/{calls,bridge,presets}.cpp` — **verify at the working SHA** | exact files not confirmed by measurement |
| MIDI | Motor + QA áudio | `tests/midi_tests.cpp` + domain files (**locate at the working SHA**) | not confirmed by measurement |
| UI / UX | JUCE/UI + QA UX | `app/desktop/**` (detach machinery in `MainComponent`, `Mixer`, `LibraryPanel`, `EngineSession`), `docs/plan/ux-pulse-spec.md` | visual evidence via `core-ui-visual`; mockup produced by a DSH team. Owner rules: **all windows start detachable**, **style before layout**. Implementation gated by D83/D102/D103 |
| Benchmarks | Benchmarks isolados | `engine/src/app/measure.cpp` → `core-engine`, `cli_measure` ctest; no separate bench scripts found | needs an isolated measurement window |
| Debugging | Debugging JUCE/C++ | `ci/review-env/probe/stack_probe.cpp`, `docs/relatorios/2026-11-20-env03-debug-259.md` | covered by `core-engine` + `systematic-debugging` for now |
| Technical research | Pesquisa técnica | external primary sources | covered by WebSearch/WebFetch + `context7` |
| Installer / distribution | Host | `app/installer/Setup.cpp` → `CoreSetup` ("Core Setup.exe (M6)"); no `.iss/.wxs/.nsi` | not in the first task |
| Build / gate environment | Guardião + scribe | `ci/compilar.bat`, `ci/gate.ps1`, `ci/gate.sh`, `ci/review-env/**` | active through `core-guardian` |
| Core/AICORE boundary | Coordenação + Pesquisa | `docs/FRONTEIRA-CORE-AICORE.md`, `docs/DIRECCAO-CORE-PATTERN-MAKER-TOOLS.md` | decided, not fully implemented; no crossing without a decision |

## Vocabulary trap

**Tools (musical)** = reusable plugin chains, presets, selected parameters, a simplified interface, and
templates that may later be prepared by AI and imported into Core. **Never** agent tools, Qoder plugins
or skills. The collision is permanent; disambiguate in every passage.

Legacy names **F-Core, P-Core, W-Core, D-Core** do not describe the current product. Some identifiers and
algorithms survive in code for compatibility. Distinguish internal mechanisms from intended surfaces;
the source of truth is the current repository read through ratified decisions.
