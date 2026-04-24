$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$cli = Join-Path $repoRoot 'scripts\steno-mode.mjs'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw 'Node.js is required. Install Node.js, then rerun this script or use npx --yes github:AkashAi7/stenographer-mode install --scope user.'
}

& node $cli install --scope user @args

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}