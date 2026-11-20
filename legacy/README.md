# CORE-ORG

Organizational design for **CORE** (`d-aicore/core`): how its team network is configured, delegated,
observed and maintained in **Qoder**.

This repository holds **planning and evaluation documents only**. It is not a second documentation
authority. Product decisions, the ledger and the audit trail live in `d-aicore/core`
(`ESTADO.md`, `docs/relatorios/`, `docs/AUDITORIA.md`).

**Status:** documentary. Nothing described here has been implemented, configured in Qoder or executed
against the Core repository. No code in `d-aicore/core` was modified by this work.

**Date:** 2026-11-20

## Contents

| File | What it is |
|---|---|
| `CORE-Rede-Qoder-Documento-Unico.md` | The single consolidated document, in four parts (see below). Everything else in this table is embedded in it verbatim. |
| `Adenda-Corretiva-A1.md` | Part I on its own: the targeted review against the real `d-aicore/core` repository. |
| `Plano-Rede-Core-Qoder.md` | Part II on its own: the phased implementation plan. |
| `Avaliacao-JIVE-UI-UX.md` | Part III on its own: the JIVE assessment. |
| `backlog.csv` | 68 backlog items: phase, package, action, owner, dependencies, three separate effort columns, acceptance criterion, expected evidence. |
| `inventario-agentes.csv` | 24 agent profiles: mission, contacts, read sources, write targets, tools, skills, model and effort, activation phase. |
| `inventario-skills.csv` | 24 plugin skills: type, whether it exists in Qoder, origin, target command, consumers, activation risk. |

For reading, use the consolidated document. The three separate files are kept as they were delivered,
unmodified, so nothing has to be reconstructed from memory later.

### Structure of the consolidated document

- **Part I — Corrective addendum A1.** The targeted review of the plan against the real
  `d-aicore/core` repository (read on 2026-11-20). 28 observed facts, 18 corrections, each naming the
  affected sections, affected backlog IDs, the previous assumption, the correction, the evidence and
  the impact on dependencies. **Read this part first: it supersedes parts II and III.**
- **Part II — Phased implementation plan.** Discovery, the 11 teams and 24 profiles, packages A–D,
  ordered backlog, effort ranges, validation and recovery, reversibility, pending decisions.
- **Part III — JIVE assessment.** Whether <https://github.com/ImJimmi/JIVE> helps produce UI/UX
  tooling for the network, with a hard pitfall around the 1.x → 2.0 migration.
- **Part IV — Machine-readable data.** Full backlog entries, agent sheets and skills, generated from
  the CSVs above, so the document and the data cannot diverge.

## Language

Parts I–IV are in **Portuguese**, matching the working language they were produced in. The
repository rule in `d-aicore/core/AGENTS.md` requires English for material entering *that* repository;
an English translation of this material is pending an owner decision and has not been done here to
avoid rewriting delivered documents.

## Reading order and precedence

1. Current instruction from the owner.
2. `d-aicore/core`: `AGENTS.md`, `ESTADO.md`, product and boundary documents.
3. Part I of the consolidated document (corrections).
4. Parts II–IV (as delivered, unrevised).

Pending decisions are numbered `NET-01`…`NET-20`. They are **proposals**: they carry no effect until
ratified by the owner with a verbatim quote, a date and a source, and recorded by the ledger scribe in
`d-aicore/core`. They deliberately do **not** use the `D###` namespace.
