---
mode: ask
description: Convert existing .github instructions, skills, agents, and prompts into steno shorthand. Supports preview and apply modes.
tools: ["changes", "codebase", "fetch", "findTestFiles", "githubRepo", "problems", "runCommands", "runTasks", "search", "searchResults", "terminalLastCommand", "terminalSelection", "usages", "vscodeAPI"]
---

# Steno Convert GitHub

Use this command to run conversion over existing files in `.github`.

Execution backend:
- run `node ./scripts/steno-mode.mjs convert-github --mode preview --project-dir .` for preview
- run `node ./scripts/steno-mode.mjs convert-github --mode apply --project-dir .` for apply

Command forms:
- `/steno-convert-github preview` -> scan + show planned changes only
- `/steno-convert-github apply` -> apply conversion edits to files

Default mode: `preview` unless user explicitly requests apply.

Target files:
- `.github/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`
- `.github/agents/**/*.agent.md`
- `.github/prompts/**/*.prompt.md`
- `.github/skills/**/SKILL.md`

Conversion rules:
- compress prose into steno shorthand while preserving meaning
- preserve exact literals: code blocks, commands, paths, URLs, identifiers, versions, flags, and quoted errors
- preserve frontmatter structure and keys in prompt/agent files
- preserve heading and list order unless user requests restructuring
- use stable shorthand only: `cfg`, `auth`, `deps`, `env`, `req`, `resp`, `impl`, `perf`, `arch`, `ctx`, `ctr`
- if a file already appears steno-compressed, skip with note

Output behavior:
- in `preview`: return candidate file list + concise conversion plan
- in `apply`: edit files directly + return changed file summary
