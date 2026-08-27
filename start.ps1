Write-Host "========================================================" -ForegroundColor Magenta
Write-Host "       🎂 STARTING BIRTHDAY SURPRISE WEBSITE 🎂" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Starting Express Backend & Vite Frontend..." -ForegroundColor Cyan
Write-Host "Surprise Experience: http://localhost:5173" -ForegroundColor Green
Write-Host "Admin Dashboard:     http://localhost:5173/admin" -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot
npm run dev
