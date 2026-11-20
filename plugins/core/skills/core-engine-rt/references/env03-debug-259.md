# ENV-03 / Debug "code 259" — proven cause dossier

**Evidence labels.** `verified-now` = code or script read in this authoring session at `59275d2` (HEAD)
and `0d7d8ce` (owner-pinned tooling version). `reported` = measured by the DSH lead session
`a69b320fbfab`, agent `env03-debug`, at `a9a0384` + local round-1/S2/S3 corrections, and recorded in
`docs/relatorios/2026-11-20-env03-debug-259.md` with 47 evidence files. **Reported numbers were not
re-run here.** A reported result proves only that the tool returned that output at that time.

## Symptom

`engine_process_tests` case "crashes in processBlock" fails in Debug with `code 259` at
`tests/engine_process_tests.cpp:159`; the same case passes in Release. Other Debug cases
("restart the component", "bounded reset", "throws while playing") pass. 259 is `STILL_ACTIVE`.

- `reported`: Debug 3/3 FAIL (~6 s/run), Release 3/3 PASS (~3.4 s).
- `verified-now`: the assertion at `tests/engine_process_tests.cpp:159` is
  `CHECK_EQ(end.get(), std::string("The engine exited (code 0)."));` — the test demands the engine exit
  **by itself** with code 0, not be terminated. Line number matches the report exactly at HEAD.

## Cause (proven, not a hang)

The engine always exits by itself with code 0. In Debug it is slow because the CRT automatically dumps
the intentionally leaked blocks at exit, and the client stops waiting too early.

1. `close()` → stdout EOF arrives in 25–68 ms, because the EXE's CRT closes the duplicated protocol
   handle (`g_protocol`, `engine/src/app/main.cpp:113-122`) **before** the slow part. `reported`
2. The main thread then spends the whole window in the automatic Debug leak dump, twice:
   - engine CRT: `common_exit` (`exit.cpp:286`) → `__scrt_uninitialize_crt` (`utility.cpp:221`) →
     `report_memory_leaks` (`initialization.cpp:211`) → `_CrtDumpMemoryLeaks` (`debug_heap.cpp:1723`) →
     `dump_all_object_since_nolock` (`:1652`) → `_CrtDbgReport` → `OutputDebugStringA` + DBWIN mutex/wait;
   - leaked plugin DLL CRT at detach: `ExitProcess` → `LdrShutdownProcess` →
     `DllMainCRTStartup` → `dllmain_crt_process_detach` (`dll_dllmain.cpp:195`) → same chain →
     `debug_heap.cpp:1672` (hex dump per block). `reported`
3. Other threads: 3 idle workers. **No audio thread, no JUCE loop, no watchdog, no plugin-lock wait.**
   `reported`
4. The client waits a hardcoded 2000 ms after EOF, expires ~0.7–1.3 s early, reads
   `GetExitCodeProcess` = 259, and reports "code 259". `verified-now` for the code, `reported` for the timing.

## Measured timeline (`reported`)

| Condition | close → real exit | EOF → exit |
|---|---|---|
| Debug, 2 leaked instances | 2723–3286 ms | 2660–3250 ms |
| Debug, 1 leaked instance | 1243 ms | 1193 ms |
| Debug, 0 leaks (clean control) | 178 ms | 120 ms |
| Release, 2 leaked instances | 31–50 ms | 4–25 ms |

Proportionality controls 0/1/2 leaks are what make this a proof rather than a correlation. Each leaked
block costs ~0.3–1 ms (DBWIN sync + SEH probe + `vsnprintf` + hex).

## Code references (`verified-now`, identical at HEAD and at the pin)

| Fact | Location |
|---|---|
| hardcoded post-EOF wait | `app/engine-client/src/engine_client.cpp:333` → `WaitForSingleObject(process_->process, 2000);` |
| the other wait already uses the option | `app/engine-client/src/engine_client.cpp:167` → `WaitForSingleObject(process_->process, (DWORD)options_.closeTimeout.count()) != WAIT_OBJECT_0` |
| app default timeout | `app/engine-client/src/engine_client.hpp:46` → `std::chrono::milliseconds closeTimeout{2000};  // then the process is terminated` |
| post-EOF path does not terminate | after `:333` the code only calls `GetExitCodeProcess` and `disconnect(...)`; `TerminateProcess` appears in the `tooLarge` branch above it |
| intentional leak policy M1 | `engine/src/plugins/juce_host.cpp:100-122` — destructor releases listeners, then `if (crashed()) { trace(...); return; }` without releasing or deleting |
| no drift since the report | `git log a9a0384..HEAD -- app/engine-client/` → empty |

The M1 comment states the reason literally: the crash was caught with SEH, under `/EHsc` the destructors
of the cut frames do not run, so every lock held around the call stays held; JUCE's VST3 host takes a
spin lock around `processBlock` and the same lock in `releaseResources()` and `reset()`; releasing the
instance waited forever on the message thread, and from then on the engine answered nothing and never
exited.

## Declared consequence for the app (`reported` + code confirmed)

The app uses the default `closeTimeout` of 2000 ms (`EngineSession` does not override it). In Debug the
app therefore **terminates the engine mid-dump** (code 1) whenever ≥2 instances are leaked. This was
confirmed by code plus measured timings, **not** by running the desktop app.

## Proposals — all await owner authorization

| Id | Proposal | Assessment |
|---|---|---|
| **A** | `engine_client.cpp:333`: wait `options_.closeTimeout` instead of the hardcoded 2000 | One line. Makes `:333` consistent with `:167`; introduces no new policy. The test uses 10 s, so the engine exits in ~3 s and reports code 0. No test fixes the 2 s constant. **Does not fix the app** — see A2. |
| **A2** | Raise the app default `closeTimeout` (e.g. 10 s) | **Product decision.** Without it the Debug app keeps terminating the engine mid-dump. A and A2 are separate; A2 is not optional if a clean Debug app exit is wanted. |
| **B** | Disable `_CRTDBG_LEAK_CHECK_DF` under `_DEBUG` at serve startup and in the self-test plugins | Trades the only automatic leak-reporting channel for ~120 ms. Defensible scope is **self-test plugins only**, never the engine serve path. Third-party Debug plugins may still dump, so A remains the robust guard. Owner decision. |
| **C** | Auto-terminate after teardown | Not recommended: abrupt and unnecessary. |

## Red → green plan (after authorization)

- Red already measured: Debug 3/3 "259".
- After A: rebuild the integrated Debug tree; run the **whole** `engine_process_tests` suite in Debug ×3
  green with "code 0"; Release stays green; `state_recovery_tests` in both configurations; the probe
  confirms reason code 0 and `close()` without terminate (~6 s, not ~14 s).
- **Missing guard, must be added:** a engine that does not exit is still terminated at `closeTimeout`
  with code 1. The post-EOF path (`:333`) does not terminate today, so this regression does not exist
  yet. Write it before accepting the green.
- Nothing weakened: `:159` still demands own-exit code 0.
- The Release gate is unaffected — ENV-03 is Debug-only.

## Independently re-verified at `c40ed0f8` (fresh session, no chat history)

A read-only probe session (`ee7ff627-b8e4-59ac-a4f9-c32d3d5ee245`, 2026-11-20T18:06→18:14Z) loaded this
skill, **refused to reuse the line numbers pinned above**, and re-read every cited line at the then-HEAD
`c40ed0f801d475e9555f60c647e7829371baa163`. Its words: «the authority here is the direct read at HEAD».
The line numbers coincided, but the re-verification is the point. Facts it added or tightened:

| Fact | Reference at `c40ed0f8` |
|---|---|
| the failing case is `TEST("serve: after a plugin crashes in processBlock the engine still answers, retries, releases it and exits")` | `tests/engine_process_tests.cpp:96`; runner selects by substring (`tests/support/check.hpp:35`); failure prints `FALHOU <file>:159: … medido … esperado …` (`check.hpp:21-24,26-28,58-59`) |
| **the test sets `closeTimeout = 10000ms`** — yet still fails, because the reader path ignores it | `tests/engine_process_tests.cpp:34` vs `app/engine-client/src/engine_client.cpp:333-338` |
| **why TWO instances leak**: the original crashes, `plugin.retry` builds a new one which has crashed again by then, then the track is removed; both destructors hit the `crashed()` branch | `tests/engine_process_tests.cpp:126,144-145` |
| crash fixture writes through a null pointer 0.1 s into playing | `app/selftest-plugins/TestPlugins.cpp:213-220` |
| SEH guard `__try { fn(context); … } __except (1) { return false; }`, invoked at `:205`, `markCrashed()` at `:206` | `engine/src/plugins/juce_host.cpp:65-68, 205, 206, 129-137` |
| **the engine's own exit code is 0 by construction**: serve loop reads stdin to EOF, sets `running=false`, joins the ticker, `return 0` | `engine/src/app/main.cpp:162, 174-176` → `engine/src/plugins/juce_host.cpp:654-663` → `main.cpp:586` |
| **`g_protocol` is never explicitly closed**: `keepStdoutForProtocol()` does `_dup`/`_fdopen` into `g_protocol` and `_dup2(stderr, stdout)`; the last write end is closed by CRT exit cleanup, so EOF reaches the client before the slow part | `engine/src/app/main.cpp:112-122` (also `:121,125,126`) |
| the only `TerminateProcess` calls in `readLoop` are the protocol-error and over-limit branches — the post-EOF path does not terminate | `app/engine-client/src/engine_client.cpp:310, 329` |
| `close()` does terminate on timeout | `app/engine-client/src/engine_client.cpp:160-168` |
| **no explicit `_CrtSetDbgFlag` anywhere in the C++ sources** — the Debug leak dump is the CRT default under `_DEBUG`, not something product code enables | grep over the sources at `c40ed0f8` |
| the vendored patch's RAII comment says the lock releases **on a C++ exception unwind**, not on an SEH catch | `ci/patches/juce-failed-plugin-restart.patch` |
| the app uses the 2000 ms default with **no override anywhere in `app/`** | grep at `c40ed0f8` |
| `STILL_ACTIVE == 259` confirmed from the installed SDK header | local SDK grep |

**Consequence for proposal B:** since no product code sets `_CrtSetDbgFlag`, "disable the leak check"
means *adding* a call that clears the CRT default — a new behaviour in the serve path, not the removal of
an existing one. That strengthens the case for A over B.

**Still reported, not re-measured by the probe:** all timings, the stacks, the per-block cost, and the
app's mid-dump terminate. The probe ran nothing and wrote nothing.

## Limits of the original investigation (`reported`)

The probe imitates `EngineClient` over raw pipes rather than linking the library. The app's terminate
behaviour was confirmed by code and timings, not by running the desktop app. Deep-run timings were
slightly perturbed by thread suspension (clean runs were not). The leaked-block inventory was not
captured (it goes to `OutputDebugString`); proportionality was proven by the 0/1/2 controls. The single
historical Debug PASS is consistent with the measured variance and was not reproduced.

## Reproduction assets (`reported`, outside the repository)

- Builds used without rebuilding: Debug `D:\Core-build\s1-fix\build`, Release `D:\Core-build\gate-round1`.
- Probe: `D:\Core-build\env03\probe\env03_probe.cpp` (raw pipes, close/EOF/exit timestamps,
  `WaitForSingleObject` 30 s) and `stacks_only.cpp` (`OpenThread`/`Suspend`/`StackWalk64`/`SymFromAddr`
  against the build PDBs).
- Logs: `D:\Core-build\env03\logs\`, 47 files archived under
  `docs/relatorios/evidencia/2026-11-20-env03-debug-259/`.
- 11 probe runs (all exitCode 0, none forced) + 6 test-binary runs.
