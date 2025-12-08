# 🔧 Quick Fix: Network Error

## Problem
App is trying to connect to wrong IP address.

## Solution

### Step 1: Check Your Current IP
When you start the backend server, it shows your IP:
```
🌐 Network Access (Use these IPs in Postman):
   1. http://192.168.1.4:4000 (Ethernet) ⭐ PRIMARY
```

### Step 2: Update Mobile App IP
Open `mobile/src/api.js` and find this line:
```javascript
const HARDCODED_IP = "192.168.1.3";
```

Change it to your actual IP:
```javascript
const HARDCODED_IP = "192.168.1.4";  // Use the IP shown when backend starts
```

### Step 3: Restart Expo
```bash
cd mobile
npx expo start --clear
```

### Step 4: Reload App
- Shake phone → Reload
- Or close and reopen Expo Go

## Verify It Works

Test from phone browser:
```
http://192.168.1.4:4000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## If IP Changes Again

Your IP can change when you:
- Reconnect to WiFi
- Switch networks  
- Restart computer

**Just update the IP in `mobile/src/api.js` and restart Expo.**

## Quick Checklist

- [ ] Backend is running (`npm start` in backend folder)
- [ ] Updated IP in `mobile/src/api.js` (line 9)
- [ ] Restarted Expo with `--clear` flag
- [ ] Reloaded app on phone
- [ ] Tested `http://YOUR_IP:4000/health` from phone browser

---

**Current IP:** Check backend startup message or run:
```bash
cd backend
node -e "import('os').then(os => { const nets = os.networkInterfaces(); for (const name of Object.keys(nets)) { for (const net of nets[name]) { if (net.family === 'IPv4' && !net.internal) { console.log(net.address); process.exit(0); } } } })"
```

