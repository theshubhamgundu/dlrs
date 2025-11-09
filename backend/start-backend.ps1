# DLRS Backend Startup Script
Write-Host "Starting DLRS Backend..." -ForegroundColor Green

# Check if Maven is available
$mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue

if (-not $mvnCmd) {
    Write-Host "Maven not found in PATH. Please install Maven or use Maven wrapper." -ForegroundColor Yellow
    Write-Host "Download Maven from: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    Write-Host "Or install via chocolatey: choco install maven" -ForegroundColor Yellow
    exit 1
}

# Check Java
$javaVersion = java -version 2>&1 | Select-Object -First 1
Write-Host "Java: $javaVersion" -ForegroundColor Cyan

# Build the project
Write-Host "`nBuilding backend..." -ForegroundColor Yellow
mvn clean install -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Run the application
Write-Host "`nStarting Spring Boot application..." -ForegroundColor Yellow
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Green
mvn spring-boot:run


