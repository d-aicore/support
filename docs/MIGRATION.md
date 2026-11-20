# Migration — core-org as the new main, support as the system

Owner decisions, 2026-11-20:

- `d-aicore/core-org` is **the application**, the new main, kept as clean as possible.
- `d-aicore/support` holds **the structure, skills, plugins, tests and explanations** — everything
  about how the work functions — plus a maintenance team (`plugins/core-support`) that repairs the
  network's functioning.
- `d-aicore/core` is the previous main; its history is what publishes into `core-org`.

## Prepared locally (commits ready, publication pending credentials)

| Local path | Remote | State |
|---|---|---|
| `D:/Core-Projects/rede-migration/core-org` | `d-aicore/core-org` | clean clone of the product at `c40ed0f`, full history, working tree clean, **no system assets added** |
| `D:/Core-Projects/rede-migration/support` | `d-aicore/support` | commit `eca1838`: README, docs (ARCHITECTURE/SYSTEM/RUNBOOK/PUBLISH/TESTS/MIGRATION), `plugins/core` v0.12.0, `plugins/core-support` v0.1.0, `legacy/` planning history |

Both remotes were verified **empty** before preparation, so publication is a ref creation, never a
force and never an overwrite.

Secret scan of the support tree: clean. The DSH transcript extracts and the session tarball are
deliberately excluded (revoked PATs inside); they stay outside Git.

## Publication commands (push-only actor)

```bash
export GIT_TERMINAL_PROMPT=0
git -C D:/Core-Projects/rede-migration/support  push origin main:refs/heads/main
git -C D:/Core-Projects/rede-migration/core-org push origin main:refs/heads/main
```

Preconditions, in order: a valid **write** credential exists; `ls-remote` of each remote returns no
refs; each push is a creation. If any fails: stop, report the literal error, never force, never
delete remote refs, never touch `D:/CORE/CORE`'s working tree.

## Credential blocker (measured 2026-11-20, pusher gate 0)

The push-only actor stopped at its auth precondition and attempted **no push**. `gh auth status`
lists **three** accounts:

| Account | Token | core-org / support permissions |
|---|---|---|
| `d-aicore` (active) | keyring **invalid** → HTTP 401 `Bad credentials` | not verifiable |
| `diogo-o` | valid | `pull=true`, `push=false`, `admin=false` on both |
| `dmo-app` | valid | `pull=true`, `push=false`, `admin=false` on both |

Root cause: the two repositories grant **read** to org members by default, so even a valid
org-member token cannot write. A fine-grained PAT from `diogo-o` or `dmo-app` cannot exceed their
access. The usable key is therefore one issued by an identity with **write/admin** on both repos —
practically the org owner (`d-aicore`) — or the owner grants write to the account the key belongs to
(Settings → Collaborators / teams).

- Windows credential manager: no stored credential; it opens an interactive prompt (a silent hang
  under `timeout`, which earlier masqueraded as success — the exit code measured was the pipe's).
- The GitHub MCP identity (`d-aicore`) is valid for API writes but cannot transport the application
  history or the full support tree; it is not a substitute for a git push.

**Unblock (owner):** place a write-capable token in `D:/Core-Projects/.secrets/github-token.txt`
(one line, token only). The coordinator imports it with `gh auth login --with-token` (value never
printed), verifies permissions by API, and the pusher then executes the two creation pushes. The
plaintext file is removed after verified import.

## Published (2026-11-20, push-only actor, literal verification)

| Remote | BEFORE | AFTER = local HEAD | Push |
|---|---|---|---|
| `d-aicore/support` | empty (`ls-remote` exit 0, no refs) | `8ce8586e1f1d1ee90a35053f41f3b9a7ce942546` | `* [new branch] main -> main`, exit 0 |
| `d-aicore/core-org` | empty | `c40ed0f801d475e9555f60c647e7829371baa163` | `* [new branch] main -> main`, exit 0 |

Both clones clean afterwards. Auth re-measured by the pusher before writing: active `d-aicore`,
fine-grained PAT, `push=true admin=true` on both. The support clone's origin had been left pointing
at `diogo-o/support` by a failed attempt; it was reset to `d-aicore/support` before the push.
The two `diogo-o/*` shells received **no content** (that push failed at auth, exit 128); they remain
empty and private and can be deleted in the UI.

**Visibility:** both repositories are **public** (measured `vis=public`). The application source and
the system docs are therefore world-readable. No secrets are present (scan clean), but if private is
wanted: Settings → Danger zone → Change visibility, per repo. Owner decision.

## After publication

1. **Done:** the working plugin is installed from this repository
   (`qodercli plugins install <support>/plugins/core`); the legacy live copy `D:/CORE-ORG/core` is
   deprecated and must not be edited — this repository is the single source of truth.
2. **Done:** `plugins/core-support` installed for the maintenance team.
3. Product development continues in actor clones under `D:/Core-Projects/<actor>`; the shared
   checkout `D:/CORE/CORE` stays read-only for agents. `d-aicore/core` is the frozen previous main.
