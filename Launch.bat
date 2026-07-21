@echo off
setlocal
cd /d "%~dp0"
title Alkander Character Sheet

rem Close server processes left running by older Alkander sheet versions.
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$currentFolder = [Regex]::Escape((Resolve-Path '.').Path);" ^
  "Get-CimInstance Win32_Process | Where-Object {" ^
  "  $_.ProcessId -ne $PID -and $_.CommandLine -and" ^
  "  $_.CommandLine -match 'server\.py' -and" ^
  "  ($_.CommandLine -match '(?i)alkander' -or $_.CommandLine -match $currentFolder)" ^
  "} | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>nul

rem Also free the app port if an older copy is still listening on it.
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":8765 .*LISTENING"') do (
  if not "%%P"=="0" taskkill /PID %%P /F >nul 2>nul
)

rem Give Windows a moment to release the port.
timeout /t 1 /nobreak >nul

where python >nul 2>nul
if %errorlevel%==0 (
  python server.py
  exit /b
)

where py >nul 2>nul
if %errorlevel%==0 (
  py server.py
  exit /b
)

start "" index.html
endlocal
