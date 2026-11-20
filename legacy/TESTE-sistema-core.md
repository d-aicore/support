# Teste do sistema · plugin `core` e ambiente das equipas

**Âmbito:** o **sistema** (plugin, fichas, skills, ambiente), não o produto. Nenhuma alteração de código
em `d-aicore/core`. ENV-03 A/A2 são código do programa e **não** são trabalho desta sessão.
**Data:** 2026-11-20 · **Método:** verificar antes → corrigir → verificar depois.

## 1. Verificação antes de corrigir (o que eu próprio tinha escrito)

| Afirmação minha | Verificação | Resultado |
|---|---|---|
| `maxOutputTokens` do `qwen4-max-preview` = 8192 | leitura do campo exato na configuração do cliente (sem campos de segredo) | **CERTO** — `8192`, typeof number. `contextWindow` 1 000 000. O print anterior que parecia omiti-lo era truncamento do meu próprio output, não ausência do campo |
| `docs/relatorios/2026-11-17-maqueta-interface.md` existe | `git cat-file -e HEAD:<path>` | **CERTO** — EXISTS at HEAD |
| `docs/relatorios/2026-11-17-ui-ux-primeira-leitura.md` existe | idem | **CERTO** |
| `docs/plan/ux-pulse-spec.md` existe | idem | **CERTO** |
| há maquinaria de janelas destacáveis no produto | `git grep -il detach HEAD -- app/desktop/src docs/plan` | **CERTO** — `EngineSession.cpp`, `LibraryPanel.cpp/.h`, `MainComponent.cpp/.h`, `Mixer.cpp` |

**Nada a corrigir nestas cinco.** O defeito real era **omissão**, não erro: as regras novas do dono dadas
na sessão do mockup não estavam no sistema.

## 2. Correções aplicadas (omissões preenchidas)

Fonte: sessão DSH `711edc2b-0f36-46cd-b95c-92800233f8d4` (268 frames zstd, 528 registos, 2 457 042 B,
17:23→18:00). Cópia derivada redigida em `D:\CORE-ORG\dsh-711edc2b-extracted.jsonl`; **0 PAT** nessa
sessão. Original intacto.

| Regra do dono (verbatim) | Onde foi incorporada |
|---|---|
| «also, rule for core, all windows start detacheable» (L483) | `core-ui-visual/SKILL.md` Decision rules + `references/visual-evidence.md` + `core-routing/references/domain-map.md` |
| «first we pick style for knobs sliders and overall look based on what we have» (L501) | idem — **estilo antes de layout**, derivado do que o Core já tem |
| «once a style is settled we just arrange and apply to other panels» (L511) | idem — arranjar e propagar, nunca re-estilizar painel a painel |
| «this is what i require but with better card» (L500) | o card é o elemento a melhorar |
| «vamos usar uma copia do cor nao mexer na actula» (L176) | cópia de trabalho, nunca o checkout atual |
| «voces poden abrir ableton para tirar ideias do ui» / «bitwig» (L386/L401) | observação local autorizada; nunca copiar assets ou código |
| JIVE + «saiu uma versao nova do jucem» (L147) | JUCE 9.0.6 existe (19/11); Core fixa **9.0.5**; qualquer probe JIVE contra a versão fixada |
| «usame a team of agents» (L526) | mockup feito por equipa de agentes no DSH → contrato de **intake** externo, não regeneração |

## 3. Verificação depois — o cliente descobriu o sistema?

| Teste | Comando | Resultado |
|---|---|---|
| Validação estrutural ×6 | `node validate-package.mjs <skill>` | **6/6 pass**, 0 erros, 0 avisos, 0 unsupported |
| Validação do pacote | `qodercli plugins validate D:/CORE-ORG/core` | «skills (6), agents (4). Plugin "core" is valid and ready to install.» |
| Instalação | `qodercli plugins install D:/CORE-ORG/core --scope project` | «Plugin "core@local" installed successfully.» rc=0 |
| Registo e estado | `qodercli plugins list` | **`core@local v0.2.0` · Scope: project · Status: enabled** |
| Fichas descobertas | `qodercli agents list --setting-sources user,project,local` | `core:core-coord`, `core:core-engine`, `core:core-engine-scribe`, `core:core-guardian` — **todas com `Qwen4-max-preview` resolvido** |
| Campo `model:` honrado | idem | **SIM** — o cliente resolveu o id custom para o display name. Era uma lacuna «por verificar»; passou a verificado |
| Sombreamento | grep `shadow` na lista de agentes | **0** |
| Skills descobertas | `qodercli skills list` | **6/6 `[Enabled]`**: `core-engine-rt`, `core-evidence`, `core-gate`, `core-host-compat`, `core-routing`, `core-ui-visual` |
| Footprint do install | `D:\CORE-ORG\.qoder\settings.json` | **52 bytes**: `{"enabledPlugins":{"core@local":true}}`. Nada global alterado, nada no repo do produto |

## 4. Teste funcional em sessão nova — T1 CONCLUÍDO

**Sessão:** `ee7ff627-b8e4-59ac-a4f9-c32d3d5ee245` · workspace `CORE-ORG`
(`aab51b03-35d3-4d9b-b705-ac69f9be75cd`) · callbackMode `supervise`.

**Desenho:** pergunta read-only sobre o mecanismo do Debug «code 259», **sem nomear nenhuma skill**.
Restrições explícitas: sem escrita de ficheiros, sem builds/testes/gates/instalações, sem git de escrita,
sem rede. Entrega: revisão fixada, mecanismo com `sha:ficheiro:linha`, classificação
confirmado-no-código / apenas-reportado / não-verificado, limites, e uma secção final **«Skills used»**
com nomes exatos e se a ativação foi **automática** ou **explícita**.

**O que testa:** ativação automática (a pergunta que omite o nome), e se a skill certa é escolhida num
catálogo que já tem ~51 skills de utilizador + as de plugins.

**Resultado (medido no transcript da sessão, blocos de pensamento excluídos — 14 skipped):**

| Critério | Resultado |
|---|---|
| Nada escrito, nada executado além de leitura | **PASS** — ferramentas usadas: `Skill`, `Bash`, `Read`, `Grep`, `Glob`. Sem `Write`/`Edit`. O próprio agente declara: sem ficheiros, sem builds/testes/gates, sem rede, sem git de escrita |
| Revisão fixada | **PASS** — `c40ed0f801d475e9555f60c647e7829371baa163` (HEAD avançou desde `59275d2`) |
| Cada afirmação com `sha:ficheiro:linha` | **PASS** — dezenas de refs, todas ao SHA fixado |
| Classificação confirmado / reportado / não verificado | **PASS** — secção própria; todos os timings marcados como do env03, não re-medidos |
| Secção de limites | **PASS** — explícita e honesta (não correu a app, não inspecionou a JUCE aplicada nem os PDBs, internals do CRT citados como reportados) |
| **Seleção da skill certa sem o prompt a nomear** | **PASS comportamental** — o prompt não continha nenhum nome de skill; o agente escolheu `core:core-engine-rt` e **nenhuma outra skill ativou**. Num catálogo com ~51 skills de utilizador + as de plugins, não houve misfire |
| Rótulo «automática vs explícita» | **CRITÉRIO MAL DESENHADO POR MIM** — o agente respondeu «invoked EXPLICITLY by name (I called the Skill tool with skill=…)». Em Qoder, o modelo chamar a ferramenta `Skill` **é** o mecanismo de ativação; não há injeção silenciosa separada. A minha pergunta dizia «you never named it» e o agente leu «you» como ele próprio. O rótulo é artefacto da pergunta, não falha do sistema |
| **A regra do sistema foi obedecida** | **PASS, e é o achado mais forte** — o agente recusou reutilizar os números de linha do dossiê (pinados em `59275d2`) e re-leu tudo em `c40ed0f8`: «the authority here is the direct read at HEAD». Era exatamente a regra que escrevi na skill |

**Correção ao desenho do teste (aplicada):** o critério passa a ser objetivo e verificável no transcript,
não auto-reportado: *(a)* o prompt do utilizador contém algum nome de skill? *(b)* qual foi a primeira
ferramenta chamada e com que argumento? *(c)* quantas skills distintas ativaram? Se (a)=não e (b)=Skill
com a skill do domínio, a seleção foi orientada pelo modelo — que é o que interessa.

**Valor acrescentado pelo probe:** verificou factos que o meu dossiê não tinha — porque é que **duas**
instâncias leakam (`plugin.retry` constrói uma segunda que também crasha), `closeTimeout=10000ms` no
teste mas o caminho do reader ignora-o, `g_protocol` nunca é fechado explicitamente, `serve()` retorna 0
por construção, e **não há `_CrtSetDbgFlag` explícito em lado nenhum** → o dump de leaks é o default do
CRT sob `_DEBUG`. Isto último reforça A sobre B: «desligar o leak check» significa *acrescentar* uma
chamada que limpa o default, não remover uma existente. Tudo incorporado no dossiê da skill, com a
etiqueta de origem e o SHA.

## 5. Testes ainda por fazer

| # | Teste | Como | Estado |
|---|---|---|---|
| T2 | **Delegação** coord→engine | sessão nova com `agentId: core-coord` | **BLOQUEADO por T9** |
| T9 | **Visibilidade das fichas no Desktop** | `mcp__builtin__list_agents` vs `qodercli agents list` | **FEITO — falha real, ver abaixo** |
| T3 | **Limitação por `skills:`** | sessão com `core-engine-scribe` (só `core-evidence`) + pergunta que tentaria `core-engine-rt`; verificar se fica dentro do limite | por fazer |
| T4 | **Retoma (`resume`)** | sessão nova só-leitura que recupere refs **e limites** de um relatório existente, sem histórico | por fazer |
| T5 | **Premissa dos hooks globais** | probe mínimo: um hook de plugin dispara em agente de plugin? O work order assume que não | por fazer, **não verificado** |
| T6 | **Guarda de escrita** | só existe depois de T5; até lá as fronteiras nas fichas são **declarativas** | bloqueado por T5 |
| T7 | **Reversibilidade** | `qodercli plugins disable core` → confirmar que nada carrega; reativar | por fazer |
| T8 | **Propagação fonte→cache** | editar a fonte, verificar o cache, reinstalar a mesma versão, verificar outra vez | **FEITO — ver abaixo** |

### T8 · resultado medido

Cache do install local: `C:\Users\vk_do\.qoder\plugins\cache\local\core\0.2.0\`.

| Passo | Observação |
|---|---|
| Editei `skills/core-engine-rt/references/env03-debug-259.md` na fonte | validação estrutural continua **pass**, 0 erros |
| `grep -c "Independently re-verified"` no **cache** | **0** → a edição da fonte **não** chegou ao plugin instalado |
| `qodercli plugins install D:/CORE-ORG/core --scope project` (mesma versão 0.2.0) | «installed successfully» |
| mesmo grep no cache | **1** → **reinstalar propaga**, mesmo sem mudar a versão |

**Consequência operacional:** o ciclo é **editar fonte → reinstalar → reload**. Não basta editar. E como
os componentes de um plugin não se desativam individualmente, a unidade de rollback é o pacote inteiro
— o que confirma a regra «nada canónico vive dentro do plugin»: a fonte e a evidência vivem fora, em
`D:\CORE-ORG\core\` e nos relatórios do repo.

### T9 · falha real de ambiente: o Desktop não vê as fichas do plugin

| Fonte | Vê as 4 fichas `core:*`? |
|---|---|
| `qodercli agents list --setting-sources user,project,local` | **SIM** — secção «Plugin:», `core:core-coord · Qwen4-max-preview`, etc. |
| `mcp__builtin__list_agents` (registo de agentes do Desktop) | **NÃO** — lista os agentes de utilizador e os de outros plugins (`code-simplifier`, `coderabbit`, `context7`, `feature-dev`), mas **nenhum `core:*`** |

**Consequência:** `create_chat_session` com `agentId: core:core-coord` não é utilizável neste momento —
o id não existe no registo do Desktop. A delegação coord→engine (T2) fica **bloqueada** até o app
carregar o plugin. O sistema funciona no **CLI**; no Desktop está instalado mas não descoberto.

**Causa provável, não verificada:** o install foi feito por CLI em scope de projeto depois de o app
arrancar; o registo de agentes do app pode estar em cache e precisar de reload/restart. Outros plugins
aparecem porque já estavam carregados no arranque.

**Próximo passo concreto (ação do dono ou do app):** reload de plugins na vista Extensions, ou reiniciar
o Qoder; depois repetir `list_agents` e confirmar os quatro `core:*`. Se continuarem ausentes, a lacuna é
de integração CLI→Desktop e o runtime da rede passa a ser o CLI — o que é uma decisão de arquitetura a
registar, não um detalhe.

**Isto é exatamente o tipo de falha que o sistema deve tornar visível:** sem este teste, as fichas
pareciam prontas e a delegação falharia em silêncio na primeira tarefa real.

### T9 · RESOLVIDO pelo reinício do Qoder

Depois de o dono reiniciar o app, o próprio host passou a anunciar as **6 skills `core:*`** e os
**4 agentes `core:core-coord`, `core:core-engine`, `core:core-engine-scribe`, `core:core-guardian`**
como tipos disponíveis. Conclusão: a causa era **cache de arranque** — install por CLI depois de o app
arrancar não é descoberto até reload/restart. Não é falha de integração CLI→Desktop.

**Regra operacional que fica:** depois de `qodercli plugins install`, é preciso **reload/restart do app**
para as fichas entrarem no registo do Desktop. O ciclo completo é:
**editar fonte → reinstalar → reload/restart → confirmar em `list_agents`.**

### T10 · erro de input na rota Token Plan (medido, hipótese anterior refutada)

Sintoma reportado pelo dono: `Responses 请求失败：server_error: <400>
InternalError.Algo.DataInspectionFailed: Input text data may contain inappropriate content.`

**Diagnóstico:** rejeição de **inspeção de conteúdo do lado do provider**, ao nível do input, na rota
**BYOK Token Plan** (`byok:qoder-custom-0f384ab2-…/qwen4-max-preview`). O prefixo `Responses` coincide
com o protocolo `openai-responses` do provider custom. A recusa acontece **antes do modelo correr**:
`input_tokens=0`, nada cobrado, nada respondido. O cliente reenviou o **input idêntico 4 vezes** contra
o mesmo veredito e depois matou o turno (45–98 s perdidos por turno).

**Medição (517 turnos, 107 run logs, 2026-11-20, `route-audit.mjs` / `route-doctor.mjs`):**

| Rota | turnos | rejeições de input |
|---|---|---|
| BYOK Token Plan | 30 | **5 (17%)** |
| `qmodel_latest_preview` (sistema) + `auto` + `efficient` + `smodel` + `ultimate` | 392 | **0** |

**Exonerado por experiência, não por argumento** (cada item enviado isolado para um session limpo na
mesma rota BYOK — session sonda `88657d2e-aa70-5fc1-a37c-9ece41c7ec93`, 4 turnos, todos `end_turn`):

- os ** três prompts exatos que falharam** (o «reiniciado, nós vamos…» e as duas mensagens dos repositórios) → passam;
- **credenciais no payload**: `payload-scan.mjs` sobre esta sessão — classe `credential` = **0**;
- o **catálogo de skills CJK** (bloco real de 4 skills) → passa;
- o **bloco real do catálogo de tools MCP** (1,7 KB, GitHub, 45 nomes, verbatim) → passa;
- **tamanho**: falhas em `history` 553–767, passagens até 750 — distribuições sobrepostas, sem separação.

**Correção do meu diagnóstico anterior:** a hipótese escrita nesta secção («nomes de ficheiro do
`Downloads` no histórico determinam a recusa») está **refutada como causa suficiente**. A referência a
`Downloads` está no registo 2 e em 56 registos desta transcrição, e **21 turnos BYOK subsequentes
(18:50–19:29) passaram com esses mesmos registos no input**. Mantém-se a prática recomendada — não
listar esse diretório para dentro de uma sessão — mas ela já não é a explicação. O que fica por
localizar é o **span exato**, e ele não é localizável a partir do cliente: a co-ocorrência de blocos
injetados dá `mcp_lazy_tools_delta` como *pista* com n=1, não como causa.

**Correção aplicada ao sistema (v0.10.0):**

1. Regra de decisão «**Route before model**» em `core-routing/SKILL.md`, com a tabela medida e a escada
   de recuperação em `core-routing/references/model-routes.md`.
2. Tabelas de rota atualizadas com números medidos em `core/README.md` e
   `core-evidence/references/proof-stages.md`.
3. Ferramenta de diagnóstico da equipa de maintenance: `route-audit.mjs` (turno → rota → desfecho),
   `route-doctor.mjs` (compara turnos rejeitados com turnos que passaram na mesma rota e imprime a
   escada), `payload-scan.mjs` (classifica o payload por forma sem imprimir o payload). Registadas em
   `core-track/SKILL.md`.
4. A escada substitui o retry cego: **(1)** nunca reenviar o input idêntico; **(2)** mudar de *entrada*
   no catálogo — `Qwen4-Max-Preview` (sistema) em vez de `qwen4-max-preview` (BYOK): mesmo modelo, sem
   gate, sem teto de 8192, 0,1×; **(3)** se a rota Token Plan for obrigatória, mudar o input — passar o
   intentionamento para um session novo através do repositório (estágio `resume`) ou desligar o
   servidor/plugin cujo bloco ficou como pista; **(4)** respeitar o teto de 8192 com um estágio por
   agente e relatório escrito pelo scribe; **(5)** perfis nunca fixam uma chave `byok:` (defeito da
   v0.2.0, corrigido na v0.3.0).

**Para o stress test com modelos free:** `efficient` mede **0 rejeições** em 79 turnos, é grátis e não
tem teto de output; a janela é de 200k e não tem controlo de esforço. Julgar a rede contra esses limites.

### T11 · política de modelo único e verificação pós-correção (v0.11.0)

**Decisão do dono (2026-11-20, ~20:15):** «vamos usar apenas o qwen 4 max preview». Um modelo para toda
a rede. O plano de stress test com `efficient` fica **substituído**: o teste corre no mesmo modelo.

**Entrada escolhida — e correção da minha recomendação anterior.** Eu tinha recomendado a entrada de
sistema `Qwen4-Max-Preview` (`qmodel_latest_preview`) por não ter gate. **Retiro essa recomendação como
rota principal:** o catálogo mede-a `enabled:false`, `unavailableReason:"account"`, e as alternativas
dão 403 medidos hoje — `auto` **8 de 14**, `smodel` **2 de 4**, `qmodel_latest_preview` **1 de 9**. A
única entrada Qwen ativa é a do **Token Plan (BYOK)**. Um 403 (entrada indisponível) e um
`DataInspectionFailed` (gate de input) são falhas diferentes; não as confundir.

**Verificação depois da correção que a Sonus aplicou:**

- 5 rejeições de input, todas entre **18:45:47 e 19:37:57**; **nenhuma depois**.
- O turno desta sessão com o histórico pós-compactação (`history_length=281`, iniciado **20:13:10**)
  corre nessa entrada BYOK e executa ferramentas sem rejeição — é a prova no payload real, não só nas
  sondas de session limpo.
- Sondas `88657d2e` (4 turnos): prompts rejeitados verbatim, bloco CJK, bloco MCP GitHub → todos `end_turn`.

**O que ainda falta (dito sem maquilhagem):**

1. O **gate de input continua armado** do lado do provider; não é desligável pelo cliente. O payload
   atual passa; isso não é garantia para o próximo.
2. O **teto de 8192 tokens de output** mantém-se (declarado no catálogo para as três entradas Token).
   **Não é mensurável nos logs**: `output_tokens` aparece como 0, logo `--ceiling` dar `maxOut=0`
   significa *sem medição*, nunca *folga*. O contrato de estágio assume o teto como real.
3. **Agentes não podem fixar o modelo**: `chat.sessions.setModelPreference` → `available:false`,
   `agent.executable:false`. A política aplica-se por seleção do dono + medição, não por escrita de config.
4. As outras duas entradas Token (`moonshotai/Kimi-K3`, `zai-org/GLM-5.3-Flash`) continuam **enabled no
   selector** → risco de drift face a «apenas qwen». Escondê-las é ação do dono na UI.

**Drift medido (baseline, não veredito):** `--policy qwen4-max-preview` sobre 61 turnos de hoje →
**31 on-policy / 30 off-policy (49,2%)**. Distribuição: `auto` 14 turnos em 14 outras sessões,
`qmodel_latest_preview` 9, `smodel` 4, `efficient` 2, `qmodel_38max` 1. A maioria é anterior à decisão;
o número serve de linha de base para julgar a política a partir de agora.

**Defeito encontrado e corrigido na minha própria ferramenta:** o run log regista os comandos que eu
próprio executo; um comando que mencione `turn.finished` ou `DataInspectionFailed` podia ser contado
como desfecho de um turno real. O parser passou a aceitar apenas registos genuínos. **Re-medição
idêntica** (61 turnos, BYOK 31/26/5) — não havia contaminação, e fica bloqueada.

```bash
node core/skills/core-track/scripts/route-audit.mjs  --since 2026-11-20 --policy qwen4-max-preview
node core/skills/core-track/scripts/route-doctor.mjs --since 2026-11-20 --policy qwen4-max-preview
```

### T12 · custo, créditos e o teto de output — o que os ecrãs do dono provam (v0.12.0)

**Razão do dono para «apenas qwen»: o bónus de gastar 20%.** O catálogo mede: `qmodel_latest_preview`
`priceFactor 0.1` vs `originalPriceFactor 0.5` → paga **20% do original**. É a essa entrada que o bónus
pertence. **Não é alcançável agora**, por três evidências independentes:

1. `account.usage`: **0 créditos restantes** — userQuota 2000/2000, addOn 2400/2400, pacotes dedicados
   10000 e 8000 ambos `QUOTA_DETAIL_STATUS_EXHAUSTED`, `available:false`.
2. Todos os modelos de sistema pagos: `enabled:false`, `unavailableReason:"account"`.
3. Tentativa explícita de seleção → `CHAT_SESSION_MODEL_SELECTION_REJECTED`, `reason:"disabled"`.

A entrada Token Plan tem `priceFactor:null` — gasta a **quota própria do provider**, não créditos
Qoder; por isso responde com créditos a zero. `efficient` é grátis mas é outro modelo → fora de política.
**Condição de viragem:** créditos repostos → re-sondar `getModels` + seleção; se a entrada 0.1 passar a
selecionável, o alvo da política passa a `qmodel_latest_preview` e o drift re-mede-se com
`--policy qmodel_latest_preview`. Um parâmetro, não uma reescrita.

**Correção de uma afirmação minha:** eu tinha escrito que o teto de 8192 «não se muda pelo cliente».
O ecrã «Edit model» do dono mostra **Maximum output tokens** como campo editável com **128K**
selecionado, enquanto o catálogo, um minuto antes, ainda dizia 8192 → alteração por guardar/aplicar.
O cap **declarado pelo cliente** é editável; o que fica por verificar é se o **provider** honra mais.
Até medir um output longo, o contrato de fragmentação mantém-se. O mesmo diálogo diz que provider,
API type e model id **não se mudam depois de adicionar** — mudar de `Responses API` exige nova entrada.
**Cautela ao guardar:** o campo API key aparece vazio; não assumir «sem chave», e nunca colar chaves
em chat, relatório ou repositório.

**Guarda de política instalada (aplicação, não só texto):** `core/hooks/hooks.json` regista um hook
`UserPromptSubmit` (`core-model-policy`) que lê o modelo do `hook_input`, compara com
`/qwen4[-\s]?max[-\s]?preview/i`, acrescenta uma linha JSONL a `obs/model-policy.jsonl` e avisa numa
linha apenas quando fora de política. **Fail-open e não bloqueante**; kill switch `obs/policy.off`.
Testado isolado, 5/5 `exit 0`: on-policy silencioso; off-policy avisa; ambas as grafias aceites; JSON
inválido e modelo ausente não partem nada. Se a app injeta o stdout do hook como contexto fica
**por verificar até se observar a disparar** — o registo JSONL é a metade fiável.

## 6. Reversibilidade

- Desligar: `qodercli plugins disable core` (ou remover a entrada `core@local` de
  `D:\CORE-ORG\.qoder\settings.json`).
- Desinstalar: `qodercli plugins uninstall core`.
- A fonte continua em `D:\CORE-ORG\core\`; nada canónico vive dentro do plugin.
- Scope é **project** neste workspace. Para uso real nos clones de atores, instalar lá ou em scope user
  — decisão por tomar, com o risco de colisão de ativação medido em T1.

## 8. Estado da montagem · v0.3.0

**Correção de um defeito que eu introduzi na v0.2.0:** as fichas pinavam `model: qwen4-max-preview`,
o que hard-routava todos os agentes `core:*` para o provider **BYOK Token Plan** — o endpoint com
inspeção de conteúdo que devolveu `400 InternalError.Algo.DataInspectionFailed`, e com teto de output
de 8192. O pin também impedia correr o sistema com outro modelo.

**Catálogo de modelos medido (`manage_app_setting → chat.sessions/getModels`):** há **duas rotas** para
o mesmo modelo:

| Rota | modelKey | Output máx | Contexto | Preço | Moderação de input |
|---|---|---|---|---|---|
| BYOK Token Plan | `byok:qoder-custom-0f384ab2-…/qwen4-max-preview` | **8192** | 1M | — | **sim** |
| Sistema Qoder | **`qmodel_latest_preview`** (`Qwen4-Max-Preview`) | não declarado | 1M | **0.1×** | não |

**Decisão do dono:** Qwen4-Max-Preview para tudo → usar a **rota de sistema**. E **`efficient`**
(grátis, priceFactor 0, original 0.1, 200k contexto, **sem effort**) para o **stress test do sistema
quando estiver montado**.

**v0.3.0:** as quatro fichas passam a `model: inherit` — o modelo é escolhido pela **sessão**. Default
para trabalho normal: `qmodel_latest_preview`. Stress test: `efficient`.

| Verificação | Resultado |
|---|---|
| 6 skills validadas | **6/6 pass**, 0 erros/avisos/unsupported |
| `qodercli plugins validate` | skills (6), agents (4), válido |
| Reinstall | «core@local installed successfully» |
| Cache | `…/plugins/cache/local/core/{0.2.0, 0.3.0}` — as duas versões coexistem |
| Fichas no cache 0.3.0 | `model: inherit` ×4 |
| `D:\CORE-ORG\.qoder\settings.json` | `{"enabledPlugins":{"core@local":true}}` — inalterado, 52 bytes |

**Falta para «montado»:** T2 delegação coord→engine · T3 limite por `skills:` · T4 retoma em sessão nova
· T5 premissa dos hooks globais · T7 reversibilidade (disable/reativar). O stress test com `efficient`
fica **depois** destes, por decisão do dono.

**Nota de ciclo:** depois de reinstalar, o Desktop precisa de **reload/restart** para descobrir a nova
versão (T9). O CLI vê imediatamente.

## 7. O que não fiz

Nenhuma alteração em `d-aicore/core`. Nenhum build, teste, gate ou sanitizer executado. Nenhum token
manuseado. Nenhum mockup gerado (é trabalho da equipa DSH). Os transcripts originais não foram escritos.
As cópias derivadas estão fora de qualquer repo e redigidas.
