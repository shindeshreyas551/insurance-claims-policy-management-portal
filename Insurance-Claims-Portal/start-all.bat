@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
echo =====================================================================
echo  INSURANCE CLAIMS & POLICY MANAGEMENT PORTAL
echo  Group 20 - Individual Academic Project (Final Assessment)
echo =====================================================================
echo [1/2] Starting Backend API (Port 5000)...
start "Backend API (Express + Prisma SQLite)" /D "%SCRIPT_DIR%backend" cmd /k "npm.cmd start"

echo [2/2] Starting Frontend Web Portal (Port 4200)...
start "Frontend (Angular 19)" /D "%SCRIPT_DIR%frontend" cmd /k "npm.cmd start"

echo.
echo Both servers are launching in dedicated windows:
echo   - Backend API: http://localhost:5000/api/health
echo   - Frontend UI: http://localhost:4200
echo =====================================================================
