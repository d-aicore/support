# Model policy: only qwen4-max-preview

Owner decision, 2026-11-20: **«vamos usar apenas o qwen 4 max preview»**. One model for the whole
network — coordinator, section teams, scribes, guardian, tracker. This supersedes the earlier
free-model (`efficient`) stress-test plan: the stress test runs on the same single model.

Measured the same day from `chat.sessions/getModels` and 45 run logs (61 turns).

## Which catalog entry — and a correction of my own earlier advice

| Entry | modelKey | Catalog state | Measured today |
|---|---|---|---|
| **qwen4-max-preview** (Token Plan, BYOK) | `byok:qoder-custom-0f384ab2-abeb-4374-a03e-d7244ee6dbd6/qwen4-max-preview` | `enabled: true`, `status: ready`, maxOutput **8192**, 1M context, vision+reasoning | **31 turns, 26 passed, 5 input-gate rejections** |
| Qwen4-Max-Preview (system) | `qmodel_latest_preview` | `enabled: false`, `unavailableReason: "account"` | 9 turns, 7 passed, **1×403**, 1 aborted |
| Auto | `auto` | `enabled: false`, `unavailableReason: "account"` | 14 turns, **8×403** |
| Sonus | `smodel` | `enabled: false`, `unavailableReason: "account"` | 4 turns, **2×403** |
| Efficient | `efficient` | `enabled: true`, free, 200k window, no effort control | 2 turns, 2 passed |

**Correction:** an hour earlier I recommended "select the system entry `Qwen4-Max-Preview`, it has no
gate". That advice is **withdrawn as the primary route**: the system Qwen entry is account-disabled in
the catalog and the alternatives measurably return `403 inference.remoteChat.stream failed`. The only
Qwen entry that is enabled and answering is the **Token Plan BYOK** one. The policy is therefore that
entry, with its two known constraints below — not a gate-free route that does not exist on this account.

The two entries still differ only by name capitalization. Selecting the wrong one produces 403, not a
moderation error; the two failure signatures must not be confused.

## Constraints that remain on the chosen route

1. **Provider input inspection cannot be disabled from the client.** Signature:
   `Responses <400> InternalError.Algo.DataInspectionFailed: Input text data may contain inappropriate content`,
   with `input_tokens=0` — refused before the model ran, nothing billed, nothing answered. The client
   re-sent the identical input four times against the same verdict.
   Measured: 5 rejections between **18:45:47 and 19:37:57**; **none afterwards**, including this
   session's post-compaction payload (`history_length=281`, turn started 20:13:10) which is running on
   that entry now. The gate is still armed; the current payload passes.
2. **The declared max output is a client setting — correction of my earlier claim.** The BYOK
   «Edit model» dialog exposes **Maximum output tokens** as an editable dropdown; the owner's
   screenshot (2026-11-20) shows **128K** selected while the catalog still reported **8192** a minute
   earlier, i.e. the change was not saved/applied yet. So "the 8192 ceiling cannot be changed from the
   client" was **wrong about the declared cap**. What stays unverified is whether the *provider*
   honors a larger cap. Until a long output is actually measured, keep the chunking contract: one
   stage per agent, scribe writes the report to file, bounded returns, never a paste of a tool result.
   **Not measurable from the logs**: `output_tokens` is recorded as 0 on these turns, so
   `route-audit --ceiling` reporting `maxOut=0 / nearCeiling=0` is *absence of measurement*, not
   evidence of headroom.
   The same dialog states provider, API type and model id **cannot be changed after adding** —
   switching away from `Responses API` requires adding a new model entry, not editing this one.
   Caution when saving that dialog: the API key field renders empty; do not treat an empty field as
   "no key stored", and never paste a key into a chat, report or repository.

## Why this entry — the cost reason, measured

The owner's reason for «apenas qwen» is the **20% spend bonus**. Catalog prices: `qmodel_latest_preview`
has `priceFactor 0.1` against `originalPriceFactor 0.5` → **pays 20% of the original**. That is the
entry the bonus belongs to, and it is **not reachable right now**:

- `account.usage` measured **0 credits remaining**: userQuota 2000/2000 used, addOn 2400/2400 used,
  dedicated packages 10000 and 8000 both `QUOTA_DETAIL_STATUS_EXHAUSTED`, `available:false`.
- Every paid system model is `enabled:false`, `unavailableReason:"account"`.
- An explicit selection attempt returned `CHAT_SESSION_MODEL_SELECTION_REJECTED`, `reason:"disabled"`
  — a refusal, not an inference.

The Token Plan BYOK entry has `priceFactor: null`: it spends the owner's **own provider quota**, not
Qoder credits, which is exactly why it still answers with zero credits. `efficient` is free but is a
different model, so it is off-policy under «apenas qwen».

**Flip condition:** when credits are restored, re-run `getModels` and a one-word selection probe. If
the 0.1 entry becomes selectable, the policy target becomes `qmodel_latest_preview` (no input gate, no
declared output cap) and the drift check is re-run with `--policy qmodel_latest_preview`. One parameter,
re-measured — not a rewrite.

## Enforcement that is actually installed

`core/hooks/hooks.json` registers a **UserPromptSubmit** hook (`core-model-policy`). It reads the
session's model from `hook_input`, matches `/qwen4[-\s]?max[-\s]?preview/i` (covers both catalog
spellings), appends one JSONL line to `D:/CORE-ORG/obs/model-policy.jsonl`, and prints a single warning
line **only when off-policy**. It is **fail-open and non-blocking**: bad JSON, missing model or any
error exits 0 silently; it never blocks a prompt, never writes configuration, never reads
`settings.json`. Kill switch: `D:/CORE-ORG/obs/policy.off`.

Tested standalone, 5/5 exit 0: on-policy silent; off-policy warns; both name spellings accepted; bad
JSON and missing model fail-open. Whether the app injects the hook's stdout as context is **unverified
until observed firing** — the JSONL record is the reliable half, and it is what the tracker reads.

## What the network must do

- **Profiles keep `model: inherit`.** The route is a session-level decision; pinning a key inside a
  ficha hard-routes every agent (defect in v0.2.0, fixed v0.3.0). Under a single-model policy the
  session is set once by the owner and every stage instance inherits it.
- **Agents cannot set the model preference.** `chat.sessions.setModelPreference` reports
  `available: false`, `agent.executable: false`. Enforcement is therefore **selection by the owner +
  measurement by the tracker**, never a config write by an agent.
- **Drift is measured, not assumed:**

```bash
node scripts/route-audit.mjs --since 2026-11-20 --policy qwen4-max-preview
node scripts/route-doctor.mjs --since 2026-11-20 --policy qwen4-max-preview
```

  Measured today: **31 on-policy / 30 off-policy turns (49.2% of 61)**. Off-policy breakdown: `auto`
  14 turns across 14 other sessions, `qmodel_latest_preview` 9, `smodel` 4, `efficient` 2,
  `qmodel_38max` 1 — all in this session except the `auto` group. Most predate the decision; the
  number is the baseline against which the policy is judged from now on, not a verdict on the model.
- **The other two Token Plan entries stay enabled in the picker** (`moonshotai/Kimi-K3`,
  `zai-org/GLM-5.3-Flash`, both maxOutput 8192). Under «apenas qwen» they are drift risks. Hiding them
  is a UI action for the owner; an agent must not do it.

## Recovery ladder when a turn is rejected on this route

1. **Never re-send the identical input.** Four client retries already reproduced the verdict.
2. **Change the input, not the model** (the policy forbids switching model): hand the intent to a
   fresh session through the repository — `core-evidence` handoff + proof stage `resume`. A clean
   session on this same entry passed every probe, including the three previously rejected prompt
   texts verbatim.
3. **Shrink the injected surface** if the doctor flags a block class as a lead: disconnect the MCP
   server or plugin that produced it. A lead at n=1 is not a cause; widen `--window`/`--since` first.
4. **Respect the 8192 ceiling**: one stage per agent, scribe writes the report, returns stay bounded.
5. If the owner later restores account access to the system entries, re-measure before recommending
   them again — `enabled` flags and 403 counts are the evidence, not the display name.

## What was exonerated by experiment (do not re-litigate)

Each was sent alone to a clean session on the rejected route and **passed**: the three rejected prompt
texts verbatim; a credential-shaped scan of the session (`credential` class = 0); the real CJK skill
catalog block; the real 1.7 KB MCP GitHub tool-catalog block. Payload size does not separate either
(rejections at history 553–767, passes up to 750). The earlier hypothesis that file names listed from
`Downloads` determined the rejection is **refuted as a sufficient cause**: those 56 records were
present in 21 later BYOK turns that passed.
