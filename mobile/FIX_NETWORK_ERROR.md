# 🔧 Fix Network Error on Mobile

## Quick Fix (Automatic)

If you see a network error, your IP address might have changed. Run this command:

```bash
cd mobile
npm run update-ip
```

This will:
1. ✅ Automatically detect your current IP address
2. ✅ Update `src/api.js` with the correct IP
3. ✅ Show you what changed

Then restart Expo:
```bash
npx expo start --clear
```

And reload the app on your phone.

---

## Manual Fix

If automatic detection doesn't work:

1. **Find your IP address:**
   - When you start the backend, it shows your IP:
     ```
     🌐 Network Access (Use these IPs in Mobile App):
       1. http://192.168.1.5:4000 (Ethernet) ⭐ PRIMARY
     ```

2. **Update `mobile/src/api.js`:**
   ```javascript
   const HARDCODED_IP = "192.168.1.5";  // Change this to your IP
   ```

3. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

---

## Verify It Works

Test from your phone's browser:
```
http://YOUR_IP:4000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

If this works but the app doesn't, the IP in `api.js` is wrong.

---

## Common Issues

### ❌ "Cannot reach server"
- **Fix:** Run `npm run update-ip` or check IP in `src/api.js`

### ❌ "Network error" 
- **Fix:** Make sure backend is running (`cd backend && npm start`)
- **Fix:** Check phone and PC are on same WiFi

### ❌ Firewall blocking
- **Fix:** Allow Node.js through Windows Firewall
- **Fix:** Temporarily disable firewall to test

---

## When IP Changes

Your IP can change when you:
- Reconnect to WiFi
- Switch networks
- Restart computer
- Change network adapter

**Just run `npm run update-ip` again!** 🚀

