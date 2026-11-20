---
name: core-gate
description: Runs and judges the real verification of the Core DAW. Use for ci/gate.ps1, ctest labels merge/desktop/rt_strict, the review-env scripts, sanitizers (MSVC ASan, WSL ASan+UBSan/TSan, clang-tidy scope), canaries, SHA-bound false-green markers, build identity and JUCE patch state. Prevents reporting a scoped run as a green gate.
---

# Core verification gates

## Overview

The repository already has the tooling. Do not write new verification scripts before running the
existing ones. A green gate is a claim about a specific configuration, revision and label set — never
about "the tests".

## Procedure

1. Read [references/verification-matrix.md](references/verification-matrix.md) for the exact commands,
   the sanitizer/platform matrix and the false-green guards.
2. Work in an actor clone (`D:\Core-Projects\<actor>`), never in the shared checkout `D:\CORE\CORE`.
3. Always pass a **unique build directory**: `ci\gate.ps1 -Build D:\Core-build\probe-<guid>`. The `.bat`
   is GUID-unique, but the build dir, `gate.log` and `gate-resumo.txt` are shared by default.
4. Run the real gate once, whole. Record: exit code; labels actually run; registered suites with
   per-suite case/check counts; wall time; build dir; binary sha256; git SHA + dirty flag; JUCE path and
   patch state.
5. Run out-of-merge scopes **separately** and record them as what they are. `rt_strict` is a known
   measured RED under an owner-decision gate; report it unchanged.
6. Declare the machine-level effects. `installer_samples` drives a real silent install/reinstall/
   uninstall of `Core Setup.exe`; `cli_package_stale` repacks the build's package folder and zip. Both
   carry the `merge` label and `RUN_SERIAL`. **"`git status` clean" is not "machine untouched".** The
   script's own comment "Nao instala nada" is wrong at machine level.
7. Judge the result with `core-guardian`'s rules: compare against the expected-registration manifest for
   this configuration, never against the previous run's numbers.

## Rules that are not negotiable

- **Never use `-Desktop` as a smoke test.** `ci/gate.ps1:34` sets `$label = if ($Desktop) { "" } else
  { "-L merge" }` — it clears the label filter and runs everything, including the known-red `rt_strict`.
- **A partial or scoped run is never "gate VERDE".** Say which labels ran.
- **The "~3–4 min" figure is a comment** (`ci/gate.ps1:3`), not a measurement. Measure it.
- Build directories must be **ASCII with no spaces** (D97, `juceaide` limitation). The gate refuses a
  build folder configured before the header-dependency fix: `ninja -t deps` must record dependencies.
- Sanitizers require `CMAKE_BUILD_TYPE=Debug`; `address` and `thread` cannot be combined; **MSVC
  supports `address` only**. UBSan and TSan are WSL/Linux; RTSan needs clang ≥20 (the repo's WSL has
  clang 18, no apt network).
- **Canaries must trip.** They are kept out of ctest on purpose because they are expected to fail. A
  sanitizer whose canary does not trip makes the suite's green meaningless.
- **Reuse is fingerprint-bound.** A `.done` marker is reused only when `sha`, `local`, `juce`, `script`
  and `cfg` all match. Legacy markers without `fp1` always re-run. The WSL script fail-closed verifies
  the clone is detached at exactly the Windows HEAD.
- Linux does not prove Windows runtime. A domain test does not prove UI. `desktop_self_test` opens the
  window (~20 s) and is not a unit test.
- Do not run builds or profiling inside an isolated benchmark window.

## Resources

- [references/verification-matrix.md](references/verification-matrix.md) — commands, sanitizer matrix,
  fingerprint contract, prerequisites, and what each script does and does not prove.
