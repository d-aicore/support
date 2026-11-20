# Tracking metrics — definitions, denominators, coverage

Every metric is a ratio or a duration with an explicit denominator. Publish coverage alongside the
value. `N` is the number of admissible units in the window; units missing an endpoint are excluded and
counted, never interpolated.

## A. Communication quality (unit: one delegation pair brief→return)

| Metric | Definition | Denominator | Defect signal |
|---|---|---|---|
| `brief_completeness` | count of 5 fields present in the brief: intent verbatim · revision · acceptance criterion · scope · explicit prohibitions | delegations | < 5 → the delegate had to guess |
| `return_completeness` | count of 4 fields present in the return: refs · claim classification · limits · next stage + owner | returns | < 4 → passage not recoverable |
| `intent_preserved` | the owner's literal intent string still appears in the final answer | delegations | absent → intent drift |
| `reask_rate` | questions that recur with the same addressee and same subject / total questions | questions | > 0 → a condition was lost |
| `owner_corrections` | owner messages that correct a prior result (filter `source.kind === "user"`) | owner messages | rising → structure or competence defect |
| `useful_returns` | returns that prevented a wrong test, an out-of-boundary change, or an unsupported conclusion | returns | **positive**, not a defect |
| `branch_minimality` | delegations that consulted only the routed branch / delegations | delegations | < 1 → wasted context and credits |

## B. Information structure (unit: one report or one claim)

| Metric | Definition | Denominator |
|---|---|---|
| `report_conformance` | reports containing all five `MODELO.md` sections | reports |
| `claim_labelling` | claims carrying one of the four labels (confirmed in code / proven by test / reported only / not verified) | claims |
| `ref_resolvability` | cited `sha:file:line` refs that resolve at the named SHA (`git cat-file -e <sha>:<path>` and line-count check) | refs cited |
| `unverified_actionable` | `not verified` items that name the command or experiment that would resolve them | not-verified items |
| `handover_fields` | reports closing with all six handover fields | reports |
| `ledger_authority` | reports that **propose** ledger lines rather than editing `ESTADO.md` | reports touching the ledger |
| `reported_as_measured` | claims presenting a reported number as a current measurement | claims | **must be 0** |

`ref_resolvability` is the strongest single indicator: it is objective, cheap, and it catches stale
dossiers. Re-measure at the working SHA; a ref that resolved yesterday may not resolve today.

## C. Performance and cost (unit: one stage or one session)

| Metric | Definition | Coverage rule |
|---|---|---|
| `time_to_first_evidence` | ts(first evidence-producing tool result) − ts(task start) | needs both endpoints |
| `turns_per_stage` | `turn/start` count attributable to the stage | always |
| `tool_calls_per_stage` | tool calls attributable to the stage | always |
| `failed_tool_rate` | failed tool calls / total tool calls | always |
| `wait_for_response` | ts(return) − ts(brief) | only with both endpoints |
| `execution_time` | ts(post-tool) − ts(pre-tool) for the same tool id | only with a complete pair |
| `collection_delay` | ingest ts − event ts | always; **never added to the two above** |
| `context_loss_events` | compaction/prune events in the window | always; DSH measured 25 in an 18 h session |
| `background_jobs` | jobs registered / settled | always; DSH measured 154/154 |
| `model_key_mix` | distinct model keys used per session | a comparison is inadmissible if this varies |

## D. Extraction method

1. Locate the transcript. Qoder: `~/.qoder/projects/<workspace-slug>/<sessionId>.jsonl`. DSH:
   `~/.dsh/sessions/<workspace-slug>/<sessionId>/session.v4.jsonl.zstd`.
2. For DSH, decode **all** zstd frames (scan magic `28 B5 2F FD`); one call decodes only the header.
3. Hash the source before and after extraction; if the hashes differ, report an unstable snapshot and
   do not claim the files changed externally.
4. Parse record by record. Skip and count `thinking`/`reasoning`. Bound every excerpt; mark truncation.
5. Write derived copies **outside** any repository, redacted (`github_pat_…`, `ghp_…`, `sk-…`,
   `Bearer …`, api-key shapes → `[REDACTED]`). Report counts, never values.
6. Attribute events to a stage by the runtime agent name (`<subject>-<stage>`) and by task id when
   present. Unattributable events are counted as unattributed, not dropped silently.

## E. Observation report shape

```text
window: sessions, workspace, start/end, model keys, N per metric family
A communication: value + denominator + coverage + classification
B structure:     value + denominator + coverage + classification
C performance:   value + coverage (both-endpoint %) + the three times kept separate
findings: one row each — evidence (session, record line, bounded excerpt) → class → falsifiable proposal
limits: what was not observable, what was excluded, sample size, no causal claims
kill switch state, redaction counts, source hashes before/after
```

## F. What is not observable (declare, do not infer)

- Real human effort and whether the owner actually read an injection.
- Whether a condition was lost **before** any event existed.
- Quality of a response beyond what the owner accepts or a pertinent test proves.
- Anything in an excluded reasoning block.
