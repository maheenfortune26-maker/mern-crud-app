# Run this from the ROOT of your repo (the folder that contains "client" and "server").
#   PowerShell:  .\fix-deploy.ps1
$ErrorActionPreference = "Continue"
$utf8 = New-Object System.Text.UTF8Encoding($false)   # UTF-8 without BOM

if (-not (Test-Path "client") -or -not (Test-Path "server")) {
  throw "Run this from the repo root (the folder containing client and server)."
}

# 1. Proper UTF-8 .gitignore files (the old ones were UTF-16, so git ignored them)
[IO.File]::WriteAllText("$PWD\.gitignore", "node_modules/`ndist/`nserver/.env`n", $utf8)
[IO.File]::WriteAllText("$PWD\client\.gitignore", "node_modules/`ndist/`n", $utf8)

# 2. Remove the broken UTF-16 .npmrc
if (Test-Path "client\.npmrc") { Remove-Item "client\.npmrc" -Force }

# 3. Simple Vercel config: SPA rewrites only (Vercel auto-detects Vite)
[IO.File]::WriteAllText("$PWD\client\vercel.json", "{`n  `"rewrites`": [{ `"source`": `"/(.*)`", `"destination`": `"/index.html`" }]`n}`n", $utf8)

# 4. Clean build script
$pkgPath = "$PWD\client\package.json"
$pkg = [IO.File]::ReadAllText($pkgPath)
$pkg = $pkg -replace '"build":\s*"npx vite build"', '"build": "vite build"'
[IO.File]::WriteAllText($pkgPath, $pkg, $utf8)

# 5. Stop tracking node_modules, server/.env and .npmrc in git (files stay on disk, except .npmrc)
git rm -r -q --cached client/node_modules server/node_modules 2>$null
git rm -q --cached server/.env 2>$null
git rm -q --cached client/.npmrc 2>$null

# 6. Commit and push
git add -A
git commit -m "fix: untrack node_modules, use UTF-8 gitignore, simplify Vercel config"
git push origin main
Write-Host "`nDone. Vercel will redeploy automatically." -ForegroundColor Green
