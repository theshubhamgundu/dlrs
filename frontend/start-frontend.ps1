# DLRS Frontend Startup Script
Write-Host "Starting DLRS Frontend..." -ForegroundColor Green

# Check if Node.js is available
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeCmd) {
    Write-Host "Node.js not found. Please install Node.js from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check Node version
$nodeVersion = node --version
Write-Host "Node.js: $nodeVersion" -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "`nStarting React development server..." -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Green
npm start


