# Quick Start Script for Campus Complaint System
# Run this script from the CMS directory

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Campus Complaint System - Quick Start   " -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running from correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Please run this script from the CMS directory!" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Installing Backend Dependencies..." -ForegroundColor Green
Set-Location backend
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Backend dependency installation failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Backend dependencies already installed." -ForegroundColor Yellow
}
Set-Location ..

Write-Host ""
Write-Host "Step 2: Installing Frontend Dependencies..." -ForegroundColor Green
Set-Location frontend
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Frontend dependency installation failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Frontend dependencies already installed." -ForegroundColor Yellow
}
Set-Location ..

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!                  " -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Start Backend (in one terminal):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. Start Frontend (in another terminal):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Default Admin Credentials:" -ForegroundColor Magenta
Write-Host "   Email: admin@college.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy Coding! 🚀" -ForegroundColor Green
