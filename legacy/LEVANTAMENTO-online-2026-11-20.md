# Levantamento online · o que serve às equipas do Core

**Data:** 2026-11-20 · **Para:** Diogo · **De:** agente planeador (Qoder, sessão `D:\CORE-ORG`)
**Âmbito:** survey de fontes externas + extensões instaláveis, filtrado pelo que o Core **é**. Não instala nada, não altera código, não escreve no repo do produto.
**Produto (medido em `D:\CORE\CORE`):** DAW Windows + **host de VST3 de terceiros** (`engine/src/plugins/juce_host.cpp`, target `core_plugin_host`), motor **miniaudio** vendored (`engine/third_party/miniaudio.h`) em processo separado (`core-engine.exe` + `core_engine_client`), GUI **JUCE 9.0.5** (FetchContent, URL+SHA256, patch D113 verificado em configure), C++20, MSVC VS 18 BuildTools, Ninja, CMake sem presets. Superfícies criativas: **Pattern Maker** e **Tools**. **Zero instrumentos, efeitos, osciladores, filtros ou sampler próprios** (`AGENTS.md:15`, D91/D104). DSP só de infraestrutura: gain, pan, metering, resampling, proteção da saída. Prioridades: **dados > tempo real > performance > compatibilidade** (D54/D115).

**Filtro aplicado a tudo o que segue:** o Core não fabrica plugins. Material de *autor de plugins* (DSP de instrumentos/efeitos, `juce_add_plugin`, APVTS, editores, assinatura/notarização) está **fora**, salvo como conhecimento de compatibilidade do lado do host.

---

## 1. Extensões instaláveis — veredicto por inspeção do conteúdo

Fontes pesquisadas: mercado Qoder (`search_extensions`, skill+plugin+mcp), skills.sh (`npx skills@1.5.22 find`, 7 queries), MCP enterprise de pesquisa de skills (**inexistente nesta sessão**). Nenhum plugin de áudio/JUCE no mercado oficial.

| Candidato | Conteúdo real (inspecionado) | Veredicto |
|---|---|---|
| `shortwavlabs/agent-skills@juce-plugin` (130 installs) | «Build JUCE audio plugins (VST3, AU, AAX, Standalone, LV2)»: AudioProcessor/APVTS, cadeias DSP, editor GUI, Three.js/GLB, code signing, notarização, Gumroad | **Rejeitar.** Fabrico de plugins. A descrição dispara em «audio-thread allocations **in a host**» → risco de ativação errada no Core. Snyk: **Warn** |
| `danielraffel/juce-agent-toolkit@juce-visage-ui` (35) | JUCE + **Visage**, **macOS/iOS apenas** (Metal, `MTKView`, `NSView`), testado JUCE **7/8**, exige fork vendored + patches; «Do NOT use when building a pure JUCE UI» | **Rejeitar.** Plataforma e versão erradas (Core: Windows x64, JUCE 9.0.5). Snyk: **Warn** |
| `kunitoki/sonic-skills@vst3-review` (28) | Review de **implementações** VST3 (`IComponent`/`IAudioProcessor`/`IEditController`, `process()`, buses, ParamID); Step 0 exige `audio-dsp-review` + `audio-numerics-review` | **Não instalar. Adotar a tabela como conhecimento** — ver §2 |
| `majiayu000-dsp-cookbook` (mercado oficial, único resultado de áudio) | Algoritmos DSP: filtros, compressores, delay, modulação, saturação, com integração JUCE | **Não instalar.** Instrumentos/efeitos fora de âmbito (D91/D104). Só a fatia de infraestrutura seria aplicável, e vem melhor de fonte primária |
| `anthropics/skills@skill-creator` (437,5K) · 5 skills de authoring no mercado oficial · `vercel-labs/skills@find-skills` (4,5M) | Criação de skills / descoberta de extensões | **Redundantes.** Já instalados: `skill-creator`, `plugin-creator:skills`, `skill-package-structural-validation`, `ai-skill-optimizer`, `qoder-find-extensions` |
| `ui-ux-pro-max` (461,8K) · `shadcn` · `impeccable` · `taste-skill` · `uizze-ui` · `web-design-guidelines` (883,8K) | Design **web** | **Redundantes ou fora de plataforma.** Já instalados `ui-ux-pro-max-skill:*` (8) e `design-review:*` (12); nenhum é JUCE desktop |
| `beatmagic/acestudio_agent_plugin@ace-studio-audio-plugins` (288) | ACE Studio | **Fora do Core.** Pertence ao lado música/AICORE |
| skills para **miniaudio**, **hosting VST3 do lado do host**, **persistência/recuperação de projetos**, **UI JUCE em Windows** | — | **Não existem** em nenhuma das fontes. É trabalho nosso |

**Conclusão:** o ecossistema de skills de áudio é para autores de plugins. O Core é host + motor + dados + UI. As fichas e skills `core-*` escrevem-se a partir de **fonte primária**, não por instalação.

## 2. O único empréstimo que vale a pena: contrato de compatibilidade do lado do host

Da tabela de violações de `vst3-review` (conceitos, não código), o que o **host do Core** tem de detetar e sobreviver quando um plugin de terceiros está mal escrito:

| Falha do plugin | Consequência no host | Onde isto morde no Core |
|---|---|---|
| Latência não reportada via `getLatencySamples()` | PDC do host partido → mistura adiantada ou drift | `juce_host.cpp:162` (`latencySamples()`), `timing_proof_tests` |
| `ParamID` instável entre versões/save-load | Automação e presets apontam para o parâmetro errado | `state_recovery_tests` (S2+S3), objetivo «não perder automação» |
| `setComponentState` não aplicado pelo controller | UI com valores stale depois de carregar preset | superfície de parâmetros das Tools |
| `setState`/`getState` assimétricos | Corrupção de preset: um lado guarda o que o outro ignora | `juce_host.cpp:348/351/392/484` (pin) |
| `IParamValueQueue` não consumido por bloco | Passos de automação perdidos | automação sub-bloco em `timing_proof_tests` |
| Bypass não passa áudio limpo | Artefactos ou silêncio quando o host automatiza bypass | `s9_mute_block_tests`, mute/suspend |
| `kOfflineProcessing` não tratado separado do realtime | Export com timing/denormals/lookahead errados | `export_plugin_failure_tests` (S1), live vs export |
| Alocação/lock em `process()` | Xruns e glitches | critério 3 do dono; `s7_rt_probe_tests` / `s7_rt_strict_tests` |

Isto é **oráculo emprestado** para `core-host-estado` e para o catálogo do guardião. Não é uma skill a instalar.

## 3. Sanitização — o que já existe no repo (medido) vs o que falta

**Já construído, exatamente na versão que fixaste (`0d7d8ce`, «complete sanitizer target list (ENV-01)»):**

| Peça | Evidência | Estado |
|---|---|---|
| Opção `CORE_SANITIZE` = `address,undefined,thread` (vírgulas) | `CMakeLists.txt:31` | existe |
| Exige `CMAKE_BUILD_TYPE=Debug` | `:34` FATAL_ERROR | existe |
| Valor desconhecido → erro; `address`+`thread` **não combináveis** (árvores separadas) | `:39`, `:42-43` | existe |
| **MSVC suporta `address` apenas** | `:46-47` FATAL_ERROR | existe |
| Flags MSVC `/fsanitize=address` + link `/DEBUG /INCREMENTAL:NO`; não-MSVC `-fsanitize=… -fno-omit-frame-pointer -g` | `:50-55` | existe |
| **Lista completa de alvos sanitizados** (ENV-01) — inclui os que ligam `core_domain`/`core_engine_lib` instrumentados e falhariam com `__asan_*` por definir; medido 2026-11-19 em `8c6837e` | `:146-170`, comentário `:154-156` | existe |
| Canários `asan_canary`/`ubsan_canary`/`tsan_canary`, **fora do ctest de propósito** (esperados falhar); UBSan só `AND NOT MSVC` | `tests/CMakeLists.txt:344-357`; `tests/canary.cpp` | existe |
| `run-all.ps1`: Debug build + compile DB + merge suite + stack probe + **ASan build + canary + suite** + clangd smoke + JUCE desktop self-test; builds em `D:\Core-build\core-review\{debug,asan}` | `ci/review-env/README.md` | existe |
| `run-wsl.sh`: clone ext4 próprio + **ASan+UBSan, TSan**, Debug, **clang-tidy com scope gate** (`ci/tidy_scope.py`); builds em `~/core-review-build/{debug,asanubsan,tsan,tidy}`; **TSan precisa `setarch $(uname -m) -R`** (ASLR off), já embutido | idem | existe |
| `verify.ps1`: verificação **só-leitura** — artefactos + **canário ASan vivo** + frescura dos marcadores; **não é uma suite**; exit 0 só quando pronto | idem | existe |
| **Guarda anti-falso-verde com fingerprint SHA-bound**: `fp1 sha=<HEAD> local=<hash do diff rastreado que afeta build, docs excluídos> juce=<dep HEAD/diff ou patch+hashes dos ficheiros tocados> script=<hash> cfg=<config por passo>`; reuso só com fingerprint completo; marcadores legacy sem `fp1` re-correm; `run-wsl.sh` verifica fail-closed que o clone está detached exatamente no HEAD do Windows | idem | existe |
| Pré-requisitos: VS 18 BuildTools (MSVC 19.51), CMake ≥4.4, Ninja; JUCE 9.0.5 em `D:\Core-deps` **sem `.git`** com patch D113; WSL2 Ubuntu 24.04, GCC 13, clang/clang-tidy 18, **sem gdb e sem rede apt**; clangd 23.1.0 | idem | existe |
| Provas arquivadas | `docs/relatorios/2026-11-19-review-debug-sanitize-environment.md`, `2026-11-19-pull-a9a0384-environment-refresh.md` | existe |

**Consequência para a `P-F` do work order** («record dependency state (JUCE path + patch hash) in the evidence contract»): **já está implementado em `ci/review-env`** — o campo `juce=` do `fp1` guarda exatamente isso, e a revisão invalida os passos. O que **falta** é o mesmo contrato no **`ci/gate.ps1`**, que não regista sha256 de binários nem estado da dependência JUCE (`ci/gate.ps1:68-79` regista só src@commit+dirty, build, label, tempo). A proposta reduz-se a: **estender o contrato de evidência do gate**, não construir mecanismo novo.

**Limites de plataforma (survey externo, com fonte):**

| Sanitizer | Windows/MSVC nativo | WSL/Linux | Fonte |
|---|---|---|---|
| ASan | **sim** (`/fsanitize=address`, VS2019 16.9+) | sim | [learn.microsoft.com/asan](https://learn.microsoft.com/en-us/cpp/sanitizers/asan?view=msvc-170) |
| UBSan | **não implementado** (pedido aberto) → o guard `AND NOT MSVC` do repo está certo | sim (clang 18) | [devcommunity request](https://developercommunity.visualstudio.com/t/Add-support-for-UBSAN-UndefinedBehavior/840750) |
| TSan | **não** (POSIX) | sim, com ASLR off | [clang docs](https://clang.llvm.org/docs/ThreadSanitizer.html) |
| **RTSan** (`-fsanitize=realtime`, `[[clang::nonblocking]]`) | **não** (pedido MSVC aberto) | sim, **LLVM ≥20** — o WSL do repo tem clang **18** → **precisa de upgrade** | [RealtimeSanitizer](https://clang.llvm.org/docs/RealtimeSanitizer.html), [MSVC request](https://developercommunity.visualstudio.com/t/Realtime-Sanitizer-similar-to-clangs-20/10744158) |
| Perfetto | MSVC «best-effort», subconjunto de alvos | sim | [build instructions](https://perfetto.dev/docs/contributing/build-instructions) |

**O achado mais importante do survey inteiro:** o **RTSan foi o que apanhou o defeito que o Core tem medido como RED**. [JUCE issue #1588](https://github.com/juce-framework/JUCE/issues/1588) — aberta 2025-10-29, **ainda aberta, 0 comentários, sem correção upstream aceite**: trace RTSan de `Array<Vst::Event, CriticalSection>::clearQuick` → `MidiEventList::clear` → `VST3PluginInstance::associateWith` **na thread de áudio**, ao hostar Surge XT a partir do Zrythm. É exatamente o `s7_rt_strict_tests` do Core (`tests/CMakeLists.txt:257-263`, vermelho medido em `a9a0384` + round-1, fora de `merge` pelo precedente ENV-03).

Segundas locks a auditar, com fonte primária da comunidade: `listenerLock` em `sendValueChangedMessageToListeners` ([forum 60007](https://forum.juce.com/t/understanding-lock-in-audio-thread/60007)) e alocação de SysEx em caminhos de `MidiMessage` ([forum 30484](https://forum.juce.com/t/midimessage-lock-free/30484)).

**Decisão que isto abre (tua, não minha):** o fix do `MidiEventList` entra como **hunk adicional do patch vendored** (mesmo mecanismo do D113, que já é verificado em configure) ou como **bypass ao nível do wrapper** do host? E aceitas um **side-build WSL com clang ≥20** para RTSan, ou toda a verificação fica MSVC-nativa? Nota: o WSL atual é clang 18, **sem rede apt** — o upgrade não é trivial.

## 4. Conhecimento a destilar em skills nossas (fonte primária, licença verificada)

| Fonte | O que dá | Licença | Versão / atividade | Aplicação |
|---|---|---|---|---|
| [Bencina, «Real-time audio programming 101»](http://www.rossbencina.com/code/real-time-audio-programming-101-time-waits-for-nothing) | regras canónicas no-lock/no-alloc/no-block, inversão de prioridade | conhecimento | 2011 | **base de `core-motor-rt`** |
| ADC: Dave Rowland «Real-time Tradeoffs» · Jatin «Replacing ValueTreeState» ([1](https://www.youtube.com/watch?v=JCNyd1KGjMk), [2](https://www.youtube.com/watch?v=_rIbzeVk4q4)) | plumbing lock-free de parâmetros/eventos | conhecimento | 2024 | automação densa do Core |
| [moodycamel ReaderWriterQueue](https://github.com/cameron314/readerwriterqueue) | fila SPSC lock-free, header único | **BSD-2** | push 2026-11-07 | candidato a handoff UI→áudio; **prova: correr `rt_strict` antes/depois** |
| [miniaudio](https://github.com/mackron/miniaudio) · [CHANGES](https://github.com/mackron/miniaudio/blob/master/CHANGES.md) | internals do device/node graph | **Unlicense OR MIT-0** | **v0.11.26**, 2026-10-31 | **diff de drift do header vendored** |
| [VST3 SDK](https://github.com/steinbergmedia/vst3sdk) · [licença](https://steinbergmedia.github.io/vst3_dev_portal/pages/VST+3+Licensing/VST3+License.html) | spec + interfaces de hosting | **MIT desde out/2025** (opções GPLv3/proprietary retiradas) | push 2026-08-11 | **porta de licença levantada**; conhecimento de spec seguro |
| [JUCE AudioPluginHost](https://github.com/juce-framework/JUCE/tree/master/extras/AudioPluginHost) · [CMake API](https://github.com/juce-framework/JUCE/blob/master/docs/CMake%20API.md) · [BREAKING_CHANGES](https://github.com/juce-framework/JUCE/blob/master/BREAKING_CHANGES.md) | host de referência (FormatManager/KnownPluginList/scan-cache); deltas 9.x | JUCE GPLv3/comercial → **conceitos** | **9.0.6 saiu 2026-11-19**; Core fixa 9.0.5 | `core-host-estado`; gate de upgrade |
| [pluginval](https://github.com/Tracktion/pluginval) · [CI doc](https://github.com/Tracktion/pluginval/blob/develop/docs/Adding%20pluginval%20to%20CI.md) | validação strictness 1–10, backtraces de crash | **GPL-3.0** → correr como ferramenta externa, **nunca copiar código** | **2.0.0**, 2026-10-14, sobre JUCE 9.0.3 | oráculo externo para plugins de terceiros e para o harness |
| [Melatonin Inspector](https://github.com/sudara/melatonin_inspector) · [tips](https://melatonin.dev/blog/big-list-of-juce-tips-and-tricks/) | árvore de componentes/geometria em runtime | **MIT** | push 2026-08-16 | QA UX (camada 2, já prevista no CSV) |
| [Gin](https://github.com/FigBug/Gin) | widgets (knobs, meters) | **BSD-3** | push 2026-11-17 | mixer/patterns — **só se não duplicar o que o Core já tem** |
| [libebur128](https://github.com/jiixyj/libebur128) | LUFS / EBU R128 | **MIT** | push 2026-11-20 | invariantes de loudness **independentes do compilador** (encaixa na regra «sem goldens bit-exact») |
| [CCRMA / JOS Smith](https://ccrma.stanford.edu/~jos/svf/svf.pdf) | teoria de filtros/SVF/espectral | conhecimento livre | svf.pdf cita 2026 | **só teoria**; não licencia criar DSP criativo |
| [awesome-juce](https://github.com/sudara/awesome-juce) | índice de módulos/templates | MIT | ativo | mapa de descoberta |
| [Pulse](https://github.com/nalexand/pulse) | workflow de patterns estilo FL | **AGPL-3.0 → conceitos apenas** | push 2026-10-31 | critérios de UX (D102 já ratifica «conceitos do Pulse, look do Core») |
| [Qoder Skills](https://docs.qoder.com/cli/Skills) · [Plugins](https://docs.qoder.com/cli/plugins) | `SKILL.md`: `name` lowercase/hífens ≤64, `description` ≤1024 com triggers; user override project; `/skills reload`; **uma domínio por skill**. Plugin: `.qoder-plugin/plugin.json` (só `name` obrigatório), descoberta automática de `commands/ agents/ skills/ hooks/hooks.json output-styles/ bin/ .mcp.json`; `qoder plugins install/validate`; scopes user/project/local; `QODER_PLUGIN_ROOT/DATA`; `isolation: worktree` | oficial | atual | **contrato de authoring das fichas e do plugin `core`** |

## 5. Rejeitar / adiar (com razão)

- **KFR** (GPLv2+/comercial), **Faust** (família GPL), **código do pluginval**, **código do Pulse**, **código do Zrythm** → copyleft; conceitos apenas, Core é fechado.
- **RtAudio, PortAudio, Soundpipe, pugl, ImGui UIs** → duplicam miniaudio/JUCE; Soundpipe parado desde 2024-01.
- **pamplejuce** → JUCE 8 + Catch2 contra JUCE 9 fixado + framework próprio `CHECK_*`.
- **musicdsp.org** → site em baixo, licenças por snippet incertas; só conceitos via Wayback.
- **RTSan/TSan/UBSan em MSVC** → não existem nativamente; WSL-only, e RTSan exige clang ≥20 (o repo tem 18).
- **Perfetto in-process em Windows** → best-effort; adiar até haver necessidade.
- **JIVE 2.0** (MIT, push 2026-11-20) → README instala `#main` sem pin; **compatibilidade com JUCE 9.0.5 não verificada**; o work order pôs-no em «not built». Só com commit fixado + probe de build.
- **Não verificado nesta passagem:** versão exata do VST3 SDK, Pirkle/Blechmann/JSFX/Eigen/IPP, heurísticas de UX de DAW publicadas (não se encontrou guideline canónica → derivar de Pulse + observação manual).

## 6. Sobreposição com o que já está instalado (regra: uma função, uma skill)

| Skill planeada no CSV | Já instalado que cobre a função | Ação |
|---|---|---|
| `core-debug-reducao` | `systematic-debugging` | fundir: a skill `core-*` acrescenta só o vocabulário/refs do Core, ou não se cria |
| `core-qa-ux` | `design-review:*` (12), `ui-ux-pro-max-skill:*` (8) | idem — e nenhum deles é JUCE desktop; a parte JUCE é nossa |
| `core-motor-mapa-audio` | `architecture-visualization:*` (12), `Explore` built-in | reutilizar o método; a parte «traçar o callback» é nossa |
| `core-pesquisa-primaria` | WebSearch/WebFetch built-in, `context7:docs-researcher` | a exigência «fonte primária + versão + ensaio» é uma regra, não uma skill nova |
| `core-scribe-verifica` | contrato já existente no repo (`AGENTS.md`, `MODELO.md`, escrivão-only) | **não criar skill**: seguir o contrato do repo |
| `core-estado-consulta` | `ESTADO.md` + índice de relatórios | idem |
| `core-arranque`, `core-observador`, `core-baseline` | nada equivalente | nossos (hooks + JSONL fora do repo) |
| `core-host-estado`, `core-motor-rt`, `core-guardiao-catalogo`, `core-headers-publicos`, `core-evidencia`, `core-passagem`, `core-registo`, `core-encaminhamento` | nada equivalente | nossos |

## 7. O que ainda é decisão tua

1. **RTSan via WSL com clang ≥20** (sem rede apt no WSL atual) ou verificação só MSVC-nativa?
2. **Fix do `MidiEventList`**: hunk adicional do patch vendored (mecanismo D113) ou bypass no wrapper do host?
3. **JUCE 9.0.6** (saiu 2026-11-19) é candidato a upgrade, ou 9.0.5 fica fixado pela estabilidade do patch?
4. **pluginval** como oráculo externo aceite (GPL, corrido out-of-process, sem copiar código)?
5. A lista de 24 skills fica **congelada** até este survey ser mapeado nela (regra «uma função, uma skill»)?

## 8. O que não fiz

Não instalei nenhuma extensão. Não alterei código, CMake, settings nem o repo do produto. Não corri sanitizers, builds, gates nem testes — tudo o que está em §3 como «existe» é **leitura de CMake/scripts/README**, não execução. Os veredictos de vermelho/verde citados são **reportados** nos relatórios do repo, não re-medidos por mim. Fontes externas com URL; o que não foi verificado está marcado como tal.
