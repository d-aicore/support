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

## Credential blocker (measured 2026-11-20)

- `gh auth status`: account `d-aicore` keyring token **invalid**; account `diogo-o` valid but
  `permissions.push=false` on `d-aicore/core-org` (pull only).
- Windows credential manager: no stored credential; it opens an interactive prompt (a silent hang
  under `timeout`, which earlier masqueraded as success — the exit code measured was the pipe's).
- The GitHub MCP identity (`d-aicore`) is valid for API writes but cannot transport the application
  history or the full support tree; it is not a substitute for a git push.

**Unblock (owner, one of):** re-authenticate `gh auth login -h github.com` as `d-aicore`; or store a
fine-grained PAT with `contents: write` on both repos; or grant `diogo-o` write on both repos in
Settings → Collaborators. After any of these, the push-only actor executes the two commands above.

## After publication

1. Reinstall the working plugin from the support repository (`qodercli plugins install
   <support>/plugins/core`) and retire the legacy live copy `D:/CORE-ORG/core` so there is one source
   of truth. Until then the installed copy remains the legacy path and this repository is canonical
   for edits.
2. Install `plugins/core-support` for the maintenance team.
3. Product development continues in actor clones under `D:/Core-Projects/<actor>`; the shared
   checkout `D:/CORE/CORE` stays read-only for agents.
