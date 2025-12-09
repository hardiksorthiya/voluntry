# 🚀 Deploy to Vercel (Easiest Way - 5 Minutes)

Vercel is MUCH easier than GitHub Pages. No complex setup needed!

## Step 1: Sign Up
1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Sign up with **GitHub** (one click)

## Step 2: Deploy
1. Click **"Add New Project"**
2. **Import** your GitHub repository: `hardiksorthiya/voluntry`
3. Configure:
   - **Root Directory**: `web` (click "Edit" and type `web`)
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
4. **Environment Variables**:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - (Or leave default for now: `http://localhost:4000/api`)
5. Click **"Deploy"**

## Step 3: Done! 🎉
- Wait 1-2 minutes
- Your site will be live at: `https://voluntry-xxxxx.vercel.app`
- You'll get a **custom URL** automatically!

## Step 4: Share Your Link
- Copy the Vercel URL
- Share with your clients
- It's that simple!

---

## ✅ Advantages Over GitHub Pages:
- ✅ **No complex setup** - Just connect GitHub and deploy
- ✅ **Automatic HTTPS** - Free SSL certificate
- ✅ **Custom domain** - Easy to add
- ✅ **Automatic deployments** - Every push to GitHub
- ✅ **Works immediately** - No routing issues
- ✅ **Better performance** - CDN included

---

## 🔄 Update Your Site
Every time you push to GitHub, Vercel automatically redeploys!

---

## 📝 Need Help?
- Vercel dashboard shows deployment status
- Check logs if something goes wrong
- Much easier than GitHub Pages!

