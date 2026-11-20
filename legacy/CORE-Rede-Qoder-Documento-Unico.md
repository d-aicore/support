# CORE · Rede de equipas no Qoder — documento único

**Para:** Diogo · **Consolidado em:** 2026-11-20 · **Estado:** documental. Nada foi implementado, configurado ou executado no repositório.

Este ficheiro junta **tudo** o que foi produzido nas três rondas: a adenda corretiva nova (Parte I), o plano faseado (Parte II), a avaliação do JIVE (Parte III) e os dados completos que estavam em CSV (Parte IV).

**Como foi montado.** As Partes II e III são reproduzidas **verbatim** — não foram reescritas. A única transformação é mecânica: os níveis de título foram deslocados um nível para caberem num só documento. A Parte IV é gerada a partir dos CSV, que ficam intactos no workspace.

## Ordem de leitura e precedência

1. **Parte I primeiro.** É a revisão pedida na última ronda e **corrige** as partes seguintes.
2. Partes II e III a seguir, já a ler com as correções em mente.
3. Parte IV como referência de consulta (backlog, fichas, skills).

Em caso de conflito: **instrução atual do dono → `AGENTS.md` e documentos de produto/fronteira do repositório → Parte I → Parte II → Parte III**.

**Duas traduções globais ao ler as Partes II–IV:** as decisões pendentes `D-01…D-16` passam a **`NET-01…NET-16`** (o namespace `D###` pertence ao ledger do repositório); e tudo o que vier a entrar no repositório é **em inglês**, incluindo relatórios, skills e saída de ferramentas.

## O que mudou nesta ronda, em oito linhas

- O repositório `d-aicore/core` **é público e foi lido**. Vários «por verificar» do plano passaram a factos observados — e alguns pressupostos ficaram **refutados**.
- O produto tem nome e forma: **Pattern Maker + Tools**, som de **plugins externos**, **AICORE externo e opcional**. O plano não os mencionava (C-01).
- O piloto «VST3 próprio A→B» **não existe como produto**: passa a hosting/estado/automação de plugins de terceiros (C-02).
- Primeiro piloto passa a **tarefa real do motor, só de leitura**, com **4 perfis** (C-03, I.3).
- **Não há segundo `ESTADO.md`**: usa-se o ledger existente, escrito só pelo escrivão, e relatórios segundo `MODELO.md` (C-04, C-10).
- **Privacidade**: repo público + produto privado ⇒ nada de prompts, segredos, áudio ou dumps em Git (C-07).
- **Oráculos corrigidos**: sem WAV fixtures nem goldens; determinismo intra-build, null tests, `/fp:fast` (C-08). Descida de contagem por remoção autorizada ≠ enfraquecimento (C-09).
- **`merge=union` e selos não estão aprovados** e têm de provar robustez e custo; a concorrência já mordeu este projeto (C-11). JIVE suspenso atrás de decisão numerada (C-13).

## Índice

- **Parte I — Adenda corretiva A1 (nova, 2026-11-20)**
  - [I.0 Como ler esta adenda](#i0-como-ler-esta-adenda)
  - [I.1 Factos observados no repositório que corrigem o plano](#i1-factos-observados-no-repositório-que-corrigem-o-plano)
  - [I.2 Correções](#i2-correções)
  - [I.3 Primeiro piloto revisto — substitui a §8 do plano](#i3-primeiro-piloto-revisto-substitui-a-8-do-plano)
  - [I.4 Mapa de domínios musicais → equipas existentes (sem novos agentes)](#i4-mapa-de-domínios-musicais-equipas-existentes-sem-novos-agentes)
  - [I.5 Dependências revistas](#i5-dependências-revistas)
  - [I.6 Itens de backlog novos propostos (não entram nos CSV sem aprovação)](#i6-itens-de-backlog-novos-propostos-não-entram-nos-csv-sem-aprovação)
  - [I.7 Mapa de decisões pendentes (renomeadas) e novas](#i7-mapa-de-decisões-pendentes-renomeadas-e-novas)
  - [I.8 O que fica intocado](#i8-o-que-fica-intocado)
  - [I.9 Fontes observadas nesta sessão](#i9-fontes-observadas-nesta-sessão)
- **Parte II — Plano de implementação da rede (ronda 1 + atualização da ronda 2)**
  - [1. Sumário executivo](#1-sumário-executivo)
  - [2. Estado inicial e decisões](#2-estado-inicial-e-decisões)
  - [3. Mapa e inventário](#3-mapa-e-inventário)
  - [4. Desenho técnico dos pacotes A–D](#4-desenho-técnico-dos-pacotes-ad)
  - [5. Backlog ordenado](#5-backlog-ordenado)
  - [6. Fases, esforço e paralelismo](#6-fases-esforço-e-paralelismo)
  - [7. Plano de validação e recuperação](#7-plano-de-validação-e-recuperação)
  - [8. Primeira sessão executável](#8-primeira-sessão-executável)
  - [9. Decisões para o Diogo, por ordem de bloqueio](#9-decisões-para-o-diogo-por-ordem-de-bloqueio)
  - [10. Critério de aceitação deste plano](#10-critério-de-aceitação-deste-plano)
  - [Anexo A · Fontes consultadas](#anexo-a-fontes-consultadas)
  - [Anexo B · Contrato de entrega de tarefa](#anexo-b-contrato-de-entrega-de-tarefa)
- **Parte III — Avaliação do JIVE para UI/UX (ronda 2)**
  - [0. Resposta curta](#0-resposta-curta)
  - [1. O que o JIVE é — factos verificados](#1-o-que-o-jive-é-factos-verificados)
  - [2. O que o JIVE **não** resolve (limites duros)](#2-o-que-o-jive-não-resolve-limites-duros)
  - [3. Porque ajuda mesmo assim — cinco alavancas para a rede](#3-porque-ajuda-mesmo-assim-cinco-alavancas-para-a-rede)
  - [4. Riscos e neutralização](#4-riscos-e-neutralização)
  - [5. O que proponho fazer — spike, não migração](#5-o-que-proponho-fazer-spike-não-migração)
  - [6. Skills novas e alteradas](#6-skills-novas-e-alteradas)
  - [7. Testes novos para o catálogo do guardião](#7-testes-novos-para-o-catálogo-do-guardião)
  - [8. Encaixe na matriz de modelos escolhida](#8-encaixe-na-matriz-de-modelos-escolhida)
  - [9. Decisões que isto acrescenta](#9-decisões-que-isto-acrescenta)
  - [10. Fontes](#10-fontes)
- **Parte IV — Dados completos: backlog, fichas de agente, skills**
  - [IV.1 Backlog completo — 68 itens](#iv1-backlog-completo-68-itens)
  - [IV.2 Fichas completas dos 24 perfis](#iv2-fichas-completas-dos-24-perfis)
  - [IV.3 As 24 skills do plugin único `core`](#iv3-as-24-skills-do-plugin-único-core)

**Ficheiros companheiros no workspace** (mantidos, não substituídos): `Adenda-Corretiva-A1.md`, `Plano-Rede-Core-Qoder.md`, `Avaliacao-JIVE-UI-UX.md`, `backlog.csv`, `inventario-agentes.csv`, `inventario-skills.csv`.

---

# PARTE I — Adenda corretiva A1 ao plano da Rede Core no Qoder

**Data:** 2026-11-20 · **Âmbito:** correção direcionada. **Não reescreve** o plano nem a avaliação JIVE; não implementa, não altera código, não cria ficheiros no repositório.
**Gatilho:** o Diogo forneceu a identidade do produto e o repositório de referência `d-aicore/core`. O repositório **está público e foi lido nesta sessão** — ao contrário do que o plano assumia. Isso muda a classe de várias afirmações: deixam de ser «por verificar» e passam a **observadas**.

## I.0 Como ler esta adenda

**Precedência em caso de conflito:** instrução atual do dono → `AGENTS.md` e documentos de produto/fronteira → esta adenda → plano (Parte II) → avaliação JIVE (Parte III).

**Classes de afirmação**, conforme o `AGENTS.md` e o `docs/AUDITORIA.md` exigem:

| Marca | Significado |
|---|---|
| `[OBS]` | **Observado por mim** no conteúdo público de `d-aicore/core@main`, lido em 2026-11-20 via `raw.githubusercontent.com` e API de conteúdos. Cito ficheiro e, quando conhecido, o *blob SHA*. **Não é um checkout local**: não medi HEAD, não compilei, não corri testes. |
| `[DEC]` | **Decisão de produto ratificada** pelo dono, citada nos documentos do repositório (com data e fonte). |
| `[OBJ]` | **Objetivo futuro** declarado, explicitamente ainda não entregue. |
| `[PROP]` | **Proposta minha**, reversível, sem efeito até ratificação. |
| `[PV]` | Por verificar — exige checkout local, execução ou decisão. |

**Aviso de honestidade que o próprio repositório exige:** ler ficheiros no GitHub não é auditar o HEAD local. O `docs/AUDITORIA.md` passo 1 manda fixar branch/SHA, plataforma e âmbito **antes de trabalhar**. Esta adenda é documental e **não autoriza implementação**.

**Renomeação obrigatória de identificadores:** o plano usou `D-01…D-16` para decisões pendentes. O repositório já tem um namespace `D###` contínuo e ratificado (`D40`, `D48`, `D72`, `D83`, `D91`…), onde «D» significa decisão do dono. `[OBS]` Reutilizar «D-» numa proposta **colide com o ledger**. Nesta adenda, todas as decisões pendentes do plano passam a **`NET-01…NET-16`** (mapa em I.7), tratadas como **propostas** (`P-F*` na convenção do repo), sem efeito até ratificação verbatim.

---

## I.1 Factos observados no repositório que corrigem o plano

| # | Facto observado `[OBS]` | Fonte (ficheiro · blob SHA quando conhecido) | Consequência direta |
|---|---|---|---|
| O1 | O repo é **público**: li `AGENTS.md`, `ESTADO.md`, código de testes e scripts sem autenticação | `github.com/d-aicore/core` | Tudo o que for commitado é público. Logs, prompts, caminhos de projetos pessoais e áudio **não podem** ir para Git. Ver C-07. |
| O2 | «Everything written into this repository is in English: source code, identifiers, comments, test names and test output, log and error messages, script and tool output, commit messages, and new documentation.» Verbatim do dono 2026-11-18: «sempre tudo em ingles, meter como rule nos fecheiros necessarios» | `AGENTS.md` · `c8bbf4d7fd18c4fcf88d5b323cc013eef362c10c` | A árvore `docs/rede/**` em português proposta no plano **viola a regra**. Ver C-06. |
| O3 | `ESTADO.md` é escrito **só pelo escrivão do ledger** (D72/D73/D79/D80). Outras entregas **propõem linhas** num relatório e abrem pendência; nunca editam o ledger | `AGENTS.md`, `ESTADO.md` · `1fe6e85907fb805bd5d4273637d18da766886ef1` | O `docs/rede/ESTADO.md` do plano é uma **segunda autoridade**. Eliminado. Ver C-04. |
| O4 | Append-only **já existe e já está ratificado**: numeração contínua sem reset, entradas nunca editadas/apagadas, invalidações **por referência**, formato `D### · data · citação verbatim · fonte · âmbito/gatilho · estado · supersede/invalida`, mapa old→new em `docs/historico/MIGRACAO-LEDGER.md` | `AGENTS.md`, `ESTADO.md` | O meu esquema `E-…` + campo `substitui` **reinventa** uma convenção existente. Ver C-04/C-11. |
| O5 | Ratificação só com **citação verbatim do dono + data + fonte**; «Silêncio ≠ aprovação» (D48/D50); arquitetura e desenho final de novas superfícies exigem **decisão numerada explícita** | `AGENTS.md` | Nenhuma skill, hook ou agente pode «decidir». Ver C-05. |
| O6 | «Core makes no sound of its own»: sampler, synths/instrumentos, efeitos, filtros, osciladores, moduladores, ducking, A/B sound e preview **removidos por decisão**, com callers e testes; tracks são **hosts genéricos de plugins**, não instrumentos tipados | `AGENTS.md` | O piloto «VST3 próprio A→B» é **inválido**. Ver C-02. |
| O7 | «The count drops when a feature is removed (authorized; not a regression). Do not relax criteria or weaken the remaining tests to obtain green. Flaky is a defect to investigate.» Contagens **por suite/âmbito** | `AGENTS.md` | O guardião tem de distinguir **remoção autorizada** de **enfraquecimento**. Ver C-09. |
| O8 | Cinco critérios do motor como **metas a atingir, não estado atual**; cada um só conta como cumprido **provado por medição**; RT «proven by tooling rather than by reading»; multicore «proven identical to the serial path»; som exato «proven by null tests». Ordem de conflito: **data > real time > performance > compatibility** | `AGENTS.md` (verbatim 2026-11-18: «eu quero melhor motor que possamos fazer» · «deixa isso como criterio a chegar») | São os **oráculos** do piloto do motor e do catálogo. Ver C-16. |
| O9 | Master vertical/selecção, refinamento visual, janela DSP e **maqueta de interface estão fora da árvore** por ordem do dono (D83); re-land só por decisão numerada | `AGENTS.md` | O artefacto «mockup aprovado» e o spike de UI **não podem** ser assumidos. Ver C-13. |
| O10 | Hosting da AI: processo separado + painel cliente fino, descoberto por `addon.json`; **não** VST3 in-process (D91). Não reintroduzir instrumentos próprios nem AI no Core; não mover código Core/AICORE sem decisão | `AGENTS.md` | A rede não pode «integrar IA» por iniciativa. Ver C-15. |
| O11 | Entrega obrigatória: relatório `docs/relatorios/AAAA-MM-DD-assunto.md` **usando `MODELO.md`**, indexado em `docs/relatorios/README.md`, com **proposta** de linhas de ESTADO e pendência. Classificar: confirmado no código / comprovado por teste / apenas reportado / não verificado | `docs/AUDITORIA.md`, `docs/relatorios/MODELO.md` | O «dossiê de passagem» do plano **já existe** noutro formato. Ver C-10. |
| O12 | Testes: **sinais gerados** (`support/signals.hpp`), «Nenhum WAV de teste no repo», «Sem goldens bit-a-bit presos a um compilador»; determinismo testa-se **dentro da mesma build** (duas vezes igual, qualquer tamanho de bloco igual); «Um teste que não pode correr falha»; cada falha imprime medido e esperado; um bug corrigido traz teste que falha sem a correção | `tests/README.md` | O catálogo do guardião baseado em **fixtures com sha256 e goldens** está errado para este repo. Ver C-08. |
| O13 | Gate real: `powershell -ExecutionPolicy Bypass -File ci\gate.ps1` (≈3–4 min com build), `-Desktop` acrescenta `Core.exe --self-test` (~20 s), `-Build`, `-Juce D:/Core-deps/JUCE-9.0.5`, `-Jobs 8`; CMake **Release + Ninja**, `CORE_BUILD_TESTS=ON`; resumo em `<Build>\gate-resumo.txt`; rc 0/1 | `ci/gate.ps1` | O plano propunha scripts novos; **o gate já existe**. Ver C-14. |
| O14 | O gate já tem **duas proteções anti-falso-verde**: `ninja -t deps` tem de mostrar dependências de headers registadas (MSVC localizado + code page partiam o `/showIncludes` e o gate ficava verde sobre objetos antigos); e `ctest --no-tests=error` (cache com `CORE_BUILD_TESTS=OFF` dava rc 0). `VSLANG=1033` + `chcp 65001` | `ci/gate.ps1` | «Verde» já foi falso neste projeto por razões de build, não de teste. O guardião tem de conhecer estes dois modos. |
| O15 | O `.bat` do gate passou a ter **nome GUID por invocação** porque «a fixed core-gate.bat was overwritten mid-run by a concurrent gate from another coordinator stream», corrompendo o ficheiro e correndo ctest contra a build de outro stream | `ci/gate.ps1` | **A concorrência já mordeu este projeto.** O meu `merge=union`/lock não é teoria: tem precedente e tem de ser provado. Ver C-11. |
| O16 | O escrivão resolveu um conflito real no índice de relatórios por **«união exacta»**: 33 linhas de HEAD + 2 de outra sessão = 35, «0 perdidas de qualquer lado; delta de bytes = exactamente as 2 linhas», devolvidas ao working tree **fora do commit** | `ESTADO.md`, nota datada 18-11 ~15:50 | A prática de união **já existe manualmente**, com verificação de contagem e de bytes. A proposta deve automatizar isto, não substituí-lo. |
| O17 | `.gitattributes` atual só contém `-text` para `knowledge/aicore/**` e `docs/relatorios/evidencia/2026-11-18-deeper-audit/**`. **Não há `merge=union`** | `.gitattributes` · `a4bc49af5d244ad91afbc913822772156806f181` | Acrescentar `merge=union` é alteração de convenção do repo → exige decisão. |
| O18 | `.gitignore` ignora `*.log`, `build/`, `build-*/`, `engine/build*/`, `data/`, `Testing/`, `node_modules/`, `.venv/` | `.gitignore` · `c291e74d582df4333f09c0396e8105b78b159d11` | Já existe onde pôr dados locais sem os commitar. |
| O19 | Existe evidência arquivada **dentro** do repo em `docs/relatorios/evidencia/…`, com sha256 registado num relatório; e `knowledge/aicore/**` com `manifest.json` verificado por SHA-256 | `.gitattributes` | Evidência **curada e pequena** em Git é prática existente. A regra não é «nada de evidência em Git», é «nada de volume/segredos». |
| O20 | Suites reais registadas: `engine_tests`, `wav_float_tests` (label `merge`, TIMEOUT 300), `domain_tests`, `modules_tests`, `role_tests`, `midi_tests`, `bug_tests`, `bitwig_tests`, `audit_tests`, `audit2_tests`, `export_plugin_failure_tests`, `hunt_tests`, `round3_tests`, `calls_tests`, `menu_tests`, `window_tests`, `cli_version`, `cli_demo_render`; nível `desktop` = `desktop_self_test`. C++20 | `tests/CMakeLists.txt`, `tests/README.md` | O catálogo do guardião **parte desta lista**, não de uma inventariação abstrata. |
| O21 | `engine/CMakeLists.txt` aplica **`/fp:fast` a todas as configurações MSVC**; por isso a validação de WAV float é **baseada em padrões de bits inteiros** e a suite corre em Debug **e** Release | comentário em `tests/CMakeLists.txt` | Comparações de sinal e null tests têm de ser desenhados com `/fp:fast` em mente. Ver C-08. |
| O22 | Já existem testes de **prioridade DATA**: `export_plugin_failure_tests` (export recusado se um plugin necessário falhou; WAV anterior byte-idêntico; bypass ≠ falha; vermelho medido em `a9a0384`) e `wav_float_tests` (NaN/±Inf/float64 overflow recusados na importação, nada registado no AssetStore). O crash SEH real de VST3 é coberto por `cli_plugin_crash_render` | `tests/CMakeLists.txt` | O primeiro piloto pode ser **leitura + validação destes percursos**, sem alterar nada. Ver I.3. |
| O23 | Estrutura real: `engine/` (`core_engine_lib`, `miniaudio_impl`, `engine/src/io/device.cpp`, `engine/src/app/measure.cpp`), `app/desktop/src`, `app/engine-client/src`, `core_domain`, `core_control`, `tests/`, `ci/`, `cmake/`, `docs/`, `lang/*.json`, `engine/third_party` | `tests/CMakeLists.txt`, API de conteúdos | Os caminhos «por verificar» do plano passam a **caminhos reais** para efeitos de leitura. |
| O24 | `modules_tests`: limpeza de módulos legados (2026-11-18, PROD-02/04/06) — os cards de Tools perdem os títulos W/D/F/R-Core, **ids e títulos antigos ficam como aliases de lookup**, buses legados reutilizados, o «open» da bridge aceita ids antigos | `tests/CMakeLists.txt` | F-Core/P-Core **não são módulos atuais**, mas os identificadores sobrevivem por compatibilidade. Confirma o aviso do dono. |
| O25 | `role_tests`: mapa de papéis (Settings > Roles) e tools que tocam através dele (SUCK, PUM, efeitos de build-up). `window_tests`: regras de janelas destacáveis, lógica pura **sem JUCE** | `tests/CMakeLists.txt` | Tools **já existe como operações**; e há precedente de testar lógica de UI sem JUCE. |
| O26 | A fronteira AI **não está implementada**: `CORE_BUILD_AI=OFF` é requisito **não encontrado** como opção no CMake raiz; painel/badge ligados; `aiControl` default true; `ai_boundary_static` **não registado** em `tests/CMakeLists.txt`; «Core 100% sem pacote AI» por demonstrar | `docs/FRONTEIRA-CORE-AICORE.md` | Decisão ≠ implementação. A rede deve **verificar a lacuna**, não assumi-la fechada. Ver C-15. |
| O27 | Direção de produto: só **Pattern Maker e Tools** como ferramentas criativas próprias; PROD-01…PROD-10 rastreiam a instrução **sem ocupar nem renumerar decisões D**; entram como **pendentes**; D58–D66 são propostas do coordenador sem efeito (D76) | `docs/DIRECCAO-CORE-PATTERN-MAKER-TOOLS.md`, `AGENTS.md` | O plano não mencionava nada disto. Ver C-01. |
| O28 | Prioridade declarada: «integridade e fiabilidade > real-time > performance > compatibilidade de plugins > clareza de workflow > quantidade de funcionalidades»; Windows 11 x64 é **P0**; uso privado, local-only | `docs/FRONTEIRA-CORE-AICORE.md`, `README.md` | Ordena o backlog inteiro. |

**Por verificar `[PV]`, com comando exato** (o agente implementador corre isto antes de qualquer escrita):

```powershell
git rev-parse HEAD; git rev-parse origin/main; git status -sb; git worktree list
git log --oneline -15
Get-Content AGENTS.md, ESTADO.md, docs\AUDITORIA.md, docs\relatorios\MODELO.md
Get-Content docs\DIRECCAO-CORE-PATTERN-MAKER-TOOLS.md, docs\FRONTEIRA-CORE-AICORE.md
Get-Content tests\CMakeLists.txt, tests\README.md, TRIAGEM-TESTES.md
Get-ChildItem docs\relatorios | Sort-Object Name -Descending | Select-Object -First 20
```

Li apenas o **primeiro de 20 fragmentos** de `ESTADO.md` (158 634 bytes `[OBS]`). O ledger completo — decisões recentes, pendências abertas, estado medido — **tem de ser lido integralmente** pelo agente que pegar na primeira tarefa. Não afirmo conhecê-lo.

---

## I.2 Correções

Cada correção indica: secções do plano afetadas · IDs de backlog · pressuposto anterior · correção · evidência · impacto nas dependências.

### C-01 · Contexto de produto ausente (crítica)

- **Secções:** II §1, §2.2, §3.1, §4.3, §6.3, §8. **Backlog:** P0-02, P0-03, P0-13, P3-02, P4-01…P4-07.
- **Pressuposto anterior:** o Core era tratado como «DAW C++/miniaudio + JUCE + hosting VST», sem camada criativa nomeada. Pattern Maker, Tools e AICORE não apareciam.
- **Correção:** o produto é uma DAW Windows 11 x64 P0, pessoal e local-only, para psycore/slambient/hi-tech/darkpsy e eletrónica experimental (BPM 190–300+, KBBB, rolls, modulação intensiva). **O Core não produz som próprio**; o som vem de plugins externos e áudio importado/gravado. A camada criativa própria são **Pattern Maker** e **Tools**. **AICORE é projeto irmão, externo e opcional**, fora do processo e do caminho de áudio. F-Core/P-Core/W-Core/D-Core **não são módulos atuais**.
- **Evidência:** `[OBS]` O6, O24, O27, O28; `docs/DIRECCAO-…` PROD-01/02/03/04; `README.md`. `[DEC]` direção explícita do dono de 17-11-2026.
- **Impacto:** o mapa de responsabilidades passa a ser por **domínio musical**, não só por tecnologia (I.4). Os artefactos de prova mudam (C-02). A ordem de fases muda (I.5).

### C-02 · Piloto VST3 próprio A→B (crítica)

- **Secções:** II §2.4 (artefactos), §6.3 (F4), §7.5, §9 (D-07). **Backlog:** P0-13, P4-01, P4-03, P4-05, P4-09.
- **Pressuposto anterior:** existia um «VST3 próprio do Core» com versões A e B, e o piloto era atualizá-lo preservando automação de projetos antigos.
- **Correção:** **não há plugin criativo próprio como produto**. O piloto passa a **hosting de plugins de terceiros**: descoberta/catalogação, instanciação, ordem e estado da chain, buses, parâmetros, latência, **persistência e recuperação de projeto** com plugins externos, e comportamento quando um plugin **falta, muda de versão ou falha**. O caso «atualizar um plugin externo sem perder automação» mantém-se válido — o que muda é quem é o dono do binário.
- **Evidência:** `[OBS]` O6, O22; `docs/DIRECCAO-…` PROD-04 («Gain, pan, metering, resampling e protecção de saída permanecem infraestrutura do host»); `AGENTS.md` D91 («plugin próprio» = pacote fora do binário, no contexto da AI).
- **Impacto:** P4-01 deixa de pedir «construir A e B» e passa a pedir **duas versões de um plugin externo instalado** (ou um plugin ausente/renomeado) + projeto antigo que o use. P4-05 (mapa de parâmetros) mantém-se e ganha prioridade. **Nenhum item pode pedir DSP criativo próprio.**

### C-03 · Primeiro piloto: motor, não Host (alta)

- **Secções:** II §1, §8 (primeira sessão), §6.3 (F1). **Backlog:** P1-02, P1-06, P1-07, P1-08.
- **Pressuposto anterior:** primeiro percurso vertical = Coordenação → ministro Engenharia → **equipa Host VST**, com 5 perfis.
- **Correção:** primeiro percurso = **quatro perfis**: `coord`, `motor`, `motor-comm`, `guardiao`. Tarefa **real, só de leitura**, sobre o motor. Sem ministro na Fase 1 (o coordenador encaminha diretamente). Sem alteração de código, sem «correção artificial» para ter o que mostrar.
- **Evidência:** `[OBS]` O8, O22, O28; instrução do dono nesta ronda («A prioridade atual é o motor C++», «preferencialmente inicialmente só de leitura»).
- **Impacto:** P1-02 reduz de 5 para 4 fichas; `min-eng` entra só quando houver mais do que uma equipa técnica ativa. O Host passa a Fase 3/4. O ensaio de delegação continua obrigatório — muda o destinatário, não o mecanismo.

### C-04 · Segunda autoridade de estado (alta)

- **Secções:** II §3.5 (árvore), §4.2 (contrato de estado, IDs, selo), §7.1, Anexo B. **Backlog:** P2-01, P2-02, P2-03, P2-05, P2-07, P2-08, P2-16.
- **Pressuposto anterior:** criar `docs/rede/ESTADO.md` como autoridade de afirmações duráveis, com IDs `E-…`, campo `substitui` e selo em duas fases; `decisoes/D-xxx.md` para decisões.
- **Correção:** **eliminar** `docs/rede/ESTADO.md` e `docs/rede/decisoes/`. Existe **uma** autoridade: `ESTADO.md`, escrito **só pelo escrivão do ledger**, com o formato e a numeração já ratificados. A rede:
  1. produz relatórios em `docs/relatorios/AAAA-MM-DD-assunto.md` **segundo `MODELO.md`**;
  2. indexa-os em `docs/relatorios/README.md`;
  3. **propõe** linhas de ledger no próprio relatório (com citação verbatim + fonte) e abre/atualiza a **pendência**;
  4. nunca edita `ESTADO.md`, `docs/relatorios/` antigos nem `docs/historico/`.
  O perfil `scribe` da rede **é** o papel de escrivão do ledger (ou reporta-lhe), não um segundo escrivão. O estado *operacional* da rede (onde está cada tarefa) vive em **dados locais não versionados**, não num ledger paralelo.
- **Evidência:** `[OBS]` O3, O4, O5, O11; `docs/AUDITORIA.md` passos 7–9.
- **Impacto:** P2-01 muda de «criar árvore» para «mapear a árvore existente e pedir autorização para o mínimo em falta». P2-02 (IDs `E-…`) e P2-05 (selo) **ficam suspensos** até prova de necessidade (C-11). O «contrato de entrega de seis campos» do Anexo B passa a **mapear para as secções de `MODELO.md`**.

### C-05 · Colisão de namespace e autoridade de decisão (alta)

- **Secções:** II §9 inteira, §2.3, §6.3, todas as referências `D-xx`. **Backlog:** todos os itens com `D-xx` em «Dep.».
- **Pressuposto anterior:** decisões pendentes chamadas `D-01…D-16`, decididas pelo Diogo em ficheiros novos.
- **Correção:** renomear para **`NET-01…NET-16`** (mapa em I.7), tratadas como **propostas** sem efeito. Ratificação só por **citação verbatim do dono + data + fonte**, entrada pelo escrivão no ledger com número `D###` próprio. Nenhuma proposta da rede ocupa, renumera ou invalida números D. Bugs usam `BUG-` (D75).
- **Evidência:** `[OBS]` O4, O5, O27; `AGENTS.md`: «PROD-01…PROD-10 … **não renumeram** decisões (D78)»; «D58–D66 são propostas do coordenador sem efeito até ratificação (D76)».
- **Impacto:** todas as dependências «D-xx» passam a «NET-xx». Acrescenta uma dependência transversal: **nenhuma implementação arranca sem número D ratificado** quando toca arquitetura, nova dependência, novo processo, nova persistência, nova superfície de UI ou o caminho de áudio (D48).

### C-06 · Idioma da documentação e dos artefactos (alta)

- **Secções:** II §3.5, §4.1, §4.2, §8, Anexo B; todos os nomes de ficheiro, skills e mensagens propostas. **Backlog:** P1-01…P1-04, P2-01, P2-02, P1-06.
- **Pressuposto anterior:** gavetas, entradas de registo, dossiês e mensagens em português.
- **Correção:** **tudo o que entra no repositório é inglês** — código, identificadores, comentários, nomes e saída de testes, mensagens de log/erro, saída de scripts, mensagens de commit e documentação nova. Exceções já previstas: **citações verbatim do dono** (mantidas na língua original) e o **ledger/histórico existentes**, que nunca se editam. Consequências práticas:
  - relatórios novos em `docs/relatorios/` → **inglês**;
  - skills/agents/hooks que escrevam no repo → saída em **inglês**;
  - o **plugin Qoder**, se viver dentro do repo, é documentação nova → **inglês**;
  - este documento único (plano + adenda) é para o Diogo, **fora da árvore**; se algum dia for commitado, tem de ser traduzido ou ficar fora.
- **Evidência:** `[OBS]` O2 (`AGENTS.md`, verbatim 2026-11-18).
- **Impacto:** P1-02/P1-03 ganham um critério de aceitação de idioma; a guarda de escrita deve rejeitar conteúdo não-inglês em ficheiros novos do repo (verificação simples e determinística). **Não** implica traduzir o histórico.

### C-07 · Privacidade, retenção e volume no sistema de observação (alta)

- **Secções:** II §4.4 (eventos, hooks), §3.5 (`evidencia/**`), §7.3. **Backlog:** P0-12, P1-08, P2-16, P3-07, P5-01.
- **Pressuposto anterior:** hooks `PostToolUse` a guardar `tool_response`, `UserPromptSubmit` a guardar `prompt`, e evidência (wav, csv, dumps, capturas) em `docs/rede/evidencia/**` dentro de Git.
- **Correção:** o repositório é **público** (O1) enquanto o produto é **privado e local-only** (O28). Política proposta `[PROP]`, a ratificar:
  1. **Nunca em Git:** prompts integrais, respostas integrais de ferramentas, transcrições de sessão, segredos/tokens/chaves, caminhos de projetos pessoais do utilizador, nomes de faixas/conteúdo musical, áudio, dumps, `gate.log`.
  2. **Eventos guardam metadados**, não conteúdo: `ts`, tipo, tarefa, origem/destino, `agent_type`, `session_id`/`agent_id`/`tool_use_id` (identificadores opacos), `code_rev`, duração, código de saída, **hash** do payload e um excerto **redigido** ≤ N caracteres (N a fixar, proposta 200). Redação por lista de padrões (chaves, tokens, `Authorization`, caminhos `D:\...` do utilizador) **antes** de escrever.
  3. **Armazenamento local não versionado** para o fluxo bruto, aproveitando o que já está ignorado (O18) — por exemplo sob `build-*/` ou um diretório local a aprovar. Nada de novo em Git sem decisão.
  4. **Evidência em Git só curada, pequena e com sha256**, seguindo o precedente existente de `docs/relatorios/evidencia/…` (O19). Áudio e dumps ficam **fora da árvore** (a build já vai para fora, por desenho do `gate.ps1`), referenced por caminho + hash no relatório.
  5. **Retenção:** fluxo bruto local com janela (proposta: 30 dias ou N MB, o que vier primeiro); evidência curada é permanente e imutável; nada é apagado do histórico Git.
  6. **Acesso:** local-only; sem envio para serviços externos; **sem tokens novos para agentes nem ativação de CI** — o `AGENTS.md` proíbe-o expressamente nesta organização documental.
- **Evidência:** `[OBS]` O1, O12 («Nenhum WAV de teste no repo»), O18, O19; `AGENTS.md` («Sem tokens novos para agentes ou activação de CI nesta organização documental»).
- **Impacto:** P0-12 passa a incluir redação e limite de tamanho **antes** de ligar qualquer hook; P5-01 (painel) lê dados locais; a métrica «atraso de recolha» mantém-se. **Acrescenta um ensaio obrigatório:** tentar escrever um segredo sintético e verificar que sai redigido.

### C-08 · Oráculos do catálogo: sem goldens nem fixtures de áudio (alta)

- **Secções:** II §4.3 (catálogo, tabela de enfraquecimento), §7.1. **Backlog:** P2-09, P2-10, P2-11, P3-04.
- **Pressuposto anterior:** catálogo com `fixtures (caminho+sha256)`, oráculo golden e deteção por «golden regerado» e «fixture trocado».
- **Correção:** este repo **não tem WAV de teste** e **não usa goldens bit-a-bit presos a um compilador**. Os oráculos reais são:
  - **sinais gerados** com semente fixa (`tests/support/signals.hpp`);
  - **determinismo intra-build**: duas execuções iguais, e igualdade **entre tamanhos de bloco**;
  - **null tests** para exatidão de som (critério 5 do dono);
  - **medido vs esperado impresso** em cada falha;
  - **vermelho medido no estado anterior** para cada bug corrigido.
  A isto acresce `/fp:fast` em todas as configurações MSVC (O21): comparações devem ser **por padrão de bits inteiro** ou por tolerância explicitamente justificada, nunca por igualdade de floats ingênua.
- **Evidência:** `[OBS]` O12, O21, O22.
- **Impacto:** as classes «fixture trocado» e «golden regerado» **saem** do catálogo; entram «semente alterada», «comparação intra-build removida», «null test substituído por comparação frouxa», «teste que não pode correr passou a ser saltado» (já proibido). P2-09 passa a partir da lista real de suites (O20).

### C-09 · Cobertura enfraquecida vs remoção autorizada (alta)

- **Secções:** II §4.3, §7.1 (ensaio 10). **Backlog:** P2-10, P2-11, P4-07.
- **Pressuposto anterior:** «teste retirado da suite» = sinal de enfraquecimento, sempre.
- **Correção:** a contagem **desce legitimamente** quando uma funcionalidade é removida por decisão (sampler, instrumentos, efeitos próprios, templates embutidos). O guardião tem de exigir, para cada descida: **ou** o número D da remoção autorizada, **ou** um sinal de enfraquecimento. Contagens comparadas **por suite/âmbito**, nunca em bruto. **Flaky é defeito a investigar**, não ruído a tolerar. E «verde» pode ser falso por razões de build (O14) — o guardião verifica também os dois guards do gate.
- **Evidência:** `[OBS]` O6, O7, O14.
- **Impacto:** P2-10 ganha uma classe nova («descida sem decisão») e perde falsos positivos; P2-11 mantém-se (tolerância alargada continua proibida).

### C-10 · Dossiê de passagem: usar o modelo existente (média)

- **Secções:** II §3.5 (`passagens/`), §8.4, Anexo B. **Backlog:** P1-06, P1-07, P2-07.
- **Pressuposto anterior:** formato próprio de dossiê e «contrato de entrega de seis campos».
- **Correção:** usar **`docs/relatorios/MODELO.md`**: *O que foi medido* (repo/branch/SHA inicial e final, âmbito e autorização, ambiente, testes executados ou «nenhum», limitações) · *Resultados* (tabela ID | problema/resultado | evidência SHA+ficheiro:linha ou execução | classificação **código/teste/reportado/não verificado** | estado) · *Alterações* · *Verificação* (comandos, códigos de saída, contagens por âmbito, vermelho/verde) · *Pendências e passagem* (próxima tarefa, dependências, decisões necessárias, risco residual, recomendação). Os seis campos do Anexo B **mapeiam** para estas secções; não se cria formato novo. Correção factual de relatório antigo é **addendum datado**, nunca reescrita.
- **Evidência:** `[OBS]` O11; `docs/AUDITORIA.md` 7–9; `docs/relatorios/MODELO.md`.
- **Impacto:** o hook `Stop` bloqueante passa a verificar **o relatório e a pendência**, não um dossiê inventado. A recuperação em sessão nova procura o relatório + o índice, não `passagens/`.

### C-11 · `merge=union`, selos e concorrência: não aprovados, a provar (média)

- **Secções:** II §4.2 (iii/iv/v), §7.1 (ensaios 5–7). **Backlog:** P2-03, P2-04, P2-05, P2-06, P2-15.
- **Pressuposto anterior:** `merge=union` em `docs/rede/**`, IDs por worktree, lock com ficheiro atómico, selo em duas fases, índice reconstruível — como desenho aprovado.
- **Correção:** **nada disto está aprovado** e a maior parte deixa de ser necessária, porque o ledger já é append-only com autoridade única (O3/O4). O que resta deve ser **provado antes de adotado**:
  - A concorrência **já causou dano real** neste projeto (O15: `.bat` partilhado corrompido por dois gates simultâneos). O precedente mostra que a solução eficaz foi **eliminar o recurso partilhado** (nome GUID por invocação), não geri-lo com lock. **Preferir particionar a serializar.**
  - A união **já é praticada manualmente** pelo escrivão com verificação de contagem e de bytes (O16). Qualquer automatização tem de reproduzir essa verificação: *N linhas de A + M de B = N+M, zero perdidas, delta de bytes exacto*.
  - `.gitattributes` não tem `merge=union` (O17); acrescentá-lo é mudança de convenção → **decisão numerada**.
  - O **selo em duas fases** só se justifica se o ledger atual não resolver já a ligação entrada↔commit. `[PV]` verificar no ledger completo antes de propor.
- **Evidência:** `[OBS]` O15, O16, O17, O3, O4.
- **Impacto:** P2-03/P2-05 passam a **condicionais**; P2-04 (ensaio de duas worktrees) **sobe de prioridade** e passa a ser o *gate* que decide se o resto é preciso. Critério de aceitação novo: **custo operacional medido** (minutos por entrega) vs. o processo manual atual do escrivão.

### C-12 · Responsabilidades por domínio musical (média)

- **Secções:** II §3.1, §3.2, §3.6. **Backlog:** P1-02, P3-01, P4-02.
- **Pressuposto anterior:** equipas divididas por tecnologia, sem dono explícito para Pattern Maker, Tools, MIDI, automação e persistência.
- **Correção:** mapa explícito em **I.4**, **sem criar equipas nem agentes**. As 11 equipas mantêm-se; o que muda é o **âmbito declarado** de cada ficha.
- **Evidência:** `[OBS]` O20, O24, O25, O27; instrução do dono («Mantém inicialmente a estrutura proposta de 11 equipas. Não acrescentes equipas ou agentes automaticamente»).
- **Impacto:** cada ficha ganha uma linha «domínios musicais de que responde». Fica uma decisão em aberto (NET-17) se o âmbito do `motor` se revelar excessivo.

### C-13 · UI, mockup e JIVE: fora da árvore e sujeito a decisão (média)

- **Secções:** II §4.5, §9 (D-07/D-14/D-16); Parte III inteira. **Backlog:** P0-17, P2-17, P4-01, P4-06, P4-08, P4-09.
- **Pressuposto anterior:** havia um «mockup aprovado» disponível e o spike JIVE era trabalho de UI a agendar.
- **Correção:** a **maqueta de interface está fora da árvore** por ordem do dono (D83), tal como master vertical/selecção, refinamento visual e janela DSP; re-land só por decisão numerada. JIVE implica **nova dependência** e potencialmente **nova superfície de UI** → gatilho de arquitetura (D48; fronteira §3.10). Além disso, o gate do Core usa por omissão **JUCE 9.0.5** em `D:/Core-deps/JUCE-9.0.5` `[OBS]` O13, enquanto o JIVE testa contra JUCE `master`. Pelo exposto:
  - a avaliação JIVE (Parte III) mantém-se válida como **análise técnica**;
  - o **spike não arranca** sem decisão numerada;
  - QA UX **não** pode comparar contra um mockup que não está na árvore; usa os percursos reais e a lógica testável (precedente: `window_tests`, lógica pura sem JUCE — O25).
- **Evidência:** `[OBS]` O9, O13, O25; `AGENTS.md` D83/D48.
- **Impacto:** P2-17, P4-08, P4-09 ficam **suspensos** atrás de NET-14/NET-16; P4-06 é reescrito para «percurso funcional + evidência de runtime», sem dependência de mockup.

### C-14 · Gates de milestone e plataforma (alta)

- **Secções:** II §6.3, §7.1. **Backlog:** P0-04, P0-05, P3-03, P3-06, P4-03.
- **Pressuposto anterior:** comandos de build/teste «por verificar» e scripts novos propostos.
- **Correção:** usar o que existe — `ci\gate.ps1` (O13) e `ctest -L merge --output-on-failure --no-tests=error`. Cada milestone de implementação mantém o Core **compilável, a abrir, tocar, guardar/reabrir e exportar**, e **não se declara nenhum destes gates sem execução**. **Linux não prova runtime Windows**; `desktop_self_test` corre no null device e **não comprova dispositivo real**. Não anunciar CI: não há workflow GitHub na árvore consultada.
- **Evidência:** `[OBS]` O13, O14; `AGENTS.md` («Cada milestone … não declarar estes gates sem execução»; «Linux não prova runtime Windows»); `tests/README.md`.
- **Impacto:** P0-04/P0-05 passam de «inventariar» a «confirmar e usar»; o esforço de máquina da Fase 3 deve ser estimado a partir dos **3–4 min reais do gate**, não de um número genérico.

### C-15 · Fronteira Core/AICORE: decidida, não implementada (média)

- **Secções:** II §2.2, §3.1, §4.4. **Backlog:** novos itens em I.6.
- **Pressuposto anterior:** AICORE não era mencionado; o plano assumia tacitamente que não havia IA no produto.
- **Correção:** existe código e dados de fronteira ainda por separar: `core_control`, `calls_tests`, `knowledge/aicore/**` com `manifest.json` (O19), painel/badge ligados, `aiControl` default true, `CORE_BUILD_AI=OFF` **não encontrado** como opção, `ai_boundary_static` **não registado** (O26). Isto é **decisão ratificada com implementação por demonstrar** — não é «AI já fora», nem convite a mexer. A rede deve **medir e reportar a lacuna**; qualquer movimentação de código/dados exige decisão.
- **Evidência:** `[OBS]` O10, O19, O26; `docs/FRONTEIRA-CORE-AICORE.md` §1 e §3.
- **Impacto:** acrescenta um item de auditoria de fronteira (I.6) e uma proibição explícita nas fichas: **nenhum agente reativa, liga ou «conserta» a AI por iniciativa**.

### C-16 · Critérios do motor como oráculos do plano (alta)

- **Secções:** II §4.3, §6.3 (F3), §7.1 (ensaio 14). **Backlog:** P3-02…P3-07.
- **Pressuposto anterior:** o piloto do motor comparava «1 worker vs configuração habitual» com métricas genéricas.
- **Correção:** ancorar nos **cinco critérios do dono**, cada um com o seu tipo de prova: (1) nunca perde trabalho → testes de integridade/recuperação; (2) plugin com falha não deita a canção abaixo → `export_plugin_failure_tests`, `cli_plugin_crash_render`, e o que faltar em **live**; (3) zero dropouts → **provado por tooling**, não por leitura de código; (4) multicore **idêntico ao serial** → equivalência sonora medida com plugins reais sob carga; (5) som exato → **null tests** em todos os sample rates e block sizes. Ordem de conflito: **data > real time > performance > compatibility**.
- **Evidência:** `[OBS]` O8, O22; `AGENTS.md` verbatim 2026-11-18.
- **Impacto:** P3-02 passa a escolher o caso por **critério do dono**; P3-06 (X3D) mantém a serialização mas o resultado é «identico/não idêntico ao serial», não só «mais rápido». Uma medição numa única máquina **não** vira garantia geral.

### C-17 · Ordem de execução e ativação diferida das equipas

- **Secções:** II §6.3, §6.4. **Backlog:** ordem global.
- **Correção:** adotar a sequência do dono: **(1) conhecer o Core → (2) organização mínima (coord, motor, comunicador, guardião) → (3) qualidade e desempenho com testes/scripts existentes + bateria de stress → (4) expandir e otimizar conforme evidência**. As 11 equipas continuam a ser o mapa-alvo, mas **ativam-se por necessidade demonstrada**, não por calendário.
- **Evidência:** instrução do dono nesta ronda; `[OBS]` O28 (prioridades).
- **Impacto:** a Fase 4 (VST/JUCE) deixa de ser um marco obrigatório e passa a **condicional**; a Fase 5 (investigador) mantém-se, com métricas ligadas a resultado real (C-18).

### C-18 · Investigador: métricas ancoradas no produto

- **Secções:** II §4.4 (A/B), §6.3 (F5). **Backlog:** P5-02…P5-07.
- **Correção:** o investigador mede **qualidade do código, estabilidade do motor, cobertura de testes, custo, retrabalho e tempo até evidência válida** — não atividade dos agentes. «Devolução útil» passa a ter definição operacional: evitou um falso-verde, uma alteração fora de âmbito, uma conclusão sem execução, ou uma perda de dados. A rede **não pode** tornar-se burocracia: se o custo de coordenação exceder o benefício medido, reduz-se.
- **Evidência:** instrução do dono; `[OBS]` O7, O8, O14 (o que conta como resultado real neste repo).
- **Impacto:** P5-03 compara com a baseline **na mesma unidade** (tempo até evidência válida, contagens por âmbito), e P5-07 decide composição com esses números.

---

## I.3 Primeiro piloto revisto — substitui a §8 do plano

**Tarefa:** auditoria **só de leitura** das garantias de **prioridade DATA** no motor. **Perfis:** `coord`, `motor`, `motor-comm`, `guardiao` (4). **Autorização:** documental; não altera código. `[PROP]`

**Pergunta do dono (a preservar literalmente):**
> «Antes de mexer no motor: mostra-me onde está garantido que o Core nunca perde trabalho por causa de um plugin ou de um ficheiro inválido, que testes o provam hoje, e o que ainda não está provado.»

**Âmbito observável** `[OBS]` O22: `tests/export_plugin_failure_tests.cpp` (export recusado quando um plugin necessário falha; WAV anterior byte-idêntico; bypass ≠ falha) e `tests/wav_float_tests.cpp` (NaN/±Inf/float64 overflow recusados na importação; nada registado no AssetStore; validação por padrão de bits por causa de `/fp:fast`); crash SEH real de VST3 em `cli_plugin_crash_render`.

**Sequência:**

1. `coord` fixa a intenção, cria a tarefa e **encaminha diretamente ao `motor`** (sem ministro).
2. `motor` localiza os percursos no código e cita **ficheiro:linha no SHA fixado**; cruza com as suites registadas em `tests/CMakeLists.txt`.
3. `guardiao` **verifica independentemente**: cada afirmação de cobertura tem teste registado? o oráculo é o quê? o que **não** está coberto (por exemplo, falha de plugin em **live**, não só em render)? classifica cada linha como *código / teste / reportado / não verificado*.
4. `motor-comm` escreve o relatório **em inglês**, segundo `MODELO.md`, e propõe linhas de ledger + pendência. Não escreve em `ESTADO.md`.
5. Execução do gate registado, para separar «existe» de «corre»:

```powershell
git rev-parse HEAD; git status -sb
powershell -ExecutionPolicy Bypass -File ci\gate.ps1
# opcional, abre a janela ~20 s:  ... -File ci\gate.ps1 -Desktop
Get-Content <Build>\gate-resumo.txt
```

**Critério de aceitação:** resposta com refs verificáveis; **zero alterações ao produto** (`git status` limpo fora do relatório); contagens por âmbito do gate registadas com código de saída; limitações declaradas (null device ≠ dispositivo real; uma máquina ≠ garantia geral); relatório indexado; pendência aberta.

**Recuperação noutra sessão:** fechar a sessão, abrir processo novo **só de leitura** e pedir «onde está decidido e provado que o Core não perde trabalho por falha de plugin, e o que falta provar?». Tem de devolver as **mesmas refs e as mesmas limitações** a partir do relatório e do índice, sem histórico de chat.

**Passagem:** próxima tarefa = catálogo do guardião a partir da lista real de suites, ou o primeiro caso de stress do motor — conforme o que o relatório mostrar como maior lacuna.

---

## I.4 Mapa de domínios musicais → equipas existentes (sem novos agentes)

`[PROP]` As 11 equipas mantêm-se. Cada linha diz quem **desenvolve** e quem **valida**.

| Domínio do produto | Dono de desenvolvimento | Validação independente | Âncora observada `[OBS]` |
|---|---|---|---|
| **Motor de áudio**: transporte, grafo, buffers, workers, RT, device I/O | `motor` | `qa-audio` + `bench` | `engine/`, `core_engine_lib`, `miniaudio_impl`, `engine/src/io/device.cpp` |
| **DSP infraestrutural** (gain, pan, metering, resampling, proteção de saída) | `motor` | `qa-audio` | `docs/DIRECCAO-…` PROD-04; `engine/src/app/measure.cpp` |
| **Pattern Maker — dados musicais**: notas, eventos, clips, grelhas, escalas, catálogo, KBBB/rolls, **alinhamento kick/baixo/pratos** | `motor` (âmbito alargado a `core_domain`) | `qa-audio` (`domain_tests`, `midi_tests`) | O20, O27; PROD-02/03 |
| **Pattern Maker — superfície** (edição, grelha, piano roll, Undo visível) | `juce` | `qa-ux` | `app/desktop/src`; precedente `window_tests` |
| **Tools — orquestração**: chain de plugins externos, ordem, presets, parâmetros selecionados, mapeamento de controlos, aplicação a pistas/seleção/intervalos em compassos | `host` | `qa-audio` + `guardiao` | PROD-01; `role_tests` (SUCK/PUM/build-up), `modules_tests` |
| **Tools — painéis simples** com acesso direto ao editor de cada plugin | `juce` | `qa-ux` | PROD-06/08; desenho final **por decidir** (D83) |
| **Hosting de plugins externos**: descoberta, catálogo, instanciação, buses, parâmetros, latência, estado, plugin em falta/alterado/falhado | `host` | `qa-audio` + `guardiao` | `export_plugin_failure_tests`, `cli_plugin_crash_render`, `menu_tests` |
| **MIDI** (import/export, rolls expandidos como tocam) | `motor` | `qa-audio` (`midi_tests`, `bitwig_tests`) | O20 |
| **Automação** (curvas, precisão temporal, compensação de latência) | `motor` | `qa-audio` (null tests) | critério 5 do dono (O8) |
| **Persistência e recuperação de projetos** (formato, guardar/reabrir, autosave, referências de ficheiros) | `motor` (`core_domain`) | `qa-audio` (`domain_tests`, `audit2_tests`) + `guardiao` | O20; PROD-05 (preservar referências do utilizador) |
| **Papéis musicais / routing / buses** | `host` | `qa-audio` (`role_tests`) | O25 |
| **Menus e percursos** (PROD-06, uma operação um lugar primário) | `juce` | `qa-ux` (`menu_tests` para colisões de ids) | O20, O27 |
| **Fronteira Core/AICORE** (contrato de ações, `addon.json`, pipes, ausência efetiva de AI) | `host` (âmbito de processo/contrato) | `guardiao` (`calls_tests`; gate `ai_boundary_static` **por registar**) | O10, O19, O26 |
| **Formatos de plugins além de VST3** (incl. estudo VST2) | `pesquisa` → `host` | `guardiao` | PROD-04 «extensível»; sem compatibilidade assumida |

**Sobrecarga declarada:** `motor` fica com motor + domínio musical + MIDI + automação + persistência. É muito para um perfil. `[PROP]` **Não criar agente agora.** Duas válvulas, ambas já previstas no desenho: (a) os **membros adicionais das equipas de verificação** absorvem trabalho de teste; (b) se a Fase 2/3 mostrar fila no `motor`, abrir **NET-17** para decidir entre desdobrar o âmbito ou criar uma 12.ª equipa de domínio musical — **decisão do dono, nunca automática**.

---

## I.5 Dependências revistas

| Item do plano | Estado revisto | Nova dependência | Razão |
|---|---|---|---|
| P0-01…P0-06 | **mantidos, reforçados** | ler `AGENTS.md`, `ESTADO.md` completo, produto, fronteira, `AUDITORIA.md`, `tests/CMakeLists.txt` | O2–O12, O20 |
| P0-13 (artefactos) | **reescrito** | plugins externos instalados + projeto antigo; **sem** mockup (fora da árvore) | C-02, C-13 |
| P1-02 | **reduzido a 4 fichas** | `coord`, `motor`, `motor-comm`, `guardiao`; saída em inglês | C-03, C-06 |
| P1-06 / P1-07 | **reescritos** | piloto de leitura do motor (I.3) | C-03 |
| P2-01 | **reescrito** | mapear árvore existente; pedir autorização para o mínimo em falta | C-04 |
| P2-02, P2-05 | **suspensos** | provar necessidade face ao ledger existente | C-04, C-11 |
| P2-03 | **condicional** | preferir particionar a serializar; medir custo | C-11 |
| P2-04 | **sobe de prioridade** | é o gate que decide o resto do pacote B | C-11 |
| P2-09…P2-11 | **reescritos** | oráculos reais; remoção autorizada vs enfraquecimento | C-08, C-09 |
| P2-13/P2-14 (`core-headers-publicos`) | **mantido como proposta** | ancora no build real (CMake+Ninja+MSVC, C++20, JUCE 9.0.5) e nos guards anti-falso-verde existentes; exige decisão de contrato | O13, O14 |
| P3-02…P3-07 | **reancorados** | cinco critérios do dono; gate real | C-14, C-16 |
| P4-01, P4-03, P4-05 | **reescritos** | hosting de terceiros | C-02 |
| P4-06 | **reescrito** | percurso funcional + runtime, sem mockup | C-13 |
| P0-17, P2-17, P4-08, P4-09 (JIVE) | **suspensos** | NET-14 + NET-16 ratificadas; JUCE 9.0.5 vs JIVE `master` | C-13 |
| P5-* | **mantidos** | métricas de produto | C-18 |
| Todos os `D-xx` | **renomeados `NET-xx`** | ratificação verbatim pelo dono | C-05 |

---

## I.6 Itens de backlog novos propostos (não entram nos CSV sem aprovação)

| ID | Fase | Resultado | Ação | Aceitação | Esforço A/M/D (h) |
|---|---|---|---|---|---|
| **P0-18** | 0 | Regras do repo internalizadas | Ler `AGENTS.md`, ledger completo, produto, fronteira, `AUDITORIA.md`, `MODELO.md`, `TRIAGEM-TESTES.md`; extrair as regras que vinculam a rede | Lista de regras com citação e fonte; nenhuma proposta da rede as contradiz | 2–4 / 0 / 0.5–1 |
| **P0-19** | 0 | Autoridade documental confirmada | Mapear `ESTADO.md` + `docs/relatorios/` + índice + pendências; identificar o escrivão e o fluxo de proposta | Diagrama do fluxo real; zero ficheiros novos propostos que dupliquem autoridade | 1–2 / 0 / 0.25–0.5 |
| **P0-20** | 0 | Política de privacidade e retenção aprovada | Escrever a política (C-07), incluindo redação, limites e o que nunca entra em Git; ensaio com segredo sintético | Segredo sintético sai redigido; nenhum ficheiro volumoso entra no índice | 2–3 / 0.25–0.5 / 0.5–1 |
| **P0-21** | 0 | Gate real executado e medido | Correr `ci\gate.ps1` e registar tempo, contagens por âmbito, rc e os dois guards anti-falso-verde | `gate-resumo.txt` arquivado localmente; números citados no relatório | 0.5–1 / 0.25–0.5 / 0 |
| **P2-18** | 2 | Fronteira AI auditada, não alterada | Verificar `CORE_BUILD_AI`, `aiControl`, painel/badge, `knowledge/aicore/**`, ausência de `ai_boundary_static`; reportar lacunas | Cada lacuna classificada e citada; **nenhuma** alteração de código | 2–4 / 0.5–1 / 0.25–0.5 |
| **P3-09** | 3 | Bateria de stress representativa | Definir workload psycore (BPM alto, KBBB/rolls, muitas pistas/plugins, automação densa) e medir serial vs multicore com plugins reais | Equivalência sonora + estabilidade + carga prolongada; contaminação declarada | 4–8 / 3–8 / 0.5–1 |

Estes seis itens somam **11,5–22 h de agente**, **4–10 h de máquina** e **2–4 h do Diogo** (três tempos distintos, nunca somados entre si), e **substituem** parte do esforço dos itens suspensos — não se somam ingenuamente ao total do plano. IDs verificados contra `backlog.csv`: não colidem com os 68 existentes.

---

## I.7 Mapa de decisões pendentes (renomeadas) e novas

| Plano (antigo) | Adenda (novo) | Estado |
|---|---|---|
| D-01 runtime/dispositivo/modelo | **NET-01** | modelos já escolhidos pelo dono; falta runtime |
| D-02 árvore governada | **NET-02** | **redefinida**: mapear a existente, não criar |
| D-03 composição/ministros | **NET-03** | ministros diferidos; Fase 1 com 4 perfis |
| D-04 investigador | **NET-04** | mantida |
| D-05 nomes públicos | **NET-05** | acresce: nomes e saída em inglês |
| D-06 contrato de headers | **NET-06** | mantida, ancorada no build real |
| D-07 artefactos | **NET-07** | **redefinida**: plugins externos; mockup fora |
| D-08 reduzir cobertura | **NET-08** | acresce: remoção autorizada por número D |
| D-09 janela X3D | **NET-09** | mantida |
| D-10 VST2 | **NET-10** | adiada, por caso de uso |
| D-11 WSL | **NET-11** | adiada (Windows é P0) |
| D-12 plano business | **NET-12** | adiada |
| D-13 composição final | **NET-13** | no fim, com métricas de produto |
| D-14 JIVE | **NET-14** | **suspensa** atrás de decisão numerada |
| D-15 fichas plugin vs projeto | **NET-15** | mantida; acresce idioma |
| D-16 versão JIVE | **NET-16** | só se NET-14 avançar; JUCE 9.0.5 |
| — | **NET-17** | desdobrar âmbito do `motor` ou criar equipa de domínio musical, **só com evidência de fila** |
| — | **NET-18** | política de privacidade/retenção e local do armazenamento de observação |
| — | **NET-19** | onde vive o plugin Qoder (dentro do repo em inglês, ou fora da árvore) |
| — | **NET-20** | automatizar a união do índice de relatórios, ou manter o processo manual do escrivão |

**Nenhuma destas propostas é decisão.** Ratificação exige citação verbatim do dono + data + fonte, entrada pelo escrivão com número `D###` próprio.

---

## I.8 O que fica intocado

Implementação faseada · memória persistente entre sessões · guardião do catálogo (agora com oráculos corretos) · investigador global (agora com métricas de produto) · observabilidade dos seis acontecimentos · rastreabilidade e recuperação · controlo de custos e decisão de reduzir a rede · separação desenho/observado/proposto.

Acrescenta-se uma regra que o repo já tem e o plano não dizia explicitamente: **auditoria não autoriza implementação; plano nunca se apresenta como implementado; teste existente nunca se apresenta como corrido; build nunca se apresenta como teste de UI.**

---

## I.9 Fontes observadas nesta sessão

Lidas em **2026-11-20** em `d-aicore/core@main`, via conteúdo público. *Blob SHA* quando obtido pela API de conteúdos (identifica o conteúdo, **não** o commit).

| Ficheiro | Blob SHA | Estado de leitura |
|---|---|---|
| `AGENTS.md` | `c8bbf4d7fd18c4fcf88d5b323cc013eef362c10c` | integral |
| `README.md` | `44b627759bde5f747be5a128748493cbb3c980c` | integral |
| `ESTADO.md` | `1fe6e85907fb805bd5d4273637d18da766886ef1` | **parcial** (1.º de 20 fragmentos; 158 634 bytes) |
| `docs/DIRECCAO-CORE-PATTERN-MAKER-TOOLS.md` | — | parcial (1.º de 2) |
| `docs/FRONTEIRA-CORE-AICORE.md` | — | parcial (1.º de 6) |
| `docs/AUDITORIA.md` | — | integral |
| `docs/relatorios/MODELO.md` | — | integral |
| `tests/README.md` | — | integral |
| `tests/CMakeLists.txt` | — | parcial (1.º de 4) |
| `ci/gate.ps1` | — | integral |
| `.gitattributes` | `a4bc49af5d244ad91afbc913822772156806f181` | integral |
| `.gitignore` | `c291e74d582df4333f09c0396e8105b78b159d11` | integral |
| listagem de raiz (API) | — | parcial |

**Não fiz:** checkout local, medição de HEAD, build, execução de testes, runtime Windows. Tudo isso é `[PV]` e está atribuído aos itens P0-01/P0-18/P0-21.


---

# PARTE II — Plano de implementação da rede (ronda 1 + atualização da ronda 2)

> **Reproduzido sem alterações** (só os níveis de título foram deslocados). Documento da ronda 1, atualizado na ronda 2. **Ler a Parte I antes**: várias secções, IDs e pressupostos aqui foram corrigidos.

## Plano de implementação · Rede de equipas do Core no Qoder

**Para:** Diogo · **De:** agente planeador (Qwen) · **Data:** 2026-11-20
**Âmbito desta entrega:** plano faseado, verificável e estimável + decisões pendentes. Não configura o Qoder, não altera o repositório e não corre pilotos.
**Companheiros deste documento:** `backlog.csv` (68 itens, rastreáveis), `inventario-agentes.csv` (24 fichas, com modelo e esforço), `inventario-skills.csv` (24 skills), `Avaliacao-JIVE-UI-UX.md` (avaliação do JIVE para UI/UX). Os quadros deste plano são gerados a partir desses CSV, por isso não divergem.

**Como ler a origem de cada afirmação** — uso três marcas em todo o documento:

- `[D]` **Desenho** — vem da versão do Diogo «Core · Rede de equipas no Qoder» tal como descrita no brief (11 secções, três ministros, plugin único `core`). O documento original e o ZIP `Core-Observador-Piloto` **não estavam disponíveis** neste workspace; nada cito deles que o brief não afirme.
- `[V]` **Verificado** — verificado por mim em 2026-11-20. Divide-se em `[V-doc]` (documentação oficial do Qoder, com URL) e `[V-obs]` (observado diretamente). **Não há um único `[V-obs]` sobre o checkout do Core nem sobre a instalação do Qoder do Diogo**: o workspace desta sessão estava vazio.
- `[P]` **Proposto** — minha proposta, reversível, ainda não aprovada.

> **Consequência honesta:** este plano é executável na sua parte organizacional e de configuração porque a documentação do Qoder é detalhada e verificável; é **condicional** na parte do Core, porque não vi o repositório. Todos os pontos do Core estão marcados «por verificar» com o comando ou ensaio exato que os resolve (secção 2.4). Nenhum caminho do Core é apresentado como facto.

---

### 1. Sumário executivo

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

### 2. Estado inicial e decisões

#### 2.1 Factos verificados

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

#### 2.2 Pressupostos reversíveis `[P]`

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

#### 2.3 Questões em aberto que não são decisões de arquitetura

Estas resolvem-se com um comando, não com uma reunião: versão exata do cliente e do modelo no dispositivo; se as skills do plugin aparecem no IDE e no CLI a partir do mesmo diretório; se um agente de plugin pode ser membro de uma Agent Team do IDE; se o IDE permite `Agent(...)` aninhado; se existe projeto pesado, VST3 A/B, projeto antigo com automação e mockup aprovado; se o ZIP do observador existe. Todas estão na tabela 2.4 com método e impacto, e nenhuma bloqueia escrever o plano.

#### 2.4 Descoberta obrigatória

Legenda de conclusão: **V** = verificado nesta sessão (com origem); **PV** = por verificar (com comando/ensaio). «Impacto» diz o que muda no plano quando a resposta chegar. Cada linha remete para um item `P0-xx`, cujo **responsável** está nomeado no backlog (secção 5).

##### Checkout

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

##### Cliente Qoder

| Pergunta | Método | Evidência | Conclusão | Impacto |
|---|---|---|---|---|
| Desktop, IDE ou CLI? versão? | `qoder --version`; confirmar que aplicação está em uso; ler `%USERPROFILE%\.qoder\settings.json` | versão + captura | **PV** · P0-07 · forma documentada: V20 | decide se a hierarquia usa `Agent(...)` (CLI, V5) ou equipas do IDE (V18) |
| Modelo Qwen disponível e tier | abrir o seletor de modelos, registar nome, `modelId`, taxa | captura do seletor | **PV** · P0-08 · catálogo documentado: V21 | comparabilidade A/B e custo; `model: inherit` vs modelo fixado |
| Onde se configuram agentes, skills, plugin, hooks | `/agents`, `qoder agents list`, `/plugins`, `qoder plugins list --json`, `/memory`; inspecionar `.qoder/` e `%USERPROFILE%\.qoder\` | saída dos comandos | **V** para os caminhos (V3,V4,V7,V14) · **PV** para o conteúdo desta instalação · P0-09 | confirma que o plugin único carrega nos dois entry points |
| Capacidades documentadas vs verificadas | para cada V1..V21, ensaio mínimo na instalação | tabela capacidade→doc→verificada | **PV** · P0-09 | tudo o que ficar «doc only» ganha um passo de verificação antes de ser usado num piloto |
| Composição de equipa exige passos manuais? | IDE: Settings>Agent Team>Create Agent Team (líder + até 4 membros); CLI: `QODER_AGENT_TEAMS=1` e pedir dois teammates | captura + passos | **V** do limite e da imutabilidade do nome (V18) · **PV** nesta instalação · P0-10 | 11 equipas × criação manual é custo real; nomes decididos antes (D-05) |
| Um agente de plugin pode ser membro de equipa do IDE? | criar equipa e tentar selecionar um agente marcado *From Plugin* | captura do picker | **PV** · P0-10 | se não puder, as fichas do plugin são para CLI e o IDE usa cópias locais → duplicação a evitar |
| Auto-update fixado? | `general.enableAutoUpdate: false` + registar versão | settings + versão | **PV** · P0-07 | sem isto, A/B e benchmarks comparam clientes diferentes |

##### Passagem de trabalho

| Pergunta | Método | Evidência | Conclusão | Impacto |
|---|---|---|---|---|
| Uma sessão delega, a equipa recebe contexto, a resposta regressa? | ensaio: coordenador delega a `host` uma pergunta de leitura; `host` responde; coordenador agrega | transcrição + eventos | **PV** · P0-11 · mecanismos documentados: V5, V17, V18 | portão da Fase 1 |
| Que identificador correlaciona os passos? | ligar hooks e inspecionar stdin | JSONL com `session_id`, `agent_id`, `tool_use_id` | **V** campos existem (V10) · **PV** valores reais · P0-11 | chave da base de observação e do dossiê |
| O que sobrevive ao fecho da sessão? | fechar TUI/IDE, abrir sessão nova, pedir a decisão | comparação de refs | **V** que a equipa não sobrevive (V17) · **PV** que os registos bastam · P1-07 | valida a aposta em Git; se falhar, a Fase 2 sobe de prioridade |
| Windows nativo chega, ou é preciso WSL? | tentar a passagem em PowerShell nativo; só avaliar WSL se algo essencial faltar | ensaio + lista de faltas | **V** hooks PowerShell (V11) e cross-session ausente em Windows (V19) | WSL fica adiado (D-11) com condição de ativação explícita |

##### Artefactos de prova

| Artefacto | Método | Conclusão | Mínimo para preencher a lacuna |
|---|---|---|---|
| Projeto pesado para stress do motor | procurar projetos de teste e medir n.º de faixas/plugins | **PV** · P0-13 | um projeto com ≥N faixas e ≥M plugins (N,M fixados pelo Diogo em D-07) + roteiro de reprodução; responsável: Diogo |
| VST3 próprio A e B | localizar builds instaladas e versões | **PV** · P0-13 | duas builds do mesmo plugin com diferença de estado conhecida e `sha256` registado; responsável: host |
| Projeto antigo com automação | abrir na versão anterior e confirmar automação escrita | **PV** · P0-13 | um projeto guardado por versão anterior com automação em ≥2 parâmetros; responsável: Diogo |
| Mockup aprovado para o cenário de UI | localizar ficheiro e aprovação | **PV** · P0-13 | imagem + decisão escrita do que é obrigatório; responsável: Diogo |
| ZIP `Core-Observador-Piloto` | procurar e abrir | **V** ausente neste workspace `[V-obs]` | se aparecer, mapear esquema SQLite para o esquema proposto (P0-16); não bloqueia nada |

##### Ponto de partida (baseline)

| Pergunta | Método | Evidência | Conclusão | Impacto |
|---|---|---|---|---|
| Qual é a tarefa real de referência? | Diogo escolhe uma tarefa já conhecida, pequena, com evidência verificável | `baseline/B-001.md` | **PV** · P0-14 | sem baseline a Fase 5 não tem contrafactual |
| Tempo até primeira evidência, perguntas repetidas, correções, retoma | executar **sem rede**, com hooks já ligados; contar | 4 números + JSONL | **PV** · P0-14 | é a régua do custo de coordenação |

---

### 3. Mapa e inventário

#### 3.1 As 11 equipas, os três ministros e o que prova que funcionam

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

#### 3.2 Os 24 perfis

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

#### 3.3 Skills do plugin único `core`

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

#### 3.4 Ferramentas, comandos e hooks por tipo de perfil

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

#### 3.5 Registos e gavetas — árvore proposta, sujeita a D-02

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

#### 3.6 Permissões por perfil `[P]`

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

#### 3.7 Duas fichas completas, como modelo de redação

##### Ficha completa · `host` (Especialista Host, equipa Host VST)

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

##### Ficha completa · `guardiao` (Guardião, equipa Verificação Qualidade)

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

#### 3.8 Matriz de modelos por perfil

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

### 4. Desenho técnico dos pacotes A–D

Esta secção existe para que o backlog seja executável sem o Diogo voltar a explicar a organização. Os blocos de código são **especificação a criar na implementação**, não configuração já aplicada.

#### 4.1 Pacote A · Plugin único e configuração dos perfis

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

#### 4.2 Pacote B · Estado durável, concorrência, selo, retoma e custo

Os quatro casos do brief ficam resolvidos **antes** de escrever scripts.

##### (i) Âmbito

Já fixado em 3.5: append-only nos registos governados; produto mutável. Uma alteração legítima ao produto **não** precisa de reescrever registos, precisa de **acrescentar** uma entrada que descreva o que mudou e com que evidência.

##### (ii) Formato de entrada e identidade estável

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

##### (iii) Concorrência — quem serializa e como se recupera

| Ficheiro | Estratégia | Porquê |
|---|---|---|
| `logs/<equipa>/<wt>.jsonl` | **partição por equipa e worktree** | o caminho quente não tem contenção nenhuma: dois agentes em duas worktrees escrevem em ficheiros diferentes |
| `passagens/<task>.md` | um escritor por passagem (o comunicador dono) | a passagem tem dono único por construção |
| `seccoes/<sec>.md` | um escritor por secção (o ministro) | idem |
| `ESTADO.md`, `mapa.md`, `catalogo-testes.md` | **escritor único (scribe/guardião) alimentado por fila** + lock | são os únicos ficheiros verdadeiramente comuns |

Mecanismo do lock, em PowerShell nativo `[P]`: criação **atómica** de ficheiro (`New-Item -ErrorAction Stop` falha se já existir), com retry e jitter; o conteúdo guarda PID + instante; um lock com PID morto ou idade > limite é recuperado automaticamente e a recuperação fica registada. Os outros perfis não escrevem em `ESTADO.md`: acrescentam um pedido de estado ao **seu** log; o scribe faz o fold numa passagem single-thread. Assim, «quem serializa» tem resposta nominal (scribe) e mecânica (lock), e a fila é durável — se o scribe morrer, os pedidos continuam nos logs.

Integração em Git `[P]`: `.gitattributes` com `docs/rede/** merge=union`. Consequência honesta: **union pode intercalar dois blocos** se ambos os lados acrescentaram no mesmo ponto. Mitigação em três partes: (1) cada entrada é escrita num único append com sentinela de fim; (2) o validador verifica emparelhamento `### [E-…]` ↔ `<!-- /E-… -->`, unicidade de ID e cadeia `substitui`; (3) a reparação **reordena blocos inteiros por (quando, ID)**, nunca apaga conteúdo. Um conflito deixa de ser «perder entradas» e passa a ser «reordenar blocos», com prova automática.

##### (iv) Revisão do próprio registo — selo em duas fases

O brief põe o problema certo: um commit não pode conter antecipadamente o seu próprio hash. Solução `[P]`:

1. A entrada nasce com `code_rev` = revisão do **código observado** (conhecida nesse momento) e `publicação: local`.
2. **Commit A** publica entradas + evidência.
3. O scribe corre `registo-sela`: lê `git rev-parse HEAD` (= A) e **acrescenta uma entrada de selo** que liga cada ID a `A:caminho#Lx-Ly`, marcando `publicação: commit`.
4. **Commit B** publica os selos. Nenhum commit contém o próprio hash.
5. `publicação: publicado` só quando `git branch -r --contains A` confirma o remoto. Os três estados são **colunas distintas**, nunca um booleano «está em Git».

Entradas sem selo aparecem no painel como **publicação atrasada** — é um estado visível, não um erro silencioso.

##### (v) Retoma e custo

`[P]` **Origem canónica = ficheiros append-only.** O índice (`docs/rede/indice/estado.sqlite`) é reconstruível e descartável.

- Tabela `entradas(id, assunto, quando, autor, tarefa, run, code_rev, publish_commit, publicação, caminho, offset, comprimento)`; guardar **offset e comprimento** torna a recuperação O(1) em vez de leitura total.
- **Leitura incremental**: watermark por ficheiro `(comprimento, mtime_ns, último_offset)`; lê só a cauda. Se o ficheiro encolheu ou o mtime recuou, reconstrói esse ficheiro inteiro.
- **Comparação a fazer em P2-06** (não é opinião, é medida): consulta por assunto com (a) leitura incremental do ficheiro, (b) índice reconstruível, em log pequeno e em log com ~10 000 entradas. Critério: o tempo de consulta por assunto **não cresce** com o tamanho total do log no caminho (b).
- **Três ensaios de retoma** (P2-15): interromper a meio de um append (bloco sem sentinela → validador quarentena-o, não o apaga); publicação atrasada (entrada sem selo → visível); ponto de secção desatualizado (código avançou desde o último ponto → «secção mais desatualizada» no painel, calculado como `max(idade do último ponto, n.º de commits que tocaram os caminhos da secção desde esse ponto)`).
- Apagar o índice e reconstruir tem de dar **as mesmas respostas**. É o teste que prova que a origem canónica é o ficheiro e não a base de dados.

#### 4.3 Pacote C · Contratos de teste e fronteiras de arquitetura

##### Catálogo único

Esquema por teste `[P]`, uma entrada append-only por alteração de contrato:

`teste_id · dono (equipa/módulo) · afirmação que protege · comando exato · bundle e opções · fixtures (caminho+sha256) · oráculo (de onde vem o esperado) · tolerâncias (com unidades) · dependências (config de build, sr, buffer, device, plugins instalados) · limitações (o que NÃO cobre) · última execução pertinente (run_id, code_rev, resultado) · custo esperado`

Inventariação (P2-09) cruza **requisitos ↔ testes ↔ artefactos** a partir de `ctest -N`, dos bundles reais (P0-06) e dos fixtures encontrados. Testes sem dono e afirmações sem teste ficam em duas listas explícitas — são o mapa do que a rede não pode afirmar.

##### O que o guardião verifica

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

##### `core-headers-publicos`

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

#### 4.4 Pacote D · Observação da organização em tempo real

##### Acontecimentos e de onde vêm

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

##### Recolha que não atrapalha

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

##### Painel e três tempos que não se somam

O painel responde, por tarefa: **«onde está, desde quando, que pergunta está pendente, qual é a última evidência?»** — cada resposta com referência clicável para `commit:caminho#linha`.

| Métrica | Definição | Quando é legítima |
|---|---|---|
| atraso de recolha | `ingest_ts − ts_evento` (p50/p95) | sempre |
| espera por resposta | `ts(resposta) − ts(pergunta)` | só com os dois extremos; requer entrada do comunicador |
| tempo de execução | `ts(PostToolUse) − ts(PreToolUse)` do mesmo `tool_use_id` | só com par completo |

Cada métrica publica a **percentagem de intervalos com ambos os extremos**. Um número sem cobertura declarada é pior que nenhum número.

##### Investigador e ensaio A/B de uma skill

`[P]` Amostragem de devoluções e correções, com duas classes explícitas: **devolução útil** (evitou um teste errado, uma alteração fora de fronteira, uma conclusão sem oráculo) e **retrabalho** (a mesma pergunta voltou porque a condição se perdeu). O brief é claro e o plano assume-o: **uma devolução que evita um teste errado é um resultado útil**, não um defeito.

Ensaio A/B (P5-04), uma variável só:

- **Variável:** uma única skill, versões A e B, instaladas por tag do plugin ou injetadas por `--agents` (V6) — nunca editadas a meio.
- **Constantes:** mesmo modelo e tier, mesmas ferramentas, mesma `code_rev`, mesmo cliente (auto-update desligado, V20), mesma família de tarefas.
- **Desenho:** tarefas equivalentes emparelhadas, ordem alternada (ABBA) para diluir aprendizagem; N≥6 (3+3) com os limites da amostra escritos antes de olhar para os resultados.
- **Métrica primária:** aceitação do produto pelo Diogo / teste pertinente que passa. **Secundárias:** devoluções úteis, perguntas repetidas, tempo até primeira evidência. Uma melhoria que só melhora o discurso é rejeitada.
- **Fora da máquina de medição:** o investigador corre na máquina de trabalho. Se o X3D for a mesma máquina (P0-13), os hooks de observação ficam desligados por flag durante a janela e os eventos são reconstruídos a partir dos logs do run **depois**, com `ingest_ts ≫ ts_evento` assinalado. O **overhead dos hooks mede-se à parte** (P3-07), nunca dentro da janela.


#### 4.5 Pacote C/UI · JIVE como alavanca de UI/UX (condicional a D-14)

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

### 5. Backlog ordenado

68 itens em ordem de execução. **Pacotes:** A = plugin e perfis · B = estado, concorrência e Git · C = contratos de teste e fronteiras · D = observação da organização.
**Esforço A/M/D:** horas de **agente** / horas de **máquina** (builds, testes, corridas) / horas de **intervenção do Diogo** (decisões, aprovações, artefactos). Intervalos justificados em 6.2.
**Responsáveis** são IDs de perfil da secção 3.2. «Dep.» lista IDs de backlog e decisões (`D-xx`) que têm de estar fechadas.
Versão rastreável e editável: `backlog.csv` (mesmos dados, mais a coluna de ação separada).

#### Fase 0 · Descoberta, instrumentação e baseline

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

#### Fase 1 · Percurso mínimo verificável

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

#### Fase 2 · Estado durável, concorrência e verificação

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

#### Fase 3 · Piloto do motor (prioridade prática)

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

#### Fase 4 · Piloto VST/JUCE

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

#### Fase 5 · Avaliação da rede

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

### 6. Fases, esforço e paralelismo

#### 6.1 Esforço por fase e por pacote

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

#### 6.2 Porque é que os intervalos são estes

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

#### 6.3 Condições de saída por fase

| Fase | Entrega mínima | Condição de saída (verificável) |
|---|---|---|
| 0 | inventário real, lacunas, baseline, decisões agrupadas | cada caminho e capacidade ligado a evidência **ou** classificado como pendente com comando; D-01/D-02/D-03/D-05 decididas |
| 1 | um pedido desce a uma equipa, regressa e é recuperável noutra sessão | cliente Windows, equipa e permissões confirmados; encaminhamento **e** retoma demonstrados (P1-06, P1-07) |
| 2 | gavetas aprovadas, registos incrementais, verificações do scribe e do guardião | ensaios de duas worktrees, alteração declarada em falta, diff sem registo e teste com tolerância alterada — **os quatro** a passar (P2-04, P2-08, P2-11) |
| 3 | Motor, QA, Debugging e Benchmarks executam um caso real | mesmo projeto, buffer e dispositivo com um worker e com a configuração habitual; builds e profiling **fora** da medição (P3-06, P3-07) |
| 4 | atualização A→B com automação; abrir, editar, guardar, recuperar | verificação áudio **e** UI independentes; artefacto em falta tem preparação e responsável (P4-01, P4-04) |
| 5 | painel e investigador mostram onde se perdeu uma condição e se a mudança à skill evitou a repetição | instrumentado desde o primeiro percurso; comparação com baseline; sessão nova recupera evidência **e limitações** (P5-06) |

#### 6.4 Paralelismo permitido e proibido

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

### 7. Plano de validação e recuperação

#### 7.1 Matriz de ensaios

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

#### 7.2 Falhas de comunicação — deteção e recuperação

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

#### 7.3 Eventos perdidos

Três garantias e um limite declarado:

1. **Origem em ficheiro**: os hooks escrevem JSONL; a base é derivada. Perder a base não perde observações (ensaio 18).
2. **Idempotência**: reingerir o mesmo ficheiro não duplica eventos (chave de dedup em 4.4).
3. **Honestidade sobre lacunas**: se um hook falhar ou o evento só existir no CLI, o painel mostra **cobertura de eventos** por sessão. Não se interpola.
4. **Limite**: um acontecimento que nunca gerou evento nem entrada de log é **irrecuperável**. É por isso que o comunicador regista *durante* a passagem e não no fim `[D]`.

#### 7.4 Reversibilidade — desligar sem perder resultados

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

#### 7.5 Compatibilidade de projetos antigos

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

### 8. Primeira sessão executável

**Tarefa:** `T-20261120-main-01` (esquema geral: `T-<data>-<worktree>-<seq>`). **Item de backlog:** P1-06. **Perfil que pega:** `coord`.

#### 8.1 Pré-requisitos (todos verificáveis antes de começar)

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

#### 8.2 O pedido a dar ao Qoder

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

#### 8.3 O que cada perfil faz, e onde termina a sua responsabilidade

| Perfil | Faz | Termina quando | Não faz |
|---|---|---|---|
| `coord` | preserva a intenção literal, cria a tarefa, encaminha a `min-eng`, agrega | a resposta final resolve as três perguntas ou identifica o bloqueio | investigar código ele próprio |
| `min-eng` | escolhe o ramo Host, pede o ponto da secção | o ponto tem revisão e momento | consultar Motor ou JUCE «por precaução» |
| `host` | lê o percurso de estado e cruza com o catálogo | cada afirmação tem `ficheiro:linha` ou «por verificar» + comando | alterar código; estimar cobertura |
| `host-comm` | regista perguntas, destinatários, respostas e condições **durante** a passagem | cada pergunta tem resposta ou estado pendente | reescrever a intenção |
| `comm-geral` | fecha o dossiê e propõe a entrada de estado | o dossiê permite chegar à fonte sem o chat | selar (isso é do scribe, Fase 2) |

#### 8.4 Resposta esperada (forma, não conteúdo inventado)

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

#### 8.5 Como confirmar que ficou registada e recuperável

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

### 9. Decisões para o Diogo, por ordem de bloqueio

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

### 10. Critério de aceitação deste plano

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

### Anexo A · Fontes consultadas

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

### Anexo B · Contrato de entrega de tarefa

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


---

# PARTE III — Avaliação do JIVE para UI/UX (ronda 2)

> **Reproduzido sem alterações** (só os níveis de título foram deslocados). Documento da ronda 2. A análise técnica mantém-se; o **spike está suspenso** — ver C-13 da Parte I.

## Avaliação · JIVE para UI/UX na rede de equipas do Core

**Para:** Diogo · **Data:** 2026-11-20 · **Anexo ao:** `Plano-Rede-Core-Qoder.md`
**Pergunta a responder:** «ver se isto ajuda criar plugin ou skills para UI/UX» — [github.com/ImJimmi/JIVE](https://github.com/ImJimmi/JIVE)
**Marcas de origem:** `[V]` verificado por mim hoje (URL indicado) · `[D]` desenho do Diogo · `[P]` proposta minha · `[PV]` por verificar.

---

### 0. Resposta curta

**Sim, ajuda muito — mas não onde a pergunta aponta.** O JIVE não pode ser a UI de um plugin do Qoder: um plugin Qoder é Markdown + JSON + hooks, e as superfícies visuais do Qoder são Canvas (`.canvas.tsx`); o JIVE é C++/JUCE e corre **dentro da DAW**. `[V]`

Onde ele ajuda é do **lado do produto**, e isso torna as **skills de UI/UX muito mais fortes**: o JIVE transforma a UI do Core em **XML (layout) + JSON (estilos)**. Texto é diffável, governável e testável. Passa a ser possível ter um **contrato objetivo de UI** — o análogo do `core-headers-publicos` para a interface — em vez de depender só de «captura vs mockup». E o *hot reloading* em Debug corta o ciclo de rebuild, que é hoje o maior custo de máquina do piloto de UI.

**Veredicto** `[P]`: **adotar em spike, num ecrã pequeno, com versão fixada — não migrar a UI do Core.** Duas skills novas (`core-jive-ui`, `core-ui-contrato`), duas alteradas (`core-qa-ux`, `core-vst3-automacao`), quatro testes novos para o catálogo do guardião. Decisão **D-14**.

**Aviso imediato:** o README que anexaste é da **era 1.x**. No `main` de hoje (JIVE **2.0.0**) o exemplo de CMake desse anexo **já não funciona**: a flag `JIVE_GUI_ITEMS_HAVE_STYLE_SHEETS` foi **removida**, e várias propriedades de estilo foram renomeadas ou movidas. Se seguires o anexo, ou o build falha, ou — pior — os estilos ficam **silenciosamente inertes**. Detalhe na secção 1.3. `[V]`

---

### 1. O que o JIVE é — factos verificados

#### 1.1 Núcleo

| Facto | Detalhe | Fonte |
|---|---|---|
| Bundle de módulos JUCE | `jive_core`, `jive_layouts`, `jive_style_sheets` (em 2.0, `jive_components` foi fundido em `jive_style_sheets`) | [CMakeLists.txt](https://github.com/ImJimmi/JIVE/blob/main/CMakeLists.txt), [BREAKING_CHANGES.md](https://github.com/ImJimmi/JIVE/blob/main/BREAKING_CHANGES.md) |
| Layout declarativo | XML → `juce::ValueTree` → hierarquia de `juce::Component` que **reage a alterações da árvore**; layouts Flex, Grid e Block; Box Model (margens, padding, bordas, cantos) | [jive_layouts/README.md](https://github.com/ImJimmi/JIVE/blob/main/jive_layouts/README.md), [README](https://github.com/ImJimmi/JIVE/blob/main/README.md) |
| Estilos declarativos | JSON com seletores **ID, tipo, classe e pseudo-classe**, combináveis e aninhados; **tokens** no objeto raiz; **imports** entre style sheets | [README](https://github.com/ImJimmi/JIVE/blob/main/README.md) |
| Templates e Snippets | reutilizar vistas dentro de outras vistas, com conteúdo personalizado | idem |
| **Hot reloading** | observa XML/JSON e aplica imediatamente; `jive_sources()` decide disco vs embutido | idem + [cmake/jive_sources.cmake](https://github.com/ImJimmi/JIVE/blob/main/cmake/jive_sources.cmake) |
| **Auto-attach de parâmetros** | `jive::Interpreter::autoAttachParameters()` procura parâmetros de áudio que correspondam aos widgets | [README](https://github.com/ImJimmi/JIVE/blob/main/README.md) |
| Localização | ficheiros `.strings`, propriedade `lang` por componente | idem |
| Janelas nativas | macOS: barra unificada; Windows: cor da barra segue o fundo; materiais `glass`/`tinted` | idem |
| Licença | **MIT**, Copyright (c) 2026 James Johnson | [LICENSE.md](https://github.com/ImJimmi/JIVE/blob/main/LICENSE.md) |
| Versão e build | `project(JIVE VERSION 2.0.0)`, `cmake_minimum_required(VERSION 3.15)` | [CMakeLists.txt](https://github.com/ImJimmi/JIVE/blob/main/CMakeLists.txt) |
| Atividade | último commit **16 Nov 2026**, 691 commits, 14 tags, 4 branches; CI de testes + cobertura | [repo](https://github.com/ImJimmi/JIVE) |
| Ferramentas de qualidade embutidas | opções `JIVE_BUILD_TEST_RUNNER`, `JIVE_BUILD_BENCHMARKS`, `JIVE_ENABLE_COVERAGE`, **`JIVE_ENABLE_PLUGINVAL`**, **`JIVE_ENABLE_MELATONIN_INSPECTOR`**, `JIVE_ENABLE_PERFETTO` | [CMakeLists.txt](https://github.com/ImJimmi/JIVE/blob/main/CMakeLists.txt) |
| **JUCE fixado a `master`** | `CPMDeclarePackage(JUCE GIT_TAG master …)` — o CI do JIVE testa contra JUCE **master**, não contra uma release | [package-lock.cmake](https://github.com/ImJimmi/JIVE/blob/main/package-lock.cmake) |
| Standard C++ | não declarado nas opções de compilador; `[PV]` — confirmar com `Select-String -Path JIVE/**/CMakeLists.txt -Pattern 'cxx_std'` | [jive_compiler_and_linker_options.cmake](https://github.com/ImJimmi/JIVE/blob/main/cmake/jive_compiler_and_linker_options.cmake) |

#### 1.2 A mecânica que interessa ao piloto (verificada no código, não no marketing)

`jive_sources(<target> SOURCES <glob>… [BUNDLE_SOURCES <bool>])` `[V]`:

- Por omissão, `BUNDLE_SOURCES = $<NOT:$<CONFIG:Debug>>` → **Debug lê do disco** (hot reload); **outras configurações embutem um zip** via `juce_add_binary_data`.
- Os ficheiros são referenciados **pelos mesmos caminhos em disco** nos dois casos.
- Quando o alvo é um plugin JUCE, o registo dos sources é compilado **em cada formato** (VST3, etc.), não na biblioteca estática partilhada — porque o linker a descartaria.

**Três consequências diretas para o plano:**

1. **Debug ≠ Release por construção.** Uma UI que funciona em hot reload pode falhar no binário entregue (ficheiro fora do glob, caminho relativo, ficheiro novo não apanhado pelo `CONFIGURE_DEPENDS`). Isto exige um teste de **paridade** (secção 7).
2. **A «build identificada» das entradas de registo passa a ter de declarar `BUNDLE_SOURCES`.** Sem isso, duas corridas com o mesmo hash de código podem ter UI diferente — exatamente a contaminação que o guardião tem de apanhar.
3. O ponto 3 do `jive_sources` encaixa no requisito do desenho de **módulo separado do executável** `[D]`: o JIVE já trata o caso «plugin com formatos partilhados».

#### 1.3 Armadilha do anexo: 1.x → 2.0

O README anexado descreve a API 1.x. Diferenças que **partem código ou silenciam estilos** `[V]`, todas em [BREAKING_CHANGES.md](https://github.com/ImJimmi/JIVE/blob/main/BREAKING_CHANGES.md):

| No anexo (1.x) | Em 2.0 | Efeito se ignorado |
|---|---|---|
| `JIVE_GUI_ITEMS_HAVE_STYLE_SHEETS=1` | **flag removida**; `jive_layouts` depende sempre de `jive_style_sheets` | definição inútil; projetos Projucer precisam dos três módulos |
| `jive_components` como módulo próprio | fundido em `jive_style_sheets` | include falha |
| `"hover"`, `"active"`, `"focus"` … | **`:hover`, `:active`, `:focus`** (pseudo-classes) | **sem os dois pontos, a chave é lida como seletor de tipo e não casa com nada — estilo silenciosamente inerte** |
| `font-weight`, `font-style`, `text-decoration` | **`font-styles`** (combinável: `"bold italic"`) | propriedade ignorada |
| `letter-spacing` (px), `font-stretch` | `font-kerning` (fator), `font-scale` | propriedade ignorada |
| `<Text justification=… direction=…>` | `text-align` / `direction` **em style sheet** | atributo ignorado |
| `opacity` como atributo | propriedade de estilo (aceita `%`) | atributo ignorado |
| `centre-x` / `centre-y` | `x`/`y` + **`anchor`** | posicionamento errado |
| gradiente com `orientation`/`stops` | string CSS `linear-gradient(...)` | gradiente não aplicado |
| defaults escritos na árvore (`display="flex"`, `opacity="1"`…) | **defaults já não são escritos** | testes que inspecionam a árvore à espera de defaults **falham** |

O último ponto é o mais interessante para nós: **muda o oráculo dos testes de UI**. Um teste estrutural tem de asserting sobre propriedades *definidas*, não sobre defaults implícitos.

---

### 2. O que o JIVE **não** resolve (limites duros)

| Expectativa | Realidade |
|---|---|
| «Plugin do Qoder com UI em JIVE» | **Impossível.** Plugin Qoder = `plugin.json` + `agents/`, `skills/`, `commands/`, `hooks/`, `.mcp.json`; a superfície visual do Qoder é Canvas (`.canvas.tsx`). JIVE é C++/JUCE e vive dentro da DAW. `[V]` |
| «Substitui o mockup aprovado» | Não. Continua a ser preciso um mockup aprovado (D-07) e evidência visual da build real. O JIVE aproxima o *formato* do mockup (tokens/seletores), não elimina a comparação. |
| «Resolve a automação dos projetos antigos» | Não, e **pode complicar**: `autoAttachParameters()` faz corresponder widgets a parâmetros automaticamente. Se essa correspondência mudar entre A e B, muda o que a automação antiga aponta. Tem de ser governado (secção 7). |
| «Dá oráculo de áudio» | Não. Continua a ser QA Áudio + bundles + tolerâncias do catálogo. |
| «Dispensa Undo/foco do Core» | Não. O JIVE expõe `clicking-grabs-focus` e `accessible`, o que **ajuda** o requisito de foco, mas o Undo do Core continua a ser do Core `[D]`. |
| «É estável» | É um projeto ativo com **breaking changes recentes** e um único mantenedor principal. `main` é um alvo movediço. |

---

### 3. Porque ajuda mesmo assim — cinco alavancas para a rede

| # | Alavanca | Efeito concreto na rede | Onde entra no plano |
|---|---|---|---|
| **L1** | **UI passa a ser texto** (XML + JSON) | o scribe passa a verificar diff↔registo na UI **com o mesmo mecanismo** do código; o guardião passa a ter contratos de UI com hash, oráculo e tolerância; o `juce` deixa de escrever classes `Component` | §4.2 e §4.3 do plano, sem alteração de mecanismo |
| **L2** | **Hot reload em Debug** | iteração de UI sem rebuild → menos **tempo de máquina** (o recurso que não se comprime com mais agentes) e mais variantes por sessão; permite QA UX comparar 3 propostas no tempo de 1 | piloto F4, esforço de máquina reduzido |
| **L3** | **Contrato objetivo de UI** | `core-ui-contrato` dá a QA UX um **oráculo verificável** antes da captura: elementos/propriedades válidas, IDs estáveis, tokens existentes, seletores que casam, pseudo-classes 2.0, ausência de propriedades 1.x | teste novo no catálogo (secção 7) |
| **L4** | **Design system partilhado** (tokens, imports, templates, snippets) | o mockup aprovado traduz-se em **tokens + seletores**, não em pixels; muda-se o tema num ficheiro; menos retrabalho entre `juce` e `qa-ux` | skill `core-jive-ui` |
| **L5** | **Ferramentas do ecossistema** | `pluginval` como oráculo externo do VST3; **Melatonin Inspector** para evidência de hierarquia/foco em runtime; **Perfetto** para tracing do `debug`; o test runner/benchmarks/coverage do JIVE como referência de método | catálogo (P2-09) e skills de QA/debug |

**A leitura estratégica** `[P]`: o valor do JIVE para a rede não é «UI mais bonita». É **converter trabalho de UI de opaco para verificável**. Hoje, «a UI está bem» é uma opinião sustentada por uma captura. Com markup + estilos + contrato, passa a ser uma afirmação com oráculo — que é exatamente o que o Diogo pediu na intenção original («resposta tecnicamente verificável»).

---

### 4. Riscos e neutralização

| Risco | Gravidade | Neutralização proposed `[P]` |
|---|---|---|
| `main` com breaking changes (2.0 mudou módulos, seletores, propriedades) | **alta** | **fixar tag/commit**, nunca `@main`; actualizar só com ensaio de migração; `BREAKING_CHANGES.md` entra como fonte primária obrigatória da skill |
| JIVE testa contra **JUCE master** | **alta** | o Core fixa a **sua** versão de JUCE; ensaio de compatibilidade antes de adoção; não herdar o `package-lock.cmake` do JIVE |
| Debug (disco) ≠ Release (zip embutido) | **alta** | teste de **paridade** (secção 7) + `BUNDLE_SOURCES` declarado em cada entrada de evidência de UI |
| `autoAttachParameters()` rebind silencioso | **alta** para o piloto A→B | mapa explícito widget↔ID de parâmetro, versionado e testado; auto-attach **desligado** no piloto de automação até o mapa estar provado |
| Listeners de `ValueTree` no message thread vs callback de áudio | média | regra RT: **nenhuma mutação de árvore/estilo a partir do callback de áudio**; comunicação por filas existentes do motor `[D]`; verificação por `core-motor-rt` |
| Licenças | baixa | JIVE é **MIT** (compatível com produto fechado); **JUCE mantém o seu próprio licenciamento** (GPLv3/comercial) — confirmar a licença do Core, que é o ponto real, não o JIVE |
| Dependência de um mantenedor | média | versão fixada + fork interno se necessário; MIT permite; sem expectativa de suporte |
| Migração 1.x→2.0 se já houver código JIVE no Core | `[PV]` | descobrir se o Core já usa JIVE (P0-17); se usa 1.x, a migração é um projeto próprio, não um spike |
| Acessibilidade/foco | baixa | JIVE expõe `accessible` e `clicking-grabs-focus`; entram no checklist de QA UX como propriedades verificáveis |

---

### 5. O que proponho fazer — spike, não migração

**Âmbito** `[P]`: **um ecrã pequeno e representativo** do Core (por exemplo, um painel de um plugin incluído, com 3–5 controlos ligados a parâmetros), refeito em JIVE **em paralelo** com a versão C++ existente, que não é tocada. Nada de migrar a DAW.

| Passo | Ação | Critério de aceitação | Esforço A/M/D (h) |
|---|---|---|---|
| 1 · Compatibilidade (P0-17) | descobrir versão de JUCE e C++ do Core, CMake, se já há JIVE; compilar JIVE 2.0 fixado contra a JUCE do Core; correr o test runner do JIVE | compila e passa os testes do JIVE na configuração do Core, ou incompatibilidade nomeada com ficheiro/linha | 2–4 / 1–2 / 0.5–1 |
| 2 · Spike de ecrã (P4-08) | recriar o ecrã em XML+JSON com tokens do mockup; hot reload em Debug | percurso musical executável com rato e teclado; contrato de UI a passar; captura comparada com mockup | 6–12 / 1–3 / 1–2 |
| 3 · Contrato de UI (P2-17) | implementar `core-ui-contrato` + controlo negativo | falha quando deve falhar (3 mutações), passa ao repor | 3–6 / 0.5–1 / 0.25–0.5 |
| 4 · Paridade e parâmetros (P4-09) | Debug disco vs Release embutido; mapa widget↔parâmetro estável A→B | mesma árvore/estilos nos dois modos; mapa de parâmetros idêntico ou diferença explícita | 3–6 / 1–2 / 0.5–1 |
| 5 · Decisão (D-14) | comparar 3 números com a linha de base de UI em C++ | decisão escrita: adotar em novos ecrãs / manter C++ / adiar | 0.5–1 / 0 / 0.5–1 |

**Os três números a medir** (sem isto o spike é gosto, não engenharia):

1. **Tempo de iteração**: do pedido «muda este espaçamento/cor» até evidência visual, em JIVE (hot reload) vs C++ (rebuild).
2. **Tempo de máquina** por iteração de UI (o recurso escasso).
3. **Defeitos apanhados pelo contrato** antes da captura — e quantos chegaram à captura anyway.

**Condição de saída honesta:** se o JIVE não compilar contra a JUCE do Core, o spike **termina no passo 1** com incompatibilidade documentada. Isso é um resultado útil, não um fracasso — e custa 2–4 h em vez de 15–30 h.

---

### 6. Skills novas e alteradas

#### 6.1 `core-jive-ui` (nova, declarativa + comando) — dono: `juce`

- **Missão:** escrever e alterar UI do Core em markup JIVE, respeitando as convenções do projeto e a versão fixada.
- **Disparo (descrição):** «muda o layout», «ajusta o espaçamento», «o botão não fica com o estilo», «novo painel», «tema». **Não usar** para lógica de negócio nem para DSP.
- **Conteúdo obrigatório:** onde vivem os XML/JSON; naming de `id` (estável, porque os seletores e os testes dependem dele); tokens primeiro, valores literais nunca; templates/snippets para repetição; pseudo-classes **com dois pontos**; propriedades 2.0 (tabela de migração 1.3 embutida como *checklist*); `jive_sources()` e o que entra no glob; regra RT (árvore não se mexe no callback).
- **Fonte primária:** `jive_layouts/README.md`, `jive_style_sheets/README.md`, `docs/guides/*`, `BREAKING_CHANGES.md` — **na tag fixada**, não em `main`.
- **Modelo:** Qwen3.8-Flash, `effort: medium`. Markup é trabalho de estrutura, não de juízo profundo — e é aqui que a escolha de modelos do Diogo poupa mais.

#### 6.2 `core-ui-contrato` (nova, comando executável/teste) — dono: `guardiao`

- **Missão:** verificar objetivamente o contrato da UI antes de qualquer captura.
- **Verificações** `[P]`: XML bem formado; elementos e propriedades dentro do vocabulário permitido da versão fixada; `id`s únicos e estáveis (lista governada); todo o seletor casa com pelo menos um elemento (deteta seletores mortos); todos os tokens referenciados existem; pseudo-classes com `:`; **nenhuma propriedade 1.x removida**; nenhum `import` em falta; glob de `jive_sources()` apanha todos os ficheiros usados.
- **Oráculo:** o vocabulário da versão fixada do JIVE + a lista de IDs governada + os tokens do design system. **Não** é a saída atual do programa (não se regera o golden a partir do que o programa faz).
- **Saída:** lista de violações com `ficheiro:linha`, classificadas em *contrato quebrado* vs *estilo inerte* — a segunda classe é a que hoje ninguém vê.
- **Modelo:** nenhum. É um script determinístico; o modelo só interpreta o resultado.

#### 6.3 `core-qa-ux` (alterada) — passa a ter **quatro** camadas de evidência

1. **Contrato estrutural** (`core-ui-contrato`) — objetivo, barato, corre sempre.
2. **Árvore em runtime** (candidato: Melatonin Inspector) — hierarquia, foco, visibilidade reais. `[PV]` integração.
3. **Captura vs mockup** — visual, com tokens como ponte.
4. **Percurso funcional** com rato e teclado, incluindo seleção, foco e Undo.

Regra nova: **uma captura não substitui o contrato, e o contrato não substitui a captura.** São oráculos diferentes para afirmações diferentes.

#### 6.4 `core-vst3-automacao` (alterada)

Acrescenta: mapa explícito widget↔ID de parâmetro; verificação de que `autoAttachParameters()` não alterou o mapa; `pluginval` como oráculo externo candidato (versão e licença `[PV]`); declaração de `BUNDLE_SOURCES` na evidência.

---

### 7. Testes novos para o catálogo do guardião

| Teste | Protege a afirmação | Oráculo | Controlo negativo (obrigatório) |
|---|---|---|---|
| `core-ui-contrato` | «a UI respeita o vocabulário e o design system» | vocabulário da tag fixada + IDs governados + tokens | remover um token referenciado; escrever `"hover"` sem `:`; usar `font-weight` (1.x) → **tem de falhar nas três classes** |
| `core-ui-embed-paridade` | «o que vejo em Debug é o que entrego em Release» | árvore/estilos obtidos nos dois modos | adicionar um XML fora do glob → Debug passa, Release falha → **o teste tem de apanhar** |
| `core-ui-parametros` | «os widgets apontam para os mesmos parâmetros entre A e B» | mapa versionado widget↔ID | renomear um ID de parâmetro → **tem de falhar**; automação antiga tem de ser verificada à parte |
| `core-vst3-pluginval` (candidato) | «o plugin passa validação externa» | pluginval, versão fixada | introduzir um defeito conhecido (ex.: parâmetro fora de gama) → **tem de falhar** |

Todos entram no catálogo com dono, comando, dependências e **limitações** — e nenhum corre dentro da janela de medição do X3D.

---

### 8. Encaixe na matriz de modelos escolhida

Os modelos que indicaste encaixam bem nesta divisão `[P]`:

| Trabalho | Modelo | Perfis |
|---|---|---|
| Juízo arquitetural, causalidade, contratos | **Qwen4-Max-Preview**, `effort: high` | `motor`, `host`, `debug`, `guardiao`, `min-eng`, `investigador` |
| Preservação de intenção e agregação | **Qwen4-Max-Preview**, `effort: medium` | `coord`, `scribe`, `min-qua` |
| Estrutura, markup, testes com oráculo dado, pesquisa | **Qwen3.8-Flash**, `effort: medium` | `juce`, `qa-audio`, `qa-ux`, `bench`, `pesquisa`, `min-reg` |
| Transcrição de passagem com contrato fixo | **Efficient**, `effort: low` | os 9 comunicadores |

**Porque é seguro pôr os comunicadores no Efficient:** o trabalho deles é transcrever com campos obrigatórios, e a correção é verificada **por código** (validador de blocos + hook `Stop` bloqueante), não por esperança. É a maior alavanca de custo da rede — 9 dos 24 perfis — e o risco é coberto por verificação determinística.

**Onde o JIVE muda a conta:** com markup, o `juce` faz trabalho de estrutura (Flash) em vez de desenho de classes C++ (Max). O contrato de UI é um script (custo de modelo zero). Só a interpretação de uma divergência visual sobe para Max.

Matriz completa por perfil, com esforço e justificação: **secção 3.8 do plano**.

---

### 9. Decisões que isto acrescenta

| ID | Decisão | Recomendação `[P]` | Bloqueia |
|---|---|---|---|
| **D-14** | Adotar JIVE? Em que âmbito? | **spike num ecrã** (secção 5), versão fixada, sem migrar a UI existente; decisão final com os 3 números | P2-17, P4-08, P4-09 (P0-17 corre independentemente) |
| **D-16** | Versão JIVE fixada e política de atualização | tag/commit fixo + fork interno se necessário; atualização só com ensaio de migração contra `BREAKING_CHANGES.md` | qualquer trabalho JIVE |
| **D-07** (reforço) | O mockup aprovado passa a incluir **tokens** (cores, tipografia, espaçamentos) além da imagem | pedir ao designer/Diogo os tokens; sem eles, L4 perde metade do valor | qualidade do piloto de UI |

**Nota sobre o anexo:** guarda-o como referência histórica, mas a skill tem de apontar à **tag fixada**. Se o Diogo quiser, o próximo passo útil é eu escrever a tabela de migração 1.x→2.0 como *checklist* dentro de `core-jive-ui` — está já resumida em 1.3.

---

### 10. Fontes

Verificadas em **2026-11-20**, no branch `main` (último commit 16 Nov 2026):

- [README.md](https://github.com/ImJimmi/JIVE/blob/main/README.md) — layouts, estilos, hot reloading, janelas nativas, localização, auto-attach, integração CMake/Projucer
- [jive_layouts/README.md](https://github.com/ImJimmi/JIVE/blob/main/jive_layouts/README.md) — XML→ValueTree, propriedades comuns (`accessible`, `clicking-grabs-focus`, `class`, `cursor`, …)
- [BREAKING_CHANGES.md](https://github.com/ImJimmi/JIVE/blob/main/BREAKING_CHANGES.md) — todas as diferenças 1.x→2.0 citadas em 1.3
- [CMakeLists.txt](https://github.com/ImJimmi/JIVE/blob/main/CMakeLists.txt) — versão 2.0.0, CMake ≥3.15, opções de testes/benchmarks/pluginval/inspector/perfetto
- [cmake/jive_sources.cmake](https://github.com/ImJimmi/JIVE/blob/main/cmake/jive_sources.cmake) — semântica exata de disco vs zip embutido e o caso dos formatos de plugin
- [package-lock.cmake](https://github.com/ImJimmi/JIVE/blob/main/package-lock.cmake) — JUCE fixado a `master`
- [LICENSE.md](https://github.com/ImJimmi/JIVE/blob/main/LICENSE.md) — MIT
- Anexo do Diogo (`8f931841-…txt`) — README da era 1.x, usado apenas para comparação

**Por verificar no checkout do Core** (P0-17): versão de JUCE em uso, standard C++, sistema de build, se já existe JIVE e em que versão, e onde vivem hoje os componentes do ecrã escolhido para o spike.

# PARTE IV — Dados completos (backlog, fichas de agente, skills)

> Gerado a partir de `backlog.csv` (68 itens), `inventario-agentes.csv` (24 fichas) e `inventario-skills.csv` (24 skills), **sem alterar esses ficheiros**. Os quadros-resumo das Partes II e III são gerados a partir das mesmas fontes, por isso não divergem.
>
> **Estado destes dados:** refletem o plano antes da revisão. Aplicam-se-lhes as correções da Parte I — em especial `D-01…D-16` → **`NET-01…NET-16`**, caminhos `docs/rede/**` substituídos pela árvore documental existente, saída em **inglês** dentro do repositório, e os itens suspensos/reescritos listados em I.5. Os CSV não foram editados de propósito: a adenda é aditiva, não reescreve entregas.

## IV.1 Backlog completo — 68 itens

Três esforços **nunca se somam**: horas de agente, horas de máquina (espera) e horas do Diogo (decisão/revisão).

### P0-01 · Checkout identificado sem ambiguidade

- **Ordem:** 1
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Checkout identificado sem ambiguidade
- **Ação:** Correr git remote -v; git rev-parse --abbrev-ref HEAD; git rev-parse HEAD; git status --porcelain; git worktree list e guardar a saída
- **Alvo/caminho:** raiz do checkout (por verificar)
- **Responsável:** coord (modo descoberta)
- **Dependências:** —
- **Horas de agente:** 0.5-1
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** owner/repo, branch, rev e estado sujo registados; worktrees listadas
- **Evidência esperada:** docs/rede/descoberta/checkout.md com saída literal dos comandos

### P0-02 · Entrada do motor e fronteira com JUCE localizadas

- **Ordem:** 2
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Entrada do motor e fronteira com JUCE localizadas
- **Ação:** Procurar ma_device/ma_engine/miniaudio e o callback de áudio; seguir até ao grafo; procurar onde JUCE chama o motor
- **Alvo/caminho:** include/**, src/** (por verificar); Select-String -Pattern 'ma_device|ma_engine|miniaudio'
- **Responsável:** coord + motor (leitura)
- **Dependências:** P0-01
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** Ficheiro e linha do callback e do ponto de contacto com JUCE identificados, ou ponto marcado por verificar com comando em falta
- **Evidência esperada:** descoberta/motor.md com refs ficheiro:linha

### P0-03 · Percurso de estado do Host VST localizado

- **Ordem:** 3
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Percurso de estado do Host VST localizado
- **Ação:** Procurar descoberta, createInstance, buses, parâmetros, latência, getStateInformation/setStateInformation e o carregamento do módulo separado
- **Alvo/caminho:** src/host/** (por verificar)
- **Responsável:** host (leitura)
- **Dependências:** P0-01
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** Cadeia guardar→restaurar identificada com refs; lacunas nomeadas
- **Evidência esperada:** descoberta/host.md com refs ficheiro:linha

### P0-04 · Targets de build, testes e instalador inventariados

- **Ordem:** 4
- **Fase:** 0
- **Pacote:** C
- **Resultado:** Targets de build, testes e instalador inventariados
- **Ação:** cmake --list-presets; ler CMakePresets.json; ctest -N; procurar .iss/.wxs/.nsi/.wixproj
- **Alvo/caminho:** CMakeLists.txt, CMakePresets.json, build/ (por verificar)
- **Responsável:** coord + guardiao
- **Dependências:** P0-01
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0
- **Critério de aceitação:** Lista de presets, de testes registados e do alvo de instalador, com o comando que os produz
- **Evidência esperada:** descoberta/build-testes.md com saída de ctest -N

### P0-05 · Scripts PowerShell reais catalogados

- **Ordem:** 5
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Scripts PowerShell reais catalogados
- **Ação:** Para cada .ps1: extrair param block, pré-requisitos, comando de invocação e artefactos produzidos; correr em modo seguro (-WhatIf ou leitura)
- **Alvo/caminho:** Get-ChildItem -Recurse -Filter *.ps1 (por verificar)
- **Responsável:** coord
- **Dependências:** P0-01
- **Horas de agente:** 1.5-3
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0
- **Critério de aceitação:** Tabela script→comando→pré-requisitos→resultado, sem scripts inventados
- **Evidência esperada:** descoberta/scripts.md; uma linha por script encontrado

### P0-06 · Bundles e convenções de relatórios identificados

- **Ordem:** 6
- **Fase:** 0
- **Pacote:** C
- **Resultado:** Bundles e convenções de relatórios identificados
- **Ação:** Localizar bundles de teste, opções aceites e onde os relatórios são escritos hoje
- **Alvo/caminho:** bundles/**, tests/**, reports/** (por verificar)
- **Responsável:** guardiao
- **Dependências:** P0-04
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** Cada bundle tem comando, opções e destino de relatório; convenção atual descrita
- **Evidência esperada:** descoberta/bundles.md

### P0-07 · Cliente Qoder e versão confirmados

- **Ordem:** 7
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Cliente Qoder e versão confirmados
- **Ação:** qoder --version; confirmar desktop/IDE/CLI em uso; ler %USERPROFILE%\.qoder\settings.json e .env; desativar auto-update
- **Alvo/caminho:** %USERPROFILE%\.qoder\ (documentado)
- **Responsável:** Diogo + coord
- **Dependências:** —
- **Horas de agente:** 0.5-1
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Versão, forma de execução e caminhos de configuração registados; general.enableAutoUpdate=false aplicado
- **Evidência esperada:** descoberta/qoder-cliente.md com versão e captura das definições

### P0-08 · Modelo Qwen disponível no dispositivo registado

- **Ordem:** 8
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Modelo Qwen disponível no dispositivo registado
- **Ação:** Abrir o seletor de modelos; registar nomes, modelId, tiers e taxa de Credits; escolher tier fixado para os pilotos
- **Alvo/caminho:** Seletor de modelos do cliente (o seletor é autoritativo)
- **Responsável:** Diogo
- **Dependências:** P0-07
- **Horas de agente:** 0.25-0.5
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Nome exato e modelId do modelo Qwen usado, mais tier fixado por fase
- **Evidência esperada:** descoberta/modelos.md com captura do seletor

### P0-09 · Capacidades distinguem documentado de verificado

- **Ordem:** 9
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Capacidades distinguem documentado de verificado
- **Ação:** Correr /agents, qoder agents list, /plugins, qoder plugins list --json, /memory; confirmar skills carregadas e um hook a disparar
- **Alvo/caminho:** .qoder/agents, .qoder/skills, .qoder/settings.json
- **Responsável:** coord
- **Dependências:** P0-07
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Tabela capacidade→documentada→verificada nesta instalação, com prova de cada sim
- **Evidência esperada:** descoberta/capacidades.md com saída dos comandos

### P0-10 · Composição de equipas confirmada no cliente

- **Ordem:** 10
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Composição de equipas confirmada no cliente
- **Ação:** IDE: Settings>Agent Team>Create (verificar limite de 1 líder + 4 membros e nome imutável). CLI: QODER_AGENT_TEAMS=1 e criar 2 teammates
- **Alvo/caminho:** Settings > Agent Team; %USERPROFILE%\.qoder\.env
- **Responsável:** Diogo + coord
- **Dependências:** P0-09
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Sabido se as 11 equipas cabem no cliente e quais passos são manuais; limite de membros confirmado ou refutado
- **Evidência esperada:** descoberta/equipas.md com captura do painel e passos manuais

### P0-11 · Passagem mínima demonstrada e correladores identificados

- **Ordem:** 11
- **Fase:** 0
- **Pacote:** D
- **Resultado:** Passagem mínima demonstrada e correladores identificados
- **Ação:** Ensaio: coord delega uma pergunta a host; host responde; capturar session_id, agent_id, tool_use_id nos hooks
- **Alvo/caminho:** hooks em .qoder/settings.json; docs/rede/logs/*
- **Responsável:** coord + comm-geral
- **Dependências:** P0-09
- **Horas de agente:** 1.5-3
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Uma pergunta desce e regressa; os três correladores aparecem nos eventos capturados
- **Evidência esperada:** logs JSONL do ensaio + descoberta/passagem.md

### P0-12 · Recolha de eventos ativa desde o início

- **Ordem:** 12
- **Fase:** 0
- **Pacote:** D
- **Resultado:** Recolha de eventos ativa desde o início
- **Ação:** Instalar hooks mínimos (UserPromptSubmit, SubagentStart/Stop, PostToolUse, PostToolUseFailure, Stop, SessionEnd) em modo async, com dispatcher e kill-switch
- **Alvo/caminho:** .qoder/settings.json + tools/rede/obs-hook.ps1 (propostos)
- **Responsável:** coord + investigador
- **Dependências:** P0-09
- **Horas de agente:** 2-4
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0
- **Critério de aceitação:** Os 6 tipos de acontecimento aparecem em JSONL; kill-switch por ficheiro flag desliga tudo sem editar settings
- **Evidência esperada:** JSONL com os 6 tipos + prova de que a flag desliga

### P0-13 · Artefactos de prova confirmados ou lacunas nomeadas

- **Ordem:** 13
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Artefactos de prova confirmados ou lacunas nomeadas
- **Ação:** Verificar projeto pesado, VST3 próprio A e B, projeto antigo com automação e mockup aprovado; registar mínimo para preencher cada lacuna
- **Alvo/caminho:** pastas de projetos e assets (por verificar)
- **Responsável:** Diogo + coord
- **Dependências:** P0-01
- **Horas de agente:** 0.5-1
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Quatro artefactos com estado existe/falta, dono e preparação mínima
- **Evidência esperada:** descoberta/artefactos.md

### P0-14 · Baseline real medida

- **Ordem:** 14
- **Fase:** 0
- **Pacote:** D
- **Resultado:** Baseline real medida
- **Ação:** Escolher uma tarefa já conhecida, executá-la sem rede e medir tempo até primeira evidência, perguntas repetidas, correções do Diogo e retoma em sessão nova
- **Alvo/caminho:** docs/rede/baseline/B-001.md (proposto)
- **Responsável:** Diogo + coord + comm-geral
- **Dependências:** P0-12
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.5-2
- **Horas do Diogo:** 1-2
- **Critério de aceitação:** Quatro números registados com o mesmo esquema de eventos da rede
- **Evidência esperada:** B-001.md + JSONL da tarefa + nota do que foi recuperável

### P0-15 · Decisões agrupadas e aprovadas

- **Ordem:** 15
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Decisões agrupadas e aprovadas
- **Ação:** Apresentar D-01..D-12 por ordem de bloqueio, com impacto e recomendação; recolher decisão escrita
- **Alvo/caminho:** docs/rede/decisoes/D-001..D-012.md (proposto)
- **Responsável:** Diogo
- **Dependências:** P0-01..P0-14
- **Horas de agente:** 0.5-1
- **Horas de máquina:** 0
- **Horas do Diogo:** 1-2
- **Critério de aceitação:** D-01, D-02, D-03, D-05 decididas (bloqueiam F1/F2); restantes com data ou Adiada
- **Evidência esperada:** decisoes/*.md com decisão, data e âmbito

### P0-16 · Protótipo de observação aproveitado ou descartado

- **Ordem:** 16
- **Fase:** 0
- **Pacote:** D
- **Resultado:** Protótipo de observação aproveitado ou descartado
- **Ação:** Se o ZIP Core-Observador-Piloto aparecer, abrir, ler esquema SQLite e decidir o que se reaproveita; caso contrário registar ausência
- **Alvo/caminho:** Core-Observador-Piloto.zip (não disponível neste workspace)
- **Responsável:** investigador
- **Dependências:** —
- **Horas de agente:** 0.5-1
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** Esquema do protótipo mapeado para o esquema proposto, ou ausência declarada
- **Evidência esperada:** descoberta/observador-prototipo.md

### P0-17 · Compatibilidade do JIVE com o Core avaliada

- **Ordem:** 17
- **Fase:** 0
- **Pacote:** A
- **Resultado:** Compatibilidade do JIVE com o Core avaliada
- **Ação:** Descobrir JUCE e C++ do Core, build system e se já existe JIVE; compilar JIVE 2.0 em tag fixada contra a JUCE do Core; correr o test runner do JIVE
- **Alvo/caminho:** JIVE (tag fixada) + CMake do Core (por verificar)
- **Responsável:** juce + guardiao
- **Dependências:** P0-04
- **Horas de agente:** 2-4
- **Horas de máquina:** 1-2
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Compila e passa os testes do JIVE na configuração do Core, ou incompatibilidade nomeada com ficheiro:linha; versão fixada registada
- **Evidência esperada:** descoberta/jive-compatibilidade.md + saída do test runner

### P1-01 · Plugin único core instalado e carregado

- **Ordem:** 18
- **Fase:** 1
- **Pacote:** A
- **Resultado:** Plugin único core instalado e carregado
- **Ação:** Criar .qoder-plugin/plugin.json + commands/ agents/ skills/ hooks/hooks.json; qoder plugins install <dir> --scope project; /plugins reload
- **Alvo/caminho:** tools/qoder/core/ (proposto) → instalado no projeto
- **Responsável:** coord
- **Dependências:** D-01, D-05, P0-07
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0
- **Critério de aceitação:** qoder plugins list mostra core@projeto; skills e agentes aparecem nas listas
- **Evidência esperada:** saída de plugins list --json e agents list

### P1-02 · Fichas e skills do primeiro percurso vertical

- **Ordem:** 19
- **Fase:** 1
- **Pacote:** A
- **Resultado:** Fichas e skills do primeiro percurso vertical
- **Ação:** Escrever as 5 fichas (coord, comm-geral, min-eng, host, host-comm) e 6 skills (arranque, passagem, registo, encaminhamento, estado-consulta, evidencia)
- **Alvo/caminho:** tools/qoder/core/agents/*.md e skills/*/SKILL.md
- **Responsável:** coord + comm-geral
- **Dependências:** P1-01, D-03
- **Horas de agente:** 3-6
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Cada ficha tem os 10 campos obrigatórios e pedido de avaliação; cada skill tem descrição com frase de disparo própria
- **Evidência esperada:** fichas + SKILL.md + inventario-agentes.csv atualizado

### P1-03 · Contexto durável carregado sem depender do chat

- **Ordem:** 20
- **Fase:** 1
- **Pacote:** A
- **Resultado:** Contexto durável carregado sem depender do chat
- **Ação:** Acrescentar secção Rede a AGENTS.md; criar .qoder/rules/rede-nucleo.md (always_on) e rede-<equipa>.md (glob); confirmar com /memory e hook InstructionsLoaded
- **Alvo/caminho:** AGENTS.md; .qoder/rules/**
- **Responsável:** coord
- **Dependências:** P1-02
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** Instruções da rede carregam em sessão nova; regras de domínio só carregam ao tocar ficheiros do domínio
- **Evidência esperada:** /memory + eventos InstructionsLoaded

### P1-04 · Permissões e fronteira de escrita por perfil

- **Ordem:** 21
- **Fase:** 1
- **Pacote:** A
- **Resultado:** Permissões e fronteira de escrita por perfil
- **Ação:** Definir permissions.allow/deny/ask por perfil; instalar guarda PreToolUse que cruza agent_type com o mapa caminho→dono; negar git push a todos exceto scribe
- **Alvo/caminho:** .qoder/settings.json; tools/rede/guarda-escrita.ps1 (proposto)
- **Responsável:** coord + guardiao
- **Dependências:** P1-02, D-02
- **Horas de agente:** 2-4
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Escrita fora do destino da ficha é negada com mensagem clara; tentativa fica registada
- **Evidência esperada:** evento de negação + saída do ensaio de escrita proibida

### P1-05 · Ativação automática medida separadamente da qualidade

- **Ordem:** 22
- **Fase:** 1
- **Pacote:** A
- **Resultado:** Ativação automática medida separadamente da qualidade
- **Ação:** Para cada skill do slice: fazer uma pergunta que não nomeia a skill; repetir com invocação explícita; classificar resultado
- **Alvo/caminho:** docs/rede/descoberta/ativacao.md (proposto)
- **Responsável:** investigador
- **Dependências:** P1-02
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** Tabela skill→explícita OK?→automática OK?→qualidade; falha de ativação registada como problema distinto
- **Evidência esperada:** ativacao.md com as perguntas literais usadas

### P1-06 · Pedido vertical T-20261120-main-01 executado

- **Ordem:** 23
- **Fase:** 1
- **Pacote:** A
- **Resultado:** Pedido vertical T-20261120-main-01 executado
- **Ação:** Dar o pedido da secção 8 ao cliente; coord encaminha a Host; host responde com refs; comm-geral escreve o dossiê
- **Alvo/caminho:** docs/rede/passagens/T-20261120-main-01.md (proposto)
- **Responsável:** coord + host + host-comm
- **Dependências:** P1-03, P1-04, D-02
- **Horas de agente:** 2-4
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Resposta resolve a pergunta original, cita ficheiro:linha e nomeia o que falta verificar; nenhuma alteração de código
- **Evidência esperada:** dossiê da passagem + resposta final + refs

### P1-07 · Continuidade provada depois de fechar e reabrir

- **Ordem:** 24
- **Fase:** 1
- **Pacote:** B
- **Resultado:** Continuidade provada depois de fechar e reabrir
- **Ação:** Fechar a sessão; abrir processo novo em modo headless só-leitura e pedir a decisão e a cobertura; comparar refs com T-20261120-main-01
- **Alvo/caminho:** qoder -p com --permission-mode dont_ask e allowlist de leitura
- **Responsável:** scribe + coord
- **Dependências:** P1-06
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Sessão nova devolve as mesmas refs e os mesmos limites sem acesso ao histórico do chat
- **Evidência esperada:** transcrição da sessão nova + comparação de refs

### P1-08 · Encaminhamento e devolução visíveis

- **Ordem:** 25
- **Fase:** 1
- **Pacote:** D
- **Resultado:** Encaminhamento e devolução visíveis
- **Ação:** Ingerir os eventos de T-20261120-main-01 e mostrar pedido→aceitação→evidência→devolução→resposta→fecho com tempos
- **Alvo/caminho:** tools/rede/obs-ingere.ps1; painel mínimo
- **Responsável:** investigador
- **Dependências:** P0-12, P1-06
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** Os 6 acontecimentos aparecem com task_id, origem, destino, revisão e instante
- **Evidência esperada:** painel mínimo + consulta SQL/JSON

### P1-09 · Reversibilidade ensaiada

- **Ordem:** 26
- **Fase:** 1
- **Pacote:** A
- **Resultado:** Reversibilidade ensaiada
- **Ação:** qoder plugins disable core; confirmar que nada carrega; reinstalar versão anterior a partir de tag Git; confirmar que os registos sobrevivem
- **Alvo/caminho:** tools/qoder/core (tag core-plugin-v0.1.0)
- **Responsável:** coord + scribe
- **Dependências:** P1-01
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0
- **Critério de aceitação:** Rede desligada sem perder registos; versão anterior ativa e verificada; reativação limpa
- **Evidência esperada:** registo do ensaio de rollback + git status limpo em docs/rede

### P1-10 · Matriz de modelos aplicada e custo por perfil medido

- **Ordem:** 27
- **Fase:** 1
- **Pacote:** A
- **Resultado:** Matriz de modelos aplicada e custo por perfil medido
- **Ação:** Aplicar Qwen4-Max-Preview / Qwen3.8-Flash / Efficient por perfil com effort; confirmar nomes e aliases no seletor; registar custo do primeiro percurso por perfil
- **Alvo/caminho:** tools/qoder/core/agents/*.md; .qoder/settings.local.json (agents.overrides)
- **Responsável:** coord + investigador
- **Dependências:** P0-08, P1-06
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Cada perfil corre no modelo declarado; custo por perfil registado; aliases inexistentes substituídos pelo nome real do seletor
- **Evidência esperada:** matriz aplicada + tabela de custo por perfil

### P2-01 · Árvore governada criada e aprovada

- **Ordem:** 28
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Árvore governada criada e aprovada
- **Ação:** Criar docs/rede/** conforme D-02; .gitattributes com docs/rede/** merge=union; .gitignore do índice
- **Alvo/caminho:** docs/rede/**; .gitattributes; .gitignore
- **Responsável:** scribe
- **Dependências:** D-02, P1-06
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Árvore exata aprovada; índice fora do controlo de versão; merge union ativo
- **Evidência esperada:** git check-attr merge docs/rede/ESTADO.md

### P2-02 · Entradas com identidade estável e formato verificável

- **Ordem:** 29
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Entradas com identidade estável e formato verificável
- **Ação:** Implementar contrato de entrada, gerador de ID por worktree e validador de blocos (ID único, campos obrigatórios, cadeia substitui)
- **Alvo/caminho:** tools/rede/registo-novo.ps1 e registo-valida.ps1 (propostos)
- **Responsável:** scribe + comm-geral
- **Dependências:** P2-01
- **Horas de agente:** 2-4
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** Duas entradas com o mesmo assunto em worktrees diferentes não colidem; validador rejeita bloco incompleto
- **Evidência esperada:** saída do validador + duas entradas reais

### P2-03 · Appends concorrentes serializados

- **Ordem:** 30
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Appends concorrentes serializados
- **Ação:** Escritor único do ESTADO.md alimentado por fila; lock por criação atómica de ficheiro com retry e backoff; recuperação de lock órfão
- **Alvo/caminho:** tools/rede/estado-append.ps1 (proposto)
- **Responsável:** scribe
- **Dependências:** P2-02
- **Horas de agente:** 3-5
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0
- **Critério de aceitação:** N appends paralelos produzem N entradas intactas; lock órfão é recuperado sem intervenção manual
- **Evidência esperada:** ensaio com 8 escritores + contagem de entradas

### P2-04 · Ensaio de duas worktrees na mesma linha

- **Ordem:** 31
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Ensaio de duas worktrees na mesma linha
- **Ação:** Duas worktrees (isolation: worktree) acrescentam ao mesmo assunto e ao mesmo ficheiro; integrar; verificar ordem e integridade
- **Alvo/caminho:** git worktree add ../wt-a ../wt-b; docs/rede/ESTADO.md
- **Responsável:** scribe + motor-comm + host-comm
- **Dependências:** P2-03
- **Horas de agente:** 2-4
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0
- **Critério de aceitação:** Nenhuma entrada perdida; blocos intactos após merge union; índice reflete as duas
- **Evidência esperada:** git log + validador + antes/depois do merge

### P2-05 · Selo em duas fases e três estados de publicação

- **Ordem:** 32
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Selo em duas fases e três estados de publicação
- **Ação:** Commit A publica evidência; scribe lê git rev-parse HEAD e acrescenta selo; commit B publica o selo; distinguir local/commit/publicado
- **Alvo/caminho:** tools/rede/registo-sela.ps1 (proposto)
- **Responsável:** scribe
- **Dependências:** P2-02
- **Horas de agente:** 2-3
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0
- **Critério de aceitação:** Nenhum commit contém o próprio hash; entradas por selar aparecem como publicação atrasada
- **Evidência esperada:** dois commits ligados + consulta de estado de publicação

### P2-06 · Estado corrente obtido sem ler o log inteiro

- **Ordem:** 33
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Estado corrente obtido sem ler o log inteiro
- **Ação:** Índice reconstruível com offsets por entrada; leitura incremental por watermark; apagar índice e reconstruir dá o mesmo resultado
- **Alvo/caminho:** tools/rede/indice-reconstroi.ps1 e estado-atual.ps1
- **Responsável:** scribe + investigador
- **Dependências:** P2-02
- **Horas de agente:** 3-6
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0
- **Critério de aceitação:** Consulta por assunto devolve a última afirmação e a sua origem; custo não cresce com o tamanho total do log
- **Evidência esperada:** medida de tempo de consulta com log pequeno e grande + teste de reconstrução

### P2-07 · Verificação bidirecional do scribe com força

- **Ordem:** 34
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Verificação bidirecional do scribe com força
- **Ação:** diff→registo e registo→diff; hook Stop bloqueante quando falta entrada para alteração declarada
- **Alvo/caminho:** tools/rede/registo-verifica.ps1; hooks Stop
- **Responsável:** scribe + guardiao
- **Dependências:** P2-05
- **Horas de agente:** 3-5
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0
- **Critério de aceitação:** Alteração governada sem entrada bloqueia o fecho com mensagem acionável; entrada sem diff é sinalizada
- **Evidência esperada:** ensaio de bloqueio + saída do verificador nos dois sentidos

### P2-08 · Três falhas de registo demonstradas

- **Ordem:** 35
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Três falhas de registo demonstradas
- **Ação:** Ensaiar alteração declarada em falta, diff sem registo e registo sem diff; confirmar deteção e correção
- **Alvo/caminho:** docs/rede/** + área de produto
- **Responsável:** scribe
- **Dependências:** P2-07
- **Horas de agente:** 2-3
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0
- **Critério de aceitação:** As três falhas são detetadas e a correção não apaga entradas anteriores
- **Evidência esperada:** três ensaios com saída do verificador

### P2-09 · Catálogo único de testes com contrato completo

- **Ordem:** 36
- **Fase:** 2
- **Pacote:** C
- **Resultado:** Catálogo único de testes com contrato completo
- **Ação:** Inventariar testes existentes e preencher teste_id, dono, comando, bundle/opções, fixtures+hash, oráculo, tolerâncias, dependências, limitações
- **Alvo/caminho:** docs/rede/catalogo-testes.md; ctest -N; bundles
- **Responsável:** guardiao
- **Dependências:** P0-04, P0-06, D-08
- **Horas de agente:** 3-6
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0
- **Critério de aceitação:** Cada teste tem oráculo e tolerância explícitos e limitações declaradas; nenhum teste sem dono
- **Evidência esperada:** catálogo preenchido + lista de testes órfãos

### P2-10 · Deteção de cobertura enfraquecida

- **Ordem:** 37
- **Fase:** 2
- **Pacote:** C
- **Resultado:** Deteção de cobertura enfraquecida
- **Ação:** Comparar catálogo e diff: tolerância alargada, fixture trocada, oráculo regerado, opção de bundle alterada, teste retirado da suite
- **Alvo/caminho:** tools/rede/catalogo-verifica.ps1 (proposto)
- **Responsável:** guardiao
- **Dependências:** P2-09
- **Horas de agente:** 3-6
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0
- **Critério de aceitação:** Cada classe de enfraquecimento é detetada; hash tratado como pista e não como prova
- **Evidência esperada:** parecer do guardião por classe de enfraquecimento

### P2-11 · Teste verde com tolerância alterada é travado

- **Ordem:** 38
- **Fase:** 2
- **Pacote:** C
- **Resultado:** Teste verde com tolerância alterada é travado
- **Ação:** Alterar uma tolerância num teste, correr até ficar verde, exigir execução pertinente e decisão do Diogo
- **Alvo/caminho:** teste do catálogo + docs/rede/decisoes/
- **Responsável:** guardiao + Diogo
- **Dependências:** P2-10
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Verde não é aceite como prova; redução de cobertura só com decisão escrita
- **Evidência esperada:** ensaio + decisão registada

### P2-12 · Fronteira pública proposta e aprovada

- **Ordem:** 39
- **Fase:** 2
- **Pacote:** C
- **Resultado:** Fronteira pública proposta e aprovada
- **Ação:** Dono do módulo lista headers protegidos e arestas de dependência permitidas; Diogo aprova o contrato arquitetural
- **Alvo/caminho:** include/** do módulo (por verificar); docs/rede/decisoes/D-006.md
- **Responsável:** dono do módulo + Diogo
- **Dependências:** P0-02, D-06
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 1-2
- **Critério de aceitação:** Lista fechada de headers e mapa de dependências aprovadas, com razão por exceção
- **Evidência esperada:** contrato aprovado + lista de headers

### P2-13 · Teste core-headers-publicos a correr

- **Ordem:** 40
- **Fase:** 2
- **Pacote:** C
- **Resultado:** Teste core-headers-publicos a correr
- **Ação:** Gerar um consumidor mínimo por header protegido; compilar com configuração representativa, só include público, sem PCH nem unity; classificar diagnóstico
- **Alvo/caminho:** tests/arquitetura/headers-publicos/ (proposto); ctest -R core-headers-publicos
- **Responsável:** guardiao + motor
- **Dependências:** P2-12
- **Horas de agente:** 4-8
- **Horas de máquina:** 1-3
- **Horas do Diogo:** 0
- **Critério de aceitação:** Todos os headers compilam isoladamente; falhas classificadas em include esquecido ou violação de fronteira
- **Evidência esperada:** saída de ctest + tabela header→resultado→classe

### P2-14 · Controlo negativo do teste de fronteira

- **Ordem:** 41
- **Fase:** 2
- **Pacote:** C
- **Resultado:** Controlo negativo do teste de fronteira
- **Ação:** Numa cópia de teste, introduzir dependência proibida e remover um include necessário; confirmar falha nas duas classes e recuperação ao repor
- **Alvo/caminho:** cópia em build/ ou worktree de teste (nunca na árvore do produto)
- **Responsável:** guardiao
- **Dependências:** P2-13
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0
- **Critério de aceitação:** O teste falha quando deve falhar e volta a passar ao repor; produto intocado
- **Evidência esperada:** duas execuções falhadas + uma passada + git status limpo

### P2-15 · Retoma demonstrada em três cenários

- **Ordem:** 42
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Retoma demonstrada em três cenários
- **Ação:** Interromper a meio de um append; publicar tarde; deixar ponto de secção desatualizado; confirmar recuperação e visibilidade
- **Alvo/caminho:** docs/rede/**; tools/rede/*
- **Responsável:** scribe + investigador
- **Dependências:** P2-03, P2-05, P2-06
- **Horas de agente:** 2-4
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0
- **Critério de aceitação:** Nenhuma entrada perdida; publicação atrasada e secção desatualizada aparecem no estado
- **Evidência esperada:** três ensaios + consulta de estado antes/depois

### P2-16 · Estado geral mostra a secção mais desatualizada

- **Ordem:** 43
- **Fase:** 2
- **Pacote:** B
- **Resultado:** Estado geral mostra a secção mais desatualizada
- **Ação:** Calcular idade do último ponto e commits que tocaram a secção desde esse ponto; publicar no painel de estado
- **Alvo/caminho:** tools/rede/estado-painel.ps1 (proposto)
- **Responsável:** scribe + investigador
- **Dependências:** P2-06
- **Horas de agente:** 2-3
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0
- **Critério de aceitação:** Pergunta «qual secção está mais desatualizada?» tem resposta com número e refs
- **Evidência esperada:** painel de estado + cálculo demonstrado

### P2-17 · Contrato objetivo de UI a correr

- **Ordem:** 44
- **Fase:** 2
- **Pacote:** C
- **Resultado:** Contrato objetivo de UI a correr
- **Ação:** Implementar core-ui-contrato: vocabulário da versão fixada, IDs únicos e estáveis, seletores que casam, tokens existentes, pseudo-classes 2.0, ausência de propriedades 1.x, glob de jive_sources completo; controlo negativo com três mutações
- **Alvo/caminho:** tests/ui/contrato/ (proposto); ctest -R core-ui-contrato
- **Responsável:** guardiao + juce
- **Dependências:** D-14, D-16, P4-08
- **Horas de agente:** 3-6
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Falha nas três mutações (token removido, hover sem dois pontos, propriedade 1.x) e passa ao repor; produto intocado
- **Evidência esperada:** saída de ctest + três execuções falhadas + uma passada

### P3-01 · Equipas do motor prontas

- **Ordem:** 45
- **Fase:** 3
- **Pacote:** A
- **Resultado:** Equipas do motor prontas
- **Ação:** Fichas e skills de Motor, QA Áudio, Debugging e Benchmarks; regras glob por domínio
- **Alvo/caminho:** tools/qoder/core/agents e skills; .qoder/rules/rede-motor.md
- **Responsável:** min-eng + min-qua
- **Dependências:** P1-09, P2-09
- **Horas de agente:** 3-6
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Cada perfil tem destino de escrita e comando de teste reais; ativação automática testada
- **Evidência esperada:** fichas + tabela de ativação

### P3-02 · Caso real do motor escolhido com critério

- **Ordem:** 46
- **Fase:** 3
- **Pacote:** C
- **Resultado:** Caso real do motor escolhido com critério
- **Ação:** Escolher alteração ou suspeita real; escrever hipótese, critério de aceitação e o que seria evidência discriminante
- **Alvo/caminho:** docs/rede/passagens/T-<data>-<wt>-<seq>.md
- **Responsável:** min-eng + Diogo
- **Dependências:** P3-01, P0-13
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Hipótese falseável e critério escritos antes de tocar no código
- **Evidência esperada:** passagem com hipótese e critério

### P3-03 · Alteração localizada com percurso demonstrado

- **Ordem:** 47
- **Fase:** 3
- **Pacote:** C
- **Resultado:** Alteração localizada com percurso demonstrado
- **Ação:** Mapear o percurso real do áudio, alterar um ponto e testar pela entrada normal
- **Alvo/caminho:** módulo motor (caminho de P0-02)
- **Responsável:** motor + motor-comm
- **Dependências:** P3-02
- **Horas de agente:** 3-6
- **Horas de máquina:** 1-3
- **Horas do Diogo:** 0
- **Critério de aceitação:** Mapa do percurso com refs; teste pela entrada normal com esperado/obtido/tolerância/config
- **Evidência esperada:** diff + mapa + resultado de teste

### P3-04 · Verificação áudio independente

- **Ordem:** 48
- **Fase:** 3
- **Pacote:** C
- **Resultado:** Verificação áudio independente
- **Ação:** Testar sinal, eventos, fronteiras de bloco, routing e live/export no mesmo projeto e configuração
- **Alvo/caminho:** bundles de áudio (de P0-06)
- **Responsável:** qa-audio + qa-audio-comm
- **Dependências:** P3-03
- **Horas de agente:** 3-6
- **Horas de máquina:** 1-3
- **Horas do Diogo:** 0
- **Critério de aceitação:** Resultados reproduzíveis por comando único; divergências com tolerância do catálogo
- **Evidência esperada:** evidencia/<run>/ com esperado, obtido, tolerância, config

### P3-05 · Falha reduzida a causa ou experiência discriminante

- **Ordem:** 49
- **Fase:** 3
- **Pacote:** C
- **Resultado:** Falha reduzida a causa ou experiência discriminante
- **Ação:** Se houver falha: reproducer mínimo, hipóteses concorrentes, tracing/dumps/comparação de sinal, critério de correção
- **Alvo/caminho:** debugging (scripts de P0-05)
- **Responsável:** debug + debug-comm
- **Dependências:** P3-04
- **Horas de agente:** 2-6
- **Horas de máquina:** 0.5-2
- **Horas do Diogo:** 0
- **Critério de aceitação:** Causa demonstrada ou experiência que distingue hipóteses, com condições escritas
- **Evidência esperada:** reproducer + tabela de hipóteses + dumps

### P3-06 · Comparação de builds em janela isolada

- **Ordem:** 50
- **Fase:** 3
- **Pacote:** C
- **Resultado:** Comparação de builds em janela isolada
- **Ação:** Serializar corridas no X3D: mesmo projeto, buffer e dispositivo, com um worker e com a configuração habitual; builds e profiling fora da medição
- **Alvo/caminho:** scripts de bench (de P0-05); X3D
- **Responsável:** bench + bench-comm
- **Dependências:** P3-03, D-07, D-09
- **Horas de agente:** 3-5
- **Horas de máquina:** 3-8
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Distribuição, pior callback, overruns, duração, n.º de blocos e configuração comparável nas duas condições
- **Evidência esperada:** CSV por corrida + sha256 das builds + registo de janela

### P3-07 · Contaminação e overhead quantificados

- **Ordem:** 51
- **Fase:** 3
- **Pacote:** D
- **Resultado:** Contaminação e overhead quantificados
- **Ação:** Registar processos ativos, energia/frequência, temperatura e estado dos hooks; medir à parte o custo dos hooks de observação
- **Alvo/caminho:** docs/rede/evidencia/<run>/contaminacao.md
- **Responsável:** bench + investigador
- **Dependências:** P3-06
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0
- **Critério de aceitação:** Corridas com contaminação declarada; overhead dos hooks medido fora da janela
- **Evidência esperada:** registo de contaminação + medida de overhead

### P3-08 · Piloto do motor fechado com decisão

- **Ordem:** 52
- **Fase:** 3
- **Pacote:** B
- **Resultado:** Piloto do motor fechado com decisão
- **Ação:** Agregar resposta, cobertura e limites; Diogo decide; entrada de estado selada
- **Alvo/caminho:** docs/rede/ESTADO.md; decisoes/
- **Responsável:** coord + scribe + Diogo
- **Dependências:** P3-04, P3-06
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Decisão escrita com refs seladas; sessão nova recupera-a
- **Evidência esperada:** entrada selada + decisão

### P4-01 · Artefactos do piloto VST/JUCE disponíveis

- **Ordem:** 53
- **Fase:** 4
- **Pacote:** A
- **Resultado:** Artefactos do piloto VST/JUCE disponíveis
- **Ação:** Preparar o que falta: VST3 A e B, projeto antigo com automação, projeto pesado, mockup aprovado; nomear dono e prazo
- **Alvo/caminho:** pastas de projetos e assets (de P0-13)
- **Responsável:** Diogo + host + juce
- **Dependências:** P0-13
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.5-2
- **Horas do Diogo:** 1-3
- **Critério de aceitação:** Quatro artefactos com caminho, versão e hash, ou lacuna com dono e data
- **Evidência esperada:** descoberta/artefactos.md atualizado + hashes

### P4-02 · Equipas Host/JUCE/QA UX prontas

- **Ordem:** 54
- **Fase:** 4
- **Pacote:** A
- **Resultado:** Equipas Host/JUCE/QA UX prontas
- **Ação:** Fichas e skills core-host-estado, core-vst3-automacao, core-juce-fluxo, core-qa-ux
- **Alvo/caminho:** tools/qoder/core/**
- **Responsável:** min-eng + min-qua
- **Dependências:** P4-01, P3-01
- **Horas de agente:** 3-5
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Skills invocáveis e testadas sem nomear; comandos apontam para scripts reais
- **Evidência esperada:** fichas + tabela de ativação

### P4-03 · Atualização A→B com automação preservada

- **Ordem:** 55
- **Fase:** 4
- **Pacote:** C
- **Resultado:** Atualização A→B com automação preservada
- **Ação:** Abrir projeto antigo com A, editar, guardar, atualizar para B, recuperar; comparar instância, estado e automação
- **Alvo/caminho:** projeto antigo + VST3 A/B (de P4-01)
- **Responsável:** host + host-comm
- **Dependências:** P4-02
- **Horas de agente:** 4-8
- **Horas de máquina:** 1-3
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Instância, estado e automação recuperados, ou diferença explícita com bloqueio e plano
- **Evidência esperada:** ensaio gravado + comparação de estado e automação

### P4-04 · Verificação áudio e UI independentes

- **Ordem:** 56
- **Fase:** 4
- **Pacote:** C
- **Resultado:** Verificação áudio e UI independentes
- **Ação:** QA Áudio verifica sinal e null-diff; QA UX verifica o fluxo musical; nenhuma verifica o trabalho da própria equipa
- **Alvo/caminho:** bundles + capturas
- **Responsável:** qa-audio + qa-ux
- **Dependências:** P4-03
- **Horas de agente:** 3-6
- **Horas de máquina:** 1-3
- **Horas do Diogo:** 0
- **Critério de aceitação:** Duas verificações independentes com evidência própria e parecer separado
- **Evidência esperada:** dois pareceres + evidencia/<run>/

### P4-05 · Compatibilidade de projetos antigos decidida

- **Ordem:** 57
- **Fase:** 4
- **Pacote:** C
- **Resultado:** Compatibilidade de projetos antigos decidida
- **Ação:** Analisar parâmetros renomeados/removidos, buses e versão de chunk; propor migração ou bloqueio explícito
- **Alvo/caminho:** código de estado do host + projeto antigo
- **Responsável:** host + min-eng + Diogo
- **Dependências:** P4-03
- **Horas de agente:** 2-5
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Cada incompatibilidade tem decisão: migração com mapa de IDs, ou bloqueio com razão
- **Evidência esperada:** tabela de incompatibilidades + decisão

### P4-06 · Evidência visual e funcional da UI

- **Ordem:** 58
- **Fase:** 4
- **Pacote:** C
- **Resultado:** Evidência visual e funcional da UI
- **Ação:** Comparar capturas com mockup; executar intenção musical com rato e teclado, incluindo seleção, foco e Undo
- **Alvo/caminho:** mockup aprovado + build identificada
- **Responsável:** qa-ux + qa-ux-comm
- **Dependências:** P4-03
- **Horas de agente:** 3-6
- **Horas de máquina:** 0.5-1
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Cada passo tem captura e resultado; divergências face ao mockup listadas
- **Evidência esperada:** capturas + checklist assinada + refs

### P4-07 · Lacunas de cobertura registadas e decididas

- **Ordem:** 59
- **Fase:** 4
- **Pacote:** C
- **Resultado:** Lacunas de cobertura registadas e decididas
- **Ação:** Inscrever no catálogo o que ficou por verificar e o teste mínimo que fecharia cada lacuna
- **Alvo/caminho:** docs/rede/catalogo-testes.md; decisoes/
- **Responsável:** guardiao + Diogo
- **Dependências:** P4-04, P4-05
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Nenhuma lacuna implícita; cada uma tem teste mínimo, dono e decisão
- **Evidência esperada:** catálogo atualizado + decisão

### P4-08 · Spike JIVE num ecrã pequeno

- **Ordem:** 60
- **Fase:** 4
- **Pacote:** C
- **Resultado:** Spike JIVE num ecrã pequeno
- **Ação:** Recriar um ecrã representativo em XML+JSON com tokens do mockup, em paralelo com a versão C++ que não é tocada; hot reload em Debug; medir tempo de iteração, tempo de máquina e defeitos apanhados pelo contrato
- **Alvo/caminho:** ecrã escolhido em P0-17; XML/JSON do Core (proposto)
- **Responsável:** juce + qa-ux + Diogo
- **Dependências:** D-14, D-16, P0-17, P4-01
- **Horas de agente:** 6-12
- **Horas de máquina:** 1-3
- **Horas do Diogo:** 1-2
- **Critério de aceitação:** Percurso musical executável com rato e teclado; contrato a passar; captura comparada com mockup; três números registados
- **Evidência esperada:** diff do spike + capturas + tabela dos três números

### P4-09 · Paridade Debug/Release e mapa de parâmetros provados

- **Ordem:** 61
- **Fase:** 4
- **Pacote:** C
- **Resultado:** Paridade Debug/Release e mapa de parâmetros provados
- **Ação:** Comparar árvore e estilos com BUNDLE_SOURCES off (Debug, disco) e on (Release, zip); verificar mapa widget↔ID de parâmetro entre A e B com autoAttachParameters desligado até o mapa estar provado
- **Alvo/caminho:** jive_sources() no CMake; mapa de parâmetros versionado
- **Responsável:** host + guardiao
- **Dependências:** D-14, P4-08, P4-03
- **Horas de agente:** 3-6
- **Horas de máquina:** 1-2
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Mesma árvore e estilos nos dois modos ou diferença explícita; mapa de parâmetros idêntico ou bloqueio declarado
- **Evidência esperada:** comparação dos dois modos + mapa de parâmetros + parecer

### P5-01 · Painel responde às quatro perguntas

- **Ordem:** 62
- **Fase:** 5
- **Pacote:** D
- **Resultado:** Painel responde às quatro perguntas
- **Ação:** Publicar onde está a tarefa, desde quando, que pergunta está pendente e qual é a última evidência; separar atraso de recolha, espera e execução
- **Alvo/caminho:** tools/rede/obs-painel.ps1 (proposto)
- **Responsável:** investigador
- **Dependências:** P2-16, P4-06
- **Horas de agente:** 3-6
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0
- **Critério de aceitação:** Quatro respostas com refs; três tempos nunca somados num só número
- **Evidência esperada:** painel + consulta reproduzível

### P5-02 · Devoluções e correções classificadas

- **Ordem:** 63
- **Fase:** 5
- **Pacote:** D
- **Resultado:** Devoluções e correções classificadas
- **Ação:** Amostragem de devoluções e correções do Diogo; classificar devolução útil (evitou teste errado) vs retrabalho
- **Alvo/caminho:** docs/rede/logs/**; passagens/**
- **Responsável:** investigador
- **Dependências:** P5-01
- **Horas de agente:** 2-4
- **Horas de máquina:** 0
- **Horas do Diogo:** 0
- **Critério de aceitação:** Amostra com critérios explícitos e contagem dos dois tipos; casos rastreáveis até ao evento
- **Evidência esperada:** tabela de amostra + refs por caso

### P5-03 · Comparação com a baseline

- **Ordem:** 64
- **Fase:** 5
- **Pacote:** D
- **Resultado:** Comparação com a baseline
- **Ação:** Comparar tarefas equivalentes com B-001: tempo até primeira evidência, perguntas repetidas, correções, retoma
- **Alvo/caminho:** docs/rede/baseline/B-001.md + passagens dos pilotos
- **Responsável:** investigador + coord
- **Dependências:** P5-02
- **Horas de agente:** 2-4
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Comparação com diferenças e limites de amostra declarados; sem conclusão causal forte
- **Evidência esperada:** tabela comparativa + nota de validade

### P5-04 · Ensaio A/B de uma única alteração de skill

- **Ordem:** 65
- **Fase:** 5
- **Pacote:** D
- **Resultado:** Ensaio A/B de uma única alteração de skill
- **Ação:** Escolher uma passagem deficiente; alterar uma skill; correr tarefas equivalentes com mesmo modelo, ferramentas e revisão; alternar A/B
- **Alvo/caminho:** tools/qoder/core/skills/<skill>/SKILL.md (versões A e B)
- **Responsável:** investigador + Diogo
- **Dependências:** P5-03
- **Horas de agente:** 3-6
- **Horas de máquina:** 1-3
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Uma variável alterada; métrica primária é aceitação do produto; ordem alternada
- **Evidência esperada:** ficha do ensaio + resultados A e B + diff da skill

### P5-05 · Melhoria confrontada com o produto

- **Ordem:** 66
- **Fase:** 5
- **Pacote:** D
- **Resultado:** Melhoria confrontada com o produto
- **Ação:** Verificar se a mudança evitou a repetição sem degradar a aceitação; proposta fundamentada ao coordenador
- **Alvo/caminho:** docs/rede/investigacao/**
- **Responsável:** investigador + coord
- **Dependências:** P5-04
- **Horas de agente:** 2-4
- **Horas de máquina:** 0
- **Horas do Diogo:** 0.5-1
- **Critério de aceitação:** Proposta com caso, comparação e recomendação; adoção só com decisão do Diogo
- **Evidência esperada:** proposta + decisão

### P5-06 · Sessão nova recupera evidência e limitações

- **Ordem:** 67
- **Fase:** 5
- **Pacote:** B
- **Resultado:** Sessão nova recupera evidência e limitações
- **Ação:** Fechar tudo; sessão nova responde o que está decidido, o que foi verificado e o que continua por verificar, com refs
- **Alvo/caminho:** qoder -p só-leitura; docs/rede/ESTADO.md
- **Responsável:** scribe + coord
- **Dependências:** P5-05
- **Horas de agente:** 1-2
- **Horas de máquina:** 0.25-0.5
- **Horas do Diogo:** 0.25-0.5
- **Critério de aceitação:** Resposta inclui limitações e não só conclusões; refs resolvem para commit+caminho+linha
- **Evidência esperada:** transcrição + verificação de refs

### P5-07 · Decisão sobre manter, ajustar ou reduzir a rede

- **Ordem:** 68
- **Fase:** 5
- **Pacote:** A
- **Resultado:** Decisão sobre manter, ajustar ou reduzir a rede
- **Ação:** Apresentar custo de coordenação vs baseline e risco de contexto; Diogo decide composição final
- **Alvo/caminho:** docs/rede/decisoes/D-013.md (proposto)
- **Responsável:** Diogo
- **Dependências:** P5-03, P5-05, P5-06
- **Horas de agente:** 1-2
- **Horas de máquina:** 0
- **Horas do Diogo:** 1-2
- **Critério de aceitação:** Decisão escrita sobre equipas, investigador e skills a manter; entradas de estado seladas
- **Evidência esperada:** decisão + estado final

## IV.2 Fichas completas dos 24 perfis

### `coord` · Coordenador

- **Equipa:** Coordenação
- **Ministro:** —
- **Missão estável:** Preservar a intenção do Diogo, encaminhar ao ramo mínimo, agregar e fechar a passagem.
- **Contactos:** Diogo; min-eng; min-qua; min-reg; comm-geral; investigador
- **Fontes de leitura:** docs/rede/ESTADO.md; seccoes/*; mapa.md; catalogo-testes.md; passagens/<task>.md
- **Destino de escrita:** docs/rede/passagens/<task>.md (por comm-geral); docs/rede/decisoes/* (proposta)
- **Modelo e dispositivo:** Qwen4-Max-Preview · effort: medium · DEV Windows
- **Justificação do modelo:** Preserva a intenção e agrega; um erro aqui perde condições para toda a rede.
- **Ferramentas:** Read, Grep, Glob, Agent(min-eng,min-qua,min-reg,comm-geral,investigador)
- **Skills:** core-encaminhamento; core-estado-consulta; core-passagem
- **Entrada:** Pedido em linguagem natural + task_id + revisão de trabalho
- **Saída:** Resposta agregada com refs, condições, limites e próxima tarefa com dono
- **Critério de conclusão:** Pergunta original resolvida ou pergunta explícita ao Diogo; entrada de estado proposta e selada
- **Pedido de avaliação:** A resposta resolve a intenção original? Que condição se perdeu no caminho? Que ramo foi consultado sem necessidade?
- **Fase de ativação:** 1

### `comm-geral` · Comunicador geral

- **Equipa:** Coordenação
- **Ministro:** —
- **Missão estável:** Preservar intenção, pergunta, destinatário, resposta e condições enquanto a passagem ocorre.
- **Contactos:** coord; os 8 comunicadores locais; scribe
- **Fontes de leitura:** passagens/<task>.md; logs/*; ESTADO.md
- **Destino de escrita:** docs/rede/passagens/<task>.md; logs/coordenacao/<wt>.jsonl
- **Modelo e dispositivo:** Efficient (tier) · effort: low · DEV Windows
- **Justificação do modelo:** Transcrição com contrato fixo, verificada por validador e hook Stop.
- **Ferramentas:** Read, Grep, Glob, Write, Edit (só docs/rede/passagens e logs/coordenacao)
- **Skills:** core-passagem; core-registo; core-evidencia
- **Entrada:** Intenção original + cada mensagem de encaminhamento/devolução
- **Saída:** Dossiê da passagem com intenção, perguntas, respostas, condições e refs
- **Critério de conclusão:** Toda a pergunta tem destinatário, resposta ou estado pendente explícito; nada de intenção reescrita
- **Pedido de avaliação:** Faltou alguma condição no dossiê? Alguma pergunta ficou sem destinatário?
- **Fase de ativação:** 1

### `min-eng` · Ministro Engenharia

- **Equipa:** Coordenação
- **Ministro:** —
- **Missão estável:** Manter o ponto das secções Motor, Host e JUCE; encaminhar só ao ramo necessário.
- **Contactos:** coord; motor; host; juce; respetivos comm
- **Fontes de leitura:** seccoes/motor.md; seccoes/host.md; seccoes/juce.md; catalogo-testes.md
- **Destino de escrita:** seccoes/{motor,host,juce}.md (append de ponto)
- **Modelo e dispositivo:** Qwen4-Max-Preview · effort: high · DEV Windows
- **Justificação do modelo:** Juízo de arquitetura e de fronteira entre módulos.
- **Ferramentas:** Read, Grep, Glob, Agent(motor,motor-comm,host,host-comm,juce,juce-comm)
- **Skills:** core-encaminhamento; core-estado-consulta; core-registo
- **Entrada:** Pergunta de engenharia + task_id
- **Saída:** Ponto da secção com revisão e momento + resposta encaminhada
- **Critério de conclusão:** Ponto identifica revisão, momento e secção mais desatualizada do seu ramo
- **Pedido de avaliação:** O ramo consultado foi o mínimo? O ponto está atualizado face ao código?
- **Fase de ativação:** 1

### `min-qua` · Ministro Qualidade

- **Equipa:** Coordenação
- **Ministro:** —
- **Missão estável:** Manter o ponto de QA Áudio, QA UX, Debugging, Benchmarks e Guardião.
- **Contactos:** coord; qa-audio; qa-ux; debug; bench; guardiao
- **Fontes de leitura:** seccoes dessas 5 equipas; catalogo-testes.md; evidencia/*
- **Destino de escrita:** seccoes/{qa-audio,qa-ux,debugging,benchmarks,guardiao}.md (append)
- **Modelo e dispositivo:** Qwen4-Max-Preview · effort: medium · DEV Windows
- **Justificação do modelo:** Juízo sobre validade de prova e suficiência de cobertura.
- **Ferramentas:** Read, Grep, Glob, Agent(qa-audio,qa-audio-comm,qa-ux,qa-ux-comm,debug,debug-comm,bench,bench-comm,guardiao)
- **Skills:** core-encaminhamento; core-estado-consulta; core-registo
- **Entrada:** Pergunta de verificação + task_id
- **Saída:** Ponto da secção + parecer de cobertura com refs ao catálogo
- **Critério de conclusão:** Cada afirmação de cobertura liga a teste_id e a uma execução pertinente
- **Pedido de avaliação:** Alguma afirmação de cobertura sem execução pertinente?
- **Fase de ativação:** 2

### `min-reg` · Ministro Registo

- **Equipa:** Coordenação
- **Ministro:** —
- **Missão estável:** Manter o ponto de Pesquisa e Scribe; garantir que a evidência é recuperável.
- **Contactos:** coord; pesquisa; scribe
- **Fontes de leitura:** seccoes/{pesquisa,scribe}.md; mapa.md; ESTADO.md
- **Destino de escrita:** seccoes/{pesquisa,scribe}.md (append)
- **Modelo e dispositivo:** Qwen3.8-Flash · effort: medium · DEV Windows
- **Justificação do modelo:** Encaminhamento de pesquisa e recuperação; o juízo vive no catálogo e no mapa.
- **Ferramentas:** Read, Grep, Glob, Agent(pesquisa,pesquisa-comm,scribe)
- **Skills:** core-encaminhamento; core-estado-consulta; core-registo
- **Entrada:** Pergunta de investigação ou de recuperação + task_id
- **Saída:** Ponto da secção + refs seladas
- **Critério de conclusão:** Toda a referência devolvida resolve para commit+caminho+linha
- **Pedido de avaliação:** Consegues chegar à fonte só com a resposta?
- **Fase de ativação:** 2

### `motor` · Especialista Motor

- **Equipa:** Motor C++/miniaudio
- **Ministro:** min-eng
- **Missão estável:** Implementar transporte, grafo, buffers, DSP, mistura e workers no motor.
- **Contactos:** motor-comm; min-eng; qa-audio; debug
- **Fontes de leitura:** código do motor (caminho por verificar); seccoes/motor.md; catalogo-testes.md
- **Destino de escrita:** código do módulo motor; logs/motor/<wt>.jsonl
- **Modelo e dispositivo:** Qwen4-Max-Preview · effort: high · DEV Windows
- **Justificação do modelo:** DSP, tempo real e causalidade; erros são caros e silenciosos.
- **Ferramentas:** Read, Grep, Glob, Bash(build/test allowlist), Write, Edit (módulo motor)
- **Skills:** core-motor-mapa-audio; core-motor-rt; core-evidencia
- **Entrada:** Pergunta ou alteração localizada + condições (buffer, sr, device, build)
- **Saída:** Alteração localizada + mapa do percurso + teste pela entrada normal
- **Critério de conclusão:** Percurso real do áudio demonstrado; teste executado com esperado/obtido/tolerância/config
- **Pedido de avaliação:** A alteração está no ponto certo do percurso? Que condição de tempo real ficou por verificar?
- **Fase de ativação:** 3

### `motor-comm` · Comunicador Motor

- **Equipa:** Motor C++/miniaudio
- **Ministro:** min-eng
- **Missão estável:** Registar a passagem do Motor enquanto ela ocorre, com vocabulário de transporte e DSP.
- **Contactos:** motor; min-eng; comm-geral; scribe
- **Fontes de leitura:** logs/motor/*; passagens/<task>.md; código (leitura)
- **Destino de escrita:** logs/motor/<wt>.jsonl; passagens/<task>.md (secção Motor); pedidos de estado
- **Modelo e dispositivo:** Efficient (tier) · effort: low · DEV Windows
- **Justificação do modelo:** Transcrição de condições e run_id com contrato fixo.
- **Ferramentas:** Read, Grep, Glob, Write, Edit (só docs/rede/logs/motor e passagens)
- **Skills:** core-passagem; core-registo; core-evidencia
- **Entrada:** Mensagens da equipa + evidência produzida
- **Saída:** Entradas append-only com run_id, condições e refs
- **Critério de conclusão:** Cada evidência tem run_id e condições; cada pergunta tem destinatário
- **Pedido de avaliação:** Que condição técnica não ficou escrita?
- **Fase de ativação:** 3

### `host` · Especialista Host

- **Equipa:** Host VST
- **Ministro:** min-eng
- **Missão estável:** Descoberta, instanciação, buses, parâmetros, latência, estado e integração do plugin distribuído separadamente.
- **Contactos:** host-comm; min-eng; qa-audio; juce
- **Fontes de leitura:** código do host (por verificar); seccoes/host.md; catalogo-testes.md
- **Destino de escrita:** código do módulo host; logs/host/<wt>.jsonl
- **Modelo e dispositivo:** Qwen4-Max-Preview · effort: high · DEV Windows
- **Justificação do modelo:** Estado, automação e compatibilidade de projetos antigos.
- **Ferramentas:** Read, Grep, Glob, Bash(build/test), Write, Edit (módulo host)
- **Skills:** core-host-estado; core-vst3-automacao; core-evidencia
- **Entrada:** Pergunta sobre estado/automação ou atualização A→B
- **Saída:** Percurso de estado identificado + ensaio abrir/editar/guardar/recuperar
- **Critério de conclusão:** Projeto da versão anterior recupera instância, estado e automação, ou bloqueio explícito
- **Pedido de avaliação:** Que parte do estado não é coberta por teste?
- **Fase de ativação:** 1

### `host-comm` · Comunicador Host

- **Equipa:** Host VST
- **Ministro:** min-eng
- **Missão estável:** Registar a passagem do Host com vocabulário de buses, parâmetros e estado.
- **Contactos:** host; min-eng; comm-geral; scribe
- **Fontes de leitura:** logs/host/*; passagens/<task>.md
- **Destino de escrita:** logs/host/<wt>.jsonl; passagens/<task>.md (secção Host)
- **Modelo e dispositivo:** Efficient (tier) · effort: low · DEV Windows
- **Justificação do modelo:** Transcrição de versões A/B e projeto usado.
- **Ferramentas:** Read, Grep, Glob, Write, Edit (só logs/host e passagens)
- **Skills:** core-passagem; core-registo; core-evidencia
- **Entrada:** Mensagens e evidência do Host
- **Saída:** Entradas com versão A/B, projeto usado e condições
- **Critério de conclusão:** Versões A e B e o projeto de teste estão identificados em cada entrada
- **Pedido de avaliação:** Falta identificar alguma versão ou projeto?
- **Fase de ativação:** 1

### `juce` · Especialista JUCE

- **Equipa:** Desenvolvimento JUCE/UI
- **Ministro:** min-eng
- **Missão estável:** Implementar o fluxo musical com componentes, tema, desenho, foco e Undo existentes.
- **Contactos:** juce-comm; min-eng; qa-ux; host
- **Fontes de leitura:** código JUCE (por verificar); seccoes/juce.md; mockup aprovado
- **Destino de escrita:** código do módulo UI; logs/juce/<wt>.jsonl
- **Modelo e dispositivo:** Qwen3.8-Flash · effort: medium · DEV Windows
- **Justificação do modelo:** Markup JIVE e componentes existentes: trabalho de estrutura, não de juízo profundo.
- **Ferramentas:** Read, Grep, Glob, Bash(build), Write, Edit (módulo UI)
- **Skills:** core-juce-fluxo; core-evidencia
- **Entrada:** Intenção musical + componentes/comandos envolvidos
- **Saída:** Percurso utilizável + refs a componentes e comandos
- **Critério de conclusão:** Percurso executável com rato e teclado, incluindo seleção, foco e Undo
- **Pedido de avaliação:** Que passo do fluxo musical não é executável?
- **Fase de ativação:** 4

### `juce-comm` · Comunicador JUCE

- **Equipa:** Desenvolvimento JUCE/UI
- **Ministro:** min-eng
- **Missão estável:** Registar a passagem de UI com vocabulário de componentes, foco e Undo.
- **Contactos:** juce; min-eng; comm-geral; scribe
- **Fontes de leitura:** logs/juce/*; passagens/<task>.md
- **Destino de escrita:** logs/juce/<wt>.jsonl; passagens/<task>.md (secção JUCE)
- **Modelo e dispositivo:** Efficient (tier) · effort: low · DEV Windows
- **Justificação do modelo:** Transcrição de refs visuais e funcionais.
- **Ferramentas:** Read, Grep, Glob, Write, Edit (só logs/juce e passagens)
- **Skills:** core-passagem; core-registo; core-evidencia
- **Entrada:** Mensagens e evidência visual/funcional
- **Saída:** Entradas com refs a capturas e ao mockup
- **Critério de conclusão:** Cada afirmação de UX liga a captura ou a passo executado
- **Pedido de avaliação:** Alguma afirmação visual sem captura?
- **Fase de ativação:** 4

### `qa-audio` · Especialista QA Áudio

- **Equipa:** QA C++ áudio
- **Ministro:** min-qua
- **Missão estável:** Testar sinal, eventos, fronteiras de bloco, routing e live/export.
- **Contactos:** qa-audio-comm; min-qua; motor; host; guardiao
- **Fontes de leitura:** catalogo-testes.md; bundles (por verificar); evidencia/*
- **Destino de escrita:** testes do domínio áudio; logs/qa-audio/<wt>.jsonl; evidencia/<run>/
- **Modelo e dispositivo:** Qwen3.8-Flash · effort: medium · DEV Windows
- **Justificação do modelo:** Testes com oráculo e tolerância já dados pelo catálogo.
- **Ferramentas:** Read, Grep, Glob, Bash(ctest/bundles), Write, Edit (testes áudio)
- **Skills:** core-qa-audio; core-guardiao-catalogo (leitura); core-evidencia
- **Entrada:** Afirmação a verificar + configuração
- **Saída:** Resultado reproduzível: esperado, obtido, tolerância, configuração
- **Critério de conclusão:** Resultado reproduzido por comando único com oráculo e tolerância do catálogo
- **Pedido de avaliação:** O teste provaria a falha se ela existisse?
- **Fase de ativação:** 3

### `qa-audio-comm` · Comunicador QA Áudio

- **Equipa:** QA C++ áudio
- **Ministro:** min-qua
- **Missão estável:** Registar a passagem de QA áudio com esperado/obtido/tolerância/config.
- **Contactos:** qa-audio; min-qua; comm-geral; guardiao
- **Fontes de leitura:** logs/qa-audio/*; catalogo-testes.md
- **Destino de escrita:** logs/qa-audio/<wt>.jsonl; passagens/<task>.md (secção QA Áudio)
- **Modelo e dispositivo:** Efficient (tier) · effort: low · DEV Windows
- **Justificação do modelo:** Transcrição de esperado/obtido/tolerância/config.
- **Ferramentas:** Read, Grep, Glob, Write, Edit (só logs/qa-audio e passagens)
- **Skills:** core-passagem; core-registo; core-evidencia
- **Entrada:** Resultados e configurações
- **Saída:** Entradas com run_id, oráculo e tolerância
- **Critério de conclusão:** Nenhum resultado registado sem tolerância e configuração
- **Pedido de avaliação:** Algum resultado sem configuração comparável?
- **Fase de ativação:** 3

### `qa-ux` · Especialista QA UX

- **Equipa:** QA JUCE/UX
- **Ministro:** min-qua
- **Missão estável:** Comparar captura com mockup e executar a intenção musical com rato e teclado.
- **Contactos:** qa-ux-comm; min-qua; juce
- **Fontes de leitura:** mockup aprovado; seccoes/juce.md; catalogo-testes.md
- **Destino de escrita:** checklists/capturas de UX; logs/qa-ux/<wt>.jsonl; evidencia/<run>/
- **Modelo e dispositivo:** Qwen3.8-Flash · effort: medium · DEV Windows
- **Justificação do modelo:** Checklist e comparação; o contrato de UI é script, não modelo.
- **Ferramentas:** Read, Grep, Glob, Bash(captura), Write, Edit (evidência UX)
- **Skills:** core-qa-ux; core-evidencia
- **Entrada:** Intenção musical + mockup + build identificada
- **Saída:** Evidência visual e funcional (seleção, foco, Undo)
- **Critério de conclusão:** Cada passo tem captura ou gravação e resultado funcional
- **Pedido de avaliação:** O que não foi possível executar nesta build?
- **Fase de ativação:** 4

### `qa-ux-comm` · Comunicador QA UX

- **Equipa:** QA JUCE/UX
- **Ministro:** min-qua
- **Missão estável:** Registar a passagem de UX distinguindo visual de funcional.
- **Contactos:** qa-ux; min-qua; comm-geral
- **Fontes de leitura:** logs/qa-ux/*; evidencia/*
- **Destino de escrita:** logs/qa-ux/<wt>.jsonl; passagens/<task>.md (secção QA UX)
- **Modelo e dispositivo:** Efficient (tier) · effort: low · DEV Windows
- **Justificação do modelo:** Transcrição de capturas e passos.
- **Ferramentas:** Read, Grep, Glob, Write, Edit (só logs/qa-ux e passagens)
- **Skills:** core-passagem; core-registo; core-evidencia
- **Entrada:** Capturas e resultados funcionais
- **Saída:** Entradas com refs a imagem e passo
- **Critério de conclusão:** Nenhuma conclusão visual sem imagem referenciada
- **Pedido de avaliação:** Falta evidência de algum passo?
- **Fase de ativação:** 4

### `debug` · Especialista Debugging

- **Equipa:** Debugging JUCE/C++
- **Ministro:** min-qua
- **Missão estável:** Reduzir a falha, comparar hipóteses, usar tracing, dumps e comparação de sinal.
- **Contactos:** debug-comm; min-qua; motor; host; juce
- **Fontes de leitura:** evidencia/*; logs/*; código (leitura); dumps
- **Destino de escrita:** reproducers e diagnósticos; logs/debugging/<wt>.jsonl; evidencia/<run>/
- **Modelo e dispositivo:** Qwen4-Max-Preview · effort: high · DEV Windows
- **Justificação do modelo:** Hipóteses discriminantes e demonstração de causa.
- **Ferramentas:** Read, Grep, Glob, Bash(tracing/dumps), Write, Edit (reproducers)
- **Skills:** core-debug-reducao; core-evidencia
- **Entrada:** Sintoma + condições + build
- **Saída:** Reproducer, condições, causa demonstrada ou experiência discriminante, critério de correção
- **Critério de conclusão:** Hipótese aceite só com experiência que a distingue das alternativas
- **Pedido de avaliação:** Que hipótese alternativa não foi excluída?
- **Fase de ativação:** 3

### `debug-comm` · Comunicador Debugging

- **Equipa:** Debugging JUCE/C++
- **Ministro:** min-qua
- **Missão estável:** Registar hipóteses, exclusões e condições da investigação.
- **Contactos:** debug; min-qua; comm-geral
- **Fontes de leitura:** logs/debugging/*; evidencia/*
- **Destino de escrita:** logs/debugging/<wt>.jsonl; passagens/<task>.md (secção Debugging)
- **Modelo e dispositivo:** Efficient (tier) · effort: low · DEV Windows
- **Justificação do modelo:** Transcrição de hipóteses e exclusões.
- **Ferramentas:** Read, Grep, Glob, Write, Edit (só logs/debugging e passagens)
- **Skills:** core-passagem; core-registo; core-evidencia
- **Entrada:** Hipóteses e resultados
- **Saída:** Entradas com hipótese, experiência e conclusão
- **Critério de conclusão:** Cada hipótese tem estado: excluída, sustentada ou por testar
- **Pedido de avaliação:** Alguma hipótese ficou sem estado?
- **Fase de ativação:** 3

### `bench` · Especialista Benchmarks

- **Equipa:** Benchmarks isolados
- **Ministro:** min-qua
- **Missão estável:** Comparar builds identificadas, serializar corridas no X3D e registar contaminação.
- **Contactos:** bench-comm; min-qua; motor; guardiao
- **Fontes de leitura:** catalogo-testes.md; scripts de bench (por verificar); evidencia/*
- **Destino de escrita:** resultados de bench; logs/benchmarks/<wt>.jsonl; evidencia/<run>/
- **Modelo e dispositivo:** Qwen3.8-Flash · effort: medium · DEV Windows; execução medida em X3D
- **Justificação do modelo:** Protocolo fixo e serialização; interpretação de resultados escala para Max.
- **Ferramentas:** Read, Grep, Glob, Bash(scripts de bench), Write, Edit (evidência bench)
- **Skills:** core-bench-x3d; core-evidencia
- **Entrada:** Builds A/B + projeto + buffer + device
- **Saída:** Distribuição, pior callback, overruns, duração, n.º de blocos e configuração comparável
- **Critério de conclusão:** Duas corridas comparáveis com contaminação declarada; builds e profiling fora da medição
- **Pedido de avaliação:** O que contaminou a janela? A comparação é legítima?
- **Fase de ativação:** 3

### `bench-comm` · Comunicador Benchmarks

- **Equipa:** Benchmarks isolados
- **Ministro:** min-qua
- **Missão estável:** Registar cada corrida com identificação de build e janela.
- **Contactos:** bench; min-qua; comm-geral
- **Fontes de leitura:** logs/benchmarks/*; evidencia/*
- **Destino de escrita:** logs/benchmarks/<wt>.jsonl; passagens/<task>.md (secção Benchmarks)
- **Modelo e dispositivo:** Efficient (tier) · effort: low · DEV Windows
- **Justificação do modelo:** Transcrição de build, janela e contaminação.
- **Ferramentas:** Read, Grep, Glob, Write, Edit (só logs/benchmarks e passagens)
- **Skills:** core-passagem; core-registo; core-evidencia
- **Entrada:** Corridas e configurações
- **Saída:** Entradas com build sha256, janela e contaminação
- **Critério de conclusão:** Nenhuma corrida sem build identificada e janela declarada
- **Pedido de avaliação:** Falta alguma condição da janela?
- **Fase de ativação:** 3

### `pesquisa` · Especialista Pesquisa

- **Equipa:** Pesquisa técnica
- **Ministro:** min-reg
- **Missão estável:** Investigar C++ áudio, miniaudio, JUCE, UX, VST3 ou VST2 conforme a pergunta.
- **Contactos:** pesquisa-comm; min-reg; equipa origem
- **Fontes de leitura:** fontes primárias (docs oficiais, headers, SDK); código do checkout
- **Destino de escrita:** docs/rede/pesquisa/<tema>.md; logs/pesquisa/<wt>.jsonl
- **Modelo e dispositivo:** Qwen3.8-Flash · effort: medium · DEV Windows
- **Justificação do modelo:** Fonte primária, versão e aplicabilidade; síntese.
- **Ferramentas:** Read, Grep, Glob, WebSearch, WebFetch, Write, Edit (só pesquisa e logs)
- **Skills:** core-pesquisa-primaria; core-evidencia
- **Entrada:** Pergunta técnica concreta + versão em uso
- **Saída:** Fonte primária com versão, aplicabilidade ao checkout e ensaio mínimo
- **Critério de conclusão:** Cada conclusão tem fonte primária, versão e ensaio proposto
- **Pedido de avaliação:** A fonte aplica-se à versão do checkout?
- **Fase de ativação:** 2

### `pesquisa-comm` · Comunicador Pesquisa

- **Equipa:** Pesquisa técnica
- **Ministro:** min-reg
- **Missão estável:** Registar a pergunta, a fonte e a aplicabilidade.
- **Contactos:** pesquisa; min-reg; comm-geral
- **Fontes de leitura:** logs/pesquisa/*; pesquisa/*
- **Destino de escrita:** logs/pesquisa/<wt>.jsonl; passagens/<task>.md (secção Pesquisa)
- **Modelo e dispositivo:** Efficient (tier) · effort: low · DEV Windows
- **Justificação do modelo:** Transcrição de URL, versão e data.
- **Ferramentas:** Read, Grep, Glob, Write, Edit (só logs/pesquisa e passagens)
- **Skills:** core-passagem; core-registo
- **Entrada:** Fontes e conclusões
- **Saída:** Entradas com URL, versão e data de consulta
- **Critério de conclusão:** Nenhuma conclusão sem fonte e versão
- **Pedido de avaliação:** Alguma fonte secundária apresentada como primária?
- **Fase de ativação:** 2

### `scribe` · Scribe

- **Equipa:** Verificação Registo
- **Ministro:** min-reg
- **Missão estável:** Manter o mapa canónico das gavetas e verificar diff↔manifesto nos dois sentidos.
- **Contactos:** min-reg; comm-geral; todos os comm; guardiao; Diogo
- **Fontes de leitura:** todo docs/rede/**; git diff; git log; índice
- **Destino de escrita:** docs/rede/mapa.md; ESTADO.md (escritor único serializado); selos; logs/scribe/<wt>.jsonl
- **Modelo e dispositivo:** Qwen4-Max-Preview · effort: medium · DEV Windows
- **Justificação do modelo:** Verificação bidirecional exige decidir o que é governado.
- **Ferramentas:** Read, Grep, Glob, Bash(git leitura/commit), Write, Edit (docs/rede governado)
- **Skills:** core-scribe-verifica; core-registo; core-estado-consulta
- **Entrada:** Diff, manifesto, entradas por selar
- **Saída:** Verificação bidirecional + selo + três estados de publicação distintos
- **Critério de conclusão:** Toda a alteração governada tem entrada selada; todo o registo aponta para diff real
- **Pedido de avaliação:** Que alteração ficou sem registo? Que registo ficou sem diff?
- **Fase de ativação:** 2

### `guardiao` · Guardião

- **Equipa:** Verificação Qualidade
- **Ministro:** min-qua
- **Missão estável:** Manter catálogo único com identidades, comandos, oráculos, tolerâncias, dependências e limitações.
- **Contactos:** min-qua; qa-audio; qa-ux; bench; scribe; Diogo
- **Fontes de leitura:** catalogo-testes.md; bundles; fixtures; evidencia/*; git diff
- **Destino de escrita:** docs/rede/catalogo-testes.md; logs/guardiao/<wt>.jsonl
- **Modelo e dispositivo:** Qwen4-Max-Preview · effort: high · DEV Windows
- **Justificação do modelo:** Detetar cobertura enfraquecida é juízo, não correspondência de padrões.
- **Ferramentas:** Read, Grep, Glob, Bash(ctest/bundles), Write, Edit (catálogo e logs)
- **Skills:** core-guardiao-catalogo; core-headers-publicos; core-evidencia
- **Entrada:** Diff, catálogo, resultados
- **Saída:** Parecer de cobertura + exigência de execução pertinente
- **Critério de conclusão:** Deteta cobertura enfraquecida mesmo com teste verde; hash é pista, não prova
- **Pedido de avaliação:** Que contrato ficou mais fraco sem ninguém notar?
- **Fase de ativação:** 2

### `investigador` · Investigador global

- **Equipa:** Transversal (proposto)
- **Ministro:** reporta a coord
- **Missão estável:** Observar a organização, identificar uma passagem deficiente e experimentar uma melhoria de skill.
- **Contactos:** coord; comm-geral; todos os logs; Diogo (via coord)
- **Fontes de leitura:** todos os logs e passagens; eventos; baseline; catalogo-testes.md
- **Destino de escrita:** docs/rede/investigacao/** apenas; sem escrita no produto
- **Modelo e dispositivo:** Qwen4-Max-Preview · effort: high · DEV Windows
- **Justificação do modelo:** Validade de comparação, desenho de A/B e leitura de casos.
- **Ferramentas:** Read, Grep, Glob, Bash(core-obs/core-indice), Write, Edit (só investigacao)
- **Skills:** core-investigador-ab; core-observador; core-estado-consulta
- **Entrada:** Amostra de passagens + baseline + aceitação do produto
- **Saída:** Caso rastreável, comparação com resultado do produto e proposta ao coordenador
- **Critério de conclusão:** Caso liga evento→passagem→registo; A/B com mesmo modelo, ferramentas e revisão
- **Pedido de avaliação:** A melhoria mudou o produto ou só o discurso?
- **Fase de ativação:** 5

## IV.3 As 24 skills do plugin único `core`

### `core-arranque`

- **Tipo:** comando executável (hook SessionStart + skill)
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; usa additionalContext do hook SessionStart
- **Comando ou script alvo:** tools/rede/arranque.ps1 (proposto)
- **Quem usa:** todos (via hook)
- **Fase:** 1
- **Risco de ativação e nota:** Não é invocada pelo modelo: corre no arranque. Injeta só o índice de estado e as regras da secção ativa, para não gastar contexto.

### `core-passagem`

- **Tipo:** declarativa
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; missão de comunicação única partilhada pelos 9 comunicadores
- **Comando ou script alvo:** —
- **Quem usa:** comm-geral + 8 comunicadores locais
- **Fase:** 1
- **Risco de ativação e nota:** Descrição tem de disparar em «regista a passagem», «quem perguntou», «o que ficou pendente». Vocabulário de domínio vem de .qoder/rules/rede-<equipa>.md, não de 9 skills diferentes.

### `core-registo`

- **Tipo:** declarativa + contrato de formato
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova
- **Comando ou script alvo:** —
- **Quem usa:** comm-*; scribe; guardiao; min-*
- **Fase:** 1
- **Risco de ativação e nota:** Contrato de entrada append-only, IDs estáveis, campos obrigatórios. Deve ser carregada por regra glob em docs/rede/** para não depender da ativação.

### `core-encaminhamento`

- **Tipo:** declarativa
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; tabela de secções + regra do ramo mínimo
- **Comando ou script alvo:** —
- **Quem usa:** coord; min-eng; min-qua; min-reg
- **Fase:** 1
- **Risco de ativação e nota:** Risco alto de sobreposição com core-passagem. Testar com pergunta que não nomeia nenhuma das duas.

### `core-estado-consulta`

- **Tipo:** comando executável
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; encapsula script da rede
- **Comando ou script alvo:** tools/rede/estado-atual.ps1 -Assunto <glob> (proposto)
- **Quem usa:** coord; min-*; investigador; scribe
- **Fase:** 1
- **Risco de ativação e nota:** Leitura por índice reconstruível; nunca lê o log inteiro. Custo medido em P2-06.

### `core-evidencia`

- **Tipo:** declarativa
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova
- **Comando ou script alvo:** —
- **Quem usa:** todos os perfis que produzem evidência
- **Fase:** 1
- **Risco de ativação e nota:** Nomeação de run_id, condições obrigatórias e local imutável. Carregar por regra glob em docs/rede/evidencia/**.

### `core-motor-mapa-audio`

- **Tipo:** declarativa + comando
- **Existe no Qoder?:** não (Explore existe como subagent built-in)
- **Reutilização/origem:** reutiliza Explore para leitura; acrescenta método de traçado do callback
- **Comando ou script alvo:** tools/rede/trace-audio.ps1 (proposto; ou scripts existentes)
- **Quem usa:** motor; debug; qa-audio
- **Fase:** 3
- **Risco de ativação e nota:** Reutilização de Explore é documentada, não verificada nesta instalação. Confirmar em P0-09.

### `core-motor-rt`

- **Tipo:** declarativa
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; regras de tempo real (sem alocação/locks no callback), workers e buffers
- **Comando ou script alvo:** —
- **Quem usa:** motor; debug
- **Fase:** 3
- **Risco de ativação e nota:** Dispara em «callback», «overrun», «worker», «buffer». Não confundir com core-bench-x3d.

### `core-host-estado`

- **Tipo:** declarativa + comando
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; encapsula scripts de build/arranque do host existentes
- **Comando ou script alvo:** scripts do checkout (por verificar)
- **Quem usa:** host; qa-audio; juce
- **Fase:** 1 (leitura) / 4 (ensaio)
- **Risco de ativação e nota:** No primeiro percurso é só leitura: identificar percurso de estado e cobertura, sem alterar código.

### `core-vst3-automacao`

- **Tipo:** comando executável
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; encapsula ensaio A→B
- **Comando ou script alvo:** tools/rede/ensaio-vst-ab.ps1 (proposto)
- **Quem usa:** host; qa-audio; qa-ux
- **Fase:** 4
- **Risco de ativação e nota:** Precisa dos artefactos A, B e projeto antigo com automação (P4-01). Com JIVE: mapa explícito widget↔ID de parâmetro e autoAttachParameters desligado até o mapa estar provado; declarar BUNDLE_SOURCES na evidência. pluginval como oráculo externo candidato.

### `core-juce-fluxo`

- **Tipo:** declarativa
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; inventário de componentes, tema, foco e Undo existentes
- **Comando ou script alvo:** —
- **Quem usa:** juce; qa-ux
- **Fase:** 4
- **Risco de ativação e nota:** Não inventar componentes: cada referência resolve para ficheiro do checkout. Se D-14 avançar, working em conjunto com core-jive-ui (markup) sem a substituir.

### `core-qa-audio`

- **Tipo:** comando executável
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; encapsula bundles/ctest existentes
- **Comando ou script alvo:** bundles do checkout + ctest (por verificar)
- **Quem usa:** qa-audio; motor; host
- **Fase:** 3
- **Risco de ativação e nota:** Saída obrigatória: esperado, obtido, tolerância, configuração. Sem oráculo do catálogo, o resultado não conta.

### `core-qa-ux`

- **Tipo:** comando + declarativa
- **Existe no Qoder?:** não (canvas é built-in, candidato a apoio visual)
- **Reutilização/origem:** nova; quatro camadas: contrato estrutural (core-ui-contrato), árvore em runtime (Melatonin Inspector, candidato), captura vs mockup, percurso rato/teclado
- **Comando ou script alvo:** tools/rede/captura-ux.ps1 (proposto)
- **Quem usa:** qa-ux; juce
- **Fase:** 4
- **Risco de ativação e nota:** Captura não substitui contrato e contrato não substitui captura. Com JIVE (D-14) o mockup passa a incluir tokens. Sem JIVE, mantém-se captura + percurso.

### `core-debug-reducao`

- **Tipo:** declarativa + comando
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; método de redução e experiência discriminante
- **Comando ou script alvo:** scripts de tracing/dumps existentes (por verificar)
- **Quem usa:** debug; motor; host; juce
- **Fase:** 3
- **Risco de ativação e nota:** Exige critério de correção escrito antes de aceitar a causa.

### `core-bench-x3d`

- **Tipo:** comando executável
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; encapsula scripts de bench e serializa corridas
- **Comando ou script alvo:** scripts de bench do checkout (por verificar)
- **Quem usa:** bench
- **Fase:** 3
- **Risco de ativação e nota:** Só corre em janela isolada. Builds e profiling fora da medição. Regista contaminação e overhead dos hooks.

### `core-pesquisa-primaria`

- **Tipo:** declarativa
- **Existe no Qoder?:** parcial (WebSearch/WebFetch são ferramentas built-in)
- **Reutilização/origem:** reutiliza ferramentas built-in; acrescenta exigência de fonte primária + versão + ensaio
- **Comando ou script alvo:** —
- **Quem usa:** pesquisa; min-reg
- **Fase:** 2
- **Risco de ativação e nota:** Não confundir com resposta de memória do modelo: sem URL, versão e aplicabilidade, a conclusão é rejeitada.

### `core-scribe-verifica`

- **Tipo:** comando executável
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova
- **Comando ou script alvo:** tools/rede/registo-verifica.ps1 e registo-sela.ps1 (propostos)
- **Quem usa:** scribe
- **Fase:** 2
- **Risco de ativação e nota:** Também invocada por hook Stop (bloqueante). A skill explica; o hook obriga.

### `core-guardiao-catalogo`

- **Tipo:** comando executável
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova
- **Comando ou script alvo:** tools/rede/catalogo-verifica.ps1 (proposto)
- **Quem usa:** guardiao; qa-audio; bench
- **Fase:** 2
- **Risco de ativação e nota:** Deteção de enfraquecimento: tolerância, fixture, oráculo, opção de bundle, teste retirado. Hash é pista; prova exige execução.

### `core-headers-publicos`

- **Tipo:** comando executável (teste)
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; alvo de teste no build system existente
- **Comando ou script alvo:** ctest -R core-headers-publicos (proposto)
- **Quem usa:** guardiao; dono do módulo; min-eng
- **Fase:** 2
- **Risco de ativação e nota:** Contrato arquitetural aprovado pelo Diogo. Separar include esquecido de violação de fronteira. Controlo negativo em cópia.

### `core-observador`

- **Tipo:** comando executável
- **Existe no Qoder?:** não (ZIP Core-Observador-Piloto é protótipo, não disponível aqui)
- **Reutilização/origem:** reutilizar esquema SQLite do protótipo se aparecer; JSONL é a origem canónica
- **Comando ou script alvo:** tools/rede/obs-ingere.ps1 e obs-painel.ps1 (propostos)
- **Quem usa:** investigador; coord; scribe
- **Fase:** 0 (mínimo) / 5 (completo)
- **Risco de ativação e nota:** Base reconstruível: apagar e reingerir tem de dar o mesmo painel. Dedup por chave e eventos tardios com ingest_ts.

### `core-investigador-ab`

- **Tipo:** declarativa + comando
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova
- **Comando ou script alvo:** tools/rede/ab-compara.ps1 (proposto)
- **Quem usa:** investigador
- **Fase:** 5
- **Risco de ativação e nota:** Uma única alteração de skill por ensaio; mesmo modelo, ferramentas e revisão. Métrica primária é aceitação do produto.

### `core-baseline`

- **Tipo:** comando executável
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; usa o mesmo esquema de eventos da rede
- **Comando ou script alvo:** tools/rede/baseline-regista.ps1 (proposto)
- **Quem usa:** coord; comm-geral; investigador
- **Fase:** 0
- **Risco de ativação e nota:** Medir antes de existir rede, com hooks já ativos, para a comparação da Fase 5 ser legítima.

### `core-jive-ui`

- **Tipo:** declarativa + comando
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; convenções de markup JIVE 2.0 (XML+JSON), tokens, templates, pseudo-classes com dois pontos, checklist de migração 1.x→2.0
- **Comando ou script alvo:** jive_sources() no CMake do Core + scripts de build existentes (por verificar)
- **Quem usa:** juce; qa-ux
- **Fase:** 4 (condicional a D-14)
- **Risco de ativação e nota:** Fonte primária na TAG FIXADA do JIVE, nunca em main. Dispara em layout/estilo/tema; não usar para DSP nem lógica de negócio.

### `core-ui-contrato`

- **Tipo:** comando executável (teste)
- **Existe no Qoder?:** não
- **Reutilização/origem:** nova; análogo de core-headers-publicos para a interface
- **Comando ou script alvo:** ctest -R core-ui-contrato (proposto); tools/rede/ui-contrato.ps1
- **Quem usa:** guardiao; juce; qa-ux
- **Fase:** 2 (condicional a D-14)
- **Risco de ativação e nota:** Oráculo é o vocabulário da versão fixada + IDs governados + tokens, nunca a saída atual. Duas classes de diagnóstico: contrato quebrado vs estilo inerte.
