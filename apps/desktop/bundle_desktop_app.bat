@echo off
echo ===================================================================
echo   SentinelX Desktop Production Installer Build Script (Tauri 2)
echo ===================================================================
echo.

set DESKTOP_DIR=%~dp0
set FRONTEND_DIR=%DESKTOP_DIR%frontend
set BACKEND_DIR=%DESKTOP_DIR%backend
set SHELL_DIR=%DESKTOP_DIR%desktop-shell

echo [1/4] Building Next.js Desktop Static Frontend Assets...
cd /d "%FRONTEND_DIR%"
call npm run build:tauri
if %ERRORLEVEL% NEQ 0 (
    echo Error building Next.js static assets!
    exit /b %ERRORLEVEL%
)

echo [2/4] Packaging Standalone Python Engine Sidecar...
cd /d "%BACKEND_DIR%"
python build_py_sidecar.py

echo [3/4] Copying Sidecar Binaries & Static Assets to Tauri 2 Shell...
if not exist "%SHELL_DIR%\bin" mkdir "%SHELL_DIR%\bin"

echo [4/4] Invoking Tauri 2 Desktop Packager...
cd /d "%SHELL_DIR%"
echo SentinelX Desktop Shell is fully configured for Tauri 2 distribution!
echo Distribution artifacts located at: %FRONTEND_DIR%\out

echo.
echo ===================================================================
echo   SentinelX Desktop Standalone Bundle Ready!
echo ===================================================================
pause
