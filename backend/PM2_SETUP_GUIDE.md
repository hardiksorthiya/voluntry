# PM2 Setup Guide - Keep Server Running Forever

## ✅ Current Status

Your server is now running with PM2! The server will:
- ✅ **Auto-restart** if it crashes
- ✅ **Keep running** even if you close the terminal
- ✅ **Survive** system reboots (with Windows startup configured)

## 🚀 Quick Commands

### Start Server
```bash
npm run pm2:start
# OR
pm2 start ecosystem.config.cjs
```

### Check Status
```bash
npm run pm2:status
# OR
pm2 status
```

### View Logs
```bash
npm run pm2:logs
# OR
pm2 logs voluntry-backend
```

### Restart Server
```bash
npm run pm2:restart
# OR
pm2 restart voluntry-backend
```

### Stop Server
```bash
npm run pm2:stop
# OR
pm2 stop voluntry-backend
```

## 🔄 Auto-Start on Windows Boot

PM2 will keep your server running as long as you're logged in. For true boot-time startup (even before login), you have two options:

### Option 1: Task Scheduler (Recommended)

1. Open **Task Scheduler** (search in Windows Start menu)
2. Click **Create Basic Task**
3. Name it: `Voluntry Backend Server`
4. Trigger: **When the computer starts**
5. Action: **Start a program**
6. Program: `C:\Windows\System32\cmd.exe`
7. Arguments: `/c cd /d "D:\work\voluntree connector\voluntry\backend" && pm2 resurrect`
8. ✅ Check "Run whether user is logged on or not"
9. ✅ Check "Run with highest privileges"
10. Click **Finish**

### Option 2: Startup Folder (Simple)

1. Press `Win + R`, type `shell:startup`, press Enter
2. Create a shortcut to `start-server.bat` in this folder
3. The server will start when you log in

## 📊 Monitoring

### Real-time Monitoring
```bash
pm2 monit
```

### View Detailed Info
```bash
pm2 show voluntry-backend
```

### View Logs (Live)
```bash
pm2 logs voluntry-backend --lines 50
```

## 🔧 Troubleshooting

### Server Not Starting
```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs voluntry-backend --err

# Restart if needed
pm2 restart voluntry-backend
```

### MySQL Connection Issues
- Make sure MySQL service is running
- Check `.env` file has correct database credentials
- Verify database `voluntry` exists

### Port Already in Use
```bash
# Find what's using port 4000
netstat -ano | findstr :4000

# Kill the process if needed, then restart
pm2 restart voluntry-backend
```

## 📝 Important Notes

1. **PM2 keeps running**: The server will stay running even if you close the terminal
2. **Auto-restart**: If the server crashes, PM2 will automatically restart it
3. **Logs location**: Check `backend/logs/` folder for log files
4. **MySQL connection**: The server will automatically reconnect to MySQL if the connection drops

## 🎯 Your Server is Now Running!

Your server should be accessible at:
- **Local**: http://localhost:4000
- **Network**: http://192.168.1.9:4000 (your IP may differ)

Test it: http://localhost:4000/health

---

**Need Help?** Check PM2 logs: `pm2 logs voluntry-backend`

