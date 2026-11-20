# Proof stages — the unit of work and of evidence

Derived from what actually ran in DSH session `7cdfbb6d-0524-4f52-bfca-3690f470adb7`
(2026-11-19T23:02Z → 2026-11-20T17:15Z, 2893 records): **27 subagents named
`<subject>-<stage>`**, and **one report per stage** whose filename matches the subagent name
(`s1-export-refusal`, `s2s3-state-recovery`, `s4-float-wav-rejection`,
`s5-installer-sample-protection`, `s6-engine-rt-proofs`, `s7-rt-measurement`, `s8-undo-cost`,
`s9-mute-block`, `s11-juce-reproducible-build`, `env03-debug-259`, `timing-latency-proof`,
`chain-series`, `csv-triage`/`csv-10-findings-confirmation`, `resume-check`,
`round1-coordination`). No local communicator per team appeared anywhere.

## Container and naming

- **One session per domain** (engine, host, data, UI). The owner's own instruction: «Cola o prompt
  comum no início de cada sessão e, a seguir, cola uma etapa. Usa sessões separadas para o motor,
  o host VST3 e a…». The session is the container; the stage brief is the minimum branch.
- **Role profiles are stable templates; the stage travels in the runtime name.** Spawn
  `subagent_type: core-engine` with `name: s1-red`, `name: s11-negctrl`, etc. Four templates,
  unlimited stage instances. Do not mint a new profile per task.
- **One report per stage**, named `YYYY-MM-DD-<subject>-<stage>.md`, indexed. The stage that produced
  the evidence writes its own report. There is no separate communicator role.

## Stage contract

| Stage | Does | Must produce | Must NOT do |
|---|---|---|---|
| `triage` | revalidate findings against the current SHA; classify confirmed in code / proven by test / reported only / not verified | classification table with `sha:file:line`; list of refuted findings | implement; treat an old report as a description of HEAD |
| `survey` | read-only mapping of a path or mechanism | map with refs, or reuse and revalidate the existing `docs/plan/*` map | write a competing map; change code |
| `baseline` | record the starting point of a section | **reading baseline**: function with refs, registered tests + labels at the SHA, known reds, covered/not-covered, limits. **Measured baseline** only with authorization: gate/suite counts, exit codes, wall time, build identity | conflate reading with measurement; imply a gate ran when it did not |
| `red` | measure the failure **before** any change | failing command, exit code, the exact assertion, configuration, repetition count | change product code; relax the assertion |
| `repro` | reduce to a minimal reproducer with conditions | reproducer + conditions + what distinguishes the hypotheses | fix while reproducing |
| `build` | produce an identified binary | build dir (ASCII, no spaces, unique), config, binary sha256, git SHA + dirty flag, JUCE path + patch state | reuse a shared build dir; claim a build is a test |
| `fix` | the smallest change the evidence supports | diff + red→green in the same scope + per-suite counts | weaken a test, tolerance or oracle; exceed the authorized scope |
| `proof` | make the regression permanent | registered test + oracle + tolerance + declared limitations + per-suite counts | leave the proof as a one-off script outside the suite |
| `negctrl` | prove the proof can fail | reintroduce the defect in a **copy** → must fail; remove a needed element → must fail; restore → must pass; product tree clean | run the negative control in the product tree |
| `release-proof` | the Release gate in a clean tree | rc, labels actually run, per-suite counts, wall time, `version==sha`, machine-level effects declared | report a scoped run as "gate green"; use `-Desktop` as a smoke test |
| `resume` | recover state in a **fresh session** with no chat history | same refs **and same limits**; what is decided, verified, and still unverified | answer from memory of the previous session |
| `<subject>` (investigation) | demonstrate a cause or name a discriminating experiment | timeline, stacks or measurements, proportionality controls, declared limits | propose a fix before the cause is proven |

## Ordering rules

- `red` before `fix`. Always. A fix without a measured red is not a bug fix.
- `negctrl` before accepting `proof`. A proof that cannot fail proves nothing.
- `release-proof` last, in a clean tree, and never inside a benchmark window.
- `resume` is the gate that closes a round: if a fresh session returns conclusions without limits,
  the round is **not** complete — the missing limits are an evidence defect, not a model defect.
- Stages of one contract may run in parallel only when their scopes and build dirs are disjoint.
  Builds, gates and profiling never run inside a measurement window.

## One model for everything — owner decision, identifier verified

The owner decided: **`qwen4-max-preview` for all profiles**. This matches what actually ran in the DSH
round — one model (`bailian-tpp/qwen4-max-preview`) with `reasoningEffort` varying `max` / `xhigh` /
`high` / `medium` across 7 `model/selection` records. The per-role model matrix in the design inventory
(Flash for structure, Efficient for communicators) was not what ran and is withdrawn.

Verified in the Qoder client configuration (non-secret fields only):

| Fact | Value |
|---|---|
| model / displayName | `qwen4-max-preview` |
| provider | custom, `openai-compatible`, protocol `openai-responses`, auth `bearer` |
| endpoint | Token Plan, `token-plan.maas.qwencloudapi.com/compatible-mode/v1` |
| context window | 1 000 000 |
| **max output tokens** | **8192 — only on this BYOK Token Plan route** |
| thinking | modes `["enabled"]`, `supportsEffort: true` |
| supported effort levels | `low`, `medium`, `high`, `xhigh`, `max` |

**One model, several catalog entries — measured 2026-11-20 (45 run logs, 61 turns):**

| Entry | modelKey | Catalog state | Max output | Measured today |
|---|---|---|---|---|
| **Token Plan (BYOK) — the policy entry** | `byok:qoder-custom-0f384ab2-…/qwen4-max-preview` | `enabled`, `ready` | **8192** | 31 turns, 26 passed, **5 input-gate rejections** |
| System `Qwen4-Max-Preview` | `qmodel_latest_preview` | **`enabled:false`, `unavailableReason:"account"`** | none declared | 9 turns, 7 passed, 1×403, 1 aborted |
| Auto / Sonus | `auto` / `smodel` | `enabled:false`, account | none declared | **8×403 of 14** / **2×403 of 4** |
| Efficient | `efficient` | enabled, free, 200k window, no effort | none declared | 2 turns, 2 passed |

Owner decision: **only `qwen4-max-preview`**, on the **Token Plan entry** — the only Qwen entry enabled
on this account. The earlier "use the system route, it has no gate" recommendation is **withdrawn**:
that entry is account-disabled and the alternatives measurably return 403. A 403 (wrong/unavailable
entry) and a `DataInspectionFailed` (input gate) are different failures and must not be conflated.

All five profiles set **`model: inherit`** so the **session** chooses the model; under a single-model
policy the owner sets the session once and every stage instance inherits it. Agents **cannot** write
the preference (`chat.sessions.setModelPreference` → `available:false`, `agent.executable:false`), so
the policy is enforced by selection plus measurement: `route-audit --policy qwen4-max-preview`
(baseline today: 31 on-policy / 30 off-policy turns). Pinning a model inside a profile hard-routes every
agent — defect in v0.2.0, corrected in v0.3.0. **The stress test runs on this same model**; the earlier
`efficient` free-model plan is superseded by the owner's decision.

The CLI accepts `-m/--model` and `--reasoning-effort <level>`. Effort levels differ by entry: the BYOK
entry supports `minimal/low/medium/high/xhigh/max` (default `medium`); system `qmodel_latest_preview`
supports `xhigh/high/low/none`; `efficient` supports **none**.

**Three practical consequences:**

1. **Effort is the lever, not model switching** — the policy forbids switching. Raise it for causal
   diagnosis, architecture and negative-control design (`high`/`xhigh`/`max`); lower it for
   transcription against a fixed contract (`low`/`medium`). Per-agent effort is **not a documented
   frontmatter field** — set it on the session (`--reasoning-effort`) or in the client. Do not invent a
   frontmatter key.
2. **8192 max output is now the network's ceiling.** One stage per agent, report written to file by the
   scribe, bounded returns, never a paste of a tool result. It is **not measurable from the logs**
   (`output_tokens` is recorded as 0), so `--ceiling` reporting `maxOut=0` means *no measurement*, not
   headroom.
3. **The input gate stays armed.** On `DataInspectionFailed`: never re-send the identical input (four
   client retries already reproduced the verdict); hand the intent to a fresh session through the
   repository and run the `resume` stage. Ladder and exonerated hypotheses:
   `core-routing/references/model-routes.md`.

## Context pressure is already observable

That session logged **25 `compaction/prune`** events, clustered at the end of an 18-hour run, and
**154 `job/registered` + 154 `job/settled`**. Context loss and machine time do not need new
instrumentation to be observed; they need to be read. Splitting sessions per domain is the mitigation
the owner already chose.
