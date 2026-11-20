---
name: core-ui-visual
description: Image-based UI/UX work for the Core DAW's JUCE desktop app. Use to produce or search visual references and mockups, to compare a real app capture against an approved reference, to check layout/spacing/colour/focus visually, or to judge detachable windows, piano roll, mixer and pattern surfaces. Distinguishes generated reference, owner-approved mockup, and real capture. Not for web UI, not for implementing UI code.
---

# Core visual UI/UX

## Overview

Core's UI is a **JUCE 9.0.5 desktop app on Windows**, not a web page. Web design skills and web
component libraries do not apply. Images are used for three different jobs, and confusing them is the
main failure mode:

| Image kind | How it is produced | What it may prove |
|---|---|---|
| **Generated reference** | `ImageGen`, or `ImageSearch` for a real product reference | a design *proposal*. Nothing about the app. |
| **Owner-approved mockup** | a generated or drawn reference **plus the owner's explicit approval** | the visual target. Approval is a decision, not a file. |
| **Real capture** | the running app: `CoreApp --self-test <dir>/self-test.png`, or a manual screenshot of an identified build | what the app actually renders, at that revision and configuration |

**A generated image is never evidence of runtime behaviour.** A build is not a UI test. A capture without
a named build and revision is not evidence either.

## Procedure

1. Fix the revision and the build identity (config, binary sha256, JUCE path + patch state). A visual
   claim without them is not admissible.
2. Establish which reference is approved. Read `docs/plan/ux-pulse-spec.md` and the ratified scope:
   **D102** (Pulse concepts, Core look/menus/colours), **D103** (piano scope: see everything, expand,
   `ctrl+scroll` for keys±, a small note-tools window). **D83**: master vertical/selection, visual
   refinement, the DSP window and the interface mockup are **outside the tree**; re-entry needs a
   numbered decision. If no reference is approved, say so and ask — do not invent one.
3. Produce or obtain the reference:
   - `ImageSearch` for real interaction references (Pulse, FL Studio, Ableton, Bitwig). **AGPL/GPL
     sources: concepts only, never transcribed code or copied assets.**
   - `ImageGen` for a mockup in Core's existing look. Load the `imagegen` skill for prompt craft. State
     in the prompt what must stay unchanged (Core colours, menus, existing surfaces) and what changes.
   - Mark the output **generated, not approved** until the owner approves it in writing.
4. Obtain the real capture from the identified build. `desktop_self_test` writes `self-test.png` and
   opens the window for ~20 s; it is a self-test, **not** a musical UX proof.
5. Compare capture against approved reference. Reuse the installed capabilities instead of duplicating
   them: `design-review:ui-alignment-review` for alignment to a reference,
   `design-review:visual-regression-review` for capture-to-baseline diff,
   `design-review:design-system-capture` for tokens, `design-review:accessibility-review` for
   contrast/focus/keyboard. This skill adds only what is Core-specific: capture provenance, JUCE desktop
   constraints, ratified scope, and the oracle status of each image.
6. Record the four evidence layers separately, and never let one substitute for another:
   structural contract · runtime component tree · capture vs reference · functional path with mouse and
   keyboard including selection, focus and Undo.
7. Write the stage report with each image referenced by path + sha256 + kind + revision. Large images
   stay outside the repository unless small and necessary; reference them by path and hash.

## Decision rules

- **All windows start detachable** — owner rule, 2026-11-20 («also, rule for core, all windows start
  detacheable»). A reference or a capture showing docked-only windows contradicts it. Existing detach
  machinery is in `app/desktop/src/{MainComponent,Mixer,LibraryPanel,EngineSession}.cpp`.
- **Style before layout.** Settle the style of knobs, sliders, cards and the overall look **from what Core
  already has**, tokenize it, then arrange and propagate to the other panels. Never restyle panel by
  panel. The card is the element the owner asked to improve.
- **Work on a copy of Core**, never the current checkout (owner instruction, 2026-11-20).
- **Ableton and Bitwig may be opened locally for UI ideas** (owner authorization). Observe and describe;
  never copy assets or code.
- **No approved reference → no alignment verdict.** Report "reference not approved" and the exact
  question for the owner. Do not grade against a generated image you just made.
- **Capture and contract are different oracles.** A capture does not prove structure; a structural
  contract does not prove appearance. Both are required, neither replaces the other.
- **Functional path is not optional.** Selection, keyboard focus, Undo, project state and plugin
  behaviour must be exercised, not inferred from a picture.
- **Scope gate before any UI change.** D83 keeps several surfaces out of the tree; D102/D103 define what
  is in. Producing a reference image is not authorization to implement it.
- **Do not migrate the UI to a declarative framework** (JIVE or other) without an owner decision and a
  pinned-version build probe against JUCE 9.0.5.
- Platform honesty: macOS/iOS-only UI tooling does not apply. Web component libraries do not apply.

## Resources

- [references/visual-evidence.md](references/visual-evidence.md) — capture provenance in this repository,
  the ratified UI scope, the image-kind contract, and what each installed design-review skill covers.
