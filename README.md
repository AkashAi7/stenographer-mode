# Steno Mode — GitHub Copilot Prompt Pack & Custom Agent

> **Stenographer Mode for GitHub Copilot, Claude Code, Kiro, Cursor & More.** Structured shorthand that cuts ~40% of AI response tokens while keeping every code literal, command, and path exactly intact.

[![npm](https://img.shields.io/npm/v/stenographer-mode?label=npm&color=d76536)](https://www.npmjs.com/package/stenographer-mode)
[![License: MIT](https://img.shields.io/badge/license-MIT-f2c14e.svg)](./LICENSE)
[![Benchmark](https://img.shields.io/badge/benchmark-50%2B%20samples-65584c.svg)](./benchmarks/latest.json)
[![Platforms](https://img.shields.io/badge/works%20with-Copilot%20%7C%20Claude%20Code%20%7C%20Kiro%20%7C%20Cursor%20%7C%208%2B%20more-1f1b16.svg)](#platforms)

<br>

[![Watch the Steno Mode demo](./demo/video-thumbnail.png)](https://akashai7.github.io/stenographer-mode/demo/video.html)

**[▶ Watch the demo](https://akashai7.github.io/stenographer-mode/demo/video.html)** · **[Open interactive benchmark](https://akashai7.github.io/stenographer-mode/demo/)** · **[GitHub repo](https://github.com/AkashAi7/stenographer-mode)**

---

## What It Does

Steno Mode is a prompt-driven response style for AI coding assistants. It compresses answers through consistent shorthand rules, not random truncation.

| Technique | Example |
|---|---|
| **Stable abbreviations** | `cfg`, `auth`, `deps`, `req`, `resp`, `impl`, `ctx` |
| **Symbolic chains** | `A -> B -> C` instead of prose transitions |
| **Filler removal** | Drops pleasantries and repeated framing |
| **Literal protection** | Code, paths, commands, errors stay **verbatim** |

---

## Benchmark

Real numbers from 50+ samples across 7 categories (debugging, code-review, architecture, docs, onboarding, ambiguous, stakeholder):

| | Baseline | Caveman | **Steno** |
|---|---:|---:|---:|
| Tokens (retry loop Q) | 52 | 27 | **20** |
| Avg reduction vs baseline | — | ~48% | **~40%** |
| Readability win rate | — | — | **86% over caveman** |
| Literal accuracy | 100% | 100% | **100%** |

> Failure cases are included in the corpus. Steno is not universal — see [Honest Scope](#honest-scope).

---

## Quick Comparison

**Prompt:** `Why does this API retry loop never stop?`

```
Baseline  The retry loop never stops because the retry counter is stored inside
          the request handler, so it resets to zero on every new attempt.
          Move the counter to state that survives across attempts.           [52 tok]

Caveman   Retry counter inside request handler. Resets each retry. Terminal
          condition never hit. Move counter outside.                         [27 tok]

Steno     Retry ctr lives inside req handler -> resets each attempt ->
          no terminal hit. Persist ctr across attempts.                      [20 tok]
```

**Prompt:** `Review this caching change.`

```
Baseline  This change improves cache hit rate, but it also introduces a stale
          data risk because invalidation only occurs on create and not on
          update or delete.

Steno     Hit rate up, but cache invalidation only covers create ->
          stale reads on update/delete paths.
```

---

## Install

One command, no clone required:

```powershell
# VS Code user profile (prompt + skill + agent)
npx --yes github:AkashAi7/stenographer-mode install --scope user

# Current repo only (.github/prompts + .github/agents)
npx --yes github:AkashAi7/stenographer-mode install --scope project

# Global CLI
npm install -g github:AkashAi7/stenographer-mode
```

If you already cloned the repo:

```powershell
npm install
npm run install:user    # or install:project
```

Uninstall:

```powershell
npm run uninstall:user
```

---

## Usage

### VS Code Copilot Chat

```
/steno Why does this test fail intermittently?
```

Switch compression levels inline:

| Command | Style |
|---|---|
| `/steno lite` | Tight professional prose |
| `/steno brief` | Default shorthand *(recommended)* |
| `/steno court` | Dense expert shorthand |
| `/steno machine` | Maximum compression |

**Persistent mode:** say `Steno Mode` once. The skill keeps it active across Ask, Edit, Agent, and all custom agents until you say `stop steno`.

**Compress a context file:**

```
/steno-compress temporary   # returns shorthand in chat only
/steno-compress permanent   # rewrites the target file in-place
```

### VS Code Agent Mode

Pick the **Steno** agent from the agent picker, then ask normally:

```
Review this diff for regressions.
Use court for terse progress updates.
```

---

## Platforms

| Platform | How to activate |
|---|---|
| **VS Code Copilot** | `npx` install → `/steno` |
| **Claude Code** | Paste `packs/claude/system.txt` into system prompt |
| **Kiro** | Paste `packs/cursor/rules.txt` into agent instructions |
| **ChatGPT** | Paste `packs/chatgpt/custom-instructions.txt` |
| **Cursor** | Paste `packs/cursor/rules.txt` into rules |
| **Windsurf** | Paste `packs/cursor/rules.txt` into rules |
| **Aider** | `--system-prompt` flag or `.aider.conf.yml` |
| **Sourcegraph Cody** | Paste into Cody custom instructions |

---

## Honest Scope

Steno works well in some contexts and poorly in others.

**Works well:**
- Code review comments
- Bug explanations and debugging Q&A
- Architecture summaries
- API and config documentation

**Does not work well:**
- Onboarding and tutorials (beginners need prose)
- Stakeholder communication (executives expect full sentences)
- Empathetic responses
- Teaching new concepts where analogies need space

---

## Compression Levels

| Level | Description |
|---|---|
| `lite` | Tight professional prose. Full sentences mostly intact. |
| `brief` | **Default.** Shorthand + symbols + compact phrasing. |
| `court` | Dense expert shorthand. Fragments allowed. |
| `machine` | Maximum compression. Expert use only. |

---

## Benchmarking

```powershell
npm install
npm run benchmark
```

Outputs `benchmarks/latest.json` and `demo/benchmark-data.js` using exact token counts via `gpt-tokenizer`.

---

## Repo Structure

```
.github/
  agents/steno.agent.md          VS Code custom agent
  skills/steno/SKILL.md          Copilot persistent skill
  skills/caveman/SKILL.md        Caveman comparison skill
bundles/vscode/
  steno.prompt.md                VS Code prompt bundle
  steno-compress.prompt.md       Context compression command
packs/
  claude/system.txt              Claude / Claude Code pack
  chatgpt/custom-instructions.txt
  cursor/rules.txt               Cursor / Kiro / Windsurf pack
benchmarks/latest.json           Benchmark results
scripts/steno-mode.mjs           Cross-platform installer CLI
```

---

## Repository

- **Site:** https://akashai7.github.io/stenographer-mode/
- **GitHub:** https://github.com/AkashAi7/stenographer-mode
- **Primary command:** `/steno`
- **Agent name:** `Steno`

