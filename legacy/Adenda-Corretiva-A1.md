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
