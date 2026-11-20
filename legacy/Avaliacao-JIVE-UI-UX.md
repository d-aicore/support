# Avaliação · JIVE para UI/UX na rede de equipas do Core

**Para:** Diogo · **Data:** 2026-11-20 · **Anexo ao:** `Plano-Rede-Core-Qoder.md`
**Pergunta a responder:** «ver se isto ajuda criar plugin ou skills para UI/UX» — [github.com/ImJimmi/JIVE](https://github.com/ImJimmi/JIVE)
**Marcas de origem:** `[V]` verificado por mim hoje (URL indicado) · `[D]` desenho do Diogo · `[P]` proposta minha · `[PV]` por verificar.

---

## 0. Resposta curta

**Sim, ajuda muito — mas não onde a pergunta aponta.** O JIVE não pode ser a UI de um plugin do Qoder: um plugin Qoder é Markdown + JSON + hooks, e as superfícies visuais do Qoder são Canvas (`.canvas.tsx`); o JIVE é C++/JUCE e corre **dentro da DAW**. `[V]`

Onde ele ajuda é do **lado do produto**, e isso torna as **skills de UI/UX muito mais fortes**: o JIVE transforma a UI do Core em **XML (layout) + JSON (estilos)**. Texto é diffável, governável e testável. Passa a ser possível ter um **contrato objetivo de UI** — o análogo do `core-headers-publicos` para a interface — em vez de depender só de «captura vs mockup». E o *hot reloading* em Debug corta o ciclo de rebuild, que é hoje o maior custo de máquina do piloto de UI.

**Veredicto** `[P]`: **adotar em spike, num ecrã pequeno, com versão fixada — não migrar a UI do Core.** Duas skills novas (`core-jive-ui`, `core-ui-contrato`), duas alteradas (`core-qa-ux`, `core-vst3-automacao`), quatro testes novos para o catálogo do guardião. Decisão **D-14**.

**Aviso imediato:** o README que anexaste é da **era 1.x**. No `main` de hoje (JIVE **2.0.0**) o exemplo de CMake desse anexo **já não funciona**: a flag `JIVE_GUI_ITEMS_HAVE_STYLE_SHEETS` foi **removida**, e várias propriedades de estilo foram renomeadas ou movidas. Se seguires o anexo, ou o build falha, ou — pior — os estilos ficam **silenciosamente inertes**. Detalhe na secção 1.3. `[V]`

---

## 1. O que o JIVE é — factos verificados

### 1.1 Núcleo

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

### 1.2 A mecânica que interessa ao piloto (verificada no código, não no marketing)

`jive_sources(<target> SOURCES <glob>… [BUNDLE_SOURCES <bool>])` `[V]`:

- Por omissão, `BUNDLE_SOURCES = $<NOT:$<CONFIG:Debug>>` → **Debug lê do disco** (hot reload); **outras configurações embutem um zip** via `juce_add_binary_data`.
- Os ficheiros são referenciados **pelos mesmos caminhos em disco** nos dois casos.
- Quando o alvo é um plugin JUCE, o registo dos sources é compilado **em cada formato** (VST3, etc.), não na biblioteca estática partilhada — porque o linker a descartaria.

**Três consequências diretas para o plano:**

1. **Debug ≠ Release por construção.** Uma UI que funciona em hot reload pode falhar no binário entregue (ficheiro fora do glob, caminho relativo, ficheiro novo não apanhado pelo `CONFIGURE_DEPENDS`). Isto exige um teste de **paridade** (secção 7).
2. **A «build identificada» das entradas de registo passa a ter de declarar `BUNDLE_SOURCES`.** Sem isso, duas corridas com o mesmo hash de código podem ter UI diferente — exatamente a contaminação que o guardião tem de apanhar.
3. O ponto 3 do `jive_sources` encaixa no requisito do desenho de **módulo separado do executável** `[D]`: o JIVE já trata o caso «plugin com formatos partilhados».

### 1.3 Armadilha do anexo: 1.x → 2.0

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

## 2. O que o JIVE **não** resolve (limites duros)

| Expectativa | Realidade |
|---|---|
| «Plugin do Qoder com UI em JIVE» | **Impossível.** Plugin Qoder = `plugin.json` + `agents/`, `skills/`, `commands/`, `hooks/`, `.mcp.json`; a superfície visual do Qoder é Canvas (`.canvas.tsx`). JIVE é C++/JUCE e vive dentro da DAW. `[V]` |
| «Substitui o mockup aprovado» | Não. Continua a ser preciso um mockup aprovado (D-07) e evidência visual da build real. O JIVE aproxima o *formato* do mockup (tokens/seletores), não elimina a comparação. |
| «Resolve a automação dos projetos antigos» | Não, e **pode complicar**: `autoAttachParameters()` faz corresponder widgets a parâmetros automaticamente. Se essa correspondência mudar entre A e B, muda o que a automação antiga aponta. Tem de ser governado (secção 7). |
| «Dá oráculo de áudio» | Não. Continua a ser QA Áudio + bundles + tolerâncias do catálogo. |
| «Dispensa Undo/foco do Core» | Não. O JIVE expõe `clicking-grabs-focus` e `accessible`, o que **ajuda** o requisito de foco, mas o Undo do Core continua a ser do Core `[D]`. |
| «É estável» | É um projeto ativo com **breaking changes recentes** e um único mantenedor principal. `main` é um alvo movediço. |

---

## 3. Porque ajuda mesmo assim — cinco alavancas para a rede

| # | Alavanca | Efeito concreto na rede | Onde entra no plano |
|---|---|---|---|
| **L1** | **UI passa a ser texto** (XML + JSON) | o scribe passa a verificar diff↔registo na UI **com o mesmo mecanismo** do código; o guardião passa a ter contratos de UI com hash, oráculo e tolerância; o `juce` deixa de escrever classes `Component` | §4.2 e §4.3 do plano, sem alteração de mecanismo |
| **L2** | **Hot reload em Debug** | iteração de UI sem rebuild → menos **tempo de máquina** (o recurso que não se comprime com mais agentes) e mais variantes por sessão; permite QA UX comparar 3 propostas no tempo de 1 | piloto F4, esforço de máquina reduzido |
| **L3** | **Contrato objetivo de UI** | `core-ui-contrato` dá a QA UX um **oráculo verificável** antes da captura: elementos/propriedades válidas, IDs estáveis, tokens existentes, seletores que casam, pseudo-classes 2.0, ausência de propriedades 1.x | teste novo no catálogo (secção 7) |
| **L4** | **Design system partilhado** (tokens, imports, templates, snippets) | o mockup aprovado traduz-se em **tokens + seletores**, não em pixels; muda-se o tema num ficheiro; menos retrabalho entre `juce` e `qa-ux` | skill `core-jive-ui` |
| **L5** | **Ferramentas do ecossistema** | `pluginval` como oráculo externo do VST3; **Melatonin Inspector** para evidência de hierarquia/foco em runtime; **Perfetto** para tracing do `debug`; o test runner/benchmarks/coverage do JIVE como referência de método | catálogo (P2-09) e skills de QA/debug |

**A leitura estratégica** `[P]`: o valor do JIVE para a rede não é «UI mais bonita». É **converter trabalho de UI de opaco para verificável**. Hoje, «a UI está bem» é uma opinião sustentada por uma captura. Com markup + estilos + contrato, passa a ser uma afirmação com oráculo — que é exatamente o que o Diogo pediu na intenção original («resposta tecnicamente verificável»).

---

## 4. Riscos e neutralização

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

## 5. O que proponho fazer — spike, não migração

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

## 6. Skills novas e alteradas

### 6.1 `core-jive-ui` (nova, declarativa + comando) — dono: `juce`

- **Missão:** escrever e alterar UI do Core em markup JIVE, respeitando as convenções do projeto e a versão fixada.
- **Disparo (descrição):** «muda o layout», «ajusta o espaçamento», «o botão não fica com o estilo», «novo painel», «tema». **Não usar** para lógica de negócio nem para DSP.
- **Conteúdo obrigatório:** onde vivem os XML/JSON; naming de `id` (estável, porque os seletores e os testes dependem dele); tokens primeiro, valores literais nunca; templates/snippets para repetição; pseudo-classes **com dois pontos**; propriedades 2.0 (tabela de migração 1.3 embutida como *checklist*); `jive_sources()` e o que entra no glob; regra RT (árvore não se mexe no callback).
- **Fonte primária:** `jive_layouts/README.md`, `jive_style_sheets/README.md`, `docs/guides/*`, `BREAKING_CHANGES.md` — **na tag fixada**, não em `main`.
- **Modelo:** Qwen3.8-Flash, `effort: medium`. Markup é trabalho de estrutura, não de juízo profundo — e é aqui que a escolha de modelos do Diogo poupa mais.

### 6.2 `core-ui-contrato` (nova, comando executável/teste) — dono: `guardiao`

- **Missão:** verificar objetivamente o contrato da UI antes de qualquer captura.
- **Verificações** `[P]`: XML bem formado; elementos e propriedades dentro do vocabulário permitido da versão fixada; `id`s únicos e estáveis (lista governada); todo o seletor casa com pelo menos um elemento (deteta seletores mortos); todos os tokens referenciados existem; pseudo-classes com `:`; **nenhuma propriedade 1.x removida**; nenhum `import` em falta; glob de `jive_sources()` apanha todos os ficheiros usados.
- **Oráculo:** o vocabulário da versão fixada do JIVE + a lista de IDs governada + os tokens do design system. **Não** é a saída atual do programa (não se regera o golden a partir do que o programa faz).
- **Saída:** lista de violações com `ficheiro:linha`, classificadas em *contrato quebrado* vs *estilo inerte* — a segunda classe é a que hoje ninguém vê.
- **Modelo:** nenhum. É um script determinístico; o modelo só interpreta o resultado.

### 6.3 `core-qa-ux` (alterada) — passa a ter **quatro** camadas de evidência

1. **Contrato estrutural** (`core-ui-contrato`) — objetivo, barato, corre sempre.
2. **Árvore em runtime** (candidato: Melatonin Inspector) — hierarquia, foco, visibilidade reais. `[PV]` integração.
3. **Captura vs mockup** — visual, com tokens como ponte.
4. **Percurso funcional** com rato e teclado, incluindo seleção, foco e Undo.

Regra nova: **uma captura não substitui o contrato, e o contrato não substitui a captura.** São oráculos diferentes para afirmações diferentes.

### 6.4 `core-vst3-automacao` (alterada)

Acrescenta: mapa explícito widget↔ID de parâmetro; verificação de que `autoAttachParameters()` não alterou o mapa; `pluginval` como oráculo externo candidato (versão e licença `[PV]`); declaração de `BUNDLE_SOURCES` na evidência.

---

## 7. Testes novos para o catálogo do guardião

| Teste | Protege a afirmação | Oráculo | Controlo negativo (obrigatório) |
|---|---|---|---|
| `core-ui-contrato` | «a UI respeita o vocabulário e o design system» | vocabulário da tag fixada + IDs governados + tokens | remover um token referenciado; escrever `"hover"` sem `:`; usar `font-weight` (1.x) → **tem de falhar nas três classes** |
| `core-ui-embed-paridade` | «o que vejo em Debug é o que entrego em Release» | árvore/estilos obtidos nos dois modos | adicionar um XML fora do glob → Debug passa, Release falha → **o teste tem de apanhar** |
| `core-ui-parametros` | «os widgets apontam para os mesmos parâmetros entre A e B» | mapa versionado widget↔ID | renomear um ID de parâmetro → **tem de falhar**; automação antiga tem de ser verificada à parte |
| `core-vst3-pluginval` (candidato) | «o plugin passa validação externa» | pluginval, versão fixada | introduzir um defeito conhecido (ex.: parâmetro fora de gama) → **tem de falhar** |

Todos entram no catálogo com dono, comando, dependências e **limitações** — e nenhum corre dentro da janela de medição do X3D.

---

## 8. Encaixe na matriz de modelos escolhida

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

## 9. Decisões que isto acrescenta

| ID | Decisão | Recomendação `[P]` | Bloqueia |
|---|---|---|---|
| **D-14** | Adotar JIVE? Em que âmbito? | **spike num ecrã** (secção 5), versão fixada, sem migrar a UI existente; decisão final com os 3 números | P2-17, P4-08, P4-09 (P0-17 corre independentemente) |
| **D-16** | Versão JIVE fixada e política de atualização | tag/commit fixo + fork interno se necessário; atualização só com ensaio de migração contra `BREAKING_CHANGES.md` | qualquer trabalho JIVE |
| **D-07** (reforço) | O mockup aprovado passa a incluir **tokens** (cores, tipografia, espaçamentos) além da imagem | pedir ao designer/Diogo os tokens; sem eles, L4 perde metade do valor | qualidade do piloto de UI |

**Nota sobre o anexo:** guarda-o como referência histórica, mas a skill tem de apontar à **tag fixada**. Se o Diogo quiser, o próximo passo útil é eu escrever a tabela de migração 1.x→2.0 como *checklist* dentro de `core-jive-ui` — está já resumida em 1.3.

---

## 10. Fontes

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
