# Plano de implementação · Rede de equipas do Core no Qoder

**Para:** Diogo · **De:** agente planeador (Qwen) · **Data:** 2026-11-20
**Âmbito desta entrega:** plano faseado, verificável e estimável + decisões pendentes. Não configura o Qoder, não altera o repositório e não corre pilotos.
**Companheiros deste documento:** `backlog.csv` (68 itens, rastreáveis), `inventario-agentes.csv` (24 fichas, com modelo e esforço), `inventario-skills.csv` (24 skills), `Avaliacao-JIVE-UI-UX.md` (avaliação do JIVE para UI/UX). Os quadros deste plano são gerados a partir desses CSV, por isso não divergem.

**Como ler a origem de cada afirmação** — uso três marcas em todo o documento:

- `[D]` **Desenho** — vem da versão do Diogo «Core · Rede de equipas no Qoder» tal como descrita no brief (11 secções, três ministros, plugin único `core`). O documento original e o ZIP `Core-Observador-Piloto` **não estavam disponíveis** neste workspace; nada cito deles que o brief não afirme.
- `[V]` **Verificado** — verificado por mim em 2026-11-20. Divide-se em `[V-doc]` (documentação oficial do Qoder, com URL) e `[V-obs]` (observado diretamente). **Não há um único `[V-obs]` sobre o checkout do Core nem sobre a instalação do Qoder do Diogo**: o workspace desta sessão estava vazio.
- `[P]` **Proposto** — minha proposta, reversível, ainda não aprovada.

> **Consequência honesta:** este plano é executável na sua parte organizacional e de configuração porque a documentação do Qoder é detalhada e verificável; é **condicional** na parte do Core, porque não vi o repositório. Todos os pontos do Core estão marcados «por verificar» com o comando ou ensaio exato que os resolve (secção 2.4). Nenhum caminho do Core é apresentado como facto.

---

## 1. Sumário executivo

**Primeiro incremento que gera valor (Fase 1, ~14–28 h de agente).** Uma intenção em linguagem natural desce do coordenador a **uma** equipa (Host VST), regressa com resposta que cita `ficheiro:linha`, e fica recuperável por uma **sessão nova sem acesso ao histórico do chat**. O pedido concreto está na secção 8. Esse incremento já entrega o que o Diogo quer no exemplo do VST — não a atualização do VST, mas a resposta tecnicamente verificável sobre o que a atualização tem de preservar e o que hoje está coberto por teste. Cinco perfis, seis skills, um plugin, hooks de recolha ligados desde o primeiro minuto.

**Maior incógnita técnica.** Não é o motor nem o VST: é **a passagem de trabalho com contexto suficiente e retorno à origem no cliente Windows real**. Três factos documentados tornam-na incerta e moldam todo o desenho:

1. `[V-doc]` No CLI, os *teammates* de Agent Teams **vivem apenas dentro da sessão TUI**; ao sair, a equipa é destruída e `resume` recupera a conversa principal mas **não** os membros nem o seu estado ([cli/agent-teams](https://docs.qoder.com/cli/agent-teams)). A continuidade organizacional **não pode** depender da sessão — tem de estar em Git. Isto confirma a aposta do desenho em registos duráveis `[D]` e torna o teste de retoma (P1-07) o portão da Fase 1.
2. `[V-doc]` A troca de mensagens **entre sessões** exige *Unix domain sockets* e é **macOS/Linux apenas** ([cli/cross-session-messaging](https://docs.qoder.com/cli/cross-session-messaging)). Em Windows nativo, a passagem entre sessões faz-se por delegação do cliente + ficheiros em Git. É a única necessidade concreta que justificaria WSL, e a Fase 1 não precisa dela.
3. `[V-doc]` No IDE, uma Agent Team tem **um líder + no máximo quatro membros adicionais**, e **o nome não pode ser alterado depois de criado** ([qoder/custom-agent-teams](https://docs.qoder.com/qoder/custom-agent-teams)). A equipa de Coordenação com cinco perfis `[D]` fica exatamente no limite; **acrescentar o investigador como sexto membro não cabe**. Os ministros, que no desenho abrangem até cinco equipas, também não cabem como «contentores de membros». Solução proposta: ministros como **perfis de encaminhamento com lista de delegação explícita** (`Agent(...)`, documentado no CLI), não como contentores — decisão **D-03**.

**Segunda incógnita, de custo.** Vinte e quatro perfis com contexto próprio pagam-se em créditos e em latência; `[V-doc]` as chamadas de modelo por sub-agentes são **faturadas separadamente** ([model-tier-selector](https://docs.qoder.com/user-guide/chat/model-tier-selector)). Por isso a baseline é medida **antes** de existir rede (P0-14) e a decisão de manter/reduzir a rede é explícita no fim (P5-07). A rede tem de provar que compensa; o plano não assume que compensa.

**Onde o plano é mais forte do que o desenho original.** Quatro mecanismos que a documentação permite e que eu proponho como espinha dorsal:

- **Guarda de escrita determinística por perfil**: os hooks recebem `agent_type` no stdin `[V-doc]`, logo um hook `PreToolUse` consegue impedir que um perfil escreva fora da sua gaveta. A ficha deixa de ser uma intenção e passa a ser uma fronteira aplicada por código.
- **Hook `Stop` bloqueante do scribe**: `Stop` é bloqueável no IDE e no CLI `[V-doc]`. Uma alteração governada sem entrada de registo **impede o fecho da resposta**. É a diferença entre «pedimos que registem» e «não conseguem acabar sem registar».
- **Selo em duas fases** para resolver o paradoxo do commit que contém o próprio hash: commit A publica a evidência, o scribe lê `git rev-parse HEAD` e acrescenta o selo, commit B publica o selo.
- **`merge=union` em `docs/rede/**` + IDs estáveis por worktree** para appends concorrentes: duas worktrees acrescentam sem perder entradas, e um validador deteta blocos corrompidos.

**Esforço total estimado** (detalhe e justificação na secção 6): **126–248 h de agente**, **24–59 h de máquina**, **18–36 h de intervenção do Diogo**, distribuídas por seis fases. Desse total, **12–24 h de agente** dependem da adoção de JIVE (D-14) e não estão comprometidas; o resto do plano é **114–224 h**. O intervalo é largo porque o checkout é desconhecido; a Fase 0 existe precisamente para o estreitar, e a Fase 2 é a que mais varia (número de headers protegidos e de testes existentes).

**Atualização de 2026-11-20, 2.ª ronda** (modelos e JIVE):

- **Modelos fixados pelo Diogo** `[D]`: Qwen4-Max-Preview, Qwen3.8-Flash e tier Efficient. A matriz por perfil está em **3.8**; D-01 fica **parcialmente decidida** (falta runtime e dispositivo).
- **JIVE avaliado** (`Avaliacao-JIVE-UI-UX.md`): não serve de UI para um plugin Qoder, mas converte a UI do Core em **XML + JSON diffáveis e testáveis**, o que dá à QA UX um **oráculo objetivo** e corta o ciclo de rebuild. Proposta: **spike num ecrã, versão fixada**, não migração. Duas skills novas, quatro testes novos, decisão **D-14**.
- **Correção importante ao desenho do plugin** `[V-doc]`: sub-agentes **fornecidos por plugin** perdem `hooks`, `mcpServers` e `permissionMode` por política de segurança; só `isolation: worktree` é preservado (V24). As fronteiras por perfil **não** podem depender do frontmatter da ficha — passam a ser aplicadas por `permissions` do projeto e por hooks globais com `agent_type`, que era já o mecanismo proposto. Em contrapartida, `agents.overrides` permite **desligar ou reconfigurar um perfil individualmente** sem desligar o plugin (V23), o que melhora a reversibilidade prevista em 7.4.

**Seis decisões bloqueiam o arranque:** D-01 (runtime e dispositivo — modelos já escolhidos), D-02 (árvore governada), D-03 (composição e lugar dos ministros), D-05 (nomes públicos), D-15 (onde vivem as fichas, por causa da política de segurança dos plugins) e D-06 (contrato de headers, bloqueia só a Fase 2). Estão na secção 9, por ordem de bloqueio, com recomendação e custo de adiar.

---

## 2. Estado inicial e decisões

### 2.1 Factos verificados

**Sobre o ambiente desta sessão** `[V-obs]`

| Facto | Como foi verificado | Consequência |
|---|---|---|
| O workspace está vazio: sem checkout do Core, sem `.git`, sem `CMakeLists.txt`, sem ZIP `Core-Observador-Piloto` | `ls -la`, `find` por `*.zip`, `CMakeLists.txt`, `*observador*`, `git rev-parse` (falhou) | Todo o inventário do Core é «por verificar». Nenhum caminho do Core neste plano é facto. |
| Não há dispositivo Windows, DAW, JUCE, VST3 nem X3D acessíveis a partir daqui | ausência de checkout e de ferramentas | Pilotos, benchmarks e ensaios de UI não podem ser antecipados; estão especificados como ensaios com critério de aceitação. |

**Sobre o Qoder** `[V-doc]` — documentação oficial consultada em 2026-11-20. **Nada disto foi verificado na instalação do Diogo**; a coluna «impacto» diz onde isso morde.

| # | Capacidade verificada na documentação | Fonte | Impacto no plano |
|---|---|---|---|
| V1 | Um **plugin** agrega Skills, MCP Servers, Agents, Commands, Rules e Hooks; instala-se ao nível do utilizador ou do projeto; **instala-se como um todo** | [extensions/plugins](https://docs.qoder.com/extensions/plugins) | O plugin único `core` `[D]` é suportado. |
| V2 | Componentes de um plugin ficam marcados *From Plugin* e **não podem ser desativados, apagados ou modificados individualmente**; desativar o plugin desativa tudo | [extensions/plugins](https://docs.qoder.com/extensions/plugins) | «Voltar à versão anterior de uma skill» **não** é um clique. Exige versão do plugin em Git + reinstalação, e um kill-switch próprio para hooks (secção 7.4). |
| V3 | Layout do plugin: `.qoder-plugin/plugin.json`, `commands/`, `agents/`, `skills/`, `hooks/hooks.json`, `bin/`, `.mcp.json`; `qoder plugins install <dir> --scope project\|user\|local`; `/plugins reload`; `enable`/`disable` via `enabledPlugins`; `uninstall --keep-data` | [cli/plugins](https://docs.qoder.com/cli/plugins) | Dá para versionar o plugin dentro do repo do Core e reinstalar por tag. `--keep-data` preserva dados, mas a evidência canónica fica em Git, não nos dados do plugin. |
| V4 | Ficha de agente em Markdown com frontmatter: `name`, `description`, `tools`, `disallowedTools`, `model`, `skills`, `mcpServers`, `permissionMode`, `maxTurns`, `timeoutMins`, `isolation: worktree` | [cli/subagent](https://docs.qoder.com/cli/subagent), [extensions/subagent](https://docs.qoder.com/extensions/subagent) | As 24 fichas são ficheiros versionados. `isolation: worktree` dá-nos o ensaio de duas worktrees de graça. |
| V5 | Um sub-agente pode ter permissão para chamar **outros sub-agentes nomeados**: `tools: [Read, Grep, Agent(Explore, Plan)]` | [cli/subagent](https://docs.qoder.com/cli/subagent) | **Hierarquia coordenador→ministro→equipa é implementável** com listas fechadas. É a base da proposta D-03. No IDE a lista de ferramentas documentada não inclui `Agent` → por verificar. |
| V6 | Precedência de agentes: built-in < utilizador < projeto < **plugin** < `--agents`; `qoder agents list` marca os *shadowed* | [cli/subagent](https://docs.qoder.com/cli/subagent) | Nomes do plugin ganham sobre definições locais. Bom para consistência, perigoso para experiências A/B → o A/B usa `--agents` ou tags, não edição silenciosa. |
| V7 | Skills: `SKILL.md` em `~/.qoder/skills/<nome>/` ou `.qoder/skills/<nome>/`; projeto tem prioridade; ativação **automática pelo modelo** ou explícita `/nome`; recarregar exige reiniciar o IDE | [extensions/skills](https://docs.qoder.com/extensions/skills) | O teste «pergunta que omite o nome da skill» é obrigatório (P1-05). 22 skills com descrições parecidas são risco de ativação, não de qualidade. |
| V8 | Hooks no **IDE/JetBrains**: 12 eventos, apenas handlers `command` e `http`. Configuração **partilhada** com o CLI; cada entrada corre só os eventos que suporta | [extensions/hooks](https://docs.qoder.com/extensions/hooks) | Um único `hooks.json` serve os dois, mas o que só existe no CLI degrada em silêncio no IDE. Tabela de eventos por entrada é obrigatória (secção 4.4). |
| V9 | Hooks no **CLI**: 23 eventos, incluindo `SubagentStart`/`SubagentStop` (`agent_id`, `agent_type`), `PostToolUseFailure`, `PermissionDenied`, `StopFailure`, `PreCompact`/`PostCompact`, `InstructionsLoaded`, `FileChanged`, `WorktreeCreate`/`WorktreeRemove`, `ConfigChange`, `CwdChanged` | [cli/hooks](https://docs.qoder.com/cli/hooks) | Os seis acontecimentos úteis do desenho `[D]` têm fonte determinística. `InstructionsLoaded` e `PostCompact` dão **observação da perda de contexto**, que era o ponto mais cego. |
| V10 | Campos comuns no stdin de qualquer hook: `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `permission_mode`, `agent_id`, `agent_type`; eventos de ferramenta trazem `tool_use_id` | [cli/hooks](https://docs.qoder.com/cli/hooks) | **Responde à pergunta «qual é o identificador para correlacionar passos»**: `session_id` + `agent_id` + `tool_use_id`, com `task_id` nosso injected no arranque. |
| V11 | Hooks CLI aceitam `"shell": "powershell"`, `async`, `asyncRewake`, `once`, `if: "Edit(*.cpp)"`, `args` (forma exec), `env`, `timeout` (600 s por omissão); variáveis `QODER_PROJECT_DIR`, `QODER_PLUGIN_ROOT`, `QODER_PLUGIN_DATA`; em PowerShell os `${...}` são substituídos pelo CLI antes de invocar; `.bat`/`.cmd` não podem ser exec diretamente | [cli/hooks](https://docs.qoder.com/cli/hooks) | **Recolha nativa em Windows sem WSL.** `async` garante que a observação não trava o agente. Usar `powershell` explícito e forma exec com `args` para caminhos com espaços. |
| V12 | Tipos de hook: `command`, `http`, `prompt` (uma chamada LLM isolada) e `agent` (sub-agente verificador que devolve `{ok, reason}`) | [cli/hooks](https://docs.qoder.com/cli/hooks) | O guardião pode ser um hook `agent` sobre escritas em testes. Só CLI. |
| V13 | `Stop` e `UserPromptSubmit` são **bloqueáveis** (exit 2); `PreToolUse` pode `allow`/`deny`/`ask` e reescrever input; `hookSpecificOutput` exige `hookEventName` | [cli/hooks](https://docs.qoder.com/cli/hooks), [extensions/hooks](https://docs.qoder.com/extensions/hooks) | Scribe bloqueia o fecho sem registo; guarda de escrita por `agent_type`; injeção de contexto no pedido. |
| V14 | Configuração merged de `~/.qoder/settings.json`, `<proj>/.qoder/settings.json` (commitável) e `<proj>/.qoder/settings.local.json` (gitignore); hooks do mesmo evento **não se sobrepõem, somam-se** | [cli/hooks](https://docs.qoder.com/cli/hooks) | Rede partilhada em Git; exceções locais fora. Cuidado: um hook duplicado no nível do utilizador dispara duas vezes → dedup obrigatória. |
| V15 | Permissões: `deny` primeiro, depois verificações de segurança, depois `ask`, depois `allow`; modos `default`, `accept_edits`, `auto`, `bypass_permissions`, `dont_ask`; **headless converte `ask` em `deny`**; modos não-default só em diretórios de confiança | [cli/permissions](https://docs.qoder.com/cli/permissions) | Verificação em sessão nova corre em `dont_ask` com allowlist de leitura. `bypass_permissions` fica proibido na árvore do produto `[P]`. |
| V16 | Memória: `AGENTS.md`, `AGENTS.local.md`, `.qoder/rules/**/*.md` com `trigger: always_on \| manual \| model_decision \| glob`; procura para cima até ao diretório com `.git`; memória de subdiretório carrega **on-demand**; memória é contexto, **não** política de enforcement | [cli/memory](https://docs.qoder.com/cli/memory) | `ESTADO.md` não é carregado por omissão. Regra núcleo `always_on` curta + regras de domínio `glob`. Fronteiras aplicam-se por hooks/permissões, nunca por memória. |
| V17 | **Agent Teams (CLI)**: beta, `QODER_AGENT_TEAMS=1` em `%USERPROFILE%\.qoder\.env`; main agent + teammates com nome estável, `SendMessage`, lista de tarefas partilhada; equipa morre ao fechar o TUI; `resume` não traz membros; recomenda 2–4 teammates | [cli/agent-teams](https://docs.qoder.com/cli/agent-teams) | Nomear teammates igual às fichas; equipas grandes são antipadrão; continuidade em Git. |
| V18 | **Agent Team (IDE)**: Settings > Agent Team; **1 líder + 1–4 membros**; nome imutável; membros do dispositivo, cloud ou dispositivos ligados; collaboration tem de estar ativa por agente; seleção da equipa no *executor picker* de New Task; delegação a partir de conversa local; Projects/discussions exigem plano business | [qoder/custom-agent-teams](https://docs.qoder.com/qoder/custom-agent-teams) | Limite estrutural das 11 equipas; passos manuais; nomes decididos **antes** de criar (D-05). |
| V19 | **Cross-session messaging**: beta, `QODER_FEATURE_CROSS_SESSION=1`, sockets Unix, **macOS/Linux apenas** | [cli/cross-session-messaging](https://docs.qoder.com/cli/cross-session-messaging) | Não contar com isto em Windows. WSL só se esta capacidade se tornar necessidade concreta (D-11). |
| V20 | CLI corre em **Windows** (arm64 não suportado); instalação `irm https://qoder.com/install.ps1 \| iex`; `qoder --version`; **auto-upgrade ativo por omissão**, desliga-se com `general.enableAutoUpdate: false` | [cli/installation](https://docs.qoder.com/cli/installation) | Runtime Windows nativo é viável. **Fixar a versão do cliente** é pré-requisito de comparabilidade A/B e de benchmarks. |
| V21 | Modelos: tiers Auto (~0.3×), Ultimate (~2×), Fast (~0.6×), Efficient (0.1×, 0.0× em promoção); modelos específicos incluem **Qwen4-Max (0.4×)**, Qwen3.8-Max (0.5×), Qwen3.8-Flash (0.1×); **chamadas de sub-agentes faturadas separadamente**; «o seletor é autoritativo» e varia por versão de cliente e conta | [model-tier-selector](https://docs.qoder.com/user-guide/chat/model-tier-selector) | O modelo Qwen exato no dispositivo do Diogo é **descoberta obrigatória** (P0-08), não um facto deste plano. Fixar tier por fase. |
| V22 | O campo `model` de uma ficha aceita **nome de modelo ou alias** (`inherit`, `auto`, `lite`, `efficient`, `performance` são valores comuns); `effort` aceita `low`/`medium`/`high`/`xhigh`/`max` ou inteiro | [cli/subagent](https://docs.qoder.com/cli/subagent) | **modelo e esforço por perfil** são configuráveis, não só por conversa. Base da matriz 3.8 |
| V23 | `settings.json` → `agents.overrides.<nome>` sobrepõe `enabled`, `tools`, `runConfig` (`maxTurns`, `maxTimeMinutes`), `modelConfig` (modelo, temperatura) e MCP, **sem editar o Markdown**; não cria agentes novos | [cli/subagent](https://docs.qoder.com/cli/subagent) | permite **desligar um perfil**, ajustar modelo por máquina e fazer A/B sem tocar na fonte do plugin. `[PV]` aplicar a agentes de plugin |
| V24 | Sub-agentes **fornecidos por plugin** sofrem política adicional: `hooks`, `mcpServers` e `permissionMode` são **removidos**; `isolation` só é preservado em `worktree` | [cli/subagent](https://docs.qoder.com/cli/subagent) | **fronteiras por perfil não podem viver no frontmatter do plugin**; passam a `permissions` do projeto + hooks globais com `agent_type`. Alternativa em D-15 |

### 2.2 Pressupostos reversíveis `[P]`

Assumo isto para poder planear; cada linha diz como se desfaz.

| Pressuposto | Porque é razoável | Como reverter |
|---|---|---|
| O checkout é um repo Git único com CMake e testes registados em CTest | o brief fala em scripts PowerShell, bundles e builds | se for outro build system, P2-13 muda o alvo, não o método (consumidor mínimo por header) |
| Existe um módulo de motor separável do executável e uma fronteira pública de headers | o brief diz «módulo separado do executável» `[D]` | se a fronteira não existir, D-06 passa a ser «definir fronteira» antes de «verificar fronteira» e o esforço de P2-13 sobe |
| Os scripts PowerShell actuais constroem, correm testes e fazem bench | brief manda reutilizar `[D]` | inventário P0-05 substitui cada script proposto pelo real; nenhum script novo é escrito antes de ver os existentes |
| O dispositivo de trabalho é Windows x64 com Qoder instalado e conta com créditos | brief: DAW em Windows | se for arm64, o CLI nativo não está suportado (V20) → IDE passa a runtime principal |
| X3D é uma máquina (ou perfil) de medição distinta da máquina de trabalho | brief: «reserva o X3D para benchmarks isolados» `[D]` | **se for a mesma máquina**, a isolamento passa a ser temporal, e D-09 muda de «máquina» para «janela» — pergunta explícita em P0-13 |
| Git é o único transporte de continuidade entre sessões | V17 + V19 fecham as alternativas em Windows | se o Diogo tiver plano business e quiser Projects, reavaliar (D-12) |

**Responsável por cada pressuposto:** o responsável do item de descoberta que o confirma, nomeado na coluna «Resp.» do backlog (secção 5). Um pressuposto não confirmado não passa a facto por repetição.

### 2.3 Questões em aberto que não são decisões de arquitetura

Estas resolvem-se com um comando, não com uma reunião: versão exata do cliente e do modelo no dispositivo; se as skills do plugin aparecem no IDE e no CLI a partir do mesmo diretório; se um agente de plugin pode ser membro de uma Agent Team do IDE; se o IDE permite `Agent(...)` aninhado; se existe projeto pesado, VST3 A/B, projeto antigo com automação e mockup aprovado; se o ZIP do observador existe. Todas estão na tabela 2.4 com método e impacto, e nenhuma bloqueia escrever o plano.

### 2.4 Descoberta obrigatória

Legenda de conclusão: **V** = verificado nesta sessão (com origem); **PV** = por verificar (com comando/ensaio). «Impacto» diz o que muda no plano quando a resposta chegar. Cada linha remete para um item `P0-xx`, cujo **responsável** está nomeado no backlog (secção 5).

#### Checkout

| Pergunta | Método (comando/ensaio) | Evidência | Conclusão | Impacto no plano |
|---|---|---|---|---|
| owner/repo, branch, revisão, estado sujo, worktrees | `git remote -v; git rev-parse --abbrev-ref HEAD; git rev-parse HEAD; git status --porcelain; git worktree list` | `descoberta/checkout.md` com saída literal | **PV** · P0-01 | sem revisão não há `code_rev` nas entradas; bloqueia o contrato de registo |
| Entrada do motor e callback de áudio | `Select-String -Path (Get-ChildItem -Recurse -Include *.h,*.cpp) -Pattern 'ma_device\|ma_engine\|ma_device_config\|miniaudio' -List` e seguir o callback até ao grafo | refs `ficheiro:linha` | **PV** · P0-02 | define o alvo de P3-03 e o que «teste pela entrada normal» significa |
| Fronteira motor↔JUCE | procurar onde JUCE chama o motor: `Select-String -Pattern 'juce::\|AudioProcessor\|JUCEApplication' -List` + ler os pontos de contacto | mapa de fronteira | **PV** · P0-02 | decide se `core-headers-publicos` protege o motor, a UI ou ambos |
| Host VST: descoberta, instância, buses, parâmetros, latência, estado | `Select-String -Pattern 'createInstance\|getStateInformation\|setStateInformation\|VST3\|busArrangements\|latency'` | cadeia guardar→restaurar com refs | **PV** · P0-03 | é o alvo do primeiro percurso vertical (secção 8); sem isto a Fase 1 arranca noutro domínio |
| Módulo do plugin distribuído separadamente | localizar o alvo de build do módulo e como o executável o carrega | alvo + mecanismo de carregamento | **PV** · P0-03 | condição do piloto A→B |
| Targets de build e presets | `cmake --list-presets; Get-Content CMakePresets.json; Select-String -Path CMakeLists.txt -Pattern 'add_executable\|add_library\|target_'` | lista de alvos e presets | **PV** · P0-04 | «configuração representativa» do teste de headers vem daqui |
| Testes existentes | `ctest -N` na pasta de build; ler `add_test`/`gtest_discover_tests` | lista de testes registados | **PV** · P0-04 | base do catálogo (P2-09); sem lista não há catálogo |
| Instalador | `Get-ChildItem -Recurse -Include *.iss,*.wxs,*.nsi,*.wixproj` | alvo/ficheiro do instalador | **PV** · P0-04 | Afeta «plugin distribuído separadamente» no piloto VST |
| Gestão de plugins do Core (dos VST, não do Qoder) | procurar descoberta/scan de VST e cache de plugins | refs do scanner | **PV** · P0-03 | atualização A→B pode invalidar cache; caso de teste adicional |
| Scripts reais: comando, pré-requisitos, resultado | `Get-ChildItem -Recurse -Filter *.ps1`; por script ler `param()` e comentário inicial; correr em leitura/`-WhatIf` | tabela script→comando→pré-req→artefacto | **PV** · P0-05 | substitui todos os `tools/rede/*.ps1` propostos por scripts reais quando existirem |
| Bundles e convenções de relatórios | localizar bundles, opções aceites e destino dos relatórios atuais | tabela bundle→opções→relatório | **PV** · P0-06 | oráculos e tolerâncias do catálogo dependem disto |

#### Cliente Qoder

| Pergunta | Método | Evidência | Conclusão | Impacto |
|---|---|---|---|---|
| Desktop, IDE ou CLI? versão? | `qoder --version`; confirmar que aplicação está em uso; ler `%USERPROFILE%\.qoder\settings.json` | versão + captura | **PV** · P0-07 · forma documentada: V20 | decide se a hierarquia usa `Agent(...)` (CLI, V5) ou equipas do IDE (V18) |
| Modelo Qwen disponível e tier | abrir o seletor de modelos, registar nome, `modelId`, taxa | captura do seletor | **PV** · P0-08 · catálogo documentado: V21 | comparabilidade A/B e custo; `model: inherit` vs modelo fixado |
| Onde se configuram agentes, skills, plugin, hooks | `/agents`, `qoder agents list`, `/plugins`, `qoder plugins list --json`, `/memory`; inspecionar `.qoder/` e `%USERPROFILE%\.qoder\` | saída dos comandos | **V** para os caminhos (V3,V4,V7,V14) · **PV** para o conteúdo desta instalação · P0-09 | confirma que o plugin único carrega nos dois entry points |
| Capacidades documentadas vs verificadas | para cada V1..V21, ensaio mínimo na instalação | tabela capacidade→doc→verificada | **PV** · P0-09 | tudo o que ficar «doc only» ganha um passo de verificação antes de ser usado num piloto |
| Composição de equipa exige passos manuais? | IDE: Settings>Agent Team>Create Agent Team (líder + até 4 membros); CLI: `QODER_AGENT_TEAMS=1` e pedir dois teammates | captura + passos | **V** do limite e da imutabilidade do nome (V18) · **PV** nesta instalação · P0-10 | 11 equipas × criação manual é custo real; nomes decididos antes (D-05) |
| Um agente de plugin pode ser membro de equipa do IDE? | criar equipa e tentar selecionar um agente marcado *From Plugin* | captura do picker | **PV** · P0-10 | se não puder, as fichas do plugin são para CLI e o IDE usa cópias locais → duplicação a evitar |
| Auto-update fixado? | `general.enableAutoUpdate: false` + registar versão | settings + versão | **PV** · P0-07 | sem isto, A/B e benchmarks comparam clientes diferentes |

#### Passagem de trabalho

| Pergunta | Método | Evidência | Conclusão | Impacto |
|---|---|---|---|---|
| Uma sessão delega, a equipa recebe contexto, a resposta regressa? | ensaio: coordenador delega a `host` uma pergunta de leitura; `host` responde; coordenador agrega | transcrição + eventos | **PV** · P0-11 · mecanismos documentados: V5, V17, V18 | portão da Fase 1 |
| Que identificador correlaciona os passos? | ligar hooks e inspecionar stdin | JSONL com `session_id`, `agent_id`, `tool_use_id` | **V** campos existem (V10) · **PV** valores reais · P0-11 | chave da base de observação e do dossiê |
| O que sobrevive ao fecho da sessão? | fechar TUI/IDE, abrir sessão nova, pedir a decisão | comparação de refs | **V** que a equipa não sobrevive (V17) · **PV** que os registos bastam · P1-07 | valida a aposta em Git; se falhar, a Fase 2 sobe de prioridade |
| Windows nativo chega, ou é preciso WSL? | tentar a passagem em PowerShell nativo; só avaliar WSL se algo essencial faltar | ensaio + lista de faltas | **V** hooks PowerShell (V11) e cross-session ausente em Windows (V19) | WSL fica adiado (D-11) com condição de ativação explícita |

#### Artefactos de prova

| Artefacto | Método | Conclusão | Mínimo para preencher a lacuna |
|---|---|---|---|
| Projeto pesado para stress do motor | procurar projetos de teste e medir n.º de faixas/plugins | **PV** · P0-13 | um projeto com ≥N faixas e ≥M plugins (N,M fixados pelo Diogo em D-07) + roteiro de reprodução; responsável: Diogo |
| VST3 próprio A e B | localizar builds instaladas e versões | **PV** · P0-13 | duas builds do mesmo plugin com diferença de estado conhecida e `sha256` registado; responsável: host |
| Projeto antigo com automação | abrir na versão anterior e confirmar automação escrita | **PV** · P0-13 | um projeto guardado por versão anterior com automação em ≥2 parâmetros; responsável: Diogo |
| Mockup aprovado para o cenário de UI | localizar ficheiro e aprovação | **PV** · P0-13 | imagem + decisão escrita do que é obrigatório; responsável: Diogo |
| ZIP `Core-Observador-Piloto` | procurar e abrir | **V** ausente neste workspace `[V-obs]` | se aparecer, mapear esquema SQLite para o esquema proposto (P0-16); não bloqueia nada |

#### Ponto de partida (baseline)

| Pergunta | Método | Evidência | Conclusão | Impacto |
|---|---|---|---|---|
| Qual é a tarefa real de referência? | Diogo escolhe uma tarefa já conhecida, pequena, com evidência verificável | `baseline/B-001.md` | **PV** · P0-14 | sem baseline a Fase 5 não tem contrafactual |
| Tempo até primeira evidência, perguntas repetidas, correções, retoma | executar **sem rede**, com hooks já ligados; contar | 4 números + JSONL | **PV** · P0-14 | é a régua do custo de coordenação |

---

## 3. Mapa e inventário

### 3.1 As 11 equipas, os três ministros e o que prova que funcionam

Estrutura do desenho `[D]`: 11 equipas, 23 agentes (Coordenação com 5 perfis, 8 equipas técnicas com 2 perfis, 2 equipas de verificação lideradas pelo scribe e pelo guardião). O investigador global proposto `[P]` eleva para 24 sem criar equipa nova. Os membros adicionais de verificação entram conforme o volume `[D]`.

| Secção / equipa | Ministro | Perfis | Decisão ou entrega | Evidência de que funciona |
|---|---|---|---|---|
| Coordenação | — | `coord`, `comm-geral`, `min-eng`, `min-qua`, `min-reg` | coordenador encaminha e agrega; comunicador preserva intenção, pergunta, destinatário, resposta e condições | a resposta final resolve a pergunta original e permite chegar à fonte |
| Motor C++/miniaudio | Engenharia | `motor`, `motor-comm` | transporte, grafo, buffers, DSP, mistura, workers | mapa do percurso real do áudio, alteração localizada, teste pela entrada normal |
| Host VST | Engenharia | `host`, `host-comm` | descoberta, instanciação, buses, parâmetros, latência, estado, módulo separado | projeto da versão anterior recupera instância, estado e automação |
| Desenvolvimento JUCE/UI | Engenharia | `juce`, `juce-comm` | fluxo musical com componentes, tema, desenho, foco e Undo existentes | percurso utilizável + refs a componentes e comandos |
| QA C++ áudio | Qualidade | `qa-audio`, `qa-audio-comm` | sinal, eventos, fronteiras de bloco, routing, live/export | resultado reproduzível com esperado, obtido, tolerância e configuração |
| QA JUCE/UX | Qualidade | `qa-ux`, `qa-ux-comm` | captura vs mockup + intenção musical com rato e teclado | evidência visual e funcional, incluindo seleção, foco e Undo |
| Debugging JUCE/C++ | Qualidade | `debug`, `debug-comm` | reduzir a falha, comparar hipóteses, tracing, dumps, comparação de sinal | reproducer, condições, causa demonstrada ou experiência discriminante, critério de correção |
| Benchmarks isolados | Qualidade | `bench`, `bench-comm` | comparar builds identificadas, serializar no X3D, registar contaminação | distribuição, pior callback, overruns, duração, n.º de blocos, configuração comparável |
| Pesquisa técnica | Registo | `pesquisa`, `pesquisa-comm` | C++ áudio, miniaudio, JUCE, UX, VST3/VST2 conforme a pergunta | fonte primária com versão, aplicabilidade ao checkout e ensaio mínimo |
| Verificação · Registo (scribe) | Registo | `scribe` (+ membros conforme volume) | mapa canónico das gavetas; diff↔manifesto nos dois sentidos | recuperação por revisão; alteração local, commit e publicação remota distinguidos |
| Verificação · Qualidade (guardião) | Qualidade | `guardiao` (+ membros conforme volume) | catálogo único: identidades, comandos, oráculos, tolerâncias, dependências, limitações | deteta cobertura enfraquecida mesmo com teste verde |
| *Transversal proposto* | reporta a `coord` | `investigador` | observar a organização, identificar uma passagem deficiente, experimentar uma melhoria de skill | caso rastreável, comparação com resultado do produto, proposta fundamentada |

**Onde o desenho choca com o cliente, e a proposta** `[P]`:

- Ministro Qualidade abrange **cinco** equipas. Uma Agent Team do IDE aceita líder + 4 membros (V18) — não cabe. Ministro Engenharia abrange três: cabe. **Proposta:** ministros são perfis de encaminhamento com `Agent(...)` fechado (V5), não contentores. No IDE, a equipa de um ministro contém apenas os comunicadores do seu ramo (que são quem fala), e os especialistas são invocados por delegação. Isto preserva as 11 secções e o «consultar só o ramo necessário».
- Coordenação tem 5 perfis = líder + 4, no limite exato. **O investigador não entra como sexto membro.** Opções em D-04.
- Cada uma das 8 equipas técnicas tem comunicador local dedicado `[D]`, e **todos partilham a mesma missão de comunicação**: uma única skill `core-passagem`, com vocabulário e refs por domínio vindos de `.qoder/rules/rede-<equipa>.md`. Nove comunicadores, uma missão, zero duplicação de skill.

### 3.2 Os 24 perfis

Fichas completas (missão estável, contactos, fontes de leitura, destino de escrita, modelo e dispositivo, ferramentas, entrada, saída, critério de conclusão, pedido de avaliação) em `inventario-agentes.csv`. Resumo:

| Equipa | Perfil | ID público | Ministro | Ferramentas (proposta) | Destino de escrita | Skills | Fase |
|---|---|---|---|---|---|---|---|
| Coordenação | Coordenador | `coord` | — | Read, Grep, Glob, Agent(min-eng,min-qua,min-reg,comm-geral,investigador) | docs/rede/passagens/<task>.md (por comm-geral); docs/rede/decisoes/* (proposta) | core-encaminhamento; core-estado-consulta; core-passagem | 1 |
| Coordenação | Comunicador geral | `comm-geral` | — | Read, Grep, Glob, Write, Edit (só docs/rede/passagens e logs/coordenacao) | docs/rede/passagens/<task>.md; logs/coordenacao/<wt>.jsonl | core-passagem; core-registo; core-evidencia | 1 |
| Coordenação | Ministro Engenharia | `min-eng` | — | Read, Grep, Glob, Agent(motor,motor-comm,host,host-comm,juce,juce-comm) | seccoes/{motor,host,juce}.md (append de ponto) | core-encaminhamento; core-estado-consulta; core-registo | 1 |
| Coordenação | Ministro Qualidade | `min-qua` | — | Read, Grep, Glob, Agent(qa-audio,qa-audio-comm,qa-ux,qa-ux-comm,debug,debug-comm,bench,bench-comm,guardiao) | seccoes/{qa-audio,qa-ux,debugging,benchmarks,guardiao}.md (append) | core-encaminhamento; core-estado-consulta; core-registo | 2 |
| Coordenação | Ministro Registo | `min-reg` | — | Read, Grep, Glob, Agent(pesquisa,pesquisa-comm,scribe) | seccoes/{pesquisa,scribe}.md (append) | core-encaminhamento; core-estado-consulta; core-registo | 2 |
| Motor C++/miniaudio | Especialista Motor | `motor` | min-eng | Read, Grep, Glob, Bash(build/test allowlist), Write, Edit (módulo motor) | código do módulo motor; logs/motor/<wt>.jsonl | core-motor-mapa-audio; core-motor-rt; core-evidencia | 3 |
| Motor C++/miniaudio | Comunicador Motor | `motor-comm` | min-eng | Read, Grep, Glob, Write, Edit (só docs/rede/logs/motor e passagens) | logs/motor/<wt>.jsonl; passagens/<task>.md (secção Motor); pedidos de estado | core-passagem; core-registo; core-evidencia | 3 |
| Host VST | Especialista Host | `host` | min-eng | Read, Grep, Glob, Bash(build/test), Write, Edit (módulo host) | código do módulo host; logs/host/<wt>.jsonl | core-host-estado; core-vst3-automacao; core-evidencia | 1 |
| Host VST | Comunicador Host | `host-comm` | min-eng | Read, Grep, Glob, Write, Edit (só logs/host e passagens) | logs/host/<wt>.jsonl; passagens/<task>.md (secção Host) | core-passagem; core-registo; core-evidencia | 1 |
| Desenvolvimento JUCE/UI | Especialista JUCE | `juce` | min-eng | Read, Grep, Glob, Bash(build), Write, Edit (módulo UI) | código do módulo UI; logs/juce/<wt>.jsonl | core-juce-fluxo; core-evidencia | 4 |
| Desenvolvimento JUCE/UI | Comunicador JUCE | `juce-comm` | min-eng | Read, Grep, Glob, Write, Edit (só logs/juce e passagens) | logs/juce/<wt>.jsonl; passagens/<task>.md (secção JUCE) | core-passagem; core-registo; core-evidencia | 4 |
| QA C++ áudio | Especialista QA Áudio | `qa-audio` | min-qua | Read, Grep, Glob, Bash(ctest/bundles), Write, Edit (testes áudio) | testes do domínio áudio; logs/qa-audio/<wt>.jsonl; evidencia/<run>/ | core-qa-audio; core-guardiao-catalogo (leitura); core-evidencia | 3 |
| QA C++ áudio | Comunicador QA Áudio | `qa-audio-comm` | min-qua | Read, Grep, Glob, Write, Edit (só logs/qa-audio e passagens) | logs/qa-audio/<wt>.jsonl; passagens/<task>.md (secção QA Áudio) | core-passagem; core-registo; core-evidencia | 3 |
| QA JUCE/UX | Especialista QA UX | `qa-ux` | min-qua | Read, Grep, Glob, Bash(captura), Write, Edit (evidência UX) | checklists/capturas de UX; logs/qa-ux/<wt>.jsonl; evidencia/<run>/ | core-qa-ux; core-evidencia | 4 |
| QA JUCE/UX | Comunicador QA UX | `qa-ux-comm` | min-qua | Read, Grep, Glob, Write, Edit (só logs/qa-ux e passagens) | logs/qa-ux/<wt>.jsonl; passagens/<task>.md (secção QA UX) | core-passagem; core-registo; core-evidencia | 4 |
| Debugging JUCE/C++ | Especialista Debugging | `debug` | min-qua | Read, Grep, Glob, Bash(tracing/dumps), Write, Edit (reproducers) | reproducers e diagnósticos; logs/debugging/<wt>.jsonl; evidencia/<run>/ | core-debug-reducao; core-evidencia | 3 |
| Debugging JUCE/C++ | Comunicador Debugging | `debug-comm` | min-qua | Read, Grep, Glob, Write, Edit (só logs/debugging e passagens) | logs/debugging/<wt>.jsonl; passagens/<task>.md (secção Debugging) | core-passagem; core-registo; core-evidencia | 3 |
| Benchmarks isolados | Especialista Benchmarks | `bench` | min-qua | Read, Grep, Glob, Bash(scripts de bench), Write, Edit (evidência bench) | resultados de bench; logs/benchmarks/<wt>.jsonl; evidencia/<run>/ | core-bench-x3d; core-evidencia | 3 |
| Benchmarks isolados | Comunicador Benchmarks | `bench-comm` | min-qua | Read, Grep, Glob, Write, Edit (só logs/benchmarks e passagens) | logs/benchmarks/<wt>.jsonl; passagens/<task>.md (secção Benchmarks) | core-passagem; core-registo; core-evidencia | 3 |
| Pesquisa técnica | Especialista Pesquisa | `pesquisa` | min-reg | Read, Grep, Glob, WebSearch, WebFetch, Write, Edit (só pesquisa e logs) | docs/rede/pesquisa/<tema>.md; logs/pesquisa/<wt>.jsonl | core-pesquisa-primaria; core-evidencia | 2 |
| Pesquisa técnica | Comunicador Pesquisa | `pesquisa-comm` | min-reg | Read, Grep, Glob, Write, Edit (só logs/pesquisa e passagens) | logs/pesquisa/<wt>.jsonl; passagens/<task>.md (secção Pesquisa) | core-passagem; core-registo | 2 |
| Verificação Registo | Scribe | `scribe` | min-reg | Read, Grep, Glob, Bash(git leitura/commit), Write, Edit (docs/rede governado) | docs/rede/mapa.md; ESTADO.md (escritor único serializado); selos; logs/scribe/<wt>.jsonl | core-scribe-verifica; core-registo; core-estado-consulta | 2 |
| Verificação Qualidade | Guardião | `guardiao` | min-qua | Read, Grep, Glob, Bash(ctest/bundles), Write, Edit (catálogo e logs) | docs/rede/catalogo-testes.md; logs/guardiao/<wt>.jsonl | core-guardiao-catalogo; core-headers-publicos; core-evidencia | 2 |
| Transversal (proposto) | Investigador global | `investigador` | reporta a coord | Read, Grep, Glob, Bash(core-obs/core-indice), Write, Edit (só investigacao) | docs/rede/investigacao/** apenas; sem escrita no produto | core-investigador-ab; core-observador; core-estado-consulta | 5 |

### 3.3 Skills do plugin único `core`

24 skills públicas, todas com prefixo `core-` `[P]` (D-05). Classificação pedida pelo brief: declarativa, comando executável, conector ou hook.

| Skill pública | Tipo | Existe no Qoder? | Reutilização / origem | Comando ou script alvo | Quem usa | Fase |
|---|---|---|---|---|---|---|
| `core-arranque` | comando executável (hook SessionStart + skill) | não | nova; usa additionalContext do hook SessionStart | tools/rede/arranque.ps1 (proposto) | todos (via hook) | 1 |
| `core-passagem` | declarativa | não | nova; missão de comunicação única partilhada pelos 9 comunicadores | — | comm-geral + 8 comunicadores locais | 1 |
| `core-registo` | declarativa + contrato de formato | não | nova | — | comm-*; scribe; guardiao; min-* | 1 |
| `core-encaminhamento` | declarativa | não | nova; tabela de secções + regra do ramo mínimo | — | coord; min-eng; min-qua; min-reg | 1 |
| `core-estado-consulta` | comando executável | não | nova; encapsula script da rede | tools/rede/estado-atual.ps1 -Assunto <glob> (proposto) | coord; min-*; investigador; scribe | 1 |
| `core-evidencia` | declarativa | não | nova | — | todos os perfis que produzem evidência | 1 |
| `core-motor-mapa-audio` | declarativa + comando | não (Explore existe como subagent built-in) | reutiliza Explore para leitura; acrescenta método de traçado do callback | tools/rede/trace-audio.ps1 (proposto; ou scripts existentes) | motor; debug; qa-audio | 3 |
| `core-motor-rt` | declarativa | não | nova; regras de tempo real (sem alocação/locks no callback), workers e buffers | — | motor; debug | 3 |
| `core-host-estado` | declarativa + comando | não | nova; encapsula scripts de build/arranque do host existentes | scripts do checkout (por verificar) | host; qa-audio; juce | 1 (leitura) / 4 (ensaio) |
| `core-vst3-automacao` | comando executável | não | nova; encapsula ensaio A→B | tools/rede/ensaio-vst-ab.ps1 (proposto) | host; qa-audio; qa-ux | 4 |
| `core-juce-fluxo` | declarativa | não | nova; inventário de componentes, tema, foco e Undo existentes | — | juce; qa-ux | 4 |
| `core-qa-audio` | comando executável | não | nova; encapsula bundles/ctest existentes | bundles do checkout + ctest (por verificar) | qa-audio; motor; host | 3 |
| `core-qa-ux` | comando + declarativa | não (canvas é built-in, candidato a apoio visual) | nova; quatro camadas: contrato estrutural (core-ui-contrato), árvore em runtime (Melatonin Inspector, candidato), captura vs mockup, percurso rato/teclado | tools/rede/captura-ux.ps1 (proposto) | qa-ux; juce | 4 |
| `core-debug-reducao` | declarativa + comando | não | nova; método de redução e experiência discriminante | scripts de tracing/dumps existentes (por verificar) | debug; motor; host; juce | 3 |
| `core-bench-x3d` | comando executável | não | nova; encapsula scripts de bench e serializa corridas | scripts de bench do checkout (por verificar) | bench | 3 |
| `core-pesquisa-primaria` | declarativa | parcial (WebSearch/WebFetch são ferramentas built-in) | reutiliza ferramentas built-in; acrescenta exigência de fonte primária + versão + ensaio | — | pesquisa; min-reg | 2 |
| `core-scribe-verifica` | comando executável | não | nova | tools/rede/registo-verifica.ps1 e registo-sela.ps1 (propostos) | scribe | 2 |
| `core-guardiao-catalogo` | comando executável | não | nova | tools/rede/catalogo-verifica.ps1 (proposto) | guardiao; qa-audio; bench | 2 |
| `core-headers-publicos` | comando executável (teste) | não | nova; alvo de teste no build system existente | ctest -R core-headers-publicos (proposto) | guardiao; dono do módulo; min-eng | 2 |
| `core-observador` | comando executável | não (ZIP Core-Observador-Piloto é protótipo, não disponível aqui) | reutilizar esquema SQLite do protótipo se aparecer; JSONL é a origem canónica | tools/rede/obs-ingere.ps1 e obs-painel.ps1 (propostos) | investigador; coord; scribe | 0 (mínimo) / 5 (completo) |
| `core-investigador-ab` | declarativa + comando | não | nova | tools/rede/ab-compara.ps1 (proposto) | investigador | 5 |
| `core-baseline` | comando executável | não | nova; usa o mesmo esquema de eventos da rede | tools/rede/baseline-regista.ps1 (proposto) | coord; comm-geral; investigador | 0 |
| `core-jive-ui` | declarativa + comando | não | nova; convenções de markup JIVE 2.0 (XML+JSON), tokens, templates, pseudo-classes com dois pontos, checklist de migração 1.x→2.0 | jive_sources() no CMake do Core + scripts de build existentes (por verificar) | juce; qa-ux | 4 (condicional a D-14) |
| `core-ui-contrato` | comando executável (teste) | não | nova; análogo de core-headers-publicos para a interface | ctest -R core-ui-contrato (proposto); tools/rede/ui-contrato.ps1 | guardiao; juce; qa-ux | 2 (condicional a D-14) |

**Política de ativação** `[P]` — o risco não é a qualidade da resposta, é a skill errada ser escolhida:

1. **Fase 1 usa 6 skills transversais** (`core-arranque`, `core-passagem`, `core-registo`, `core-encaminhamento`, `core-estado-consulta`, `core-evidencia`). Nessa fase o Host trabalha a partir da **ficha** e da regra de domínio; `core-host-estado` entra em modo só-leitura como apoio opcional e a sua parte executável só na Fase 4. As restantes skills entram com a equipa que precisa delas.
2. Cada `description` contém uma **frase de disparo própria** e um contra-exemplo («não usar para X»). Descrições parecidas são a causa mais provável de ativação falhada.
3. **Teste obrigatório por skill (P1-05, repetido em P3-01 e P4-02):** fazer uma pergunta que **omite o nome** da skill; depois repetir com `/nome`. Registar em quatro colunas: explícita OK / automática OK / qualidade da resposta / classificação. **Se a explícita resulta e a automática falha, o problema é de ativação e entra em fila separada** — não se «melhora a skill» para resolver um problema de descrição.
4. O que tem de ser **inevitável** não fica dependente de ativação: contrato de registo e fronteiras de escrita são aplicados por **hooks** e por **regras `glob`**, não por boa vontade do modelo (V13, V16).
5. **Conectores MCP: nenhum na Fase 1.** Nada no primeiro percurso precisa de serviço externo; MCP acrescenta superfície de permissões e de falha. Entra só se um piloto mostrar necessidade concreta (por exemplo, um leitor de projetos da DAW).
6. **Reutilização externa** (`npx skills add … -a qoder`, V7) fica disponível mas não é usada no arranque: skills de terceiros aumentam a ambiguidade de ativação e não são verificadas por nós.

### 3.4 Ferramentas, comandos e hooks por tipo de perfil

| Tipo de capacidade | O que é | Onde se declara | Nota verificada |
|---|---|---|---|
| Ferramentas de leitura | `Read`, `Grep`, `Glob` | `tools:` da ficha | todos os perfis as têm |
| Ferramentas de escrita | `Write`, `Edit` | `tools:` + guarda `PreToolUse` por `agent_type` | a lista da ficha não basta: a fronteira real é o hook (V10, V13) |
| Execução | `Bash` (com `shell: powershell` nos hooks) | `tools:` + `permissions.allow` com padrões de comando | em Windows, `.bat`/`.cmd` exigem `cmd.exe /c` na forma exec (V11) |
| Delegação | `Agent(nome, nome, …)` | `tools:` da ficha | documentado no CLI (V5); **por verificar no IDE** |
| Investigação externa | `WebSearch`, `WebFetch` | `tools:` de `pesquisa` | só `pesquisa`; os outros perfis pedem a `pesquisa` |
| Comandos públicos | `/core-…` | `commands/*.md` do plugin | slash commands são do utilizador; não substituem a ativação automática |
| Hooks | 6 eventos na Fase 0; +`Stop`, `PreToolUse`, `InstructionsLoaded`, `PreCompact`/`PostCompact` na Fase 2 | `hooks/hooks.json` do plugin + `.qoder/settings.json` | IDE corre 12 eventos e só `command`/`http`; CLI corre 23 e quatro tipos (V8, V9, V12) |
| Conectores | MCP | `.mcp.json` do plugin | vazio na Fase 1 `[P]` |

### 3.5 Registos e gavetas — árvore proposta, sujeita a D-02

`[P]` Tudo o que está sob `docs/rede/` é **proposta de caminho**, não caminho observado. O Diogo aprova a árvore; enquanto não aprovar, a Fase 1 escreve em `docs/rede/` apenas com autorização explícita para o efeito (P1-06).

```
<raiz do checkout>
├─ AGENTS.md                        # [D] existente? por verificar. Acrescentar secção «Rede» (append)
├─ .gitattributes                   # docs/rede/** merge=union   [P]
├─ .gitignore                       # docs/rede/indice/          [P]
├─ .qoder/
│  ├─ settings.json                 # permissões + enabledPlugins (commitável)
│  ├─ settings.local.json           # exceções desta máquina (gitignore)
│  └─ rules/
│     ├─ rede-nucleo.md             # trigger: always_on, curto: como consultar estado e registar
│     └─ rede-<equipa>.md           # trigger: glob nos caminhos do domínio
├─ tools/qoder/core/                # FONTE do plugin único (versionada)
│  ├─ .qoder-plugin/plugin.json
│  ├─ agents/*.md                   # 24 fichas
│  ├─ skills/<nome>/SKILL.md        # 22 skills
│  ├─ commands/*.md
│  └─ hooks/hooks.json
├─ tools/rede/*.ps1                 # scripts da rede; reutilizar os do Core quando existirem
└─ docs/rede/                       # ÁRVORE GOVERNADA · append-only por entrada
   ├─ ESTADO.md                     # afirmações duráveis + origem; escritor único serializado
   ├─ mapa.md                       # mapa canónico das gavetas (scribe)
   ├─ catalogo-testes.md            # catálogo único (guardião)
   ├─ seccoes/<sec>.md              # 11 pontos de secção, com revisão e momento
   ├─ logs/<equipa>/<worktree>.jsonl  # log por equipa E por worktree (sem contenção)
   ├─ passagens/<task_id>.md        # dossiê da passagem (comunicador)
   ├─ decisoes/D-xxx.md             # decisões do Diogo
   ├─ pesquisa/<tema>.md
   ├─ investigacao/**               # único destino de escrita do investigador
   ├─ baseline/B-001.md
   ├─ evidencia/<run_id>/**         # artefactos imutáveis: wav, csv, capturas, dumps, logs
   └─ indice/                       # RECONSTRUÍVEL, não governado, fora do Git
```

| Gaveta | Regime | Escritor | Quem lê |
|---|---|---|---|
| `ESTADO.md` | append-only por entrada; última entrada por assunto substitui a anterior | **scribe apenas**, por fila serializada | todos |
| `seccoes/*.md` | append-only | ministro da secção | coord, ministros, investigador |
| `logs/<equipa>/<wt>.jsonl` | append-only, particionado por worktree | comunicador da equipa + hooks | scribe, guardião, investigador |
| `passagens/<task>.md` | append-only | comunicador (geral e local) | todos |
| `mapa.md`, `catalogo-testes.md` | append-only por entrada; vista corrente = fold | scribe / guardião | todos |
| `decisoes/*.md` | append-only; decisão nova substitui, nunca reescreve | Diogo (via scribe) | todos |
| `evidencia/<run_id>/**` | **imutável** depois de selado | quem produziu a evidência | todos |
| `indice/` | descartável e reconstruível | scripts | scripts |
| código do produto, testes, fixtures, mockups | **mutável, legitimamente** | dono do módulo | todos |

**Âmbito do invariante (pedido explícito do brief).** Append-only aplica-se **aos registos governados**, não ao produto. Uma classe C++ nova, um fixture novo ou um mockup novo são alterações legítimas e normais. O que o invariante proíbe é reescrever ou apagar **afirmações, evidência e decisões**. Regra prática de uma linha para as fichas: *«escreve à vontade no produto dentro da tua gaveta; em `docs/rede/` só acrescentas»*.

### 3.6 Permissões por perfil `[P]`

Aplicadas em três camadas, da mais fraca para a mais forte: `tools:` da ficha → `permissions.allow/deny/ask` do projeto → hook `PreToolUse` com `agent_type`. A terceira é a que vale: `deny` é avaliado primeiro (V15) e o hook é determinístico (V13). **`permissionMode` por ficha não conta** para agentes de plugin (V24): o modo é definido na sessão/projeto, e a fronteira real é o hook.

| Perfil | Ler | Escrever | Executar | Delegar | Proibido |
|---|---|---|---|---|---|
| `coord`, `min-*` | todo o repo + registos | nada diretamente (pedem ao comunicador/scribe) | leitura de estado | lista fechada do seu ramo | escrever código; `git push` |
| comunicadores (9) | registos + código em leitura | `logs/<sua equipa>/`, `passagens/` | `registo-novo`, `estado-atual` | — | escrever código; escrever noutro log |
| `motor`, `host`, `juce` | tudo em leitura | módulo do seu domínio + testes desse domínio | build/test allowlist | `Agent(<seu comm>)` | tocar noutro módulo; `git push`; `bypass_permissions` |
| `qa-audio`, `qa-ux`, `debug` | tudo em leitura | testes, reproducers, evidência | `ctest`, bundles, tracing | `Agent(<seu comm>)` | alterar código de produto para «fazer passar» |
| `bench` | tudo em leitura | evidência de bench | scripts de bench, **janela isolada** | `Agent(bench-comm)` | builds/profiling durante a medição |
| `pesquisa` | tudo + web | `pesquisa/`, seu log | — | `Agent(pesquisa-comm)` | apresentar fonte secundária como primária |
| `scribe` | tudo | toda a árvore governada | `git` leitura + `commit` | `Agent(<membros de verificação>)` | `git push` sem decisão do Diogo; apagar entradas |
| `guardiao` | tudo | `catalogo-testes.md`, seu log | `ctest`, bundles, teste de headers | `Agent(<membros>)` | reduzir tolerância sem decisão escrita |
| `investigador` | **todos os logs e eventos** | `investigacao/**` apenas | `obs-*`, `indice-*` | — | escrever no produto; alterar skills durante um A/B em curso |

Nenhum perfil recebe `bypass_permissions` na árvore do produto `[P]`. As sessões de verificação em sessão nova correm `--permission-mode dont_ask` com allowlist de leitura, porque em headless `ask` se converte em `deny` (V15) — o que é exatamente o comportamento desejado: ou lê, ou falha visivelmente.

### 3.7 Duas fichas completas, como modelo de redação

#### Ficha completa · `host` (Especialista Host, equipa Host VST)

| Campo | Conteúdo |
|---|---|
| Missão estável | Descoberta, instanciação, buses, parâmetros, latência, estado e integração do plugin distribuído separadamente. |
| Contactos | host-comm; min-eng; qa-audio; juce |
| Fontes de leitura | código do host (por verificar); seccoes/host.md; catalogo-testes.md |
| Destino de escrita | código do módulo host; logs/host/<wt>.jsonl |
| Modelo e dispositivo | Qwen4-Max-Preview · effort: high · DEV Windows |
| Ferramentas | Read, Grep, Glob, Bash(build/test), Write, Edit (módulo host) |
| Skills | core-host-estado; core-vst3-automacao; core-evidencia |
| Entrada | Pergunta sobre estado/automação ou atualização A→B |
| Saída | Percurso de estado identificado + ensaio abrir/editar/guardar/recuperar |
| Critério de conclusão | Projeto da versão anterior recupera instância, estado e automação, ou bloqueio explícito |
| Pedido de avaliação | Que parte do estado não é coberta por teste? |

#### Ficha completa · `guardiao` (Guardião, equipa Verificação Qualidade)

| Campo | Conteúdo |
|---|---|
| Missão estável | Manter catálogo único com identidades, comandos, oráculos, tolerâncias, dependências e limitações. |
| Contactos | min-qua; qa-audio; qa-ux; bench; scribe; Diogo |
| Fontes de leitura | catalogo-testes.md; bundles; fixtures; evidencia/*; git diff |
| Destino de escrita | docs/rede/catalogo-testes.md; logs/guardiao/<wt>.jsonl |
| Modelo e dispositivo | Qwen4-Max-Preview · effort: high · DEV Windows |
| Ferramentas | Read, Grep, Glob, Bash(ctest/bundles), Write, Edit (catálogo e logs) |
| Skills | core-guardiao-catalogo; core-headers-publicos; core-evidencia |
| Entrada | Diff, catálogo, resultados |
| Saída | Parecer de cobertura + exigência de execução pertinente |
| Critério de conclusão | Deteta cobertura enfraquecida mesmo com teste verde; hash é pista, não prova |
| Pedido de avaliação | Que contrato ficou mais fraco sem ninguém notar? |

### 3.8 Matriz de modelos por perfil

**Modelos escolhidos pelo Diogo (2026-11-20)** `[D]`: **Qwen4-Max-Preview**, **Qwen3.8-Flash** e o tier **Efficient** para trabalho pequeno. Atribuição proposta por perfil, com esforço de raciocínio:

| Perfil | Modelo | Effort | Justificação |
|---|---|---|---|
| `coord` | Qwen4-Max-Preview | medium | Preserva a intenção e agrega; um erro aqui perde condições para toda a rede. |
| `comm-geral` | Efficient (tier) | low | Transcrição com contrato fixo, verificada por validador e hook Stop. |
| `min-eng` | Qwen4-Max-Preview | high | Juízo de arquitetura e de fronteira entre módulos. |
| `min-qua` | Qwen4-Max-Preview | medium | Juízo sobre validade de prova e suficiência de cobertura. |
| `min-reg` | Qwen3.8-Flash | medium | Encaminhamento de pesquisa e recuperação; o juízo vive no catálogo e no mapa. |
| `motor` | Qwen4-Max-Preview | high | DSP, tempo real e causalidade; erros são caros e silenciosos. |
| `motor-comm` | Efficient (tier) | low | Transcrição de condições e run_id com contrato fixo. |
| `host` | Qwen4-Max-Preview | high | Estado, automação e compatibilidade de projetos antigos. |
| `host-comm` | Efficient (tier) | low | Transcrição de versões A/B e projeto usado. |
| `juce` | Qwen3.8-Flash | medium | Markup JIVE e componentes existentes: trabalho de estrutura, não de juízo profundo. |
| `juce-comm` | Efficient (tier) | low | Transcrição de refs visuais e funcionais. |
| `qa-audio` | Qwen3.8-Flash | medium | Testes com oráculo e tolerância já dados pelo catálogo. |
| `qa-audio-comm` | Efficient (tier) | low | Transcrição de esperado/obtido/tolerância/config. |
| `qa-ux` | Qwen3.8-Flash | medium | Checklist e comparação; o contrato de UI é script, não modelo. |
| `qa-ux-comm` | Efficient (tier) | low | Transcrição de capturas e passos. |
| `debug` | Qwen4-Max-Preview | high | Hipóteses discriminantes e demonstração de causa. |
| `debug-comm` | Efficient (tier) | low | Transcrição de hipóteses e exclusões. |
| `bench` | Qwen3.8-Flash | medium | Protocolo fixo e serialização; interpretação de resultados escala para Max. |
| `bench-comm` | Efficient (tier) | low | Transcrição de build, janela e contaminação. |
| `pesquisa` | Qwen3.8-Flash | medium | Fonte primária, versão e aplicabilidade; síntese. |
| `pesquisa-comm` | Efficient (tier) | low | Transcrição de URL, versão e data. |
| `scribe` | Qwen4-Max-Preview | medium | Verificação bidirecional exige decidir o que é governado. |
| `guardiao` | Qwen4-Max-Preview | high | Detetar cobertura enfraquecida é juízo, não correspondência de padrões. |
| `investigador` | Qwen4-Max-Preview | high | Validade de comparação, desenho de A/B e leitura de casos. |

**Como se aplica** `[P]` — três mecanismos, por ordem de preferência:

1. `model:` e `effort:` no frontmatter da ficha. `[V-doc]` O campo `model` aceita **nome de modelo ou alias**; os valores comuns documentados incluem `inherit`, `auto`, `lite`, `efficient`, `performance`; `effort` aceita `low`, `medium`, `high`, `xhigh`, `max` ou inteiro ([cli/subagent](https://docs.qoder.com/cli/subagent)). Portanto **`model: efficient` é aplicável por perfil**, não só pela conversa.
2. `agents.overrides.<nome>.modelConfig.model` em `.qoder/settings.local.json`, para ajustar por máquina **sem editar a ficha** (V23).
3. `model: inherit` apenas onde se quer que o perfil siga a conversa — não é o caso desta rede, porque comparabilidade exige modelo declarado.

**Cuidados verificáveis:**

- Os aliases `lite` e `performance` aparecem na documentação, mas o índice oficial lista notas de **remoção do tier Lite** e de **renomeação Performance→Fast**. `[PV]` Confirmar no seletor (P0-08) antes de usar; `efficient` e `auto` são os seguros.
- O nome exato no dispositivo é autoridade: a documentação lista «Qwen4-Max», o Diogo indica «Qwen4-Max-Preview». Registar a **string exata e o modelId** do seletor em P0-08; um modelo *preview* pode mudar ou desaparecer, e isso quebra comparabilidade tal como um auto-update do cliente.
- **Escalada declarada:** qualquer perfil pode ser temporariamente elevado a Qwen4-Max-Preview quando a tarefa exigir juízo arquitetural ou causal (por exemplo `bench` a interpretar uma distribuição anómala, ou `qa-audio` a desenhar um oráculo novo). A escalada faz-se por `agents.overrides`, **fica registada no dossiê e no evento**, e é **proibida durante um ensaio A/B** — mudaria uma constante do ensaio.
- **Custo:** chamadas de sub-agentes são faturadas separadamente (V21). Os 9 comunicadores em Efficient são a maior alavanca (9 de 24 perfis) e o risco é coberto por verificação determinística: validador de blocos + hook `Stop` bloqueante. Se a promoção de Efficient terminar, o custo volta a 0.1× — reavaliar em P1-10.


---

## 4. Desenho técnico dos pacotes A–D

Esta secção existe para que o backlog seja executável sem o Diogo voltar a explicar a organização. Os blocos de código são **especificação a criar na implementação**, não configuração já aplicada.

### 4.1 Pacote A · Plugin único e configuração dos perfis

**Fonte versionada do plugin** `[P]` em `tools/qoder/core/`, instalada no projeto. Layout conforme V3:

```jsonc
// tools/qoder/core/.qoder-plugin/plugin.json   (a criar)
{
  "name": "core",
  "version": "0.1.0",
  "description": "Rede de equipas do Core: coordenação, engenharia, qualidade e registo.",
  "author": "Diogo",
  "keywords": ["core", "audio", "juce", "vst3", "daw"]
}
```

```powershell
# instalação e verificação (a correr na implementação, no dispositivo do Diogo)
qoder plugins install .\tools\qoder\core --scope project
qoder plugins list --json          # esperar core, scope project, versão 0.1.0
qoder agents list                  # esperar as fichas do slice, sem «shadowed» inesperado
# no TUI: /plugins reload   ·   /agents reload   ·   /memory
```

**Contrato da ficha.** Dez campos obrigatórios + pedido de avaliação (secção 3.7). O frontmatter é o que o cliente aplica; o corpo é o que o modelo lê. **Atenção (V24):** em agentes fornecidos por plugin, `hooks`, `mcpServers` e `permissionMode` são removidos — por isso **não aparecem neste exemplo**. O modo de permissão vem do projeto e da sessão; as fronteiras vêm dos hooks globais. `model`, `effort`, `tools`, `maxTurns`, `timeoutMins` e `isolation: worktree` mantêm-se.

```markdown
---
name: host
description: >
  Percurso de estado do Host VST do Core: descoberta, instanciação, buses, parâmetros,
  latência e restauro de estado/automação. Usar quando a pergunta é «o que se perde ao
  atualizar um plugin» ou «onde é guardado o estado». Não usar para desenho de UI.
tools: [Read, Grep, Glob, Bash, Write, Edit, Agent(host-comm)]
disallowedTools: []
model: Qwen4-Max-Preview      # nome exato a confirmar no seletor (P0-08)
effort: high
maxTurns: 24
timeoutMins: 20
---
Missão estável · Contactos · Fontes de leitura · Destino de escrita · Modelo e dispositivo ·
Entrada · Saída · Critério de conclusão · Pedido de avaliação
```

**Crescimento da rede, condicionado a demonstração** `[D]`: só se criam mais equipas **depois** de a delegação entre duas estar demonstrada (P0-11 → P1-06 → P1-07). Ordem de entrada: Coordenação+Host (F1) → Scribe+Guardião (F2) → Motor+QA Áudio+Debugging+Benchmarks (F3) → JUCE+QA UX (F4) → Pesquisa (F2, quando a primeira pergunta externa aparecer) → Investigador (instrumentado desde F0, análise em F5).

**Custo de contexto** `[P]`: `core-arranque` injeta apenas (a) o índice de assuntos com a última afirmação por assunto da secção ativa e (b) as regras da secção. Nunca injeta o `ESTADO.md` inteiro. Regras de domínio são `glob` (V16), portanto o vocabulário de DSP não é carregado numa tarefa de UI.

### 4.2 Pacote B · Estado durável, concorrência, selo, retoma e custo

Os quatro casos do brief ficam resolvidos **antes** de escrever scripts.

#### (i) Âmbito

Já fixado em 3.5: append-only nos registos governados; produto mutável. Uma alteração legítima ao produto **não** precisa de reescrever registos, precisa de **acrescentar** uma entrada que descreva o que mudou e com que evidência.

#### (ii) Formato de entrada e identidade estável

Uma entrada é um bloco Markdown terminado por um sentinela, escrito num **único** append:

```markdown
### [E-20261120-main-0142] assunto=host.estado.restauro
- quando: 2026-11-20T14:32:11+00:00
- autor: host-comm
- tarefa: T-20261120-main-01 · passagem: P-20261120-main-01 · run: R-20261120-main-07
- code_rev: 9f3c1ab (dirty: não) · worktree: main
- afirmação: O restauro de estado passa por <ficheiro:linha>; a automação é lida em <ficheiro:linha>.
- evidência: docs/rede/evidencia/R-20261120-main-07/estado-compara.csv
- condições: build=RelWithDebInfo sha256:… · sr=48000 · buffer=256 · device=WASAPI partilhado
- substitui: E-20261119-main-0088
- publicação: local            # local | commit | publicado (preenchido pelo selo)
<!-- /E-20261120-main-0142 -->
```

**Esquema de IDs, estável antes da integração** `[P]`: `<tipo>-<YYYYMMDD>-<worktree>-<seq>`, com `tipo ∈ {T,P,E,R}`. O identificador de worktree é criado uma vez em `$(git rev-parse --git-dir)/core-wt-id` (6 caracteres aleatórios; `main` na árvore principal) — é local, não versionado, e **não colide entre worktrees**. Não há alocador central, portanto não há ponto de contenção para criar identidade. Depois da integração, cada referência lógica ganha uma referência física imutável: `commit:caminho#Lx-Ly`. **As duas vivem juntas**: a lógica sobrevive a renomeações, a física prova o que foi visto.

#### (iii) Concorrência — quem serializa e como se recupera

| Ficheiro | Estratégia | Porquê |
|---|---|---|
| `logs/<equipa>/<wt>.jsonl` | **partição por equipa e worktree** | o caminho quente não tem contenção nenhuma: dois agentes em duas worktrees escrevem em ficheiros diferentes |
| `passagens/<task>.md` | um escritor por passagem (o comunicador dono) | a passagem tem dono único por construção |
| `seccoes/<sec>.md` | um escritor por secção (o ministro) | idem |
| `ESTADO.md`, `mapa.md`, `catalogo-testes.md` | **escritor único (scribe/guardião) alimentado por fila** + lock | são os únicos ficheiros verdadeiramente comuns |

Mecanismo do lock, em PowerShell nativo `[P]`: criação **atómica** de ficheiro (`New-Item -ErrorAction Stop` falha se já existir), com retry e jitter; o conteúdo guarda PID + instante; um lock com PID morto ou idade > limite é recuperado automaticamente e a recuperação fica registada. Os outros perfis não escrevem em `ESTADO.md`: acrescentam um pedido de estado ao **seu** log; o scribe faz o fold numa passagem single-thread. Assim, «quem serializa» tem resposta nominal (scribe) e mecânica (lock), e a fila é durável — se o scribe morrer, os pedidos continuam nos logs.

Integração em Git `[P]`: `.gitattributes` com `docs/rede/** merge=union`. Consequência honesta: **union pode intercalar dois blocos** se ambos os lados acrescentaram no mesmo ponto. Mitigação em três partes: (1) cada entrada é escrita num único append com sentinela de fim; (2) o validador verifica emparelhamento `### [E-…]` ↔ `<!-- /E-… -->`, unicidade de ID e cadeia `substitui`; (3) a reparação **reordena blocos inteiros por (quando, ID)**, nunca apaga conteúdo. Um conflito deixa de ser «perder entradas» e passa a ser «reordenar blocos», com prova automática.

#### (iv) Revisão do próprio registo — selo em duas fases

O brief põe o problema certo: um commit não pode conter antecipadamente o seu próprio hash. Solução `[P]`:

1. A entrada nasce com `code_rev` = revisão do **código observado** (conhecida nesse momento) e `publicação: local`.
2. **Commit A** publica entradas + evidência.
3. O scribe corre `registo-sela`: lê `git rev-parse HEAD` (= A) e **acrescenta uma entrada de selo** que liga cada ID a `A:caminho#Lx-Ly`, marcando `publicação: commit`.
4. **Commit B** publica os selos. Nenhum commit contém o próprio hash.
5. `publicação: publicado` só quando `git branch -r --contains A` confirma o remoto. Os três estados são **colunas distintas**, nunca um booleano «está em Git».

Entradas sem selo aparecem no painel como **publicação atrasada** — é um estado visível, não um erro silencioso.

#### (v) Retoma e custo

`[P]` **Origem canónica = ficheiros append-only.** O índice (`docs/rede/indice/estado.sqlite`) é reconstruível e descartável.

- Tabela `entradas(id, assunto, quando, autor, tarefa, run, code_rev, publish_commit, publicação, caminho, offset, comprimento)`; guardar **offset e comprimento** torna a recuperação O(1) em vez de leitura total.
- **Leitura incremental**: watermark por ficheiro `(comprimento, mtime_ns, último_offset)`; lê só a cauda. Se o ficheiro encolheu ou o mtime recuou, reconstrói esse ficheiro inteiro.
- **Comparação a fazer em P2-06** (não é opinião, é medida): consulta por assunto com (a) leitura incremental do ficheiro, (b) índice reconstruível, em log pequeno e em log com ~10 000 entradas. Critério: o tempo de consulta por assunto **não cresce** com o tamanho total do log no caminho (b).
- **Três ensaios de retoma** (P2-15): interromper a meio de um append (bloco sem sentinela → validador quarentena-o, não o apaga); publicação atrasada (entrada sem selo → visível); ponto de secção desatualizado (código avançou desde o último ponto → «secção mais desatualizada» no painel, calculado como `max(idade do último ponto, n.º de commits que tocaram os caminhos da secção desde esse ponto)`).
- Apagar o índice e reconstruir tem de dar **as mesmas respostas**. É o teste que prova que a origem canónica é o ficheiro e não a base de dados.

### 4.3 Pacote C · Contratos de teste e fronteiras de arquitetura

#### Catálogo único

Esquema por teste `[P]`, uma entrada append-only por alteração de contrato:

`teste_id · dono (equipa/módulo) · afirmação que protege · comando exato · bundle e opções · fixtures (caminho+sha256) · oráculo (de onde vem o esperado) · tolerâncias (com unidades) · dependências (config de build, sr, buffer, device, plugins instalados) · limitações (o que NÃO cobre) · última execução pertinente (run_id, code_rev, resultado) · custo esperado`

Inventariação (P2-09) cruza **requisitos ↔ testes ↔ artefactos** a partir de `ctest -N`, dos bundles reais (P0-06) e dos fixtures encontrados. Testes sem dono e afirmações sem teste ficam em duas listas explícitas — são o mapa do que a rede não pode afirmar.

#### O que o guardião verifica

| Classe de enfraquecimento | Sinal | Prova exigida |
|---|---|---|
| Tolerância alargada | diff no valor de tolerância | execução pertinente + decisão escrita do Diogo |
| Oráculo substituído | golden regerado a partir da saída atual | comparação com o oráculo anterior e justificação |
| Fixture trocado | sha256 diferente | execução com fixture antigo e novo |
| Opção de bundle alterada | diff nas opções/flags | execução nas duas configurações |
| Teste retirado da suite | desaparece de `ctest -N` ou do bundle | decisão explícita de redução de cobertura |
| Asserções removidas | contagem de asserções desce | execução + revisão |
| Contrato órfão | teste existe mas nenhuma afirmação o referencia | inscrever afirmação ou marcar como não-governado |

**Hash é pista, não prova.** Um ficheiro com hash igual pode estar coberto por um teste que já não testa nada; um hash diferente pode ser irrelevante. A demonstração final exige **execução pertinente** com o oráculo e a tolerância do catálogo (P2-11: teste verde com tolerância alterada tem de ser travado).

#### `core-headers-publicos`

`[P]` Desenho do teste, sujeito a D-06 (o dono do módulo propõe a fronteira; **o Diogo aprova o contrato arquitetural**).

1. **Entrada aprovada:** lista fechada de headers protegidos + mapa de arestas de dependência permitidas (público→público, público→sistema; público→interno proibido salvo exceção escrita com razão).
2. **Consumidor mínimo por header:** um TU com `#include "<header>"` e `int main(){return 0;}` (mais uma instanciação de um tipo documentado, quando o header existir para isso).
3. **Configuração representativa:** standard e defines **iguais aos do módulo entregue**, e apenas o diretório de include **público** no caminho de include. **Sem PCH, sem unity build** — são exatamente os mecanismos que escondem dependências.
4. **Duas verificações, não uma:**
   - *Auto-suficiência*: compilar cada header isoladamente (varrimento rápido em modo syntax-only: `cl /Zs`, `clang -fsyntax-only`; uma compilação real por header na variante lenta).
   - *Grafo de includes*: obter a árvore (`cl /showIncludes`, `clang -H`) e verificar as arestas contra o mapa aprovado. **Isto apanha o caso «compila mas vaza»**, que a auto-suficiência sozinha não vê.
5. **Classificação do diagnóstico — separar as duas coisas que o brief pede:**

| Diagnóstico | Classificação | Ação | Quem decide |
|---|---|---|---|
| `C1083 / fatal error: cannot open 'X'` e `X` é header **interno/privado** do próprio módulo | **violação de fronteira** | parar; propor correção de arquitetura | **Diogo** |
| `X` é header de sistema/terceiros ou público não incluído | **include esquecido** | acrescentar o include; sem decisão de arquitetura | dono do módulo |
| compila, mas o grafo tem aresta proibida | **violação de fronteira (vazamento)** | parar; propor correção | **Diogo** |
| compila e grafo limpo | passa | — | — |

6. **Controlo negativo obrigatório (P2-14), em cópia de teste** (worktree ou pasta temporária, **nunca** na árvore do produto): introduzir uma dependência proibida num header protegido → o teste **tem de falhar** com classe «fronteira»; remover um include necessário → **tem de falhar** com classe «include esquecido»; repor → **tem de passar**. Três execuções registadas como evidência, mais `git status` limpo na árvore do produto.
7. **Integração:** alvo `core-headers-publicos` + registo em CTest com etiqueta `arquitetura`. Corre **fora** das janelas de medição.

### 4.4 Pacote D · Observação da organização em tempo real

#### Acontecimentos e de onde vêm

Esquema `[P]` (SQLite reconstruível; **JSONL é a origem**):
`evento(id, ts_evento, ingest_ts, tipo, tarefa, passagem, origem, destino, equipa, agente, session_id, agent_id, tool_use_id, code_rev, worktree, ref, payload_sha256, fonte)`

| Acontecimento | Fonte determinística | Campos-chave | Estado |
|---|---|---|---|
| **pedido** | hook `UserPromptSubmit` | `prompt`, `session_id` | hook (V9) |
| encaminhamento | hook `PreToolUse` com matcher `Agent` | `tool_input` (destino), `tool_use_id` | hook |
| **aceitação** | hook `SubagentStart` | `agent_id`, `agent_type` | hook |
| **evidência** | hook `PostToolUse` (`Bash\|Write\|Edit`) | `tool_response`, `tool_use_id` | hook |
| falha de ferramenta | hook `PostToolUseFailure` | `error`, `error_type`, `is_interrupt` | hook |
| **devolução** | hook `SubagentStop` + entrada do comunicador | `agent_id`; motivo da devolução | hook **+** log |
| **resposta** | hook `Stop` | `last_assistant_message` | hook |
| **fecho** | hook `SessionEnd` | `reason` | hook |
| contexto carregado | hook `InstructionsLoaded` | `file_path`, `memory_type`, `load_reason` | hook |
| perda/compressão de contexto | hooks `PreCompact` / `PostCompact` | `trigger`, `compact_summary` | hook |
| permissão negada | hook `PermissionDenied` | `tool_name`, `reason` | hook |
| **pergunta pendente, intenção, condições** | **entrada de log do comunicador** | pergunta, destinatário, condições | **log** — o hook não vê semântica |
| tempo de execução de build/teste | `PreToolUse`+`PostToolUse` com o mesmo `tool_use_id`, ou log do run | início/fim | parcial |
| espera por decisão do Diogo | `PermissionRequest`/`Notification` + log | instante do pedido e da resposta | parcial |
| **desconhecido** | — | esforço humano real; qualidade da resposta (só por avaliação); se uma condição se perdeu **antes** de haver evento; se o modelo leu o que foi injetado | fica declarado como cego |

**Correlação** `[V-doc+P]`: `session_id` + `agent_id` + `tool_use_id` vêm do cliente (V10). A tarefa e a passagem são nossas: `core-arranque` injeta `tarefa` e `passagem` no contexto via `SessionStart`/`UserPromptSubmit` (`additionalContext`), e o comunicador escreve-as em cada entrada. Sem isto, os eventos existem mas não se agrupam por intenção — que é exatamente a perda de contexto que o Diogo quer ver.

#### Recolha que não atrapalha

`[P]` Todos os hooks de observação são `async: true` com `timeout` curto, escrevem **uma linha JSONL** e saem. Nada de base de dados no caminho do agente. A ingestão é um passo separado (`obs-ingere`). Um **dispatcher único** com kill-switch por ficheiro flag (`docs/rede/flags/obs.off`) ou variável `CORE_OBS=0` desliga toda a recolha **sem editar `settings.json`** — necessário porque os componentes de um plugin não se desativam individualmente (V2).

```jsonc
// tools/qoder/core/hooks/hooks.json  (a criar; excerto)
{ "hooks": {
  "PostToolUse": [{ "matcher": "Bash|Write|Edit", "async": true, "hooks": [
    { "type": "command", "shell": "powershell",
      "command": "\"${QODER_PLUGIN_ROOT}\"/bin/obs-hook.ps1",
      "timeout": 10, "env": { "CORE_TIPO": "evidencia" } } ] }],
  "SubagentStart": [{ "async": true, "hooks": [
    { "type": "command", "shell": "powershell",
      "command": "\"${QODER_PLUGIN_ROOT}\"/bin/obs-hook.ps1", "timeout": 10 } ] }]
} }
```

- **Deduplicação:** chave `(session_id, hook_event_name, tool_use_id, agent_id, payload_sha256)` com inserção idempotente. Necessária porque configurações de hooks **somam-se** entre níveis (V14) e um hook pode estar registado duas vezes.
- **Eventos tardios:** `ts_evento` e `ingest_ts` são colunas separadas; a métrica de atraso de recolha é a diferença. Nunca se «corrige» o instante do evento para o da ingestão.
- **Retoma após falha:** apagar a base e reingerir os JSONL tem de produzir o mesmo painel. É o teste de P5-01.
- **Degradação no IDE:** os eventos que só existem no CLI ficam ausentes, e o painel mostra **cobertura de eventos** por sessão em vez de fingir que estão lá (V8).

#### Painel e três tempos que não se somam

O painel responde, por tarefa: **«onde está, desde quando, que pergunta está pendente, qual é a última evidência?»** — cada resposta com referência clicável para `commit:caminho#linha`.

| Métrica | Definição | Quando é legítima |
|---|---|---|
| atraso de recolha | `ingest_ts − ts_evento` (p50/p95) | sempre |
| espera por resposta | `ts(resposta) − ts(pergunta)` | só com os dois extremos; requer entrada do comunicador |
| tempo de execução | `ts(PostToolUse) − ts(PreToolUse)` do mesmo `tool_use_id` | só com par completo |

Cada métrica publica a **percentagem de intervalos com ambos os extremos**. Um número sem cobertura declarada é pior que nenhum número.

#### Investigador e ensaio A/B de uma skill

`[P]` Amostragem de devoluções e correções, com duas classes explícitas: **devolução útil** (evitou um teste errado, uma alteração fora de fronteira, uma conclusão sem oráculo) e **retrabalho** (a mesma pergunta voltou porque a condição se perdeu). O brief é claro e o plano assume-o: **uma devolução que evita um teste errado é um resultado útil**, não um defeito.

Ensaio A/B (P5-04), uma variável só:

- **Variável:** uma única skill, versões A e B, instaladas por tag do plugin ou injetadas por `--agents` (V6) — nunca editadas a meio.
- **Constantes:** mesmo modelo e tier, mesmas ferramentas, mesma `code_rev`, mesmo cliente (auto-update desligado, V20), mesma família de tarefas.
- **Desenho:** tarefas equivalentes emparelhadas, ordem alternada (ABBA) para diluir aprendizagem; N≥6 (3+3) com os limites da amostra escritos antes de olhar para os resultados.
- **Métrica primária:** aceitação do produto pelo Diogo / teste pertinente que passa. **Secundárias:** devoluções úteis, perguntas repetidas, tempo até primeira evidência. Uma melhoria que só melhora o discurso é rejeitada.
- **Fora da máquina de medição:** o investigador corre na máquina de trabalho. Se o X3D for a mesma máquina (P0-13), os hooks de observação ficam desligados por flag durante a janela e os eventos são reconstruídos a partir dos logs do run **depois**, com `ingest_ts ≫ ts_evento` assinalado. O **overhead dos hooks mede-se à parte** (P3-07), nunca dentro da janela.


### 4.5 Pacote C/UI · JIVE como alavanca de UI/UX (condicional a D-14)

Avaliação completa em **`Avaliacao-JIVE-UI-UX.md`**. Resumo do que muda no desenho:

**O que é** `[V]`: bundle de módulos JUCE (`jive_core`, `jive_layouts`, `jive_style_sheets`), MIT, versão **2.0.0**, que interpreta **XML para layout** (→ `juce::ValueTree` → hierarquia de componentes que reage à árvore) e **JSON para estilos** (seletores ID/tipo/classe/pseudo-classe, tokens, imports), com **hot reloading**, templates/snippets, localização e `autoAttachParameters()`.

**O que não é:** não é UI para um plugin do Qoder — plugin Qoder é Markdown/JSON/hooks e a superfície visual é Canvas. JIVE corre dentro da DAW.

**Porque entra no plano** `[P]`: converte a UI de **opaca** (classes C++ + captura) em **verificável** (markup + estilos + contrato). Isso dá à QA UX um oráculo objetivo, permite ao scribe e ao guardião tratar UI com o mesmo mecanismo do código, e reduz tempo de máquina por iteração.

**Mecânica que condiciona a evidência** `[V]`, verificada em `cmake/jive_sources.cmake`: `jive_sources(<target> SOURCES <glob>… [BUNDLE_SOURCES <bool>])` usa `$<NOT:$<CONFIG:Debug>>` por omissão — **Debug lê do disco, outras configurações embutem um zip**; em alvos de plugin, o registo é compilado em cada formato. Consequências: (a) **Debug ≠ Release por construção**, logo é preciso teste de paridade; (b) cada entrada de evidência de UI tem de declarar `BUNDLE_SOURCES`, senão duas corridas com o mesmo hash podem ter UI diferente.

**Riscos principais e neutralização** `[P]`: `main` tem breaking changes recentes → **tag fixada** (D-16); o JIVE testa contra **JUCE `master`** → o Core fixa a sua JUCE e faz ensaio de compatibilidade (P0-17); `autoAttachParameters()` pode rebind silencioso → mapa explícito widget↔ID de parâmetro, testado, com auto-attach desligado até estar provado; **nenhuma mutação de árvore/estilo a partir do callback de áudio**.

**Aviso sobre o anexo do Diogo** `[V]`: o README anexado é da era **1.x**. Em 2.0 a flag `JIVE_GUI_ITEMS_HAVE_STYLE_SHEETS` foi removida, os estados passaram a pseudo-classes **com dois pontos** (sem eles o estilo fica **inerte em silêncio**), `font-weight`/`font-style` → `font-styles`, `opacity`/`justification`/`direction`/`centre-x`/`centre-y` saíram dos atributos, e **os defaults já não são escritos na árvore** — o que muda o oráculo de qualquer teste estrutural de UI.

**Skills:** +`core-jive-ui` (juce, Flash) e +`core-ui-contrato` (guardiao, script determinístico); `core-qa-ux` passa a quatro camadas de evidência (contrato → árvore em runtime → captura vs mockup → percurso rato/teclado); `core-vst3-automacao` ganha mapa de parâmetros e declaração de `BUNDLE_SOURCES`.

**Testes novos para o catálogo:** `core-ui-contrato`, `core-ui-embed-paridade`, `core-ui-parametros` e `core-vst3-pluginval` (candidato externo). Todos com controlo negativo obrigatório e nenhum dentro da janela do X3D.

**Âmbito proposto:** spike num ecrã pequeno, em paralelo com a versão C++ que não é tocada; três números a medir (tempo de iteração, tempo de máquina, defeitos apanhados pelo contrato); se não compilar contra a JUCE do Core, termina no passo 1 com incompatibilidade documentada — 2–4 h em vez de 15–30 h.

---

## 5. Backlog ordenado

68 itens em ordem de execução. **Pacotes:** A = plugin e perfis · B = estado, concorrência e Git · C = contratos de teste e fronteiras · D = observação da organização.
**Esforço A/M/D:** horas de **agente** / horas de **máquina** (builds, testes, corridas) / horas de **intervenção do Diogo** (decisões, aprovações, artefactos). Intervalos justificados em 6.2.
**Responsáveis** são IDs de perfil da secção 3.2. «Dep.» lista IDs de backlog e decisões (`D-xx`) que têm de estar fechadas.
Versão rastreável e editável: `backlog.csv` (mesmos dados, mais a coluna de ação separada).

### Fase 0 · Descoberta, instrumentação e baseline

| ID | Pac. | Resultado e ação concreta | Alvo / caminho | Resp. | Dep. | A/M/D (h) | Critério de aceitação | Evidência esperada |
|---|---|---|---|---|---|---|---|---|
| P0-01 | A | **Checkout identificado sem ambiguidade** — Correr git remote -v; git rev-parse --abbrev-ref HEAD; git rev-parse HEAD; git status --porcelain; git worktree list e guardar a saída | raiz do checkout (por verificar) | coord (modo descoberta) | — | 0.5-1 / 0 / 0 | owner/repo, branch, rev e estado sujo registados; worktrees listadas | docs/rede/descoberta/checkout.md com saída literal dos comandos |
| P0-02 | A | **Entrada do motor e fronteira com JUCE localizadas** — Procurar ma_device/ma_engine/miniaudio e o callback de áudio; seguir até ao grafo; procurar onde JUCE chama o motor | include/**, src/** (por verificar); Select-String -Pattern 'ma_device\|ma_engine\|miniaudio' | coord + motor (leitura) | P0-01 | 1-2 / 0 / 0 | Ficheiro e linha do callback e do ponto de contacto com JUCE identificados, ou ponto marcado por verificar com comando em falta | descoberta/motor.md com refs ficheiro:linha |
| P0-03 | A | **Percurso de estado do Host VST localizado** — Procurar descoberta, createInstance, buses, parâmetros, latência, getStateInformation/setStateInformation e o carregamento do módulo separado | src/host/** (por verificar) | host (leitura) | P0-01 | 1-2 / 0 / 0 | Cadeia guardar→restaurar identificada com refs; lacunas nomeadas | descoberta/host.md com refs ficheiro:linha |
| P0-04 | C | **Targets de build, testes e instalador inventariados** — cmake --list-presets; ler CMakePresets.json; ctest -N; procurar .iss/.wxs/.nsi/.wixproj | CMakeLists.txt, CMakePresets.json, build/ (por verificar) | coord + guardiao | P0-01 | 1-2 / 0.5-1 / 0 | Lista de presets, de testes registados e do alvo de instalador, com o comando que os produz | descoberta/build-testes.md com saída de ctest -N |
| P0-05 | A | **Scripts PowerShell reais catalogados** — Para cada .ps1: extrair param block, pré-requisitos, comando de invocação e artefactos produzidos; correr em modo seguro (-WhatIf ou leitura) | Get-ChildItem -Recurse -Filter *.ps1 (por verificar) | coord | P0-01 | 1.5-3 / 0.5-1 / 0 | Tabela script→comando→pré-requisitos→resultado, sem scripts inventados | descoberta/scripts.md; uma linha por script encontrado |
| P0-06 | C | **Bundles e convenções de relatórios identificados** — Localizar bundles de teste, opções aceites e onde os relatórios são escritos hoje | bundles/**, tests/**, reports/** (por verificar) | guardiao | P0-04 | 1-2 / 0 / 0 | Cada bundle tem comando, opções e destino de relatório; convenção atual descrita | descoberta/bundles.md |
| P0-07 | A | **Cliente Qoder e versão confirmados** — qoder --version; confirmar desktop/IDE/CLI em uso; ler %USERPROFILE%\.qoder\settings.json e .env; desativar auto-update | %USERPROFILE%\.qoder\ (documentado) | Diogo + coord | — | 0.5-1 / 0 / 0.25-0.5 | Versão, forma de execução e caminhos de configuração registados; general.enableAutoUpdate=false aplicado | descoberta/qoder-cliente.md com versão e captura das definições |
| P0-08 | A | **Modelo Qwen disponível no dispositivo registado** — Abrir o seletor de modelos; registar nomes, modelId, tiers e taxa de Credits; escolher tier fixado para os pilotos | Seletor de modelos do cliente (o seletor é autoritativo) | Diogo | P0-07 | 0.25-0.5 / 0 / 0.25-0.5 | Nome exato e modelId do modelo Qwen usado, mais tier fixado por fase | descoberta/modelos.md com captura do seletor |
| P0-09 | A | **Capacidades distinguem documentado de verificado** — Correr /agents, qoder agents list, /plugins, qoder plugins list --json, /memory; confirmar skills carregadas e um hook a disparar | .qoder/agents, .qoder/skills, .qoder/settings.json | coord | P0-07 | 1-2 / 0 / 0.25-0.5 | Tabela capacidade→documentada→verificada nesta instalação, com prova de cada sim | descoberta/capacidades.md com saída dos comandos |
| P0-10 | A | **Composição de equipas confirmada no cliente** — IDE: Settings>Agent Team>Create (verificar limite de 1 líder + 4 membros e nome imutável). CLI: QODER_AGENT_TEAMS=1 e criar 2 teammates | Settings > Agent Team; %USERPROFILE%\.qoder\.env | Diogo + coord | P0-09 | 1-2 / 0 / 0.5-1 | Sabido se as 11 equipas cabem no cliente e quais passos são manuais; limite de membros confirmado ou refutado | descoberta/equipas.md com captura do painel e passos manuais |
| P0-11 | D | **Passagem mínima demonstrada e correladores identificados** — Ensaio: coord delega uma pergunta a host; host responde; capturar session_id, agent_id, tool_use_id nos hooks | hooks em .qoder/settings.json; docs/rede/logs/* | coord + comm-geral | P0-09 | 1.5-3 / 0 / 0.25-0.5 | Uma pergunta desce e regressa; os três correladores aparecem nos eventos capturados | logs JSONL do ensaio + descoberta/passagem.md |
| P0-12 | D | **Recolha de eventos ativa desde o início** — Instalar hooks mínimos (UserPromptSubmit, SubagentStart/Stop, PostToolUse, PostToolUseFailure, Stop, SessionEnd) em modo async, com dispatcher e kill-switch | .qoder/settings.json + tools/rede/obs-hook.ps1 (propostos) | coord + investigador | P0-09 | 2-4 / 0.25-0.5 / 0 | Os 6 tipos de acontecimento aparecem em JSONL; kill-switch por ficheiro flag desliga tudo sem editar settings | JSONL com os 6 tipos + prova de que a flag desliga |
| P0-13 | A | **Artefactos de prova confirmados ou lacunas nomeadas** — Verificar projeto pesado, VST3 próprio A e B, projeto antigo com automação e mockup aprovado; registar mínimo para preencher cada lacuna | pastas de projetos e assets (por verificar) | Diogo + coord | P0-01 | 0.5-1 / 0 / 0.5-1 | Quatro artefactos com estado existe/falta, dono e preparação mínima | descoberta/artefactos.md |
| P0-14 | D | **Baseline real medida** — Escolher uma tarefa já conhecida, executá-la sem rede e medir tempo até primeira evidência, perguntas repetidas, correções do Diogo e retoma em sessão nova | docs/rede/baseline/B-001.md (proposto) | Diogo + coord + comm-geral | P0-12 | 1-2 / 0.5-2 / 1-2 | Quatro números registados com o mesmo esquema de eventos da rede | B-001.md + JSONL da tarefa + nota do que foi recuperável |
| P0-15 | A | **Decisões agrupadas e aprovadas** — Apresentar D-01..D-12 por ordem de bloqueio, com impacto e recomendação; recolher decisão escrita | docs/rede/decisoes/D-001..D-012.md (proposto) | Diogo | P0-01..P0-14 | 0.5-1 / 0 / 1-2 | D-01, D-02, D-03, D-05 decididas (bloqueiam F1/F2); restantes com data ou Adiada | decisoes/*.md com decisão, data e âmbito |
| P0-16 | D | **Protótipo de observação aproveitado ou descartado** — Se o ZIP Core-Observador-Piloto aparecer, abrir, ler esquema SQLite e decidir o que se reaproveita; caso contrário registar ausência | Core-Observador-Piloto.zip (não disponível neste workspace) | investigador | — | 0.5-1 / 0 / 0 | Esquema do protótipo mapeado para o esquema proposto, ou ausência declarada | descoberta/observador-prototipo.md |
| P0-17 | A | **Compatibilidade do JIVE com o Core avaliada** — Descobrir JUCE e C++ do Core, build system e se já existe JIVE; compilar JIVE 2.0 em tag fixada contra a JUCE do Core; correr o test runner do JIVE | JIVE (tag fixada) + CMake do Core (por verificar) | juce + guardiao | P0-04 | 2-4 / 1-2 / 0.5-1 | Compila e passa os testes do JIVE na configuração do Core, ou incompatibilidade nomeada com ficheiro:linha; versão fixada registada | descoberta/jive-compatibilidade.md + saída do test runner |

### Fase 1 · Percurso mínimo verificável

| ID | Pac. | Resultado e ação concreta | Alvo / caminho | Resp. | Dep. | A/M/D (h) | Critério de aceitação | Evidência esperada |
|---|---|---|---|---|---|---|---|---|
| P1-01 | A | **Plugin único core instalado e carregado** — Criar .qoder-plugin/plugin.json + commands/ agents/ skills/ hooks/hooks.json; qoder plugins install <dir> --scope project; /plugins reload | tools/qoder/core/ (proposto) → instalado no projeto | coord | D-01, D-05, P0-07 | 1-2 / 0.25-0.5 / 0 | qoder plugins list mostra core@projeto; skills e agentes aparecem nas listas | saída de plugins list --json e agents list |
| P1-02 | A | **Fichas e skills do primeiro percurso vertical** — Escrever as 5 fichas (coord, comm-geral, min-eng, host, host-comm) e 6 skills (arranque, passagem, registo, encaminhamento, estado-consulta, evidencia) | tools/qoder/core/agents/*.md e skills/*/SKILL.md | coord + comm-geral | P1-01, D-03 | 3-6 / 0 / 0.5-1 | Cada ficha tem os 10 campos obrigatórios e pedido de avaliação; cada skill tem descrição com frase de disparo própria | fichas + SKILL.md + inventario-agentes.csv atualizado |
| P1-03 | A | **Contexto durável carregado sem depender do chat** — Acrescentar secção Rede a AGENTS.md; criar .qoder/rules/rede-nucleo.md (always_on) e rede-<equipa>.md (glob); confirmar com /memory e hook InstructionsLoaded | AGENTS.md; .qoder/rules/** | coord | P1-02 | 1-2 / 0 / 0 | Instruções da rede carregam em sessão nova; regras de domínio só carregam ao tocar ficheiros do domínio | /memory + eventos InstructionsLoaded |
| P1-04 | A | **Permissões e fronteira de escrita por perfil** — Definir permissions.allow/deny/ask por perfil; instalar guarda PreToolUse que cruza agent_type com o mapa caminho→dono; negar git push a todos exceto scribe | .qoder/settings.json; tools/rede/guarda-escrita.ps1 (proposto) | coord + guardiao | P1-02, D-02 | 2-4 / 0 / 0.25-0.5 | Escrita fora do destino da ficha é negada com mensagem clara; tentativa fica registada | evento de negação + saída do ensaio de escrita proibida |
| P1-05 | A | **Ativação automática medida separadamente da qualidade** — Para cada skill do slice: fazer uma pergunta que não nomeia a skill; repetir com invocação explícita; classificar resultado | docs/rede/descoberta/ativacao.md (proposto) | investigador | P1-02 | 1-2 / 0 / 0 | Tabela skill→explícita OK?→automática OK?→qualidade; falha de ativação registada como problema distinto | ativacao.md com as perguntas literais usadas |
| P1-06 | A | **Pedido vertical T-20261120-main-01 executado** — Dar o pedido da secção 8 ao cliente; coord encaminha a Host; host responde com refs; comm-geral escreve o dossiê | docs/rede/passagens/T-20261120-main-01.md (proposto) | coord + host + host-comm | P1-03, P1-04, D-02 | 2-4 / 0.5-1 / 0.5-1 | Resposta resolve a pergunta original, cita ficheiro:linha e nomeia o que falta verificar; nenhuma alteração de código | dossiê da passagem + resposta final + refs |
| P1-07 | B | **Continuidade provada depois de fechar e reabrir** — Fechar a sessão; abrir processo novo em modo headless só-leitura e pedir a decisão e a cobertura; comparar refs com T-20261120-main-01 | qoder -p com --permission-mode dont_ask e allowlist de leitura | scribe + coord | P1-06 | 1-2 / 0.25-0.5 / 0.25-0.5 | Sessão nova devolve as mesmas refs e os mesmos limites sem acesso ao histórico do chat | transcrição da sessão nova + comparação de refs |
| P1-08 | D | **Encaminhamento e devolução visíveis** — Ingerir os eventos de T-20261120-main-01 e mostrar pedido→aceitação→evidência→devolução→resposta→fecho com tempos | tools/rede/obs-ingere.ps1; painel mínimo | investigador | P0-12, P1-06 | 1-2 / 0 / 0 | Os 6 acontecimentos aparecem com task_id, origem, destino, revisão e instante | painel mínimo + consulta SQL/JSON |
| P1-09 | A | **Reversibilidade ensaiada** — qoder plugins disable core; confirmar que nada carrega; reinstalar versão anterior a partir de tag Git; confirmar que os registos sobrevivem | tools/qoder/core (tag core-plugin-v0.1.0) | coord + scribe | P1-01 | 1-2 / 0.25-0.5 / 0 | Rede desligada sem perder registos; versão anterior ativa e verificada; reativação limpa | registo do ensaio de rollback + git status limpo em docs/rede |
| P1-10 | A | **Matriz de modelos aplicada e custo por perfil medido** — Aplicar Qwen4-Max-Preview / Qwen3.8-Flash / Efficient por perfil com effort; confirmar nomes e aliases no seletor; registar custo do primeiro percurso por perfil | tools/qoder/core/agents/*.md; .qoder/settings.local.json (agents.overrides) | coord + investigador | P0-08, P1-06 | 1-2 / 0 / 0.25-0.5 | Cada perfil corre no modelo declarado; custo por perfil registado; aliases inexistentes substituídos pelo nome real do seletor | matriz aplicada + tabela de custo por perfil |

### Fase 2 · Estado durável, concorrência e verificação

| ID | Pac. | Resultado e ação concreta | Alvo / caminho | Resp. | Dep. | A/M/D (h) | Critério de aceitação | Evidência esperada |
|---|---|---|---|---|---|---|---|---|
| P2-01 | B | **Árvore governada criada e aprovada** — Criar docs/rede/** conforme D-02; .gitattributes com docs/rede/** merge=union; .gitignore do índice | docs/rede/**; .gitattributes; .gitignore | scribe | D-02, P1-06 | 1-2 / 0 / 0.5-1 | Árvore exata aprovada; índice fora do controlo de versão; merge union ativo | git check-attr merge docs/rede/ESTADO.md |
| P2-02 | B | **Entradas com identidade estável e formato verificável** — Implementar contrato de entrada, gerador de ID por worktree e validador de blocos (ID único, campos obrigatórios, cadeia substitui) | tools/rede/registo-novo.ps1 e registo-valida.ps1 (propostos) | scribe + comm-geral | P2-01 | 2-4 / 0 / 0 | Duas entradas com o mesmo assunto em worktrees diferentes não colidem; validador rejeita bloco incompleto | saída do validador + duas entradas reais |
| P2-03 | B | **Appends concorrentes serializados** — Escritor único do ESTADO.md alimentado por fila; lock por criação atómica de ficheiro com retry e backoff; recuperação de lock órfão | tools/rede/estado-append.ps1 (proposto) | scribe | P2-02 | 3-5 / 0.25-0.5 / 0 | N appends paralelos produzem N entradas intactas; lock órfão é recuperado sem intervenção manual | ensaio com 8 escritores + contagem de entradas |
| P2-04 | B | **Ensaio de duas worktrees na mesma linha** — Duas worktrees (isolation: worktree) acrescentam ao mesmo assunto e ao mesmo ficheiro; integrar; verificar ordem e integridade | git worktree add ../wt-a ../wt-b; docs/rede/ESTADO.md | scribe + motor-comm + host-comm | P2-03 | 2-4 / 0.5-1 / 0 | Nenhuma entrada perdida; blocos intactos após merge union; índice reflete as duas | git log + validador + antes/depois do merge |
| P2-05 | B | **Selo em duas fases e três estados de publicação** — Commit A publica evidência; scribe lê git rev-parse HEAD e acrescenta selo; commit B publica o selo; distinguir local/commit/publicado | tools/rede/registo-sela.ps1 (proposto) | scribe | P2-02 | 2-3 / 0.25-0.5 / 0 | Nenhum commit contém o próprio hash; entradas por selar aparecem como publicação atrasada | dois commits ligados + consulta de estado de publicação |
| P2-06 | B | **Estado corrente obtido sem ler o log inteiro** — Índice reconstruível com offsets por entrada; leitura incremental por watermark; apagar índice e reconstruir dá o mesmo resultado | tools/rede/indice-reconstroi.ps1 e estado-atual.ps1 | scribe + investigador | P2-02 | 3-6 / 0.5-1 / 0 | Consulta por assunto devolve a última afirmação e a sua origem; custo não cresce com o tamanho total do log | medida de tempo de consulta com log pequeno e grande + teste de reconstrução |
| P2-07 | B | **Verificação bidirecional do scribe com força** — diff→registo e registo→diff; hook Stop bloqueante quando falta entrada para alteração declarada | tools/rede/registo-verifica.ps1; hooks Stop | scribe + guardiao | P2-05 | 3-5 / 0.25-0.5 / 0 | Alteração governada sem entrada bloqueia o fecho com mensagem acionável; entrada sem diff é sinalizada | ensaio de bloqueio + saída do verificador nos dois sentidos |
| P2-08 | B | **Três falhas de registo demonstradas** — Ensaiar alteração declarada em falta, diff sem registo e registo sem diff; confirmar deteção e correção | docs/rede/** + área de produto | scribe | P2-07 | 2-3 / 0.25-0.5 / 0 | As três falhas são detetadas e a correção não apaga entradas anteriores | três ensaios com saída do verificador |
| P2-09 | C | **Catálogo único de testes com contrato completo** — Inventariar testes existentes e preencher teste_id, dono, comando, bundle/opções, fixtures+hash, oráculo, tolerâncias, dependências, limitações | docs/rede/catalogo-testes.md; ctest -N; bundles | guardiao | P0-04, P0-06, D-08 | 3-6 / 0.5-1 / 0 | Cada teste tem oráculo e tolerância explícitos e limitações declaradas; nenhum teste sem dono | catálogo preenchido + lista de testes órfãos |
| P2-10 | C | **Deteção de cobertura enfraquecida** — Comparar catálogo e diff: tolerância alargada, fixture trocada, oráculo regerado, opção de bundle alterada, teste retirado da suite | tools/rede/catalogo-verifica.ps1 (proposto) | guardiao | P2-09 | 3-6 / 0.5-1 / 0 | Cada classe de enfraquecimento é detetada; hash tratado como pista e não como prova | parecer do guardião por classe de enfraquecimento |
| P2-11 | C | **Teste verde com tolerância alterada é travado** — Alterar uma tolerância num teste, correr até ficar verde, exigir execução pertinente e decisão do Diogo | teste do catálogo + docs/rede/decisoes/ | guardiao + Diogo | P2-10 | 1-2 / 0.5-1 / 0.25-0.5 | Verde não é aceite como prova; redução de cobertura só com decisão escrita | ensaio + decisão registada |
| P2-12 | C | **Fronteira pública proposta e aprovada** — Dono do módulo lista headers protegidos e arestas de dependência permitidas; Diogo aprova o contrato arquitetural | include/** do módulo (por verificar); docs/rede/decisoes/D-006.md | dono do módulo + Diogo | P0-02, D-06 | 1-2 / 0 / 1-2 | Lista fechada de headers e mapa de dependências aprovadas, com razão por exceção | contrato aprovado + lista de headers |
| P2-13 | C | **Teste core-headers-publicos a correr** — Gerar um consumidor mínimo por header protegido; compilar com configuração representativa, só include público, sem PCH nem unity; classificar diagnóstico | tests/arquitetura/headers-publicos/ (proposto); ctest -R core-headers-publicos | guardiao + motor | P2-12 | 4-8 / 1-3 / 0 | Todos os headers compilam isoladamente; falhas classificadas em include esquecido ou violação de fronteira | saída de ctest + tabela header→resultado→classe |
| P2-14 | C | **Controlo negativo do teste de fronteira** — Numa cópia de teste, introduzir dependência proibida e remover um include necessário; confirmar falha nas duas classes e recuperação ao repor | cópia em build/ ou worktree de teste (nunca na árvore do produto) | guardiao | P2-13 | 1-2 / 0.5-1 / 0 | O teste falha quando deve falhar e volta a passar ao repor; produto intocado | duas execuções falhadas + uma passada + git status limpo |
| P2-15 | B | **Retoma demonstrada em três cenários** — Interromper a meio de um append; publicar tarde; deixar ponto de secção desatualizado; confirmar recuperação e visibilidade | docs/rede/**; tools/rede/* | scribe + investigador | P2-03, P2-05, P2-06 | 2-4 / 0.5-1 / 0 | Nenhuma entrada perdida; publicação atrasada e secção desatualizada aparecem no estado | três ensaios + consulta de estado antes/depois |
| P2-16 | B | **Estado geral mostra a secção mais desatualizada** — Calcular idade do último ponto e commits que tocaram a secção desde esse ponto; publicar no painel de estado | tools/rede/estado-painel.ps1 (proposto) | scribe + investigador | P2-06 | 2-3 / 0.25-0.5 / 0 | Pergunta «qual secção está mais desatualizada?» tem resposta com número e refs | painel de estado + cálculo demonstrado |
| P2-17 | C | **Contrato objetivo de UI a correr** — Implementar core-ui-contrato: vocabulário da versão fixada, IDs únicos e estáveis, seletores que casam, tokens existentes, pseudo-classes 2.0, ausência de propriedades 1.x, glob de jive_sources completo; controlo negativo com três mutações | tests/ui/contrato/ (proposto); ctest -R core-ui-contrato | guardiao + juce | D-14, D-16, P4-08 | 3-6 / 0.5-1 / 0.25-0.5 | Falha nas três mutações (token removido, hover sem dois pontos, propriedade 1.x) e passa ao repor; produto intocado | saída de ctest + três execuções falhadas + uma passada |

### Fase 3 · Piloto do motor (prioridade prática)

| ID | Pac. | Resultado e ação concreta | Alvo / caminho | Resp. | Dep. | A/M/D (h) | Critério de aceitação | Evidência esperada |
|---|---|---|---|---|---|---|---|---|
| P3-01 | A | **Equipas do motor prontas** — Fichas e skills de Motor, QA Áudio, Debugging e Benchmarks; regras glob por domínio | tools/qoder/core/agents e skills; .qoder/rules/rede-motor.md | min-eng + min-qua | P1-09, P2-09 | 3-6 / 0 / 0.5-1 | Cada perfil tem destino de escrita e comando de teste reais; ativação automática testada | fichas + tabela de ativação |
| P3-02 | C | **Caso real do motor escolhido com critério** — Escolher alteração ou suspeita real; escrever hipótese, critério de aceitação e o que seria evidência discriminante | docs/rede/passagens/T-<data>-<wt>-<seq>.md | min-eng + Diogo | P3-01, P0-13 | 1-2 / 0 / 0.5-1 | Hipótese falseável e critério escritos antes de tocar no código | passagem com hipótese e critério |
| P3-03 | C | **Alteração localizada com percurso demonstrado** — Mapear o percurso real do áudio, alterar um ponto e testar pela entrada normal | módulo motor (caminho de P0-02) | motor + motor-comm | P3-02 | 3-6 / 1-3 / 0 | Mapa do percurso com refs; teste pela entrada normal com esperado/obtido/tolerância/config | diff + mapa + resultado de teste |
| P3-04 | C | **Verificação áudio independente** — Testar sinal, eventos, fronteiras de bloco, routing e live/export no mesmo projeto e configuração | bundles de áudio (de P0-06) | qa-audio + qa-audio-comm | P3-03 | 3-6 / 1-3 / 0 | Resultados reproduzíveis por comando único; divergências com tolerância do catálogo | evidencia/<run>/ com esperado, obtido, tolerância, config |
| P3-05 | C | **Falha reduzida a causa ou experiência discriminante** — Se houver falha: reproducer mínimo, hipóteses concorrentes, tracing/dumps/comparação de sinal, critério de correção | debugging (scripts de P0-05) | debug + debug-comm | P3-04 | 2-6 / 0.5-2 / 0 | Causa demonstrada ou experiência que distingue hipóteses, com condições escritas | reproducer + tabela de hipóteses + dumps |
| P3-06 | C | **Comparação de builds em janela isolada** — Serializar corridas no X3D: mesmo projeto, buffer e dispositivo, com um worker e com a configuração habitual; builds e profiling fora da medição | scripts de bench (de P0-05); X3D | bench + bench-comm | P3-03, D-07, D-09 | 3-5 / 3-8 / 0.5-1 | Distribuição, pior callback, overruns, duração, n.º de blocos e configuração comparável nas duas condições | CSV por corrida + sha256 das builds + registo de janela |
| P3-07 | D | **Contaminação e overhead quantificados** — Registar processos ativos, energia/frequência, temperatura e estado dos hooks; medir à parte o custo dos hooks de observação | docs/rede/evidencia/<run>/contaminacao.md | bench + investigador | P3-06 | 1-2 / 0.5-1 / 0 | Corridas com contaminação declarada; overhead dos hooks medido fora da janela | registo de contaminação + medida de overhead |
| P3-08 | B | **Piloto do motor fechado com decisão** — Agregar resposta, cobertura e limites; Diogo decide; entrada de estado selada | docs/rede/ESTADO.md; decisoes/ | coord + scribe + Diogo | P3-04, P3-06 | 1-2 / 0 / 0.5-1 | Decisão escrita com refs seladas; sessão nova recupera-a | entrada selada + decisão |

### Fase 4 · Piloto VST/JUCE

| ID | Pac. | Resultado e ação concreta | Alvo / caminho | Resp. | Dep. | A/M/D (h) | Critério de aceitação | Evidência esperada |
|---|---|---|---|---|---|---|---|---|
| P4-01 | A | **Artefactos do piloto VST/JUCE disponíveis** — Preparar o que falta: VST3 A e B, projeto antigo com automação, projeto pesado, mockup aprovado; nomear dono e prazo | pastas de projetos e assets (de P0-13) | Diogo + host + juce | P0-13 | 1-2 / 0.5-2 / 1-3 | Quatro artefactos com caminho, versão e hash, ou lacuna com dono e data | descoberta/artefactos.md atualizado + hashes |
| P4-02 | A | **Equipas Host/JUCE/QA UX prontas** — Fichas e skills core-host-estado, core-vst3-automacao, core-juce-fluxo, core-qa-ux | tools/qoder/core/** | min-eng + min-qua | P4-01, P3-01 | 3-5 / 0 / 0.25-0.5 | Skills invocáveis e testadas sem nomear; comandos apontam para scripts reais | fichas + tabela de ativação |
| P4-03 | C | **Atualização A→B com automação preservada** — Abrir projeto antigo com A, editar, guardar, atualizar para B, recuperar; comparar instância, estado e automação | projeto antigo + VST3 A/B (de P4-01) | host + host-comm | P4-02 | 4-8 / 1-3 / 0.5-1 | Instância, estado e automação recuperados, ou diferença explícita com bloqueio e plano | ensaio gravado + comparação de estado e automação |
| P4-04 | C | **Verificação áudio e UI independentes** — QA Áudio verifica sinal e null-diff; QA UX verifica o fluxo musical; nenhuma verifica o trabalho da própria equipa | bundles + capturas | qa-audio + qa-ux | P4-03 | 3-6 / 1-3 / 0 | Duas verificações independentes com evidência própria e parecer separado | dois pareceres + evidencia/<run>/ |
| P4-05 | C | **Compatibilidade de projetos antigos decidida** — Analisar parâmetros renomeados/removidos, buses e versão de chunk; propor migração ou bloqueio explícito | código de estado do host + projeto antigo | host + min-eng + Diogo | P4-03 | 2-5 / 0.5-1 / 0.5-1 | Cada incompatibilidade tem decisão: migração com mapa de IDs, ou bloqueio com razão | tabela de incompatibilidades + decisão |
| P4-06 | C | **Evidência visual e funcional da UI** — Comparar capturas com mockup; executar intenção musical com rato e teclado, incluindo seleção, foco e Undo | mockup aprovado + build identificada | qa-ux + qa-ux-comm | P4-03 | 3-6 / 0.5-1 / 0.5-1 | Cada passo tem captura e resultado; divergências face ao mockup listadas | capturas + checklist assinada + refs |
| P4-07 | C | **Lacunas de cobertura registadas e decididas** — Inscrever no catálogo o que ficou por verificar e o teste mínimo que fecharia cada lacuna | docs/rede/catalogo-testes.md; decisoes/ | guardiao + Diogo | P4-04, P4-05 | 1-2 / 0 / 0.5-1 | Nenhuma lacuna implícita; cada uma tem teste mínimo, dono e decisão | catálogo atualizado + decisão |
| P4-08 | C | **Spike JIVE num ecrã pequeno** — Recriar um ecrã representativo em XML+JSON com tokens do mockup, em paralelo com a versão C++ que não é tocada; hot reload em Debug; medir tempo de iteração, tempo de máquina e defeitos apanhados pelo contrato | ecrã escolhido em P0-17; XML/JSON do Core (proposto) | juce + qa-ux + Diogo | D-14, D-16, P0-17, P4-01 | 6-12 / 1-3 / 1-2 | Percurso musical executável com rato e teclado; contrato a passar; captura comparada com mockup; três números registados | diff do spike + capturas + tabela dos três números |
| P4-09 | C | **Paridade Debug/Release e mapa de parâmetros provados** — Comparar árvore e estilos com BUNDLE_SOURCES off (Debug, disco) e on (Release, zip); verificar mapa widget↔ID de parâmetro entre A e B com autoAttachParameters desligado até o mapa estar provado | jive_sources() no CMake; mapa de parâmetros versionado | host + guardiao | D-14, P4-08, P4-03 | 3-6 / 1-2 / 0.5-1 | Mesma árvore e estilos nos dois modos ou diferença explícita; mapa de parâmetros idêntico ou bloqueio declarado | comparação dos dois modos + mapa de parâmetros + parecer |

### Fase 5 · Avaliação da rede

| ID | Pac. | Resultado e ação concreta | Alvo / caminho | Resp. | Dep. | A/M/D (h) | Critério de aceitação | Evidência esperada |
|---|---|---|---|---|---|---|---|---|
| P5-01 | D | **Painel responde às quatro perguntas** — Publicar onde está a tarefa, desde quando, que pergunta está pendente e qual é a última evidência; separar atraso de recolha, espera e execução | tools/rede/obs-painel.ps1 (proposto) | investigador | P2-16, P4-06 | 3-6 / 0.25-0.5 / 0 | Quatro respostas com refs; três tempos nunca somados num só número | painel + consulta reproduzível |
| P5-02 | D | **Devoluções e correções classificadas** — Amostragem de devoluções e correções do Diogo; classificar devolução útil (evitou teste errado) vs retrabalho | docs/rede/logs/**; passagens/** | investigador | P5-01 | 2-4 / 0 / 0 | Amostra com critérios explícitos e contagem dos dois tipos; casos rastreáveis até ao evento | tabela de amostra + refs por caso |
| P5-03 | D | **Comparação com a baseline** — Comparar tarefas equivalentes com B-001: tempo até primeira evidência, perguntas repetidas, correções, retoma | docs/rede/baseline/B-001.md + passagens dos pilotos | investigador + coord | P5-02 | 2-4 / 0.25-0.5 / 0.25-0.5 | Comparação com diferenças e limites de amostra declarados; sem conclusão causal forte | tabela comparativa + nota de validade |
| P5-04 | D | **Ensaio A/B de uma única alteração de skill** — Escolher uma passagem deficiente; alterar uma skill; correr tarefas equivalentes com mesmo modelo, ferramentas e revisão; alternar A/B | tools/qoder/core/skills/<skill>/SKILL.md (versões A e B) | investigador + Diogo | P5-03 | 3-6 / 1-3 / 0.5-1 | Uma variável alterada; métrica primária é aceitação do produto; ordem alternada | ficha do ensaio + resultados A e B + diff da skill |
| P5-05 | D | **Melhoria confrontada com o produto** — Verificar se a mudança evitou a repetição sem degradar a aceitação; proposta fundamentada ao coordenador | docs/rede/investigacao/** | investigador + coord | P5-04 | 2-4 / 0 / 0.5-1 | Proposta com caso, comparação e recomendação; adoção só com decisão do Diogo | proposta + decisão |
| P5-06 | B | **Sessão nova recupera evidência e limitações** — Fechar tudo; sessão nova responde o que está decidido, o que foi verificado e o que continua por verificar, com refs | qoder -p só-leitura; docs/rede/ESTADO.md | scribe + coord | P5-05 | 1-2 / 0.25-0.5 / 0.25-0.5 | Resposta inclui limitações e não só conclusões; refs resolvem para commit+caminho+linha | transcrição + verificação de refs |
| P5-07 | A | **Decisão sobre manter, ajustar ou reduzir a rede** — Apresentar custo de coordenação vs baseline e risco de contexto; Diogo decide composição final | docs/rede/decisoes/D-013.md (proposto) | Diogo | P5-03, P5-05, P5-06 | 1-2 / 0 / 1-2 | Decisão escrita sobre equipas, investigador e skills a manter; entradas de estado seladas | decisão + estado final |

---

## 6. Fases, esforço e paralelismo

### 6.1 Esforço por fase e por pacote

| Fase | Itens | Tempo do agente (h) | Tempo de máquina (h) | Intervenção do Diogo (h) |
|---|---|---|---|---|
| Fase 0 | 17 | 16.75–33.5 | 2.75–6.5 | 4.5–9 |
| Fase 1 | 10 | 14–28 | 1.25–2.5 | 1.75–3.5 |
| Fase 2 | 17 | 38–71 | 6.25–13.5 | 2–4 |
| Fase 3 | 8 | 17–35 | 6–17 | 2–4 |
| Fase 4 | 9 | 26–52 | 5.5–15 | 4.75–10.5 |
| Fase 5 | 7 | 14–28 | 1.75–4.5 | 2.5–5 |
| **Total** | 68 | 125.75–247.5 | 23.5–59 | 17.5–36 |
| Pacote | Itens | Agente (h) | Máquina (h) | Diogo (h) |
|---|---|---|---|---|
| A | 23 | 29.75–58.5 | 3–7 | 7.5–16 |
| B | 13 | 25–45 | 3.25–6.5 | 1.5–3 |
| C | 21 | 52–106 | 14.5–38 | 6–12 |
| D | 11 | 19–38 | 2.75–7.5 | 2.5–5 |
**Separando o que depende de JIVE (D-14)** — os itens condicionais não estão comprometidos:

| Âmbito | Itens | Agente (h) | Máquina (h) | Diogo (h) |
|---|---|---|---|---|
| P2-17, P4-08, P4-09 | 3 | 12–24 | 2.5–6 | 1.75–3.5 |
| Resto do plano (não depende de JIVE) | 65 | 113.75–223.5 | 21–53 | 15.75–32.5 |


*Os valores são somas exatas dos intervalos dos 68 itens: a precisão de 15 minutos é aritmética, não confiança. Lê-se «Fase 2: 35–65 h», não «35,0 h». Os totais em créditos não são estimados aqui — são medidos na baseline (P0-14) e no primeiro percurso (P1-06).*

### 6.2 Porque é que os intervalos são estes

| Fase | O que faz variar o esforço | O que estreita o intervalo |
|---|---|---|
| 0 · Descoberta | número de scripts e de alvos de build; se o cliente é IDE ou CLI; se há artefactos | P0-01..P0-06 respondidos; P0-13 fecha artefactos |
| 1 · Percurso mínimo | quantos passos manuais o cliente exige por equipa (V18); se a ativação automática funciona à primeira | P0-10 e P0-11 |
| 2 · Estado e verificação | **n.º de headers protegidos** e **n.º de testes existentes** — são os dois multiplicadores do plano; esforço do teste de headers varia 4–8 h conforme o build system | P0-04 (`ctest -N`), P2-12 (lista aprovada) |
| 3 · Piloto motor | se o caso escolhido falha (entra Debugging, +2–6 h) e o tempo de build do projeto pesado | P0-13 (projeto pesado) e P3-02 (caso escolhido) |
| 4 · Piloto VST/JUCE | **artefactos em falta**: preparar A/B, projeto antigo e mockup pode custar mais do que o piloto | P0-13 e P4-01 |
| 5 · Avaliação | tamanho da amostra e se o A/B precisa de mais tarefas para dizer algo | P5-03 (validade da comparação) |

**O que significam os três tempos, para não serem somados por engano.** Tempo de agente é latência de trabalho intelectual (pode correr em paralelo com o Diogo a fazer outra coisa). Tempo de máquina é ocupação de CPU/dispositivo — **é o único que não pode ser comprimido com mais agentes**, e no X3D é estritamente serial. Intervenção do Diogo é o recurso mais escasso: 15–31 h no total, concentradas em decisões (F0), aprovações de contrato (F2) e aceitação de pilotos (F3–F5).

**Custo em créditos, a medir e não a adivinhar** `[P]`: as chamadas de modelo por sub-agentes são faturadas separadamente (V21). A Fase 0 regista o custo da tarefa de baseline; a Fase 1 regista o custo do mesmo tipo de tarefa com rede. Fixar tier por fase (recomendação: `Auto` para trabalho corrente, `Ultimate` só para arquitetura e debugging difícil, `Efficient`/`Fast` para comunicadores, cuja tarefa é registar, não raciocinar sobre DSP).

### 6.3 Condições de saída por fase

| Fase | Entrega mínima | Condição de saída (verificável) |
|---|---|---|
| 0 | inventário real, lacunas, baseline, decisões agrupadas | cada caminho e capacidade ligado a evidência **ou** classificado como pendente com comando; D-01/D-02/D-03/D-05 decididas |
| 1 | um pedido desce a uma equipa, regressa e é recuperável noutra sessão | cliente Windows, equipa e permissões confirmados; encaminhamento **e** retoma demonstrados (P1-06, P1-07) |
| 2 | gavetas aprovadas, registos incrementais, verificações do scribe e do guardião | ensaios de duas worktrees, alteração declarada em falta, diff sem registo e teste com tolerância alterada — **os quatro** a passar (P2-04, P2-08, P2-11) |
| 3 | Motor, QA, Debugging e Benchmarks executam um caso real | mesmo projeto, buffer e dispositivo com um worker e com a configuração habitual; builds e profiling **fora** da medição (P3-06, P3-07) |
| 4 | atualização A→B com automação; abrir, editar, guardar, recuperar | verificação áudio **e** UI independentes; artefacto em falta tem preparação e responsável (P4-01, P4-04) |
| 5 | painel e investigador mostram onde se perdeu uma condição e se a mudança à skill evitou a repetição | instrumentado desde o primeiro percurso; comparação com baseline; sessão nova recupera evidência **e limitações** (P5-06) |

### 6.4 Paralelismo permitido e proibido

| Em paralelo | Porquê |
|---|---|
| P0-01..P0-06 (checkout) ∥ P0-07..P0-10 (cliente) ∥ P0-16 (protótipo) | dependências disjuntas; três frentes de descoberta |
| P0-12 (hooks) **cedo**, antes de existir rede | sem instrumentação precoce não há observações para comparar na Fase 5. É a razão de D estar na Fase 0 e não no fim |
| P2-01..P2-06 (estado) ∥ P2-09..P2-11 (catálogo) | escritores e gavetas diferentes: scribe vs guardião |
| P2-12..P2-14 (headers) ∥ P2-07/P2-08 (verificação do scribe) | um é build system, o outro é Git |
| P4-01 (preparar artefactos) ∥ Fase 3 | artefactos são trabalho do Diogo/hosts, não competem com a medição |
| P5-01 (painel) ∥ pilotos F3/F4 | o painel é construído com dados que já existem |

| Não pode ser paralelo | Porquê |
|---|---|
| corridas de benchmark no X3D entre si, nem com builds/profiling | contamina a medição; o brief exige serialização |
| P2-13 antes de D-06 | sem fronteira aprovada o teste não tem oráculo |
| F4 antes de P4-01 | sem A/B e projeto antigo o piloto produz teatro, não evidência |
| A/B de skill (P5-04) com qualquer outra alteração de skill/fichas | duas variáveis destroem a comparação |
| análise/promoção de melhorias antes dos pilotos | pode acontecer depois; instrumentação é que tem de ser antes |

**Caminho crítico:** P0-01 → P0-03 → P0-11 → D-01/D-03/D-05 → P1-02 → P1-06 → P1-07 → D-02 → P2-02 → P2-03 → P2-07 → P3-03 → P3-06 → P4-03 → P5-04 → P5-07. Tudo o resto tem folga.

---

## 7. Plano de validação e recuperação

### 7.1 Matriz de ensaios

Cada linha é um ensaio com resultado esperado e evidência. Um ensaio que não produz evidência não conta como passado.

| # | Cenário | Ensaio | Esperado | Evidência | ID |
|---|---|---|---|---|---|
| 1 | Passagem vertical | pedido desce a Host e regressa | resposta resolve a intenção e cita `ficheiro:linha` | dossiê + resposta | P1-06 |
| 2 | Continuidade | fechar sessão, abrir processo novo só-leitura | mesmas refs e mesmos limites, sem histórico | transcrição + comparação | P1-07 |
| 3 | Ativação de skill | pergunta que omite o nome | explícita e automática ambas OK, ou problema de ativação isolado | tabela de 4 colunas | P1-05 |
| 4 | Fronteira de escrita | `qa-audio` tenta escrever no módulo motor | negado, com mensagem e evento | evento `PermissionDenied`/hook | P1-04 |
| 5 | Duas worktrees | appends ao mesmo assunto e ficheiro | nenhuma entrada perdida; blocos intactos | validador + antes/depois do merge | P2-04 |
| 6 | Lock órfão | matar o escritor a meio | lock recuperado; pedido continua na fila | registo de recuperação | P2-03 |
| 7 | Selo | publicar e selar | nenhum commit contém o próprio hash; atraso visível | dois commits + consulta | P2-05 |
| 8 | Alteração sem registo | alterar produto governado e tentar fechar | hook `Stop` bloqueia com mensagem acionável | saída do bloqueio | P2-07/P2-08 |
| 9 | Diff sem registo / registo sem diff | ambos os sentidos | detetados nos dois sentidos | parecer do scribe | P2-08 |
| 10 | Cobertura enfraquecida | alargar tolerância até ficar verde | verde **não** é aceite; exige execução + decisão | parecer do guardião + decisão | P2-11 |
| 11 | Fronteira de headers | include proibido em cópia; include necessário removido | falha nas duas classes, com classificação correta; passa ao repor | 3 execuções + `git status` limpo | P2-14 |
| 12 | Índice descartável | apagar índice e reconstruir | mesmas respostas | comparação de consultas | P2-06 |
| 13 | Retoma | interromper append; publicar tarde; secção desatualizada | nada perdido; ambos os estados visíveis | 3 ensaios | P2-15 |
| 14 | Medição comparável | 1 worker vs configuração habitual | distribuição, pior callback, overruns, n.º blocos, config | CSV por corrida + sha256 | P3-06 |
| 15 | Contaminação | registar processos/energia/temperatura + overhead dos hooks | contaminação declarada; overhead medido fora | registo de janela | P3-07 |
| 16 | Compatibilidade A→B | abrir/editar/guardar/atualizar/recuperar | instância, estado e automação preservados ou bloqueio explícito | comparação + gravação | P4-03 |
| 17 | Independência da verificação | QA Áudio e QA UX verificam trabalho alheio | dois pareceres separados | pareceres | P4-04 |
| 18 | Eventos perdidos | apagar base; reingerir; duplicar linha; evento tardio | mesmo painel; sem duplicados; atraso assinalado | consultas antes/depois | P5-01 |
| 19 | A/B de skill | uma variável, ordem alternada | métrica primária é aceitação do produto | ficha do ensaio + diff | P5-04 |
| 20 | Reversibilidade | desligar plugin e voltar a versão anterior | registos intactos; rede desligada e reativada | ensaio de rollback | P1-09 |

### 7.2 Falhas de comunicação — deteção e recuperação

| Falha | Como se deteta | Recuperação | Onde fica registado |
|---|---|---|---|
| Skill não ativa automaticamente | teste com nome omitido (P1-05); nenhum evento de aceitação para o perfil esperado | invocação explícita `/core-…`; corrigir `description` **numa versão nova**, não a quente | `descoberta/ativacao.md`, fila separada da qualidade |
| Delegação para perfil inexistente | `PostToolUseFailure` no `Agent`; `qoder agents list` não mostra o nome | corrigir nome/âmbito; `--agents` só para diagnóstico | log da equipa + evento de falha |
| Ministro não devolve | `SubagentStart` sem `SubagentStop`; `timeoutMins`/`maxTurns` atingidos | coordenador reencaminha ao especialista diretamente e regista o desvio | dossiê com «ramo contornado» |
| Loop de reencaminhamento | contagem de encaminhamentos por tarefa acima do limiar | `maxTurns` por ficha + regra «uma pergunta, um destinatário»; coordenador pergunta ao Diogo | dossiê + métrica de retrabalho |
| Contexto insuficiente na equipa | `InstructionsLoaded` não mostra a regra esperada; resposta pede o que já foi dito | `core-arranque` injeta o índice da secção; regra `glob` corrigida | evento de contexto + entrada «condição em falta» |
| Resposta sem referências | verificação do scribe no fecho | hook `Stop` bloqueia; resposta volta ao comunicador | parecer do scribe |
| Condição perdida em compressão | `PreCompact`/`PostCompact` entre a pergunta e a resposta | comunicador reescreve a condição no dossiê **antes** de continuar; investigador marca o caso | evento de compressão + caso de investigação |

**Princípio de recuperação** `[P]`: nenhuma destas falhas se resolve apagando ou reescrevendo registos. Resolve-se **acrescentando** a entrada que descreve o desvio. O histórico do erro é o material com que a Fase 5 melhora a organização.

### 7.3 Eventos perdidos

Três garantias e um limite declarado:

1. **Origem em ficheiro**: os hooks escrevem JSONL; a base é derivada. Perder a base não perde observações (ensaio 18).
2. **Idempotência**: reingerir o mesmo ficheiro não duplica eventos (chave de dedup em 4.4).
3. **Honestidade sobre lacunas**: se um hook falhar ou o evento só existir no CLI, o painel mostra **cobertura de eventos** por sessão. Não se interpola.
4. **Limite**: um acontecimento que nunca gerou evento nem entrada de log é **irrecuperável**. É por isso que o comunicador regista *durante* a passagem e não no fim `[D]`.

### 7.4 Reversibilidade — desligar sem perder resultados

`[V-doc]` No IDE, componentes de plugin não se desativam individualmente (V2). **No CLI há uma exceção útil** (V23): `agents.overrides.<nome>.enabled = false` desliga **um perfil** sem desligar o plugin, e `modelConfig`/`runConfig`/`tools` permitem reconfigurar esse perfil sem editar a fonte. `[PV]` confirmar que se aplica a agentes fornecidos por plugin. A reversibilidade tem, por isso, quatro níveis, todos ensaiados em P1-09:

| Nível | Como | O que preserva |
|---|---|---|
| **Desligar um hook** (segundos) | criar `docs/rede/flags/obs.off` ou `CORE_OBS=0`; o dispatcher sai imediatamente | todos os registos e eventos já escritos; nenhuma edição de `settings.json` |
| **Desligar ou reconfigurar um perfil** (CLI) | `agents.overrides.<nome>.enabled=false`, ou `modelConfig.model` / `runConfig.maxTurns` / `tools` em `settings.local.json` | registos e evidência; a fonte do plugin fica intata |
| **Desligar a rede inteira** | `qoder plugins disable core` (ou desativar o plugin no painel do IDE) | registos em Git, evidência, índice; nada do que é canónico vive dentro do plugin |
| **Voltar a uma versão anterior de uma skill** | `git checkout core-plugin-v0.1.0 -- tools/qoder/core; qoder plugins install .\tools\qoder\core --scope project; /plugins reload` | todo o `docs/rede/**`; a versão fica identificada no painel e nas entradas |
| **Desinstalar mantendo dados** | `qoder plugins uninstall core --scope project --keep-data` | dados do plugin; e os registos continuam em Git |

**Regra que torna isto verdade** `[P]`: `QODER_PLUGIN_DATA` é usado **só para caches**. Evidência, registos e decisões vivem em `docs/rede/**`. Se esta regra se quebrar, o rollback passa a perder resultados — é uma invariante do desenho, não uma preferência.

**Reversibilidade do lado do produto**: o piloto A→B mantém a versão A instalada em paralelo até o Diogo aceitar B; qualquer alteração de estado/chunk tem de ter caminho de volta ou bloqueio explícito (P4-05).

### 7.5 Compatibilidade de projetos antigos

| Risco na atualização A→B | Ensaio | Critério |
|---|---|---|
| Parâmetro renomeado | abrir projeto antigo com B e comparar valores por ID | mapa de IDs escrito e testado, ou bloqueio |
| Parâmetro removido | idem | valor antigo preservado ou perda declarada ao Diogo antes de aceitar |
| Automação em parâmetro alterado | comparar curvas antes/depois, por parâmetro e por tempo | igualdade dentro de tolerância declarada no catálogo |
| Layout de buses alterado | abrir e verificar routing e silêncio | nenhum canal silencioso ou trocado |
| Versão de chunk/state | guardar com B e reabrir com A (se A continuar suportado) | comportamento declarado: retrocompatível ou não |
| Cache de descoberta de plugins | forçar re-scan após atualização | instância correta, sem duplicados nem «plugin em falta» |
| Latência declarada | comparar latência reportada A vs B | diferença explicada ou bloqueio |

Áudio: comparação de sinal (null-diff) na mesma configuração, com tolerância do catálogo. UI: percurso musical executado com rato e teclado, incluindo seleção, foco e Undo. **Duas verificações independentes**, nunca feitas por quem implementou (P4-04).

---

## 8. Primeira sessão executável

**Tarefa:** `T-20261120-main-01` (esquema geral: `T-<data>-<worktree>-<seq>`). **Item de backlog:** P1-06. **Perfil que pega:** `coord`.

### 8.1 Pré-requisitos (todos verificáveis antes de começar)

| Pré-requisito | Como confirmar | Se falhar |
|---|---|---|
| D-01, D-03, D-05 decididas | `docs/rede/decisoes/` | parar; pedir decisão (secção 9) |
| Checkout identificado | P0-01 feito | fazer P0-01 primeiro (5–10 min) |
| Plugin `core` instalado no projeto | `qoder plugins list --json` | P1-01 |
| 5 fichas + 6 skills carregadas | `qoder agents list`; `/` mostra `core-…` | P1-02; reiniciar cliente (V7) |
| Hooks de recolha ativos | JSONL tem os 6 tipos (P0-12) | P0-12; sem isto a sessão não é observável |
| Permissões e guarda de escrita | P1-04 | não escrever nada até estar ativo |
| Árvore `docs/rede/` autorizada | D-02 ou autorização explícita para o efeito | escrever só em `passagens/` e `logs/`, com autorização |

**Dados de entrada:** revisão de trabalho (`git rev-parse HEAD`), branch, estado sujo sim/não, worktree, nome do dispositivo, modelo e tier fixados (P0-08), e o pedido abaixo. Nada disto é inventado: vai literal para o dossiê.

### 8.2 O pedido a dar ao Qoder

```text
Usa a rede do Core para esta intenção, sem alterar código:

«Quero atualizar um VST incluído com o Core sem perder a automação dos projetos antigos.»

Antes de qualquer alteração, preciso de uma resposta verificável a três perguntas:
1. Que percurso do Host guarda e restaura o estado e a automação de uma instância de plugin?
   Indica ficheiro e linha.
2. Que testes cobrem hoje esse percurso? Para cada um: comando, oráculo e tolerância.
   Se não existir teste, diz «sem cobertura» em vez de estimar.
3. O que falta verificar para eu poder decidir a atualização com segurança?

Encaminhamento: coordenador → ministro Engenharia → equipa Host VST. Consulta apenas
esse ramo. O comunicador do Host regista a passagem enquanto ela ocorre.

Formato da resposta final: intenção original · resposta às três perguntas com referências
ficheiro:linha · condições e limites do que foi verificado · o que ficou por verificar ·
próxima tarefa e dono. Não alteres código. Não inventes caminhos: o que não encontrares
fica «por verificar» com o comando que o resolveria.

Tarefa: T-20261120-main-01. Regista o dossiê em docs/rede/passagens/T-20261120-main-01.md
e o log da equipa em docs/rede/logs/host/<worktree>.jsonl.
```

### 8.3 O que cada perfil faz, e onde termina a sua responsabilidade

| Perfil | Faz | Termina quando | Não faz |
|---|---|---|---|
| `coord` | preserva a intenção literal, cria a tarefa, encaminha a `min-eng`, agrega | a resposta final resolve as três perguntas ou identifica o bloqueio | investigar código ele próprio |
| `min-eng` | escolhe o ramo Host, pede o ponto da secção | o ponto tem revisão e momento | consultar Motor ou JUCE «por precaução» |
| `host` | lê o percurso de estado e cruza com o catálogo | cada afirmação tem `ficheiro:linha` ou «por verificar» + comando | alterar código; estimar cobertura |
| `host-comm` | regista perguntas, destinatários, respostas e condições **durante** a passagem | cada pergunta tem resposta ou estado pendente | reescrever a intenção |
| `comm-geral` | fecha o dossiê e propõe a entrada de estado | o dossiê permite chegar à fonte sem o chat | selar (isso é do scribe, Fase 2) |

### 8.4 Resposta esperada (forma, não conteúdo inventado)

```text
Intenção: «atualizar um VST incluído com o Core sem perder a automação dos projetos antigos» (literal).
1. Percurso de estado: <ficheiro:linha> → <ficheiro:linha>. Automação: <ficheiro:linha>.
   [ou: por verificar — comando: Select-String -Pattern 'setStateInformation' …]
2. Cobertura: <teste_id> · comando <…> · oráculo <…> · tolerância <…>
   [ou: sem cobertura para <afirmação>]
3. Por verificar: <lista>, cada item com o ensaio mínimo e o dono.
Condições: revisão <hash>, branch <…>, dirty <sim/não>, dispositivo <…>, modelo <…>, tier <…>.
Limites: nada foi executado; nenhuma afirmação de cobertura sem teste registado.
Próxima tarefa: P1-07 (retoma em sessão nova) · dono: scribe + coord.
Refs: docs/rede/passagens/T-20261120-main-01.md · docs/rede/logs/host/<wt>.jsonl
```

**Critério de aceitação desta sessão:** a resposta resolve a pergunta original, cada afirmação técnica resolve para `ficheiro:linha` ou está marcada «por verificar» com comando, e **`git status` não mostra alterações ao produto**.

### 8.5 Como confirmar que ficou registada e recuperável

```powershell
# 1. existe dossiê e log, com entradas válidas
Get-Content docs\rede\passagens\T-20261120-main-01.md
.\tools\rede\registo-valida.ps1            # se P2-02 já existir; senão conferir os campos
                                           # obrigatórios e o sentinela de fim de bloco à mão
# 2. o produto não foi tocado
git status --porcelain                     # esperar apenas docs/rede/**
# 3. os seis acontecimentos existem para esta tarefa
.\tools\rede\obs-ingere.ps1
.\tools\rede\obs-painel.ps1 -Tarefa T-20261120-main-01
# 4. FECHAR a sessão. Depois, num processo novo, só leitura:
qoder -p "Sem usar histórico: onde está decidido o que o Host preserva ao atualizar um VST,
que cobertura existe e o que ficou por verificar? Dá referências commit:caminho:linha." `
  --permission-mode dont_ask --allowed-tools 'Read,Grep,Glob'
```

**Passo 4 é o portão.** Se a sessão nova devolver as mesmas refs **e os mesmos limites**, a Fase 1 está concluída e a próxima tarefa é P2-01 (árvore governada, com D-02). Se devolver as conclusões mas não os limites, a Fase 1 **não** está concluída: falta registar condições, e isso é trabalho do comunicador, não do modelo.

---

## 9. Decisões para o Diogo, por ordem de bloqueio

| ID | Decisão | Opções | Recomendação `[P]` | Bloqueia | Custo de adiar |
|---|---|---|---|---|---|
| **D-01** *(parcialmente decidida)* | Runtime e dispositivo — **modelos já escolhidos pelo Diogo**: Qwen4-Max-Preview, Qwen3.8-Flash, Efficient (matriz em 3.8) | (a) CLI nativo Windows como runtime da rede + IDE para trabalho visual; (b) IDE como runtime principal; (c) ambos com plugin partilhado | **(a)**, com IDE para QA UX. CLI dá `Agent(...)`, `isolation: worktree`, hooks PowerShell e 23 eventos. Fixar tier por fase e `enableAutoUpdate: false` | toda a Fase 1 | nada avança: fichas, permissões e hooks dependem disto |
| **D-02** | Árvore governada e âmbito do append-only | (a) `docs/rede/**` como proposto; (b) outra raiz; (c) índice dentro do Git | **(a)** + `merge=union` + índice fora do Git | escritas da Fase 1, toda a Fase 2 | agentes escrevem em sítios diferentes e a continuidade falha |
| **D-03** | Composição das secções e lugar dos ministros | (a) ministros como perfis de encaminhamento com `Agent(...)`; (b) ministros como líderes de equipas IDE (exige partir Qualidade em duas → 12 equipas); (c) ministros consultivos, coordenação encaminha diretamente | **(a)**. Preserva 11 equipas e o ramo mínimo. Se o IDE for o runtime, cai em (b) ou (c) — decidir com D-01 | configuração da Fase 1 | risco de criar equipas com nomes errados, **que não se podem renomear** (V18) |
| **D-05** | Nomes públicos de plugin, skills, agentes e equipas | (a) plugin `core`, skills `core-*`, agentes curtos (`coord`, `host`, …); (b) tudo prefixado (`core-host`) | **(a)**: prefixo nas skills (evita colisões de ativação), nomes curtos nos agentes (custo de contexto e legibilidade dos eventos) | Fase 1 | nomes de equipa IDE são imutáveis; renomear depois = recriar |
| **D-06** | Contrato arquitetural de `core-headers-publicos` | (a) lista fechada de headers + arestas permitidas proposta pelo dono; (b) fronteira ainda por definir | **(a)**, com exceções escritas e justificadas | P2-13/P2-14 | o teste não tem oráculo; qualquer resultado é opinião |
| **D-07** | Artefactos de prova e limiares | projeto pesado (N faixas, M plugins), VST3 A/B, projeto antigo com automação, mockup aprovado | fixar N e M e nomear dono/prazo por artefacto | F3 (projeto pesado), F4 (restantes) | pilotos produzem teatro em vez de evidência |
| **D-08** | Quem pode reduzir cobertura ou tolerâncias | (a) ninguém sem decisão escrita do Diogo; (b) guardião pode até X% | **(a)** | P2-10/P2-11 | «verde» passa a poder significar «mais fraco» |
| **D-09** | Política da janela X3D | (a) máquina distinta, hooks desligados na janela; (b) mesma máquina, isolamento temporal; orçamento de contaminação | responder primeiro «X3D é a mesma máquina?» (P0-13); recomendo hooks off + overhead medido à parte | P3-06 | comparação de builds ilegítima |
| **D-04** | Posição e acessos do investigador global | (a) 24.º agente transversal, reporta a `coord`, **fora** da equipa de Coordenação (limite de 5), leitura de todos os logs, escrita só `investigacao/**`; (b) sexto membro da Coordenação (**não cabe** no IDE); (c) skill do coordenador, sem agente próprio | **(a)**. Confirma a intenção do desenho (24 agentes, 11 equipas) sem violar o limite do cliente. Decidir até ao fim da Fase 2 para que a instrumentação nasça com ele | Fase 5 (análise); instrumentação desde F0 | perde-se a janela de observação comparável |
| **D-13** | Composição final da rede | manter 24 / reduzir perfis / fundir equipas | decidir **depois** de P5-03/P5-05/P5-06, com custo de coordenação medido | — (é a decisão final) | manter rede cara sem prova de retorno |
| **D-10** | Estudo de VST2 | (a) adiar; (b) abrir caso de uso + viabilidade agora | **(a)**: entra quando houver caso de uso concreto; a pesquisa usa fonte primária com versão e ensaio mínimo | — | dispersa a Fase 4 |
| **D-11** | WSL | (a) não; (b) sim, só se cross-session messaging (V19) for necessidade concreta | **(a)**. Hooks PowerShell e delegação do cliente cobrem a Fase 1 | — | complexidade sem necessidade demonstrada |
| **D-12** | Plano business (Projects/discussions) | (a) não; (b) sim | **(a)** por agora; equipas e agentes funcionam sem isso (V18) | — | nenhum |

**Quem prepara cada decisão** (a decisão é sempre do Diogo): D-01 e D-05 `coord`; D-02 `scribe`; D-03 `coord` + `min-eng`; D-04 `investigador`; D-06 dono do módulo + `guardiao`; D-07 `host` + `juce` + Diogo; D-08 `guardiao`; D-09 `bench`; D-10 `pesquisa`; D-11/D-12 `coord`; D-13 `coord` + `investigador`; D-14/D-16 `juce` + `guardiao`; D-15 `coord` + `guardiao`.

**Como responder de forma que desbloqueie:** para cada decisão, uma linha em `docs/rede/decisoes/D-xxx.md` com *decisão · data · âmbito · o que fica explicitamente fora*. O scribe sela. Basta «D-01: (a), CLI, tier Auto, Qwen4-Max se disponível» para a Fase 1 arrancar.

| **D-14** | Adotar JIVE para UI/UX? Em que âmbito? | (a) spike num ecrã pequeno, em paralelo com o C++ existente; (b) migrar a UI; (c) não adotar | **(a)**, com versão fixada e três números medidos; ver `Avaliacao-JIVE-UI-UX.md` | P2-17, P4-08, P4-09 (12–24 h de agente) | piloto de UI continua a depender só de captura vs mockup, sem oráculo objetivo |
| **D-15** | Onde vivem as fichas, dado que agentes de plugin perdem `hooks`/`mcpServers`/`permissionMode` (V24) | (a) plugin único `core`, fronteiras por `permissions` do projeto + hooks globais com `agent_type`; (b) fichas ao nível do projeto (`.qoder/agents/`), mantendo esses campos; (c) híbrido | **(a)** — preserva o plugin único do desenho e não perde capacidade real, porque a fronteira determinística já era o hook | redação final das fichas (P1-02) | risco de escrever fichas com campos que o cliente descarta em silêncio |
| **D-16** | Versão JIVE fixada e política de atualização | (a) tag/commit fixo, atualização só com ensaio de migração; (b) seguir `main` | **(a)**; `BREAKING_CHANGES.md` como fonte obrigatória; o Core fixa a sua JUCE (o JIVE testa contra `master`) | qualquer trabalho JIVE | breaking changes entram sem aviso no meio de um piloto |

**Decisões que podem esperar sem custo:** D-10, D-11, D-12, D-13 e D-16 (esta última só quando D-14 for «sim»). **Decisões que não podem:** D-01, D-02, D-03, D-05, D-15 (Fase 1) e D-06 (Fase 2). D-14/D-16 só bloqueiam o ramo de UI em JIVE.

---

## 10. Critério de aceitação deste plano

O brief pede que outro agente consiga pegar na primeira tarefa, localizar os pré-requisitos, saber onde termina a sua responsabilidade, produzir a evidência pedida e entregar a tarefa seguinte **sem o Diogo voltar a explicar a organização**. Onde isso está garantido:

| Exigência | Onde está |
|---|---|
| Pegar na primeira tarefa | secção 8 (pedido literal) e P0-01/P1-06 no backlog |
| Saber que modelo usar | 3.8 (matriz por perfil, com esforço e regra de escalada) |
| Localizar pré-requisitos | 8.1 (tabela com comando de confirmação e alternativa se falhar) + coluna «Dep.» do backlog |
| Saber onde termina a responsabilidade | 8.3 (por perfil) + «destino de escrita» e «critério de conclusão» das 24 fichas + guarda de escrita por `agent_type` |
| Produzir a evidência pedida | coluna «evidência esperada» em todos os 63 itens + contrato de entrada (4.2) + esquema de eventos (4.4) |
| Entregar a tarefa seguinte | Anexo B (contrato de entrega de tarefa, seis campos fixos) + caminho crítico em 6.4 |
| Não reexplicar a organização | secção 3 (mapa, fichas, skills, registos, permissões) + regra núcleo `always_on` e regras `glob` que a tornam carregável em sessão nova |
| Distinguir desenho / observado / proposto | marcas `[D]` `[V-doc]` `[V-obs]` `[P]` em todo o documento; «por verificar» com comando em 2.4 |

**O que este plano deliberadamente não faz:** não configura o Qoder, não cria a árvore no repositório, não corre pilotos, não fixa caminhos do Core como se os tivesse visto, não assume que a rede compensa o custo de coordenação. Isso pertence à implementação, e a primeira decisão a tomar é D-01.

---

## Anexo A · Fontes consultadas

Documentação oficial do Qoder, consultada em **2026-11-20**. Verificada na documentação; **não** verificada na instalação do Diogo.

| Página | O que sustenta neste plano |
|---|---|
| [extensions/plugins](https://docs.qoder.com/extensions/plugins) | V1, V2 — plugin único, componentes não desativáveis individualmente |
| [cli/plugins](https://docs.qoder.com/cli/plugins) | V3 — layout, manifesto, scopes, install/enable/disable/uninstall `--keep-data`, `isolation: worktree` |
| [extensions/subagent](https://docs.qoder.com/extensions/subagent) · [cli/subagent](https://docs.qoder.com/cli/subagent) | V4, V5, V6 — fichas, `Agent(...)`, precedência, `--agents`, headless |
| [extensions/skills](https://docs.qoder.com/extensions/skills) | V7 — `SKILL.md`, caminhos, prioridade, ativação automática vs explícita |
| [extensions/hooks](https://docs.qoder.com/extensions/hooks) | V8, V13 — 12 eventos no IDE, `command`/`http`, config partilhada, `Stop` bloqueável |
| [cli/hooks](https://docs.qoder.com/cli/hooks) | V9, V10, V11, V12, V13, V14 — 23 eventos, correladores, PowerShell, `async`, tipos de hook, merge de config |
| [cli/permissions](https://docs.qoder.com/cli/permissions) | V15 — ordem de decisão, modos, headless `ask`→`deny` |
| [cli/memory](https://docs.qoder.com/cli/memory) | V16 — `AGENTS.md`, regras e triggers, carregamento on-demand |
| [cli/agent-teams](https://docs.qoder.com/cli/agent-teams) | V17 — beta, flag, ciclo de vida, `resume` não traz membros |
| [qoder/custom-agent-teams](https://docs.qoder.com/qoder/custom-agent-teams) | V18 — líder + 4 membros, nome imutável, picker, delegação, plano business |
| [cli/cross-session-messaging](https://docs.qoder.com/cli/cross-session-messaging) | V19 — macOS/Linux apenas |
| [cli/installation](https://docs.qoder.com/cli/installation) | V20 — Windows, instalação, auto-upgrade |
| [user-guide/chat/model-tier-selector](https://docs.qoder.com/user-guide/chat/model-tier-selector) | V21 — tiers, modelos Qwen, faturação de sub-agentes, seletor autoritativo |
| [cli/subagent](https://docs.qoder.com/cli/subagent) (secções de modelo, hooks e overrides) | V22, V23, V24 — `model`/`effort` por ficha, `agents.overrides`, política de segurança dos agentes de plugin |
| [github.com/ImJimmi/JIVE](https://github.com/ImJimmi/JIVE) (README, BREAKING_CHANGES, CMakeLists, `jive_sources.cmake`, `package-lock.cmake`, LICENSE) | secção 4.5 e `Avaliacao-JIVE-UI-UX.md` — JIVE 2.0.0, MIT, XML/JSON, hot reload, embed por configuração, JUCE a `master` |

Outras páginas relevantes para a implementação, ainda não lidas em detalhe: `cli/builtins-reference` (lista exata de sub-agentes e skills built-in), `cli/settings` (ordem de aplicação), `cli/Skills` (guia completo de `SKILL.md`), `cli/workflows`, `cli/parallel-tasks`.

## Anexo B · Contrato de entrega de tarefa

Todas as tarefas terminam com este bloco de seis campos, escrito pelo comunicador da equipa no dossiê. É o que permite passar à tarefa seguinte sem o Diogo reexplicar nada.

```text
1. Intenção original (literal, não reescrita)
2. O que foi feito e o que ficou por fazer
3. Evidência: refs commit:caminho#linha + run_id + condições (build, sr, buffer, device, modelo, tier)
4. Limites: o que NÃO foi verificado e porquê
5. Decisão pendente: ID, a quem, o que bloqueia
6. Próxima tarefa: ID do backlog + dono + pré-requisitos já satisfeitos
```

**Checklist de arranque para o agente que pegar na primeira tarefa**

1. Ler secção 8 e confirmar 8.1. Se algum pré-requisito falhar, resolver esse item de backlog primeiro — não improvisar.
2. Ler a ficha do perfil em `inventario-agentes.csv`. O «destino de escrita» é uma fronteira, não uma sugestão.
3. Confirmar que a recolha está ativa (JSONL a crescer). Sem observação, a tarefa não conta para a Fase 5.
4. Executar, registar **durante**, e nunca reescrever entradas anteriores.
5. Fechar com o bloco de seis campos. Se o hook `Stop` bloquear, é porque falta registo — acrescentar, não contornar.
6. Se aparecer uma decisão de arquitetura, parar e inscrever em `decisoes/`. Os agentes investigam e propõem; **o Diogo decide**.
