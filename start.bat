@echo off
title Birthday Surprise Website
echo ========================================================
echo        🎂 STARTING BIRTHDAY SURPRISE WEBSITE 🎂
echo ========================================================
echo.
echo Starting backend API server (port 3001)...
start "Birthday Backend" cmd /k "cd /d "%~dp0" && node server/server.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend (port 5173)...
start "Birthday Frontend" cmd /k "cd /d "%~dp0" && npx vite --port 5173 --host"

echo Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================================
echo  ✅ Website is starting up!
echo.
echo  🎂 Surprise Experience: http://localhost:5173
echo  ⚙️  Admin Dashboard:    http://localhost:5173/admin
echo ========================================================
echo.
echo Both server windows are open. DO NOT close them.
echo Close this window when you are done using the website.
echo.
start "" "http://localhost:5173"
pause
