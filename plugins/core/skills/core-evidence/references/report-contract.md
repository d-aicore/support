# Report contract — d-aicore/core

Source: `AGENTS.md` ("Entrega obrigatória"), `docs/AUDITORIA.md` (9 steps), `docs/relatorios/MODELO.md`,
`docs/README.md`. Read at `59275d2`. These are the repository's rules, not new ones.

## Report shape (`docs/relatorios/MODELO.md`, five sections)

```markdown
# Relatório — AAAA-MM-DD — assunto

## O que foi medido
- Repositório, branch e SHA inicial/final:
- Âmbito e autorização:
- Ambiente:
- Testes executados (ou "nenhum"):
- Limitações:

## Resultados
| ID | Problema / resultado | Evidência (SHA, ficheiro:linha ou execução) | Classificação | Estado |
| --- | --- | --- | --- | --- |
| … | … | … | código / teste / reportado / não verificado | aberto / corrigido / validado / decisão |

## Alterações
Ficheiros e motivo; distinguir implementação, documentação e proposta.

## Verificação
Comandos e códigos de saída, contagens por âmbito, vermelho/verde quando aplicável.
Não copiar números históricos como actuais.

## Pendências e passagem
Próxima tarefa, dependências, decisões necessárias, risco residual e recomendação.
```

The template's headings are Portuguese because the template itself is historical. **New report content
is written in English** (D101); keep the template's section structure and do not translate the existing
ledger or history.

## Audit procedure (`docs/AUDITORIA.md`)

1. Read `AGENTS.md`, `ESTADO.md`, product and boundary documents. Fix branch/SHA, platform, scope.
2. Revalidate every pendência against current code. An old report is not a description of HEAD.
3. Classify findings: confirmed in code / proven by test / reported only / not verified. Cite
   `file:line` and SHA.
4. Separate bug from product/architecture decision. Do not implement inside an audit-only task.
5. When implementation is authorized: test the regression in the previous and the new state; record
   commands, exit codes, suites/cases/checks, environment and limitations. Compare counts in the same
   scope.
6. Validate what the change requires: a domain test does not prove UI; Linux does not prove Windows.
   Do not invent tiers or announce CI that does not exist.
7. Deliver `docs/relatorios/AAAA-MM-DD-assunto.md` using `MODELO.md`; descriptive suffix on collision.
8. Add the index entry and propose the `ESTADO.md` update: what closed, what continues, who or which
   decision unblocks it.
9. The previous report stays; a factual correction is a dated addendum. Avoid full copies and
   "summary of the summary".

## Six-field handover (close every passage with this)

1. Original intent — literal, not rewritten.
2. What was done and what was not.
3. Evidence — `commit:path#Lx-Ly` refs + run id + conditions (build, sample rate, buffer, device,
   model, tier).
4. Limits — what was NOT verified and why.
5. Pending decision — id, to whom, what it blocks.
6. Next task — backlog id + owner + prerequisites already satisfied.

## Red → green requirements

- A bug fix needs a significant regression that is **red in the previous state when executable**, then
  green. If not executable, declare the limitation.
- Report counts **per suite/scope**. A count drop when a feature is removed is authorized (cite the
  decision), not a regression.
- Do not relax criteria or weaken remaining tests to obtain green. Flaky is a defect to investigate.
- Each implementation milestone keeps Core compilable, opening, playing, saving/reopening and
  exporting. Do not declare those gates without executing them.
- Use the tests and gates registered in the checkout. No new agent tokens, no CI activation in this
  documentary organization.

## Privacy, retention, volume

- Raw logs, temporary files and builds stay **outside** the repository unless the evidence is small,
  necessary and secret-free (`docs/README.md`).
- Never read, copy, quote or commit `~/.qoder/settings.json`: its `providers` section holds plaintext
  API keys. Never write secrets, tokens, credentials, full prompts or full tool responses into a report,
  an evidence file or an observation stream.
- Observation streams (JSONL) live outside the repository and outside build trees, redacted, with a
  kill switch. A derived index is disposable; the files are canonical.
- Large audio, dumps and intensive run logs are referenced by path and hash, not committed.
- Do not send messages, close PRs or archive another repository by inference from a plan.

## Authority

- Only the ledger scribe writes `ESTADO.md` (D72/D79/D80). Deliveries propose lines via report +
  pendência. An owner instruction can dispense with this for a specific delivery (as D116 did); that
  dispensation is the owner's to give, never an agent's to assume.
- Ratification requires a verbatim owner quote + date + source. Silence is not approval (D48/D50).
- Architecture and the final design of new surfaces require an explicit numbered decision. Do not
  re-ask product decisions already expressed; concretize only the details still open.
- Proposals: `P-F*`. Bugs: `BUG-` (D75). Never occupy `D` numbers.
