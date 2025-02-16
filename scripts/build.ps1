# Ensure we're in the project root
Set-Location $PSScriptRoot/..

# Clean dist directory
if (Test-Path dist) {
    Remove-Item -Recurse -Force dist
}
New-Item -ItemType Directory -Path dist -Force | Out-Null

# Run build steps
node ./scripts/validate-entrypoints.js
rollup --config rollup.config.mjs
node ./scripts/convert-icons.js
node ./scripts/build-manifest.js

Write-Host "✅ Build completed"
