@echo off
title Codefest Setup

echo ============================
echo      SUARA KITA SETUP
echo ============================

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install

    if errorlevel 1 (
        echo Installation failed!
        pause
        exit /b 1
    )
)

echo Starting SuaraKita...
call npm run dev

pause