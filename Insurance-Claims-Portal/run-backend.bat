@echo off
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%backend"
echo Starting Backend API on http://localhost:5000...
npm.cmd start
