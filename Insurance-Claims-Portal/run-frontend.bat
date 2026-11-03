@echo off
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%frontend"
echo Starting Frontend UI on http://localhost:4200...
npm.cmd start
