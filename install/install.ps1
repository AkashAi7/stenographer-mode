$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$userPrompts = Join-Path $env:APPDATA 'Code\User\prompts'
$bundlePrompt = Join-Path $repoRoot 'bundles\vscode\steno.prompt.md'
$targetPrompt = Join-Path $userPrompts 'steno.prompt.md'

$oldPrompt = Join-Path $userPrompts 'stenographer.prompt.md'
$legacyPrompt = Join-Path $userPrompts 'stenographer-mode.prompt.md'

New-Item -ItemType Directory -Path $userPrompts -Force | Out-Null
Copy-Item -Path $bundlePrompt -Destination $targetPrompt -Force

if (Test-Path $oldPrompt) {
	Remove-Item -Path $oldPrompt -Force
}

if (Test-Path $legacyPrompt) {
	Remove-Item -Path $legacyPrompt -Force
}

Write-Host "Installed Stenographer Mode prompt to $targetPrompt"
Write-Host "Use /steno in VS Code prompt picker or invoke by description."