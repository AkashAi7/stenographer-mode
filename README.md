# Stenographer Mode

Shorthand-first token compression with readable technical precision.

Stenographer Mode is a prompt and packaging product for compressed AI responses. It is positioned against caveman mode by keeping more structure and scanability while still reducing token usage.

## What Is In This Repo

- VS Code Copilot skill: `.github/skills/stenographer/SKILL.md`
- Caveman comparison skill: `.github/skills/caveman/SKILL.md`
- VS Code user prompt bundle: `bundles/vscode/stenographer.prompt.md`
- Static demo and landing page: `demo/`
- Cross-platform starter packs: `packs/`
- Installer and exporter: `install/`
- Exact token benchmark pipeline: `benchmarks/` and `scripts/generate-benchmarks.mjs`

## Product Identity

- Product ID: `stenographer-mode`
- User ID: `stenographer_mode`
- Primary command: `/stenographer`
- Legacy alias: `/stenographer-mode`

## Supported Surfaces

- VS Code Copilot Chat
- Claude
- Cursor
- ChatGPT

## Install

Install the VS Code prompt into the roaming prompt profile:

```powershell
& '.\install\install.ps1'
```

Remove it:

```powershell
& '.\install\uninstall.ps1'
```

## Run The Demo

Open `demo/index.html` in a browser.

The page includes:

- branded landing surface
- install and export CTAs
- baseline vs caveman vs stenographer comparison
- exact token benchmark display
- release-kit summary

## Exact Benchmarking

This project uses `gpt-tokenizer` for exact token counts.

Install dependencies:

```powershell
npm install
```

Generate benchmark artifacts:

```powershell
npm run benchmark
```

Outputs:

- `benchmarks/latest.json`
- `demo/benchmark-data.js`

## Export A Distribution Bundle

```powershell
& '.\install\export-pack.ps1'
```

This creates a timestamped bundle under `dist/` containing product metadata, prompt bundles, demo assets, benchmark artifacts, install scripts, and platform packs.

## Key Files

- `product.json`: product identity and platform coverage
- `bundle.json`: distributable bundle manifest
- `release.json`: release metadata and benchmark status
- `package.json`: benchmark dependency and script entrypoint

## Current Status

- install: ready
- export: ready
- demo: ready
- benchmark: exact

## Repo Note

This folder currently has product files and documentation, but it is not initialized as a git repository yet. If you want a full repo, run:

```powershell
git init
```