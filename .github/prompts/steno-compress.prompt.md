---
mode: ask
description: Convert instructions, skills, agents, prompts, or any ctx file into steno shorthand format. Supports temporary session-only conversion or permanent file rewrite.
tools: ["changes", "codebase", "fetch", "findTestFiles", "githubRepo", "problems", "runCommands", "runTasks", "search", "searchResults", "terminalLastCommand", "terminalSelection", "usages", "vscodeAPI"]
---

# Steno Compress

Use this command to compress ctx into steno shorthand.

Command forms:
- `/steno-compress temporary` -> return shorthand conversion in chat only
- `/steno-compress permanent` -> rewrite target file(s) in-place

Default mode: `temporary` unless user explicitly asks to persist changes.

Scope:
- instructions files
- skill files
- agent files
- prompt files
- other ctx files requested by the user

Rules:
- preserve exact literals: code blocks, commands, paths, URLs, identifiers, versions, flags, and quoted errors
- preserve heading structure and list order unless user asks to restructure
- use stable shorthand only: `cfg`, `auth`, `deps`, `env`, `req`, `resp`, `impl`, `perf`, `arch`, `ctx`
- prefer readability over maximum compression

If permanent mode is used:
- apply edits directly to specified files
- return a short summary of what changed
- keep all technical semantics intact
