# Visual evidence — Core DAW UI/UX

## Capture provenance in this repository (verified by reading, not by running)

| Source | What it gives | Limits |
|---|---|---|
| `desktop_self_test` — `tests/CMakeLists.txt:339-342`: `add_test(NAME desktop_self_test COMMAND CoreApp --self-test ${CMAKE_CURRENT_BINARY_DIR}/self-test.png)`, label `desktop`, TIMEOUT 600 | a real PNG from the running app, written into the build tree | opens the window ~20 s; it is a self-test, not a musical UX proof; registers only where `CoreApp` is built |
| `ci/gate.ps1 -Desktop` | runs the self-test as part of a wider scope | **clears the label filter** (`:34`) and therefore also runs the known-red `rt_strict`. Never use it as a smoke test |
| `ci/review-env/run-all.ps1` | includes the JUCE desktop self-test in the Windows review environment | environment/tooling only; not a UX verdict |
| Manual capture of an identified build | any surface, any state | must record revision, config, binary sha256, window/DPI state |
| `design-review:*` installed skills | alignment, visual regression, design-system capture, accessibility | generic; they do not know Core's capture provenance or scope |

`docs/relatorios/2026-11-17-maqueta-interface.md` and `docs/relatorios/2026-11-17-ui-ux-primeira-leitura.md`
exist in the repository as historical UI readings. They are **historical**: revalidate against the working
SHA, and note that D83 placed the interface mockup outside the tree.

## Ratified UI scope (do not re-ask, do not exceed)

- **D102** — UX = **concepts from Pulse** (`github.com/nalexand/pulse`, **AGPL-3.0**: behaviours and
  concepts only, never transcribed code), with **Core's look, menus and colours**. Detachable windows,
  dropdowns instead of many buttons, expandable channel rack, refined mixer and fill pattern; the right
  side keeps Core's existing functions. Final refinement is the owner's.
- **D103** — piano scope: see everything, expandable, `ctrl+scroll` for keys+ / keys−, a button opening a
  small note-tools window including the existing bass kbbb options. «apenas muda no piano» limits the slice.
- **D83** — master vertical/selection, visual refinement, the DSP window and the interface mockup are
  **outside the tree** by owner order; re-land only by numbered decision.
- `docs/plan/ux-pulse-spec.md` is the existing written spec. Reuse and revalidate it; do not write a
  competing one.

## Mockup produced outside Qoder (DSH team) — intake contract

The owner produces the interface mockup with a team in the DeepSeek Harness. **Do not regenerate it here
and do not grade against a substitute.** Ingest it as an external artifact and record the intake in the
stage report:

| Field | Why it is required |
|---|---|
| path + sha256 + format (PNG / SVG / Figma export / markup) | identifies the exact artifact; a re-exported file is a different oracle |
| surface and state (empty, loaded, playing, selected, focused) | a mockup of one state cannot judge another |
| target revision / build, if stated | otherwise the comparison is against an unknown baseline |
| **owner approval: verbatim quote + date + source** | until then the kind is `generated, not approved` (D48/D50: silence is not approval) |
| scope check against **D83** and **D102/D103** | out-of-tree surfaces re-land only by numbered decision; the mockup is a design artifact, not authorization to implement |
| **tokens alongside the image** — colours, typography, spacing, radii | without tokens the comparison stays subjective; with them part of the contract becomes objective and diffable |
| markup vs pixels | markup (XML/JSON) can carry a structural contract; pixels alone cannot |

Ask the producing team for the tokens **with** the image, not after. That single request is what turns
"looks right" into a checkable claim, and it costs them almost nothing while the design is open.

Storage: outside the product repository unless small, necessary and secret-free; reference by path +
sha256. Never commit a mockup that embeds private configuration or credentials.

## Owner rules captured from the mockup session (DSH `711edc2b`, 2026-11-20)

Verbatim, with line numbers in the extracted transcript (`D:\CORE-ORG\dsh-711edc2b-extracted.jsonl`):

| Line | Owner words | Rule for the system |
|---|---|---|
| L483 | «also, rule for core, all windows start detacheable» | **every window starts detachable.** A product rule, not a preference. A mockup or capture showing docked-only windows contradicts it. Existing machinery already references detach at HEAD: `app/desktop/src/{MainComponent,Mixer,LibraryPanel,EngineSession}.cpp` |
| L501 | «panel must look good, so first we pick style for knobs sliders and overall look based on what we have» | **style first**, derived from what Core already has — not imported from a foreign design system |
| L511 | «once a style is settled we just arrange and apply to other panels» | **then arrange, then propagate.** Never restyle panel by panel |
| L500 | «this is what i require but with better card» | the card is the element to improve; the rest of the requirement stands |
| L176 | «vamos usar uma copia do cor nao mexer na actula» | work on a **copy** of Core; never the current checkout |
| L386 / L401 | «voces poden abrir ableton para tirar ideias do ui» · «bitwig» | opening Ableton and Bitwig locally for UI ideas is **authorized**. Observe and describe; never copy assets or code |
| L147 | JIVE + «saiu uma versao nova do jucem» | a newer JUCE exists (9.0.6, 2026-11-19 per survey); Core pins **9.0.5**. Any JIVE probe runs against the pinned JUCE |
| L526 | «usame a team of agents» | the mockup work is done by a team of agents, in DSH |

**Consequence for the visual contract:** there is a **style layer** (knobs, sliders, cards, overall look)
that must be settled and tokenized **before** layout work, and a **window-behaviour rule** (all start
detachable) that every reference and every capture must satisfy. Ask the producing team for the style
tokens with the first mockup, not after the panels are arranged.

## Image-kind contract

Every image referenced in a report carries four fields: **kind** (generated / approved-reference /
real-capture), **path**, **sha256**, **revision + build identity** (for captures).

- A **generated** image may be attached to a proposal. It may never appear in a "verified" row.
- An **approved reference** requires the owner's written approval — verbatim quote, date, source —
  recorded through the report and the ledger pendência. The file alone is not approval.
- A **real capture** requires the build identity. Without it, the claim is `not verified`.

## Four evidence layers (none substitutes for another)

1. **Structural contract** — objective, cheap, always runs. For JUCE C++ surfaces there is no markup
   vocabulary today; a structural contract would have to be defined against the component tree, and that
   is an owner decision. If a declarative UI framework is ever adopted, its vocabulary becomes the oracle
   (never the program's current output).
2. **Runtime component tree** — hierarchy, geometry, focus, visibility. Candidate: Melatonin Inspector
   (**MIT**, `github.com/sudara/melatonin_inspector`). Integration **not verified** in this project.
3. **Capture vs approved reference** — visual, with the image-kind contract above.
4. **Functional path** — mouse and keyboard: selection, focus, Undo, project state, plugin behaviour.
   A picture does not prove any of these.

## Tooling fit

| Need | Use | Note |
|---|---|---|
| Generate a mockup in Core's look | `ImageGen` + the `imagegen` skill | state what must stay unchanged; mark output generated, not approved |
| Find real interaction references | `ImageSearch` | AGPL/GPL sources: concepts only; download originals separately if used as assets |
| Compare capture to reference | `design-review:ui-alignment-review` | installed; generic alignment method |
| Diff against a baseline capture | `design-review:visual-regression-review` | installed; thresholds and masks need a stated decision |
| Extract tokens from existing UI | `design-review:design-system-capture` | installed |
| Contrast, focus, keyboard, targets | `design-review:accessibility-review` | installed |
| Web UI styling / component libraries | **do not use** | Core is JUCE desktop C++, not web |
| macOS/iOS-only JUCE UI tooling | **do not use** | wrong platform (e.g. Visage-based skills) |

## Storage and privacy

Large images, captures and dumps stay **outside** the repository unless small, necessary and secret-free
(`docs/README.md`). Reference them by path + sha256. Never capture or commit credentials, tokens, or
windows showing private configuration. Redact before writing; report a secret's presence and location
without its value.
