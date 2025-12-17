@echo off
REM PM2 Server Startup Script for Windows
REM This script starts the Voluntry backend server using PM2

cd /d "%~dp0"
echo Starting Voluntry Backend Server...
pm2 start ecosystem.config.cjs
pm2 save
echo.
echo Server started! Use 'pm2 status' to check status.
echo Use 'pm2 logs voluntry-backend' to view logs.
pause

