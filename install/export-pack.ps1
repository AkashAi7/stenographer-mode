$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $repoRoot 'dist'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$bundleDir = Join-Path $distDir "stenographer-mode-$stamp"

New-Item -ItemType Directory -Path $bundleDir -Force | Out-Null

$paths = @(
  'package.json',
  'package-lock.json',
  'product.json',
  'release.json',
  'bundle.json',
  'benchmarks\corpus.json',
  'benchmarks\latest.json',
  '.github\skills\stenographer\SKILL.md',
  '.github\skills\caveman\SKILL.md',
  'bundles\vscode\stenographer.prompt.md',
  'bundles\vscode\stenographer-mode.prompt.md',
  'packs\claude\system.txt',
  'packs\cursor\rules.txt',
  'packs\chatgpt\custom-instructions.txt',
  'demo\brand-mark.svg',
  'demo\benchmark-data.js',
  'demo\index.html',
  'demo\styles.css',
  'demo\app.js',
  'install\install.ps1',
  'install\uninstall.ps1',
  'install\export-pack.ps1',
  'scripts\generate-benchmarks.mjs'
)

foreach ($path in $paths) {
  $source = Join-Path $repoRoot $path
  $destination = Join-Path $bundleDir $path
  $destinationDir = Split-Path -Parent $destination
  New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
  Copy-Item -Path $source -Destination $destination -Force
}

Write-Host "Exported product bundle to $bundleDir"