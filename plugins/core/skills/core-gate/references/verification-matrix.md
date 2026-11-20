# Verification matrix — Core DAW

All facts below were read at `0d7d8ce` (owner-pinned tooling version) and `59275d2` (HEAD).
`ci/` and `CMakeLists.txt` are **identical** between the two; only `tests/` differs. Nothing here was
executed in the authoring session: these are commands and their documented behaviour, not run results.

## Registered tests and labels

`tests/CMakeLists.txt` — custom framework (`CHECK_EQ`, `CHECK_NEAR`), plain `add_test`, **no gtest, no
CMakePresets.json**. 22 registrations at the pin, 31 at HEAD.

| Label | Meaning | Notes |
|---|---|---|
| `merge` | fast, every build and before every merge (`ctest -L merge`) | includes `installer_samples` and `cli_package_stale` (`RUN_SERIAL`) |
| `desktop` | opens Core's window via `CoreApp --self-test` (~20 s) | only where the app is built; not a unit test |
| `rt_strict` | the strict zero-lock gate, `CORE_S7_STRICT=1` | **known measured RED**, deliberately out of `merge` (ENV-03 precedent) |

Conditional registration (a missing test may be a configuration gap, not a regression):
`core-package` → `cli_package_stale`; `WIN32 AND CORE_BUILD_APP AND TARGET CoreSetup` →
`installer_samples`; `core_engine_client` → `engine_process_tests`; `CoreTestCrash_VST3 +
CoreTestSynth_VST3 + engine_process_tests` → `cli_plugin_crash_render`; `CoreTestSynth_VST3 +
CoreTestGain_VST3 + core_plugin_host` → `m5_bitexact_tests`, `s7_rt_probe_tests`, `s7_rt_strict_tests`,
`s9_mute_block_tests`, `timing_proof_tests`; `core_engine_client + juce_events` → `state_recovery_tests`;
`CoreApp` → `desktop_self_test`. Fault/Throw/CrashRestart variants add compile definitions and
dependencies to `engine_process_tests` without adding a test.

Canaries (`tests/CMakeLists.txt:344-357`): `asan_canary` when `CORE_SANITIZE` matches `address`;
`ubsan_canary` when it matches `undefined` **AND NOT MSVC**; `tsan_canary` when it matches `thread`.
**Kept out of ctest on purpose — they are expected to fail.**

## Commands

```powershell
# whole merge gate, unique build dir (never the default shared one)
powershell -NoProfile -ExecutionPolicy Bypass -File ci\gate.ps1 -Build D:\Core-build\probe-<guid>

# read-only environment health check: artifacts + live ASan canary + marker freshness. NOT a suite run.
powershell -NoProfile -ExecutionPolicy Bypass -File ci\review-env\verify.ps1 -Src D:\Core-Projects\<actor>

# full Windows review environment: Debug build + compile DB + merge suite + stack probe
# + ASan build + canary + suite + clangd smoke + JUCE desktop self-test
powershell -NoProfile -ExecutionPolicy Bypass -File ci\review-env\run-all.ps1

# out-of-merge scope, recorded separately as the known red
ctest --test-dir <Build> -L rt_strict --output-on-failure
```

```bash
# WSL2: own ext4 clone + ASan+UBSan, TSan, plain Debug, clang-tidy (scope-gated)
wsl.exe -e bash ci/review-env/run-wsl.sh
```

`ci/gate.ps1` internals worth knowing: `:17` default build dir `D:\Core-build\gate-<src leaf>` (shared);
`:34` `-Desktop` clears the label filter; `:35`/`:79` `gate.log` and `gate-resumo.txt` live in the build
dir; `:41` the temporary `.bat` is GUID-unique; `:48-49` `VSLANG=1033` + `chcp 65001`; `:51`
`-G Ninja -DCMAKE_BUILD_TYPE=Release -DCORE_BUILD_TESTS=ON`; `:54` refuses a build folder whose Ninja
recorded no header dependencies; `:56` `ctest --test-dir "$Build" $label --output-on-failure
--timeout 600 --no-tests=error`; `:68-79` the summary records only src@commit+dirty, build, label, time
— **no binary sha256 and no JUCE dependency state**.

## Sanitizer wiring (`CMakeLists.txt`)

| Line | Fact |
|---|---|
| `:31` | `CORE_SANITIZE` cache string: `address`, `undefined`, `thread` (comma separated) |
| `:34` | requires `CMAKE_BUILD_TYPE=Debug`, else FATAL_ERROR |
| `:39` | unknown value → FATAL_ERROR |
| `:42-43` | `address` + `thread` cannot be combined; use separate build trees |
| `:46-47` | **MSVC supports `address` only** → FATAL_ERROR otherwise |
| `:50-52` | MSVC: `/fsanitize=address`; link `/fsanitize=address /DEBUG /INCREMENTAL:NO` |
| `:54-55` | non-MSVC: `-fsanitize=<list> -fno-omit-frame-pointer -g` |
| `:146-170` | `CORE_SANITIZED_TARGETS` — the complete list (ENV-01). Comment `:154-156`: two names had to be added because they link instrumented `core_domain`/`core_engine_lib` and would fail with undefined `__asan_*`; measured 2026-11-19 on `8c6837e` |

## Platform matrix

| Sanitizer | Windows/MSVC native | WSL/Linux | Source |
|---|---|---|---|
| ASan | yes (`/fsanitize=address`, VS2019 16.9+) | yes | https://learn.microsoft.com/en-us/cpp/sanitizers/asan |
| UBSan | **not implemented** (open request) | yes (clang 18) | https://developercommunity.visualstudio.com/t/Add-support-for-UBSAN-UndefinedBehavior/840750 |
| TSan | no (POSIX) | yes, ASLR off via `setarch $(uname -m) -R` (built into `run-wsl.sh`) | https://clang.llvm.org/docs/ThreadSanitizer.html |
| RTSan (`-fsanitize=realtime`, `[[clang::nonblocking]]`) | no (open MSVC request) | yes, **LLVM ≥20** — repo WSL has clang 18 | https://clang.llvm.org/docs/RealtimeSanitizer.html |
| Perfetto | MSVC build "best-effort", subset of targets | yes | https://perfetto.dev/docs/contributing/build-instructions |

RTSan is the tool that caught JUCE issue #1588 (the `MidiEventList` audio-thread lock). Adopting it
requires a clang ≥20 side-build; the repo's WSL has **no apt network and no gdb**. Owner decision.

## SHA-bound false-green guard (`ci/review-env`)

Every `.done` marker is bound to a fingerprint:

```text
fp1 sha=<HEAD> local=<hash of tracked build-affecting diff, docs excluded> juce=<dep HEAD/diff or patch+touched-file hashes> script=<this script hash> cfg=<per-step configuration>
```

A step is reused **only when the whole fingerprint matches**. Changing the revision, a tracked
source/CMake change, the vendored JUCE patch state, the script, or the step configuration invalidates
the affected steps. Legacy markers without `fp1` always re-run. `run-wsl.sh` additionally hard-verifies
that the clone is detached at exactly the Windows HEAD on every run (fail-closed). `verify.ps1` checks
the context fingerprint (sha+local+juce+script); per-step `cfg` is checked by `run-all.ps1`.

**Consequence:** the dependency-state recording that a pending proposal asks for **already exists** in
`ci/review-env`. What is missing is the same contract in `ci/gate.ps1`'s summary. Extend the gate's
evidence contract; do not build a new mechanism.

## Prerequisites

- Windows 11 x64; VS 18 BuildTools (MSVC 19.51), `vcvars64.bat` at
  `C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\VC\Auxiliary\Build\vcvars64.bat`;
  CMake ≥ 4.4; Ninja.
- JUCE 9.0.5 at `D:\Core-deps\JUCE-9.0.5` (extracted, **no `.git`**) with the D113 crash patch applied.
  Since S11 the CMake build applies the patch to a fetched copy idempotently and **verifies a supplied
  local copy**, failing early if unpatched; it never modifies a user-provided deps dir. Verify with
  `git apply --check -R ci/patches/juce-failed-plugin-restart.patch` inside the deps dir
  (rc=0 ⇔ fully applied, 14 hunks in 2 files).
- WSL2 Ubuntu 24.04: GCC 13, clang/clang-tidy 18, CMake, Ninja, python3. **No gdb, no apt network.**
- clangd 23.1.0; Node. The `dsh-cpp-lsp` desktop-profile wiring is outside the repository.
- Canonical out-of-tree location: `D:\Core-build\core-review` (Windows) and `~/core-review-build`
  (WSL). Logs land beside the builds; historical evidence is archived, never overwritten
  (`archive-<sha>/`).

## What each script proves — and does not

| Script | Proves | Does not prove |
|---|---|---|
| `ci/gate.ps1` | configure + build + `ctest -L merge --no-tests=error` in Release | UI behaviour; Debug behaviour; anything outside `merge` |
| `ci/gate.ps1 -Desktop` | everything registered, including `rt_strict` and the window self-test | a clean merge gate — it is a different, wider scope |
| `ci/review-env/verify.ps1` | artifacts present, live ASan canary, marker freshness | that any suite passed |
| `ci/review-env/run-all.ps1` | Debug + ASan builds, merge suite, stack symbols, clangd, desktop self-test | Release gate equivalence |
| `ci/review-env/run-wsl.sh` | ASan+UBSan, TSan, clang-tidy scope on Linux | **Windows runtime** |
| `ci/tidy_scope.py` | static-analysis coverage against `compile_commands.json` | correctness of the code |
| `desktop_self_test` | the app opens and runs its self-test (~20 s) | musical UX, focus, Undo, plugin behaviour |

Evidence reports: `docs/relatorios/2026-11-19-review-debug-sanitize-environment.md`,
`docs/relatorios/2026-11-19-pull-a9a0384-environment-refresh.md`.
