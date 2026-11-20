# Adenda corretiva · Plano-Rede-Core-Qoder.md

**Para:** Diogo · **De:** agente planeador (Qoder, sessão `D:\CORE-ORG`) · **Data:** 2026-11-20
**Forma:** adenda. Não reescreve o plano entregue, não altera código, não configura o Qoder, não corre builds nem testes.
**Repositório lido:** `D:\CORE\CORE` · remote `https://github.com/d-aicore/core.git` · branch `main`
**Baseline que usei (tua instrução «USAR ESTA VERSAO»):** `0d7d8ce` = `0d7d8cea19225d3f4e9163f043ff2111b6038d9a`, 2026-11-20 13:05:01 +0000
**Documentos lidos:** `Plano-Rede-Core-Qoder.md`, `Brief-Plano-Implementacao-Core-Qoder.md`, `Avaliacao-JIVE-UI-UX (1).md`, contexto de produto `339a8b82-…txt`, e no repo: `AGENTS.md`, `README.md`, `ESTADO.md`, `docs/README.md`, `docs/AUDITORIA.md`, `docs/relatorios/MODELO.md`, `docs/plan/*`, `TRIAGEM-TESTES.md`, `CMakeLists.txt`, `ci/*`.

---

## 0. A instrução «USAR ESTA VERSAO», e o que ela muda

Assunto real do commit (medido, difere ligeiramente do que colaste): `Build: complete sanitizer target list (ENV-01) + reproducible JUCE D113 patch + review-env tooling`.

`0d7d8ce` é ancestral de `HEAD` (`git merge-base --is-ancestor 0d7d8ce HEAD` → sim), **5 commits atrás**. Entre os dois: `587bf5b` (Data), `234f956` (Engine: RT proofs), `aacc6d1` (Docs), `480c4b1` (Ledger D115/D116), `59275d2` (HEAD, Docs).

**Chamada que fiz:** uso `0d7d8ce` como *baseline de leitura* (é a tua instrução literal) e registo `59275d2` como *revisão viva*, com o delta medido. Não escolhi um dos dois para excluir o outro: o delta é curto e está medido abaixo.

| O que mede | Em `0d7d8ce` (pin) | Em `59275d2` (HEAD) | Consequência |
|---|---|---|---|
| `add_test` em `tests/CMakeLists.txt` | **22** | **31** | «cobertura hoje» depende do SHA. As 9 provas novas entram em `234f956`/`587bf5b`, depois do pin. |
| Decisões no ledger | até **D114** | até **D116** | D115/D116 só existem depois do pin — e D115 é o mandato que enquadra esta rede. |
| `setStateInformation` (`engine/src/plugins/juce_host.cpp`) | `:348`, `:351` | `:348`, `:365` | refs citáveis só com o SHA ao lado |
| `getStateInformation` (idem) | `:392`, `:484` | `:406`, `:498` | idem |
| `findAllTypesForFile` (idem) | `:335`, `:656` | `:335`, `:670` | idem |
| callback de áudio (`engine/src/io/device.cpp`) | `:79`; wiring `config.dataCallback` `:160` | `:79`; wiring `:177` | o callback não se moveu; o wiring moveu-se 17 linhas |

**Regra que isto prova e que fica para a rede:** nenhuma afirmação viaja sem `sha:ficheiro:linha`. O plano Qwen já o pedia; agora há um exemplo medido de porquê.

**Nota sobre D140–D142:** aparecem no `ESTADO.md` do pin (linhas 409–410) mas **não são números livres** — são números do predecessor B, arquivados como `M-D##` por D74/D82, e a hipótese de renumerar D72/D73 como D141/D142 está explicitamente invalidada.

---

## 1. Adenda corretiva ao plano

Legenda: **[obs]** observado no repo · **[dec]** decisão de produto ratificada no ledger · **[prop]** proposta minha, reversível.

| # | Secção / ID do plano afetado | Pressuposto anterior | Correção | Evidência | Impacto nas dependências |
|---|---|---|---|---|---|
| A1 | §2.1, §2.4 «Checkout», P0-01 | «workspace vazio; nenhum caminho do Core é facto» | **[obs]** Checkout identificado: `D:\CORE\CORE`, `main`, HEAD `59275d2`, 212 commits, **working tree suja (7 entradas)**, mais 2 worktrees ativas em `.agents/worktrees/{ci-gate-unique,flawless-batch}`. Há ≥21 clones de atores em `D:\Core-Projects\*` com `origin D:/CORE/CORE`. | `git remote -v`, `git rev-parse HEAD`, `git status --porcelain`, `git worktree list` | P0-01 fecha. **Novo constrangimento:** nunca escrever no checkout partilhado — a rede trabalha num clone de ator (padrão já existente). |
| A2 | §2.4, P0-02 (motor) | «entrada do motor por verificar» | **[obs]** Callback de áudio: `engine/src/io/device.cpp:79`, wiring `:160` (pin). Grafo/motor: `engine/src/core/{engine,graph,workers,rt_workers,render_job,tempo_map,project,server,qualify}.cpp`. Backend: `engine/third_party/miniaudio.h` + `engine/src/io/miniaudio_impl.c`. Mapa já escrito: `docs/plan/realtime-map.md`. | refs acima ao pin | P0-02 passa de «produzir mapa» a «citar e revalidar mapa existente» (regra 2 de `docs/AUDITORIA.md`: não tratar relatório antigo como descrição do HEAD). |
| A3 | §2.4, P0-03, §8 (pedido piloto) | «VST incluído com o Core; módulo plugin distribuído separadamente» | **[dec+obs]** O Core **não tem som próprio** nem VST criativo distribuído: `AGENTS.md:15` («Core makes no sound of its own»), D91 (AI = processo separado + add-on `addon.json`, **não** VST3 in-process), D104 (sem instrumentos/efeitos/sampler). O host carrega **VST3 de terceiros**: `engine/src/plugins/juce_host.cpp:335` e comentário `:360` (HEAD) «This host loads VST3 only». Distribuição = instalador próprio `app/installer/Setup.cpp` («Core Setup.exe (M6)»); **não há** `.iss/.wxs/.nsi`. | refs acima | **A pergunta do piloto §8 deixa de ser real.** Ver A4. P0-03 fecha com estas refs; P0-13 perde o artefacto «VST3 próprio A e B» e ganha «dois plugins de terceiros + projeto com automação». |
| A4 | §1 (primeiro incremento), §8, P1-06 | Primeiro percurso vertical = Host VST | **[dec]** Prioridade é o **motor** (D99 «flawless»; D115 «dados > tempo real > performance > compatibilidade»; `AGENTS.md` «Engine quality bar»; contexto de produto §7 e §11). O primeiro percurso passa a ser **uma pergunta de leitura sobre o motor**, e o hosting de plugins externos fica para fase posterior. | D115/D116 no ledger (HEAD `59275d2`, `ESTADO.md:208-209`) | P1-06 re-escopado; P3-xx (motor) deixa de ser «Fase 3» e passa a ser o conteúdo da Fase 1. P4-03 (A→B) desce de prioridade sem ser cancelado. |
| A5 | §3.5, §4.2 (i)–(v), P2-01, D-02 | Criar `docs/rede/ESTADO.md` como estado canónico da rede | **[dec]** Proibido na prática: `docs/README.md:19` «**Não criar resumos concorrentes do ESTADO**. Só o escrivão do ledger escreve `ESTADO.md` (D72/D79/D80)»; `AGENTS.md:39` e `:59`. Já existe `ESTADO.md` (canónico, 665 linhas no snapshot `a9a0384`), com Decisões / Pendentes / Invalidadas / Estado medido / Ligações, numeração contínua, entradas nunca editadas, invalidação por referência, namespace `BUG-` (D75). | refs acima | D-02 muda de «aprovar árvore nova» para «**mapear a rede no contrato existente**». P2-01, P2-02, P2-05, P2-07 e P2-16 re-escrevem-se sobre `ESTADO.md` + `docs/relatorios/`. |
| A6 | §3.5 (`logs/<equipa>/<wt>.jsonl` em Git), §4.4, P0-12 | Logs JSONL e evidência volumosa dentro do repo | **[dec+prop]** `docs/README.md`: «Ficheiros temporários, **logs brutos** e builds ficam **fora do repo** salvo evidência pequena, necessária e sem segredos.» Além disso `C:\Users\vk_do\.qoder\settings.json` contém **API keys em texto plano** em `providers` — nenhum hook pode ler, copiar ou commitar esse ficheiro. **[prop]** Observação (JSONL + SQLite derivada) vive **fora** do repo, em `D:\CORE-ORG\obs\`; no repo entra só o relatório pequeno + evidência mínima. Redação de segredos, retenção e limite de tamanho são pré-requisito de ligar qualquer hook, não um acrescento posterior. | `docs/README.md`; `~/.qoder/settings.json` (chave `providers`) | P0-12 ganha um passo de redação obrigatório antes de escrever o primeiro evento. P2-04 (duas worktrees) perde urgência: sem logs comuns no repo, a contenção desaparece do caminho quente. |
| A7 | §4.2 (iii)–(v): `merge=union`, lock por ficheiro, selo em duas fases, índice SQLite com watermarks | Adotar já | **[prop]** Adiar e demonstrar primeiro. `.gitattributes` já existe e protege `knowledge/aicore/**` e `docs/relatorios/evidencia/2026-11-18-deeper-audit/**` de conversão de EOL — qualquer adição tem de coexistir com isto, e `merge=union` sobre `docs/**` interage com ficheiros que o repo declara nunca editar. Com A5+A6, os ficheiros verdadeiramente comuns deixam de existir na rede: o `ESTADO.md` tem escritor único (escrivão) por decisão ratificada. | `.gitattributes` (repo); `docs/README.md:19` | P2-03, P2-04, P2-05, P2-06 caem para «demonstrar se algum dia houver dois escritores». P2-15 mantém-se como ensaio de retoma, mas sobre relatórios + ledger. |
| A8 | §9 (D-01…D-13) e anexo JIVE (D-14, D-16) | Numerar decisões da rede como `D-01`…`D-16` | **[dec]** Colide com o namespace `D###` vivo do ledger (até D114 no pin, D116 no HEAD; D36–D140 do predecessor B arquivados como `M-D##`). A tua regra de entrega é: relatório + pendência, e **só o escrivão escreve `ESTADO.md`**; números atribuídos por ele. | `ESTADO.md` (pin e HEAD), `AGENTS.md:59`, `docs/AUDITORIA.md:7-8` | Todas as «D-xx» do plano passam a **propostas sem número**, com `RD-n` local apenas para rascunho fora do repo. P0-15 muda de «aprovar D-01..D-12» para «fechar propostas e pedir números ao escrivão». |
| A9 | §3.5 (`docs/rede/seccoes`, `passagens`, `decisoes`, `guardiao`, `escrever`), §4.1, `tools/rede/*.ps1` | Nomes portugueses em ficheiros novos dentro do repo | **[dec]** D101 (ratificada 18/11): «Everything written into this repository is in English: … and new documentation» (`AGENTS.md:19-20`). Exceções da própria regra: verbatim do dono e o ledger/histórico existente. **[prop]** O que a rede escrever **no repo** é inglês e segue o contrato que já existe: `docs/relatorios/AAAA-MM-DD-assunto.md` conforme `MODELO.md` + entrada no índice `docs/relatorios/README.md`. O que viver fora do repo (CORE-ORG) pode ficar em PT-PT, como esta adenda. | `AGENTS.md:19-20`; `docs/relatorios/MODELO.md` | P1-03, P1-06, P2-01 mudam de alvo. O «dossiê de passagem» passa a ser o relatório existente; não há formato novo a inventar. |
| A10 | §3.3 (`tools/rede/*.ps1` propostos), §4.1, P0-05 | Escrever ~12 scripts novos da rede | **[obs]** Já existem, exatamente no commit que fixaste: `ci/review-env/` — «agent environment for code review, debug, sanitization and JUCE UI/UX», out-of-tree, idempotente, marcadores SHA-bound, localização canónica `D:\Core-build\core-review`. `run-all.ps1` = Debug build (app+JUCE+tests) + compile DB + merge suite + stack probe + ASan build/canary/suite + clangd smoke + JUCE desktop self-test. `verify.ps1` = verificação **só-leitura** (default `-Src 'D:\CORE\CORE'`). Mais: `ci/gate.ps1` (`:48-49` `VSLANG=1033`+`chcp 65001`; `:56` `ctest --test-dir … --no-tests=error`; `:39` nome de build por GUID → gates concorrentes; `-Desktop` para self-test), `ci/compilar.bat`, `ci/gate.sh`, `ci/tidy_scope.py`, `ci/review-env/{proof-windows.ps1,proof-wsl.sh,run-wsl.sh,prep-wsl-repull.sh}`, `ci/patches/juce-failed-plugin-restart.patch`. | `ci/review-env/README.md:1-12`; `ci/gate.ps1:4,39,48,49,56`; `ci/review-env/verify.ps1:6` | P0-05 encolhe drasticamente. **Nenhum script novo de verificação antes de correr `verify.ps1` e `gate.ps1`.** O que falta à rede é só: observação (hooks) e delegação — não verificação. |
| A11 | §2.4 (`cmake --list-presets`, `gtest_discover_tests`), P0-04, §4.3 (`ctest -R core-headers-publicos`) | Presets CMake + gtest | **[obs]** **Não há `CMakePresets.json`.** Framework de teste **próprio** (`CHECK_EQ`, `CHECK_NEAR`; ex. `tests/engine_tests.cpp:166-168`), 23 `.cpp` em `tests/`, 22 `add_test` no pin / 31 no HEAD, etiqueta `merge` (`tests/CMakeLists.txt:4` «label "merge": fast, every build and before every merge»). JUCE 9.0.5 fixado por URL+SHA256 em `CMakeLists.txt:64-66` (commit `d60b7a78…`), override local `-DFETCHCONTENT_SOURCE_DIR_JUCE=D:/Core-deps/JUCE-9.0.5` (`:61-62`; a cópia existe). D97: build dir **ASCII e sem espaços** (limitação `juceaide`). | refs acima | P0-04 = `ci/gate.ps1` ou `ctest -L merge -N` numa build configurada — **custa tempo de máquina**, não é leitura. P2-09 parte das suites já triadas em `TRIAGEM-TESTES.md` (88 casos / 1288 verificações medidas em `5d0b584`, Linux — **histórico**, a re-medir em Windows no pin). P2-13 mantém método, muda alvo. |
| A12 | §3.1, §3.2 (24 perfis), §3.6 | Equipas divididas por tecnologia (motor/host/JUCE/QA/debug/bench) | **[obs+prop]** Faltam responsáveis explícitos para **Pattern Maker, Tools, MIDI, automação, persistência/recuperação de projetos** (pedido §2 do contexto de produto). Domínios reais no pin: `patterns/{bass,break,cymbals,drop,drums,hats,lead,perc}`, `pcore/styles.json`, `templates/`, `lang/`; `app/domain/src/{document,autosave,history,edit,bounce,bitwig,follow,groove,assets,core_plugins}.cpp`; `app/{control,desktop,engine-client,installer,selftest-plugins}`; `engine/src/{app,core,dsp,io,plugins}`. **[prop]** Mapear domínios nas 11 equipas **sem criar agentes** (ver §2). | `git ls-tree` ao pin | P1-02/P3-01/P4-02 mantêm contagem; muda o conteúdo das fichas (domínio musical, não só tecnologia). |
| A13 | §9 D-10 (VST2: «adiar») | Recomendação do planeador | **[dec]** D99 (ratificada) inclui «conseguir lidar com varios plugins sejam vst3 **ou vst2**»; o contexto de produto diz que VST3 é o formato suportado e que a arquitetura deve **permitir estudar** outros, sem assumir compatibilidade universal. Adiar é decisão tua, não minha recomendação. | D99 no ledger; contexto de produto §4 | D-10 → proposta `RD-10`, decisão tua. |
| A14 | §7.5, Fase 4 (mockup aprovado, P4-06) | Existe/ existirá um mockup aprovado | **[dec]** D83: master vertical/selecção, refinamento visual, janela DSP e maqueta de interface estão **fora da árvore**; re-land só por decisão numerada. D102 ratifica UX = conceitos do Pulse com look/menus/cores do Core; D103 limita o âmbito ao piano. Já existe `docs/plan/ux-pulse-spec.md`. | ledger (D83/D102/D103); `docs/plan/ux-pulse-spec.md` | P0-13/P4-01: o «mockup aprovado» tem de ser nomeado por ti; sem isso a Fase 4 compara contra `ux-pulse-spec.md`, não contra uma imagem. |
| A15 | Anexo JIVE (`Avaliacao-JIVE-UI-UX (1).md`): D-14, D-16, P0-17, P2-17, P4-08/09, skills `core-jive-ui`/`core-ui-contrato` | Spike JIVE | **[obs]** **Não há JIVE no repo** (`git grep -il jive 0d7d8ce` → vazio). O Core fixa JUCE **9.0.5** e aplica-lhe um patch (`ci/patches/juce-failed-plugin-restart.patch`, tornado reprodutível exatamente no commit que fixaste); o JIVE testa contra JUCE **master**. **[prop]** Manter o spike, **fora da fatia 1**, com a condição de saída honesta que o próprio anexo já define (se não compilar contra a JUCE do Core, termina no passo 1). Só depois de A5–A10 resolvidos, porque o spike precisa do contrato de registo certo para não produzir evidência órfã. | `CMakeLists.txt:64-66`; `ci/patches/`; anexo JIVE §1.1/§4 | P0-17 (descoberta) pode correr já e é barato; P2-17/P4-08/P4-09 ficam gated na tua decisão. |
| A16 | Cabeçalho do plano: «Companheiros deste documento: `backlog.csv` (63 itens), `inventario-agentes.csv` (24 fichas), `inventario-skills.csv` (22 skills)» | CSV existem e os quadros são gerados a partir deles | **[obs]** **Não estão** em `C:\Users\vk_do\Downloads` (há 7 cópias do brief e 2 do plano, nenhum CSV). A afirmação «não divergem» não é verificável. | listagem de `Downloads` | Ou me envias os CSV, ou as tabelas do plano passam a ser a origem — e então qualquer alteração tem de ser feita nelas, não num ficheiro separado. |
| A17 | §2.4, P0-16 (ZIP `Core-Observador-Piloto`) | «por verificar» | **[obs]** Ausente em todo o `D:` (pesquisa por `*observador*` / `Core-Observador*` até profundidade 3). P0-16 fecha como «ausente»; o esquema SQLite do plano é a única origem. | pesquisa em `D:\` | P0-16 fecha, sem impacto. |
| A18 | §2.1 V20/V21, §4.1, P0-07, P0-09, P0-10 | Cliente e capacidades por verificar | **[obs]** Instalados: **CLI `qodercli.exe` 1.1.65** (`C:\Users\vk_do\.qoder\bin\qodercli\`) e **IDE 1.40.1** (`D:\Qoder\Qoder IDE\bin\qoder`, é o que `qoder` resolve na PATH). `~/.qoder/settings.json`: `enabledPlugins` com 23 entradas (**nenhum `core`**), `providers` (3, com chaves em texto plano), `mcpServers` (GitHub); **sem** `general.enableAutoUpdate`, **sem** `permissions`, **sem** `hooks`. User scope: `agents/` (~10 fichas, incl. «Software Dev Team»), `skills/` (~51), `plugins/`. No repo: **não há `.qoder/`**; há `.qoderignore` não rastreado (contém só a linha de comentário com as instruções de uso). | saídas de `qodercli --version`, leitura de `settings.json`, listagens | D-01 passa a ser escolha entre dois runtimes **já instalados**. Risco real de ativação: 22 skills `core-*` juntam-se a ~51 existentes (V6/V7). P0-07 não é «confirmar» auto-update, é **criar** a chave — e não tocar em `providers`. |

---

## 2. Domínios de produto → equipas (o que faltava ao plano)

Sem criar agentes novos. Caminhos medidos no pin `0d7d8ce`.

| Domínio de produto | Onde vive no código | Equipa/perfil do plano que responde | O que prova que funciona |
|---|---|---|---|
| Motor / tempo real / grafo / workers | `engine/src/core/{engine,graph,workers,rt_workers,render_job,tempo_map,qualify}.cpp` · `engine/src/io/device.cpp:79` | Motor (`motor`) + QA Áudio + Benchmarks | mapa do percurso com refs; prova vermelho→verde nos contratos S6/S7 (D115) |
| Dispositivo / backend miniaudio | `engine/src/io/{device.cpp,miniaudio_impl.c}` · `engine/third_party/miniaudio.h` | Motor + Debugging | ART-003 (saída morta reportada e reaberta); self-test `-Desktop` |
| Hosting de plugins de terceiros (VST3) | `engine/src/plugins/juce_host.cpp` (scan `:335`/`:656`, estado `:348`/`:351`/`:392`/`:484`, latência `:162`, crash `:136`) · `app/selftest-plugins/TestPlugins.cpp` · `docs/plan/plugin-hosting-map.md` | Host VST (`host`) | estado e latência preservados; plugin que rebenta não trava a sessão |
| Persistência, integridade e recuperação de projetos | `app/domain/src/{document,autosave,history,edit,bounce,assets}.cpp` · `docs/plan/data-loss-map.md` | **Faltava dono explícito** → Motor/Host + QA Áudio, com o guardião no catálogo | D115 «dados > …»: guardar/reabrir, autosave, exportações incompletas recusadas (`587bf5b`) |
| Pattern Maker | `patterns/{bass,break,cymbals,drop,drums,hats,lead,perc}`, `pcore/styles.json`, `app/domain/src/{groove,follow}.cpp` | **Faltava dono explícito** → JUCE/UI + QA UX para o fluxo; Motor para o alinhamento kick/baixo/pratos | catálogo de padrões e alinhamento preservados (regra de `AGENTS.md`) |
| Tools musicais (chains, presets, parâmetros expostos) | `app/domain/src/core_plugins.cpp`, `app/control/src/{calls,bridge,presets}.cpp` (`[prop]` por confirmar no pin — comando em §5) | **Faltava dono explícito** → Host VST (parâmetros/estado) + JUCE/UI (superfície) | uma Tool reduz configuração repetida sem esconder o editor do plugin |
| MIDI | `tests/midi_tests.cpp` + domínio (`[prop]` por localizar no pin) | Motor + QA Áudio | import/export MIDI coberto por suite própria |
| UI/UX (Pulse concepts, look Core) | `app/desktop/**`, `docs/plan/ux-pulse-spec.md` | JUCE/UI + QA UX | percurso musical com rato/teclado, foco, Undo; âmbito D102/D103 |
| Build / gate / ambiente de agente | `ci/{gate.ps1,compilar.bat,gate.sh,tidy_scope.py}`, `ci/review-env/**` | **Faltava dono explícito** → Guardião (catálogo) + Scribe (evidência) | `gate.ps1` verde com `--no-tests=error`; `verify.ps1` OK |
| Fronteira Core/AICORE | `docs/FRONTEIRA-CORE-AICORE.md`, `docs/DIRECCAO-CORE-PATTERN-MAKER-TOOLS.md` | Coordenação + Pesquisa | nenhuma travessia sem decisão numerada |

**Não confundir** (aviso explícito do contexto de produto): *Tools musicais da DAW* ≠ *tools/plugins/skills dos agentes Qoder*. As fichas devem dizer isto literalmente, porque os dois vocabulários vão colidir em todas as passagens.

---

## 3. O piloto re-escopado (substitui §8 do plano)

Mesma forma, assunto real, só leitura, ao pin.

```text
Usa a rede do Core para esta intenção, sem alterar código e sem escrever no checkout partilhado:

«Quero confiar no motor em projetos reais: muitas pistas, muitos plugins VST3 de terceiros,
automação intensa, BPM alto. Antes de qualquer alteração, preciso de uma resposta verificável.»

Baseline de leitura: 0d7d8ce (0d7d8cea19225d3f4e9163f043ff2111b6038d9a). Toda a referência
é sha:ficheiro:linha. O que não confirmares fica «por verificar» com o comando que o resolve.

Três perguntas:
1. Qual é o percurso real do áudio desde o callback até à mistura e aos workers, e onde estão
   os pontos que a prioridade «dados > tempo real > performance > compatibilidade» (D115) toca?
2. Que testes registados cobrem hoje esse percurso, no pin? Para cada um: comando, oráculo,
   tolerância. Se não existir teste, diz «sem cobertura» — não estimates.
3. O que falta medir para eu decidir se o modo multithread pode deixar de ser serial por omissão?

Encaminhamento: coordenador → ministro Engenharia → equipa Motor. Consulta apenas esse ramo.
O comunicador regista a passagem enquanto ela ocorre.

Entrega: relatório em docs/relatorios/2026-11-20-<assunto>.md conforme docs/relatorios/MODELO.md,
em inglês (D101), no clone do ator; entrada no índice; linhas de ESTADO.md apenas PROPOSTAS
no relatório (só o escrivão escreve o ledger — D72/D79/D80).
Formato da resposta: intenção literal · três respostas com refs · condições e limites ·
por verificar · próxima tarefa e dono.
```

O que mudou face ao §8 do plano: o domínio (motor, não host), o SHA (fixado), o destino de escrita (relatório existente, não `docs/rede/passagens/`), e a autoridade do ledger (propor, não escrever).

---

## 4. Fatia 1 — passos pequenos, cada um verificável sozinho

Ordem por dependência. Nenhum passo escreve em `D:\CORE\CORE`.

| # | Passo | Comando exato | Aceitação / evidência |
|---|---|---|---|
| 1 | Fixar a baseline e o estado do checkout, sem tocar em nada | `git -C "D:\CORE\CORE" rev-parse HEAD && git -C "D:\CORE\CORE" status --porcelain && git -C "D:\CORE\CORE" worktree list` | saída literal guardada em `D:\CORE-ORG\baseline\pin.md`; sujo=7 entradas registado como facto, não corrigido |
| 2 | Clone de ator (padrão já existente), nunca o checkout partilhado | `git clone "D:/CORE/CORE" "D:/Core-Projects/rede-motor" && git -C "D:/Core-Projects/rede-motor" checkout 0d7d8ce` | `git -C … rev-parse HEAD` = `0d7d8cea…`; caminho ASCII sem espaços (D97) |
| 3 | Verificação só-leitura do ambiente, com a ferramenta que já existe | `powershell -ExecutionPolicy Bypass -File "D:/Core-Projects/rede-motor/ci/review-env/verify.ps1" -Src "D:/Core-Projects/rede-motor"` | OK/MISSING por item, com SHA; nada escrito no produto |
| 4 | Responder às 3 perguntas do §3 **só com leitura** (`Read`/`Grep`/`Glob`) | `git -C "D:/Core-Projects/rede-motor" grep -n "dataCallback" 0d7d8ce -- engine/src/io/device.cpp` (e equivalentes) | cada afirmação com `0d7d8ce:ficheiro:linha`; lacunas com comando |
| 5 | Cobertura no pin, sem inventar: listar o que está registado | `git -C "D:/Core-Projects/rede-motor" show 0d7d8ce:tests/CMakeLists.txt` e contar `add_test` | 22 testes nomeados; cada um com oráculo/tolerância **ou** «sem cobertura» |
| 6 | (Opcional, custa máquina) prova executada, não lida | `powershell -ExecutionPolicy Bypass -File "D:/Core-Projects/rede-motor/ci/gate.ps1"` — build dir ASCII, JUCE local via `-DFETCHCONTENT_SOURCE_DIR_JUCE=D:/Core-deps/JUCE-9.0.5` | `ctest … --no-tests=error` verde com contagem por suite; se não correr, declarar limitação (regra: Linux não prova Windows) |
| 7 | Observação mínima **fora** do repo, com redação de segredos | criar `D:\CORE-ORG\obs\` + hook async que escreve uma linha JSONL com `session_id/agent_id/tool_use_id/tipo/sha`; nunca `prompt` integral, nunca `tool_response` integral, nunca `~/.qoder/settings.json` | JSONL cresce; kill-switch por `D:\CORE-ORG\obs\obs.off`; nenhum campo com chave/segredo (verificação por grep) |
| 8 | Portão de retoma | fechar a sessão; abrir processo novo só-leitura: `qodercli -p "Sem histórico: o que está decidido sobre o percurso de áudio do motor no pin 0d7d8ce, que cobertura existe e o que ficou por verificar? Refs sha:ficheiro:linha." --permission-mode dont_ask --allowed-tools "Read,Grep,Glob"` | mesmas refs **e mesmos limites**; se devolver conclusões sem limites, a fatia não passou |
| 9 | Entrega conforme o contrato do repo | relatório `docs/relatorios/2026-11-20-rede-slice1-engine-read.md` (inglês, `MODELO.md`) **no clone do ator** + linha no índice + linhas de `ESTADO.md` **propostas** | diff do clone toca só em `docs/`; commit só com autorização tua (D116 autorizou a ronda S, não esta) |
| 10 | Land-or-delete | comparar custo (créditos + tempo até primeira evidência) com a mesma tarefa feita sem rede; decidir manter 3 perfis, crescer ou apagar | decisão escrita; sem ela a rede não cresce |

**Perfis nesta fatia: 3, não 5** — coordenador, especialista do motor, comunicador. O escrivão entra no passo 9 como papel (não como agente novo) porque o ledger já tem escritor definido. Ministros, guardião e investigador entram só quando houver duas passagens reais para comparar.

---

## 5. Por verificar (com o comando que resolve)

| Pergunta | Comando / ensaio | Porque importa |
|---|---|---|
| Tools: onde vivem parâmetros expostos e presets, no pin | `git -C "D:/Core-Projects/rede-motor" grep -n "presets\|exposed\|toolChain" 0d7d8ce -- app/domain app/control` | A2/§2: o domínio Tools não tem dono confirmado por mim |
| MIDI: ficheiros de domínio | `git -C … grep -il "midi" 0d7d8ce -- engine app/domain` | idem |
| `ctest -L merge -N` real no pin | requer configure+build (`ci/gate.ps1`); não o corri | 22 vs 31 é contagem de `add_test`, não de testes executáveis |
| Modelo/tier disponível nesta conta | seletor de modelos do cliente (é autoritativo) | custo da fatia 1 e comparabilidade |
| Um agente de plugin pode ser membro de Agent Team do IDE? | criar equipa e procurar fichas *From Plugin* no picker | decide se as fichas servem os dois runtimes ou só o CLI |
| O IDE permite `Agent(...)` aninhado? | ficha com `tools: [Agent(x)]` no IDE | decide D-03 (ministros como encaminhadores) |
| Skills de plugin aparecem nos dois entry points a partir do mesmo diretório? | `qodercli plugins list --json` + `/plugins` no IDE | evita duplicar fichas |
| Próximo número `D###` livre | perguntar ao escrivão (D116 mostra que o dono pode dispensar o escrivão numa entrega, mas só ele o pode fazer) | A8 |
| `ux-pulse-spec.md` é o «mockup aprovado»? | ler `docs/plan/ux-pulse-spec.md` e comparar com D102/D103 | A14, Fase 4 |
| Conteúdo das 3 entradas `??` não rastreadas no checkout (`environment.yml`, `vc140.pdb`, `.qoderignore`) | `git -C "D:\CORE\CORE" status --porcelain` + leitura | são trabalho de outra sessão; preservar, não limpar |

---

## 6. Decisões que são tuas (com a minha recomendação)

| # | Decisão | Recomendação | Custo de adiar |
|---|---|---|---|
| RD-1 | Confirma a leitura do pin: baseline de leitura `0d7d8ce`, com delta medido para `59275d2`? | Sim, e exigir `sha:` em toda a ref | sem isto «cobertura hoje» é ambíguo (22 vs 31) |
| RD-2 | Onde vive a governação da rede | **[prop]** `D:\CORE-ORG` (fora do produto) para plugin, fichas, skills, observação e rascunhos; no Core entra **só** o que o contrato existente já prevê (relatório + índice + linhas propostas). Razão: três regras do repo (estado concorrente, logs brutos fora, inglês) | agentes escrevem em sítios diferentes e a continuidade falha |
| RD-3 | Alcance da fatia 1 | 3 perfis, 2–3 skills, 0 scripts novos de verificação, 1 piloto de leitura do motor | 24 fichas + 22 skills sem uma passagem demonstrada = custo sem prova |
| RD-4 | Política de observação (redação, retenção, tamanho, localização) | JSONL fora do repo, sem prompts/respostas integrais, sem qualquer leitura de `~/.qoder/settings.json`, retenção curta, evidência volumosa só por referência | segredos e áudio em Git; `providers` tem chaves em texto plano |
| RD-5 | JIVE | Spike gated, fora da fatia 1, versão fixada, condição de saída no passo 1 (compatibilidade com JUCE 9.0.5 + patch D113) | adotar dependência que testa contra JUCE master |
| RD-6 | VST2 | Manter como estudo com fonte primária; não entra na fatia 1 (D99 menciona-o, mas a implementação auditada é VST3-only) | dispersão |
| RD-7 | Números de decisão da rede | Propostas sem número; números pedidos ao escrivão | colisão com `D###` vivo |

---

## 7. O que preservo do plano Qwen (não tocar)

Faseamento com portões; crescimento da rede condicionado a delegação demonstrada; guardião com «hash é pista, não prova» e controlo negativo obrigatório; separação entre falha de ativação e qualidade da resposta; investigador com devolução útil ≠ retrabalho; três tempos que não se somam e cobertura declarada por métrica; reversibilidade em três níveis com kill-switch por flag; regra «`QODER_PLUGIN_DATA` só para caches»; `bypass_permissions` proibido na árvore do produto; contrato de entrega de seis campos (é compatível com `MODELO.md`, que tem cinco secções — mapear, não duplicar).

## 8. O que não fiz

Não escrevi, commitei, limpei ou configurei nada em `D:\CORE\CORE` (só `git show`/`git grep`/`git ls-tree`/`git rev-parse`/`git status`, todos de leitura). Não alterei `~/.qoder/settings.json`. Não instalei nenhum plugin. Não corri builds, testes, gates nem benchmarks — por isso nenhuma contagem de testes executados aparece aqui como corrida. Não reescrevi `Plano-Rede-Core-Qoder.md`, o brief, a avaliação JIVE ou o contexto de produto. Esta adenda vive fora do repo, em PT-PT; se algum dia entrar, entra em inglês e como relatório.

---

# Adenda 2 · 2026-11-20 (~15:35) — fonte autoritativa encontrada, e o que a contradiz

Escrita depois de dois deltas do dono: o work order **«PLAN — Engine measurement first»** e a indicação de que os ficheiros do plano estão versionados em **`d-aicore/core-org`**, com a sessão do DeepSeek Harness em `~/.dsh`. Nada acima foi reescrito: isto é addendum datado (regra 9 de `docs/AUDITORIA.md`).

## 9. A fonte autoritativa (e a minha adenda fica supersedida onde se sobrepõe)

**Repo:** `d-aicore/CORE-ORG` (público, `main`) @ **`5ade78e4238ee4f15c35a70d16cc609ca51c4e88`**, 2026-11-20T14:54:00Z, «Add CORE Qoder network plan, corrective addendum, backlog and inventories».
**Como obtido:** `git clone` e `git ls-remote` falham nesta máquina com `fatal: expected flush after ref listing` (protocolo git; a API/curl responde 200). Usei o tarball `codeload.github.com/d-aicore/CORE-ORG/tar.gz/refs/heads/main` → snapshot em `D:\CORE-ORG\CORE-ORG\` (**sem `.git`**; a proveniência é o SHA acima, não um clone).

| Ficheiro | Bytes | O que é |
|---|---|---|
| `CORE-Rede-Qoder-Documento-Unico.md` | 317 672 | documento consolidado, Partes I–IV |
| `Adenda-Corretiva-A1.md` | 50 817 | **Parte I** — 28 factos observados, 18 correções C-01…C-18, piloto revisto (§I.3), mapa de domínios (§I.4), 6 itens novos (§I.6), decisões renomeadas **NET-01…NET-20** (§I.7). O README manda ler primeiro: **supersede as Partes II e III** |
| `Plano-Rede-Core-Qoder.md` | 150 001 | Parte II — **versão mais nova** que a de Downloads (132 045) |
| `Avaliacao-JIVE-UI-UX.md` | 23 261 | Parte III — idêntica à de Downloads |
| `backlog.csv` · `inventario-agentes.csv` · `inventario-skills.csv` | 29 740 · 18 873 · 7 672 | **68 itens · 24 perfis · 24 skills** |

**Precedência declarada no README:** instrução atual do dono → `d-aicore/core` (`AGENTS.md`, `ESTADO.md`, produto/fronteira) → Parte I → Partes II–IV. O repo é **só documental**, não é segunda autoridade; as decisões `NET-xx` não usam o namespace `D###` e não têm efeito até ratificação verbatim + data + fonte, registada pelo escrivão.

**Mapa da minha adenda → Parte I (o que já estava corrigido upstream):** A3/A4 → C-02/C-03 + §I.3 · A5 → C-04 · A8 → C-05 (`NET-xx`) · A9 → C-06 · A6 → C-07 · A7 → C-11 · A12 → C-12 + §I.4 · A14/A15 → C-13 · A10/A11 → C-14/C-16 (parcial). **Não reclamo autoria destas correções: já lá estavam.**

**A16 fica REFUTADA por mim mesmo:** os CSV existem (em CORE-ORG, não em Downloads). E a afirmação «não divergem» **verifica-se**: 68 IDs únicos no plano do repo = 68 no CSV, `comm` nos dois sentidos = vazio (72 linhas de tabela → 4 IDs repetidos). A versão de Downloads (63 itens, 22 skills) está **superseded** pela do repo (68 itens, 24 skills).

**O «backlog de 74 itens» do work order = 68 + 6.** Os seis são os propostas de §I.6: `P0-18`, `P0-19`, `P0-20`, `P0-21`, `P2-18`, `P3-09` (11,5–22 h agente / 4–10 h máquina / 2–4 h dono). Não é uma terceira versão do backlog.

## 10. O que é novo — medido por mim, e que contradiz A1 e o work order

### 10.1 Conflito de baseline (crítico, bloqueia WP-0)

A Parte I leu o repo **em `a9a0384`** (18/11 23:03:32Z; o próprio A1 diz que não é checkout local). O pin que indicaste é **`0d7d8ce`** (20/11 13:05:01Z). **`a9a0384` é ancestral de `0d7d8ce`**, e os dois têm **22 `add_test`** e **nenhuma** das suites S:

| Suite exigida pela aceitação de WP-0 | `a9a0384` (SHA de A1) | `0d7d8ce` (teu pin) | `59275d2` (HEAD) |
|---|---|---|---|
| `m5_bitexact_tests` · `s7_rt_probe_tests` · `s7_rt_strict_tests` · `timing_proof_tests` · `state_recovery_tests` · `export_plugin_failure_tests` · `wav_float_tests` · `s9_mute_block_tests` | **ausentes** | **ausentes** | presentes (`tests/CMakeLists.txt:228,255,262,311,328,84,25,286`) |
| `cli_plugin_crash_render` · `engine_process_tests` | presentes | presentes | presentes |
| label `rt_strict` | **não existe** | **não existe** | existe (`:263`) |
| total de registos | 22 | 22 | **31** |

**Consequência:** a aceitação de WP-0 («the scoreboard names at least …») e o passo de WP-1 «correr `-L rt_strict` e registar o vermelho conhecido» são **impossíveis no pin e no SHA de A1**. O delta pin→HEAD é **só testes**: `git diff --stat 0d7d8ce..HEAD -- ci/ CMakeLists.txt tests/` lista 11 ficheiros, todos em `tests/`, +4731/−38; **`ci/` e `CMakeLists.txt` não mudaram**, e `ci/patches/` é idêntico.

**Chamada que fiz:** «USAR ESTA VERSAO» = usar **essa versão do tooling/build** (`0d7d8ce`: sanitizer target list + patch JUCE D113 reprodutível + review-env) — que é byte-idêntica à de HEAD. O **baseline de medição** de WP-0…WP-2 tem de ser **`59275d2`**, porque é a única revisão que contém as suites que o work order nomeia. Se quiseres mesmo medir no pin, a aceitação de WP-0 tem de ser reduzida ao que lá existe — e então o scoreboard não cobre os critérios 3/4/5. **Isto é uma decisão tua, não minha.**

### 10.2 A1 §I.3 sugere `-Desktop` como opcional — está errado

`Adenda-Corretiva-A1.md:270`: `# opcional, abre a janela ~20 s: ... -File ci\gate.ps1 -Desktop`.
Medido em `ci/gate.ps1:34`: `$label = if ($Desktop) { "" } else { "-L merge" }` → **`-Desktop` limpa o filtro de labels** e corre tudo, incluindo `s7_rt_strict_tests` (vermelho conhecido, fora de merge por decisão). O work order proíbe-o como smoke test; **o work order ganha** (precedência: instrução atual > Parte I). A linha 270 de A1 precisa de correção datada.

### 10.3 O comentário do gate contradiz o que os testes fazem

- `ci/gate.ps1:8`: «Nao instala nada, nao escreve na arvore do codigo». **Falso ao nível da máquina:** `installer_samples` (`tests/CMakeLists.txt:144-149`) corre o **Core Setup.exe real** em install/reinstall/uninstall silencioso; `cli_package_stale` (`:133-137`) **reempacota** o package folder e o zip. Ambos com label **`merge`** e `RUN_SERIAL TRUE`. «`git status` limpo» ≠ «máquina intocada» — o work order tem razão.
- `ci/gate.ps1:3`: «~3-4 min com a build» é **comentário**, não medição. WP-1 substitui-o.
- Build dir, `gate.log` e `gate-resumo.txt` são **partilhados por omissão** (`:17` `D:\Core-build\gate-<leaf>`, `:35`, `:79`); só o `.bat` é GUID-único (`:41`). `-Build` existe (`:10`) → a instrução do work order é válida.
- O gate **não regista** sha256 de binários nem estado da dependência JUCE → os campos do contrato de evidência proposto são mesmo novos.

### 10.4 `P-F` do JUCE: premissa falsa, adoção válida

O work order diz que «the vendored JUCE patch currently lives only as an uncommitted working-tree modification». **Medido, é falso:**
- `ci/patches/juce-failed-plugin-restart.patch` é **rastreado** e **idêntico** em `0d7d8ce` e `59275d2`.
- `CMakeLists.txt` (bloco D113, a seguir a `:64-67`) corre `git apply --check -R` em configure — rc=0 prova que **todos os 14 hunks em 2 ficheiros** estão presentes; aplica idempotentemente ao JUCE fetched; e **`FATAL_ERROR`** se uma cópia local (`FETCHCONTENT_SOURCE_DIR_JUCE`) não tiver o patch completo. Comentário literal: «Never modify a user-provided local deps dir».
- Medi a cópia local real: `git -C "D:/Core-deps/JUCE-9.0.5" apply --check -R "D:/CORE/CORE/ci/patches/juce-failed-plugin-restart.patch"` → **rc=0** (patch completo presente).

**Mas o risco que a proposta aponta continua real:** `D:/Core-deps/JUCE-9.0.5` **não é repo git** (`fatal: not a git repository`) e não tem identidade/hash registada em lado nenhum. O configure prova *o patch*, não que a árvore está pristine. → **Adotar a `P-F` com a premissa corrigida**: registar caminho da deps dir + rc do `apply --check -R` + sha256 dos ficheiros patchados, em vez de «commitar o patch» (já está commitado).

### 10.5 Scoreboard dos critérios do dono (esqueleto WP-0-A, registo lido, nada executado)

Critérios verbatim de `AGENTS.md:30-34` (HEAD): 1 never loses work · 2 a failing plugin never takes the song down · 3 zero audio dropouts (no alloc/lock/I/O/blocking on the audio thread, **proven by tooling**) · 4 handles many plugins (multicore **identical** to serial, real plugins under load) · 5 exact sound (automation + latency compensation at every sample rate and block size, **null tests**). Ordem: dados > tempo real > performance > compatibilidade.

| Critério | Suites registadas (HEAD `59275d2`, `tests/CMakeLists.txt`) | O que prova / o que falta |
|---|---|---|
| 1 | `export_plugin_failure_tests:84` (S1) · `wav_float_tests:25` (S4) · `installer_samples:145` (S5) · `state_recovery_tests:328` (S2+S3) · `domain_tests:31` · `cli_package_stale:134` | recusa antes de publicar, WAV float inválido, samples do dono, estado+automação no relink, save/reopen/undo. **Falta:** valores medidos por suite no SHA atual |
| 2 | `cli_plugin_crash_render:175` · `engine_process_tests:162` (+ seams Fault/Throw/CrashRestart `:187-208`) · `bug_tests:57` | crash em processBlock não trava a sessão; 5 casos de recusa + controlo verde. **Falta:** contagens por âmbito |
| 3 | `s7_rt_probe_tests:255` (merge) · **`s7_rt_strict_tests:262-263`** (label `rt_strict`, `CORE_S7_STRICT=1`, fora de merge) | tooling GREEN / **engine path RED no critério 3 como escrito** — *reportado* em `docs/relatorios/2026-11-20-s7-rt-measurement.md:8` (~7 chamadas CS por processBlock + realloc raro). **Não re-medido por mim.** Vai a verde só por correção autorizada ou aceitação explícita do dono |
| 4 | `m5_bitexact_tests:228` (merge, M5 OFF por omissão D51, `RtWorkerPool::workerJobs()` como prova de uso paralelo) | *reportado* GREEN: serial ≡ M5(2) ≡ M5(4) bit-exact em 4 block sizes, 25/26 passados (`docs/relatorios/2026-11-20-s6-engine-rt-proofs.md:8,100`). **Falta:** carga prolongada com plugins reais |
| 5 | `timing_proof_tests:311` (PDC, MIDI sample-accurate, automação sub-bloco, M7a, 64/128/256/512 a 48k/44.1k; `--evidence` com probes **fora do repo**) · `s9_mute_block_tests:286` (mute = fader-only `graph.cpp:1329-1331`, bloco live compile-time 128 `juce_host.cpp:23`) · `engine_tests:15` | método e resultados em `docs/relatorios/2026-11-20-timing-latency-proof.md`. **Falta:** o defeito CSV-09 (CPU de pistas muted) é o próprio pin não-zero, a atualizar só com mudança autorizada |

Notas de inventário que o manifesto WP-2 tem de cobrir: registos **condicionais** (`core-package`, `WIN32 AND CORE_BUILD_APP AND CoreSetup`, `core_engine_client`, `CoreTestCrash/Synth/Gain/Fault/Throw/CrashRestart_VST3`, `core_plugin_host`, `juce_events`, `CoreApp`); canaries **fora do ctest de propósito** (`:344-357`, esperados falhar); `desktop_self_test` com label `desktop` (`:339-342`) — abre a janela ~20 s, não é teste unitário; e `tests/CMakeLists.txt:6`: «Signals are generated in the tests; **no audio fixtures and no bit-exact goldens** tied to one compiler» → o catálogo do guardião não pode exigir goldens de áudio (é a C-08 de A1).

**WP-0-B (pendências do ledger que tocam o motor): NÃO feito.** Enumerei os IDs da secção Pendentes (A04 A06 A08 A12 A13 A16 A18 A19 A21 A22 A24 A27 + linhas Alvos/CI/Desenho/Do/Fio/Item/Itens/Pendente/Pergunta/Proposta/Timeout), mas não li as linhas completas. A própria regra de WP-0 proíbe conclusões de leitura parcial — fica como trabalho por fazer, não como resultado.

## 11. A sessão do DeepSeek Harness (o que pediste para procurar)

| Onde | O que está lá | Estado |
|---|---|---|
| `C:\Users\vk_do\.dsh\sessions\` | **um** workspace: `--C-Users-vk_do-Documents-deepseek-harness-default-workspace--`, **32 transcripts** `session.v4.jsonl.zstd` (19–20/11; mais recentes `85d5eccb…`/`5f3a9134…` 05:29, `5150d3b6…` 04:24 com 1,1 MB) | legível |
| `--D-CORE--` (caminho citado no ledger, D98/D115) | **não existe** em `~/.dsh/sessions/` | **lacuna de proveniência**: o ledger cita um log que não está no disco |
| `D:\CORE\.dsh-meow\sessions\` | metadados `session-{2ff54f03-8344-40bb-8cb4-54df0601eb69, f917643e…, 03f22e49…}.json` (17–18/11, 0,8–2,3 KB) | só metadados, sem transcript |
| `C:\Users\vk_do\AppData\Local\Temp\dsh-spill-{3inpI5,kN0Ybi}\session-a69b320fbfab\` | **spill da sessão lead citada em D115/D116**. Mais recentes: `8f402ab29683-job_output.txt` (95 KB, 20/11 **13:04**) = output de configure CMake (MSVC 19.51.36260.0, VS 18 BuildTools); `6b536a855da3-pwsh.txt` (62 KB, **13:06**) = log de commit **`[main 7fdf349] Docs: S-round delivery reports, evidence and index (round 1 + wave 2 + timing + chain)` — 329 ficheiros, 48 357 inserções**, e «removed 2 other-session rows» | é o rasto do último trabalho no projeto |
| `C:\Users\vk_do\.dsh\storages\session_projcache\sessions\` | `session-7cdfbb6d-0524-4f52-bfca-3690f470adb7.json` (106 KB, 20/11 **13:37**) · `session-3ed86858-1f13-4a09-8aa7-cbfcc1c8bf79.json` (10 KB, **12:52** — hora exata da mensagem do dono em D116) | cache de projeto por sessão |
| `C:\Users\vk_do\Documents\deepseek-harness\default-workspace\` | `core/`, `core-review/`, `agent-task-factory/`, `dsh-cpp-lsp/`, probes `.js` | área de trabalho do harness |

**Duas notas honestas:** (1) `7fdf349` **não é nenhum dos 6 SHAs que colaste** — o commit dos relatórios da ronda S tem outro hash na história atual (`aacc6d1`), portanto houve re-commit/rewrite depois das 13:06; a confirmar antes de citar qualquer um como prova. (2) `zstd` não está na PATH, mas **node 24 tem `zlib.zstdDecompressSync`** → os transcripts leem-se sem instalar nada. Não abri nenhum transcript ainda: disseste onde procurar, não o que extrair.

## 12. O que não fiz (atualizado)

Não escrevi, commitei nem limpei nada em `D:\CORE\CORE` (só leitura: `git show/grep/ls-tree/rev-parse/status/diff --stat/cat-file/merge-base`, e um `git apply --check -R` na deps dir, que é verificação sem escrita). Não corri o gate, builds, testes nem benchmarks — **nenhuma contagem de testes executados aparece aqui como corrida**; os veredictos S6/S7 estão marcados *reportado*. Não alterei `~/.qoder/settings.json`, não instalei plugin, não toquei no remote `CORE-ORG` (o clone falhou; o snapshot é local e sem `.git`). Não reescrevi A1, o plano, o CSV, a avaliação JIVE nem o work order.
