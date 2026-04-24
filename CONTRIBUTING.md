# Contributing to Stenographer Mode

Thank you for your interest in contributing! This guide covers how to contribute effectively.

## Ways to Contribute

### 1. Expand the Benchmark Corpus

The benchmark corpus at `benchmarks/corpus.json` drives credibility. Add samples by:

1. Choose a category: `debugging`, `code-review`, `architecture`, `docs`, `onboarding`, `ambiguous`, `stakeholder`
2. Write a realistic prompt
3. Create three versions: `baseline` (normal), `caveman` (terse), `steno` (shorthand)
4. Run `npm run benchmark` to regenerate artifacts

```json
{
  "label": "Your sample name",
  "category": "debugging",
  "prompt": "Your realistic prompt here",
  "baseline": "Full natural language response...",
  "caveman": "Terse choppy version...",
  "steno": "Shorthand w/ arrows and abbrevs..."
}
```

### 2. Improve Prompt Instructions

The core prompts live in:
- `bundles/vscode/steno.prompt.md` — VS Code prompt mode
- `.github/skills/stenographer/SKILL.md` — Copilot skill

Improvements should:
- Preserve the shorthand vocabulary (`cfg`, `auth`, `deps`, `req`, `resp`, etc.)
- Maintain the four compression levels (`lite`, `brief`, `court`, `machine`)
- Keep technical literals intact (code, paths, commands, errors)

### 3. Add Platform Packs

Platform packs in `packs/` adapt steno for different AI surfaces:
- `packs/claude/system.txt`
- `packs/cursor/rules.txt`
- `packs/chatgpt/custom-instructions.txt`

Add a new pack by creating a directory with the platform-appropriate format.

### 4. Fix Bugs or Improve Tooling

The installer and benchmark scripts are in `scripts/`:
- `scripts/steno-mode.mjs` — cross-platform installer
- `scripts/generate-benchmarks.mjs` — benchmark generator

## Development Setup

```bash
git clone https://github.com/AkashAi7/stenographer-mode.git
cd stenographer-mode
npm install
npm run benchmark
```

## Pull Request Guidelines

1. **One change per PR** — keep PRs focused
2. **Run benchmarks** — ensure `npm run benchmark` succeeds
3. **Test locally** — verify prompts work in VS Code Copilot
4. **Describe the change** — explain what and why in the PR description

## Code Style

- Use clear, concise commit messages
- Follow existing patterns in the codebase
- No external runtime dependencies beyond `gpt-tokenizer`

## Questions?

Open an issue with the `question` label or start a discussion.
