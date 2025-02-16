Write-Host "Building newtab..."

# Create dist directory structure
$distDir = "dist"
$newtabDir = "$distDir/newtab"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path $distDir | Out-Null
New-Item -ItemType Directory -Force -Path $newtabDir | Out-Null

# Copy React dependencies
Copy-Item -Path "node_modules/react/umd/react.production.min.js" -Destination "$newtabDir/"
Copy-Item -Path "node_modules/react-dom/umd/react-dom.production.min.js" -Destination "$newtabDir/"

# Copy newtab HTML
Copy-Item -Path "src/extension/newtab/index.html" -Destination "$newtabDir/"

# Copy manifest
Copy-Item -Path "src/configs/manifest/manifest.template.json" -Destination "$distDir/manifest.json"

Write-Host "Files copied successfully. Contents of ${newtabDir}:"
Get-ChildItem -Path $newtabDir -Recurse

Write-Host "✅ Newtab build completed"
