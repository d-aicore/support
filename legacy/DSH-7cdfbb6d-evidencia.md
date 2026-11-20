# Evidência extraída · sessão DSH `7cdfbb6d-0524-4f52-bfca-3690f470adb7`

**Extraído em:** 2026-11-20, sessão Qoder `D:\CORE-ORG`. **Método:** o transcript é
`C:\Users\vk_do\.dsh\sessions\--C-Users-vk_do-Documents-deepseek-harness-default-workspace--\session-7cdfbb6d-0524-4f52-bfca-3690f470adb7\session.v4.jsonl.zstd`
(3 125 525 B). São **1477 frames zstd concatenados** — `zlib.zstdDecompressSync` do node só decodifica o
primeiro (244 B, o header `session`). Foi preciso varrer o magic `28 B5 2F FD` e decodificar frame a frame:
1477/1477 sem falhas → **10 541 698 B, 2893 registos**. Cópia derivada (redigida) em
`D:\CORE-ORG\dsh-7cdfbb6d-extracted.jsonl`, **fora de qualquer repo**. O transcript original não foi alterado.

**Span:** 2026-11-19T23:02:58Z → 2026-11-20T17:15:44Z (~18 h). **Nada foi executado a partir do pacote
`core`; isto é extração de evidência, não verificação de runtime.**

## Privacidade — ação tomada

O transcript contém **11 strings com forma de GitHub PAT** (`github_pat_…`), incluindo a mensagem do dono
em L2826. **Valores nunca impressos.** A cópia derivada foi redigida: 11 substituições por
`[REDACTED-GITHUB-PAT]`, 0 restantes. **O original `.jsonl.zstd` continua a contê-las** (não se escreve em
transcripts). O token já foi revogado/expirado segundo o dono. Nenhuma das duas cópias pode entrar em Git.
Recomendação: apagar a cópia derivada quando a extração terminar; o original é histórico do harness.

## O que a sessão realmente usou (contagens medidas)

| Registo | Count | Leitura |
|---|---|---|
| `user/message` | 116 | mas só **19** com `source.kind=user` (palavras do dono). Resto: `time-context` 34, `subagent-settled` 37, `agent-message` 12, `goal` 3, `runtime-context` 3, `tool-jobs` 3, `agent-instructions` 2, `user-approval` 1, `skill-catalog` 1, `working-directory` 1 |
| `assistant/message` | 328 | |
| `tool/call` / `tool/result` | 480 / 505 | |
| `subagent/catalog` | 27 | **27 subagentes nomeados por tarefa+estágio de prova**, não por tecnologia |
| `team/task` | 86 | task board |
| `job/registered` / `job/settled` | 154 / 154 | builds e gates em background |
| `todo/write` | 34 | |
| `turn/start` / `turn/end` | 42 / 42 | |
| `goal/change` | 2 | create + edit (continuação por rondas) |
| `model/selection` | 7 | ver abaixo |
| **`compaction/prune`** | **25** | todos agrupados no fim (linhas 2586–2634) → pressão de contexto real e observável |
| `agent/inbox/spliced` | 161 | |

**Nenhuma skill foi invocada** (confirmado pelo próprio resumo do dono; há um único `skill-catalog`
injetado). O resultado — 6 commits publicados + relatórios — veio de **método + tooling + orquestração**.

## Modelo e effort (verbatim dos registos `model/selection`)

| Linha | Provider / modelo | reasoningEffort |
|---|---|---|
| 11 | `deepseek-account` / `deepseek-v4-pro` | — |
| 12 | `bailian-tpp` / `qwen4-max-preview` | — |
| 233 | `bailian-tpp` / `qwen4-max-preview` | `max` |
| 244 | idem | `xhigh` |
| 254 | idem | `high` |
| 264 | idem | `medium` |
| 282 | idem | `xhigh` |

**Correção ao desenho:** a matriz de modelos por perfil do CSV (Qwen4-Max para juízo, Qwen3.8-Flash para
estrutura, Efficient para os 9 comunicadores) **não foi o que correu**. Correu **um modelo** com
**effort variável**. E é o provider `bailian-tpp` do DSH, não o seletor do Qoder — a disponibilidade em
Qoder continua por verificar. As fichas do plugin `core` usam `model: inherit` por essa razão.

## Os 27 subagentes (nomes verbatim do catálogo)

`csv-triage`, `resume-check`, `csv-triage-2`, `plan-hunt`, `s1-red`, `s11-proof`, `s5-red`, `s1-build`,
`s11-clean-build`, `s11-negctrl`, `s11-release-proof`, `s1-repro`, `s11-fix`, `s5-fix`, `s1-repro-2`,
`s4-red`, `s1-fix`, `s4-fix`, `env03-debug`, `s2s3-fix`, `s6-proof`, `s7-rt`, `vst3-host`, `s8-undo`,
`s9-mute`, `timing-proof`, `chain-series`.

**Padrão:** `<contrato>-<estágio de prova>` — `red`, `repro`, `build`, `fix`, `proof`, `negctrl`,
`clean-build`, `release-proof`. O nome codifica **onde está na prova**, não a tecnologia. Não há
«comunicador local por equipa» em lado nenhum.

## Goal (verbatim, truncado)

- create (L328): «Execute the owner's staged Core program (prompt comum + etapas 0, 3A, 1, 4, 6, 2, 5, 7
  in the suggested order) at D:\CORE\CORE with subagents, delivering per-stage reports/evidence per
  docs/AUDITORIA…»
- edit rev.2 (L825): «Coordinate the owner's S-round for a flawless Core (dispatch «Passagem para o
  coordenador dos Qwens», 2026-11-20): priority dados > tempo real > performance > compatibilidade…»

## Palavras do dono que mudam o desenho da rede (19 mensagens, `source.kind=user`)

| Linha | Hora (UTC) | Conteúdo |
|---|---|---|
| L21 | 11-19 23:05 | handover de ambiente, 46 169 chars, base `main @ 8c6837e`, plataforma medida |
| **L249 / L287** | 23:16 / 23:20 | **«Core — Prompts para o DeepSeek Harness»**: «Abre `D:\CORE\CORE` como workspace… Cola o **prompt comum** no início de cada sessão e, a seguir, cola **uma etapa**. **Usa sessões separadas para o motor, o host VST3 e a…**» (10 583 / 10 507 chars) |
| L259/269/278/297/311/720 | 23:16–00:04 | `CONTINUA`, `CONTINIA`, `continue`, `con t`, `cont` → continuação por rondas |
| L543 | 23:45 | anexo CSV + «depois confirma» |
| **L740** | 00:05 | **«Core — Passagem para o coordenador dos Qwens»** (11 758 chars) = dispatch D115 |
| **L754** | 00:06 | **«you are free to deplay as many agents as you want»** |
| L1142 | 00:31 | anúncio do plugin `@local/agent-task-factory` (criado e instalado pelo próprio dono/agent) |
| L2495 / L2512 | 12:52 / 12:54 | «acaba o que tem feito para fazer commit» · «update ao estado… proximo agente a pegar no projecto tem de saber tudo» = D116 |
| L2763 / L2800 / L2826 | 13:32–13:36 | «mandar para github» · URL do repo · **PAT (redigido)** |
| L2848 | 17:10 | «quero levantamento dos plugins, skills, metodos tudo que estavamos usar aqui» → produziu `c40ed0f` |

**Nota de permissões:** L20 regista a mudança de política para «never ask the user for approval» nessa
sessão. Isso **não se herda** para a rede Qoder: as fichas do plugin `core` usam `permissionMode: default`.

## Deltas ao desenho da rede (evidência, não opinião)

1. **Sessão por domínio, não 11 equipas persistentes numa sessão.** O método do próprio dono é «prompt
   comum + uma etapa», em **sessões separadas** (motor, host VST3, …). Isto responde à composição das
   secções e ao lugar dos ministros com evidência: o contentor é a **sessão**, e o ramo mínimo é o
   **brief da etapa**. Não são contentores de membros.
2. **Perfis por estágio de prova, não por tecnologia.** Os 27 subagentes reais são `s1-red`/`s1-fix`/
   `s1-repro`/`s11-negctrl`/`s11-release-proof`. As 4 fichas do WP-3 são templates de papel; o trabalho
   real instancia agentes por estágio. O plugin deve permitir isso, não congelar 24 papéis.
3. **Os 9 comunicadores locais não têm contrapartida no que funcionou.** Os relatórios foram por etapa,
   escritos pelo próprio estágio, conforme `docs/AUDITORIA.md`. Cortar os 9 é uma decisão apoiada em
   evidência, não em preferência.
4. **Zero skills invocadas.** O valor veio do método. As 5 skills do plugin `core` codificam exatamente
   esse método (vermelho-primeiro, gate real, validação SHA-bound, contrato de evidência, compatibilidade
   do host) — e é essa a justificação delas, não a contagem do desenho.
5. **A perda de contexto já é observável:** 25 `compaction/prune` no fim de 18 h. Não é preciso inventar
   hooks para a descobrir; o log do harness já a regista. O investigador começa com dados existentes.
6. **Tempo de máquina já é observável:** 154 `job/registered` + 154 `job/settled`. Idem.
7. **«as many agents as you want» está autorizado** (L754). O limite não é a autorização do dono — é o
   custo e a prova de retorno. A recomendação lean mantém-se, mas como proposta medida, não como proibição.

## Estado do repo verificado nesta sessão

- `git status -sb` → `## main...origin/main [ahead 1]`; `git rev-list --count origin/main..HEAD` → **1**.
- **`c40ed0f`** (2026-11-20 17:14:45 +0000) «Docs: environment/tools/methods inventory (plugins, skills,
  methods, toolchain, agents)» — 2 ficheiros, +160: o relatório (158 linhas) + 2 linhas no índice.
  **Existe, é o único não publicado.** Confirma o resumo do dono.
- `docs/relatorios/2026-11-20-environment-tools-methods-inventory.md` existe (12 346 B) e está indexado
  (1 entrada no README).
- `docs/relatorios/2026-11-20-vst3-host-soundtoys.md` existe → o ensaio com plugins reais de terceiros
  já foi feito e reportado.
- Working tree: `M docs/relatorios/README.md`, `?? .qoderignore` (preservar; é trabalho de outra sessão).
- `gh` devolveu **401 Bad credentials** e `git clone`/`ls-remote` para `d-aicore/CORE-ORG` falharam com
  «expected flush after ref listing» — consistente com o token expirado, não com um bug de protocolo.

## Plugins DSH → Qoder (o que transfere e o que não)

| DSH | Função | Equivalente Qoder | Ação |
|---|---|---|---|
| `@local/dsh-cpp-lsp` | clangd sobre o compile DB do Core, `--query-driver=cl.exe`; definição hpp→cpp, cross-TU, referências, hover | **não existe ferramenta LSP no Qoder** | lacuna real. Ou se aceita navegação por `Grep`/`Read`, ou se expõe clangd via MCP — decisão do dono, com custo |
| `@local/agent-task-factory` | `agent_create`, `task_create`, `todo_add` | `Agent(...)`, `TaskCreate/TaskUpdate/TaskList`, `mcp__builtin__create_team_task` | **já coberto**; não recriar |
| `dsh-base` + `dsh-web-app` | agent loop, sessões, sandbox, permissões, GUI | o próprio Qoder | não aplicável |
| `job_*` | builds/gates em background | `Bash run_in_background` + `Monitor` | já coberto |
| `create_goal/update_goal` | continuação por rondas | `CreateGoal/UpdateGoal` | já coberto |
| `send_message/list_agents` | mensagens entre agentes | `mcp__builtin__send_message_to_chat_session`, `list_agents` | já coberto |
| `load_workspace_dependencies` | Python/Node bundled | node-repl MCP + Bash | já coberto |

## O que não fiz

Não publiquei nada, não pedi nem manuseei tokens, não alterei o transcript original, não escrevi em
`d-aicore/core`, não instalei o plugin `core`, não corri builds/gates/testes. A única escrita foi a
cópia derivada **redigida** fora do repo e este ficheiro.
