$ErrorActionPreference = 'Stop'

$userPrompts = Join-Path $env:APPDATA 'Code\User\prompts'
$targets = @(
  (Join-Path $userPrompts 'stenographer.prompt.md'),
  (Join-Path $userPrompts 'stenographer-mode.prompt.md')
)

foreach ($targetPrompt in $targets) {
  if (Test-Path $targetPrompt) {
    Remove-Item -Path $targetPrompt -Force
    Write-Host "Removed $targetPrompt"
  }
}