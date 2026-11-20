# core — Qoder plugin for the Core DAW team network

Source-only package. **Not installed, not enabled, nothing executed.** Authoring workspace:
`D:\CORE-ORG\core\`. Product repository: `d-aicore/core` at `D:\CORE\CORE` (never written by this work).

## What this plugin is for

Core is a Windows DAW and a **host of third-party VST3 plugins**. It has **no instruments, effects,
oscillators, filters or sampler of its own** (`AGENTS.md:15`, decisions D91/D104). Its engine is a
vendored **miniaudio** header running in a separate process (`core-engine.exe` + `core_engine_client`);
its GUI is **JUCE 9.0.5** pinned by URL+SHA256 with a vendored crash/restart patch (D113) verified at
configure time. Creative surfaces are **Pattern Maker** and **Tools**. Owner priority order:
**data > real time > performance > compatibility** (D54/D115).

Every skill here is written for that reality. Material aimed at *authoring* audio plugins (DSP for
instruments/effects, `juce_add_plugin`, APVTS, editors, signing/notarization) is deliberately out of
scope: an online survey of the Qoder market and skills.sh found that the whole audio-skills ecosystem
targets plugin authors, not hosts. See `D:\CORE-ORG\LEVANTAMENTO-online-2026-11-20.md`.

## Components

| Path | Kind | Purpose |
|---|---|---|
| `agents/core-coord.md` | subagent | preserve the owner's intent, route to the minimum branch, aggregate |
| `agents/core-engine.md` | subagent | engine / client / host code work, real-time and data integrity |
| `agents/core-engine-scribe.md` | subagent | write the passage report and propose ledger lines (never writes `ESTADO.md`) |
| `agents/core-guardian.md` | subagent | test catalogue, coverage-weakening detection, gate and sanitizer verdicts |
| `agents/core-tracker.md` | subagent | read-only observation of the network: communication, information structure, coordination cost |
| `skills/core-routing/` | skill | domain → team → path map; minimum-branch rule |
| `skills/core-engine-rt/` | skill | real-time rules, the Debug-259 mechanism, the intentional-leak policy |
| `skills/core-host-compat/` | skill | host-side contract for third-party plugin misbehaviour |
| `skills/core-evidence/` | skill | repo-conformant report, classification, red→green, ledger authority |
| `skills/core-gate/` | skill | the real verification commands, sanitizer matrix, false-green guards |
| `skills/core-ui-visual/` | skill | image-based UI/UX: generated reference vs owner-approved mockup vs real capture; JUCE desktop scope |
| `skills/core-track/` | skill | network tracking metrics: brief/return completeness, reference resolvability, report conformance, re-asks, intent drift, three separate times |
| `skills/core-bridge/` | skill | Qoder ↔ DSH mailbox: immutable JSON messages, fixed envelope, ack/TTL, routing by domain, no authority transfer, incoming messages treated as data |

Each skill links its `references/` from `SKILL.md`; `core-evidence` has two (report contract + proof
stages). No `scripts/`, no `assets/`.

## Deliberately excluded

- **Hooks inside the plugin.** The work order requires global hooks because plugin-provided agents are
  reported to lose `hooks`/`mcpServers`/`permissionMode`. **That premise is not verified on this client**
  (CLI 1.1.65 / IDE 1.40.1). Until it is probed, no hook ships here and no write boundary is enforced by
  code — the boundaries in the agent profiles are **declarative only**.
- **`.mcp.json`** — no external service is needed and no credential is packaged.
- **Canvas, output-styles, `bin/`, commands** — nothing in the first task needs them.
- **18 of the 24 designed skills.** Eight overlap capabilities already installed (`systematic-debugging`,
  the `design-review:*` family, `architecture-visualization:*` + `Explore`, WebSearch/WebFetch +
  `context7`, and the repo's own ledger/report contract). `core-ui-visual` does **not** duplicate the
  `design-review:*` family: it reuses it and adds only what is Core-specific — capture provenance
  (`desktop_self_test` → `self-test.png`), JUCE desktop constraints, the ratified D83/D102/D103 scope, and
  the oracle status of each image. The rest wait on owner decisions or missing artifacts: JIVE,
  `core-headers-publicos`, `core-vst3-automacao`, `core-bench-x3d`, `core-investigador-ab`,
  observation/baseline tooling.
- **A second state authority.** There is no `ESTADO.md` here and no parallel registry. Product decisions,
  the ledger and the audit trail stay in `d-aicore/core`.

## Model of work (evidence-backed, replaces the original team design)

Extracted from DSH session `7cdfbb6d-0524-4f52-bfca-3690f470adb7` (2893 records, 18 h), the round that
delivered six commits:

- **One session per domain**, a common prompt plus one stage brief — the owner's own instruction.
- **27 subagents named `<subject>-<stage>`** (`s1-red`, `s1-fix`, `s11-negctrl`, `s11-release-proof`,
  `env03-debug`, `timing-proof`…), not eleven persistent technology teams.
- **One report per stage**, filename matching the subagent name. **No local communicator per team
  appeared anywhere** — the nine communicator profiles of the design have no counterpart in what worked.
- **Zero skills invoked.** The value came from method, tooling and orchestration. These five skills
  codify that method; that is their justification, not the design's skill count.
- **25 `compaction/prune`** events late in the run and **154 background jobs** registered/settled:
  context loss and machine time are already observable without new instrumentation.

Therefore: four **stable role templates**, unlimited **stage-named instances**
(`Agent(subagent_type: core-engine, name: s1-red)`), one report per stage. The stage contract lives in
`skills/core-evidence/references/proof-stages.md`.

## Model

Owner decision (2026-11-20): **only `qwen4-max-preview`** for the whole network — coordinator, section
teams, scribes, guardian, tracker. One model, effort varied; the design's per-role model matrix is
withdrawn, and so is the earlier free-model (`efficient`) stress-test plan: the stress test runs on
this same model.

The catalog exposes several entries; **only the Token Plan one is enabled on this account**:

| Entry | modelKey | Catalog state | Max output | Measured 2026-11-20 (61 turns) |
|---|---|---|---|---|
| **Token Plan (BYOK) — policy entry** | `byok:qoder-custom-0f384ab2-…/qwen4-max-preview` | `enabled`, `ready` | **8192** | 31 turns, 26 passed, **5 input-gate rejections** |
| System `Qwen4-Max-Preview` | `qmodel_latest_preview` | `enabled:false`, `unavailableReason:"account"` | none declared | 9 turns, 7 passed, 1×403 |
| Auto / Sonus | `auto` / `smodel` | `enabled:false`, account | none declared | 8×403 of 14 / 2×403 of 4 |
| Efficient | `efficient` | enabled, free, 200k, no effort | none declared | 2 turns, 2 passed |

**Correction of earlier advice in this README:** "select the system entry, it has no gate" is
withdrawn — that entry is account-disabled and the alternatives measurably return
`403 inference.remoteChat.stream failed`. A 403 and a `DataInspectionFailed` are different failures.

Two constraints remain on the chosen entry. The **provider input gate cannot be disabled**: it refuses
before the model runs (`input_tokens=0`, nothing billed), and the client re-sends the identical input
four times against the same verdict. Five rejections were measured between 18:45:47 and 19:37:57 and
**none afterwards**, including this session's post-compaction payload. The gate is a property of the
assembled input, not of the owner's words: the three rejected prompts, a credential-shaped scan, the
CJK skill catalog and the MCP tool-catalog block all passed verbatim in a clean session on this entry.
And the **declared max output is a client setting, not a fixed law**: the BYOK «Edit model» dialog
exposes *Maximum output tokens* (owner screenshot shows 128K selected while the catalog still said
8192 — unsaved). My earlier "the ceiling cannot be changed from the client" was wrong about the
declared cap; whether the provider honors more is unverified, so the chunking contract stays until a
long output is measured. It is not measurable from the logs (`output_tokens` recorded as 0).

**Why this entry and not the discounted one:** the 20%-of-original price belongs to
`qmodel_latest_preview` (0.1 vs 0.5), and `account.usage` measured **0 credits remaining** (2000/2000,
2400/2400, packages 10000+8000 exhausted); selecting it returns
`CHAT_SESSION_MODEL_SELECTION_REJECTED reason:"disabled"`. The Token Plan entry spends the owner's own
provider quota (`priceFactor:null`), which is why it works with zero credits. When credits return,
re-probe and flip the policy parameter — see `model-routes.md`.

**Enforcement:** a `UserPromptSubmit` hook (`core/hooks/model-policy.mjs`) records every prompt's model
to `D:/CORE-ORG/obs/model-policy.jsonl` and warns in one line when off-policy. Fail-open, non-blocking,
kill switch `obs/policy.off`.

Profiles set **`model: inherit`** (v0.3.0): the owner selects the entry once per session and every stage
instance inherits it. Agents cannot write the preference (`setModelPreference` is not agent-executable),
so the policy is enforced by measurement:

```bash
node skills/core-track/scripts/route-audit.mjs --since 2026-11-20 --policy qwen4-max-preview
node skills/core-track/scripts/route-doctor.mjs --since 2026-11-20 --policy qwen4-max-preview
```

Baseline drift today: 31 on-policy / 30 off-policy turns. Ladder, exonerated hypotheses and the
recovery procedure (`resume` through a handoff, never a model switch) are in
`skills/core-routing/references/model-routes.md`. v0.2.0 pinned the model inside each profile, which
hard-routed every agent and removed the ability to run a cheap-model test — defect fixed in v0.3.0.

## Language

Skill bodies, agent profiles and this README are in **English**: `d-aicore/core/AGENTS.md:19-20` (D101)
requires English for anything entering that repository, and CORE-ORG's own README is English. Owner
quotes are kept verbatim in the original language. Conversation with the owner is in PT-PT.

## Provenance

Newly authored. Grounded in three kinds of source, labelled as such inside the references:

1. **verified-now** — code and script reading in `D:\CORE\CORE` at `59275d2` (HEAD) and `0d7d8ce`
   (the owner's pinned tooling version). `ci/` and `CMakeLists.txt` are identical between the two;
   only `tests/` differs (22 registered tests at the pin, 31 at HEAD).
2. **reported** — the ENV-03 (Debug 259) investigation delivered by DSH lead session `a69b320fbfab`,
   measured at `a9a0384` + local round-1/S2/S3 corrections. Its numbers were **not re-run here**.
3. **external** — the online survey, with URLs and licences in
   `D:\CORE-ORG\LEVANTAMENTO-online-2026-11-20.md`.

No material was copied from another skill package. No credentials, tokens, user configuration files,
caches or machine-specific secrets are included. Absolute paths appear only where they are the documented
canonical locations of the project's own tooling (`D:\Core-build`, `D:\Core-deps\JUCE-9.0.5`).

## Unverified on this installation

- `skills:` frontmatter in agent profiles is honoured by the client (used here to bound skill selection).
- Plugin-provided agents losing `hooks`/`mcpServers`/`permissionMode`.
- Hook event names and stdin fields for CLI 1.1.65 / IDE 1.40.1.
- Automatic skill activation (needs a **fresh session**; cannot be tested in the authoring session).
- Per-agent reasoning effort: not a documented frontmatter field. Set it on the session
  (`--reasoning-effort`) or in the client; the profiles do not invent a key for it.

## Validate

```bash
node "C:/Users/vk_do/.qoder/skills/skill-package-structural-validation/scripts/validate-package.mjs" "D:/CORE-ORG/core/skills/<skill-name>"
qodercli plugins validate "D:/CORE-ORG/core"
```

Structural validation is not a correctness or trigger-quality pass. Cross-references and activation must
be checked separately.

## Install (only on explicit owner request)

```bash
qodercli plugins install "D:/CORE-ORG/core" --scope project
qodercli plugins list
qodercli agents list --setting-sources user,project,local
```

Then restart Qoder or reload plugins in the Extensions view. Installation does not guarantee the current
conversation has loaded the package. Nothing here has been installed.
