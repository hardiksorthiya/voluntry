# 🚀 Quick Deploy Guide

## Easiest Way: Vercel (5 minutes)

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Click**: "New Project"
4. **Import** your GitHub repository
5. **Configure**:
   - Root Directory: `web`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com/api`
7. **Click**: "Deploy"
8. **Done!** Your app is live at `https://your-project.vercel.app`

---

## Alternative: Netlify (5 minutes)

1. **Go to**: https://netlify.com
2. **Sign up** with GitHub
3. **Click**: "Add new site" → "Import an existing project"
4. **Connect** your GitHub repository
5. **Configure**:
   - Base directory: `web`
   - Build command: `npm run build`
   - Publish directory: `web/dist`
6. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com/api`
7. **Click**: "Deploy site"
8. **Done!** Your app is live at `https://your-project.netlify.app`

---

## Important Notes

- ✅ Both platforms are **FREE**
- ✅ **Automatic deployments** on every push to GitHub
- ✅ **Custom domains** supported
- ⚠️ Make sure your **backend is deployed** and accessible
- ⚠️ Set `VITE_API_URL` to your **production backend URL**

---

## Share Your Link

Once deployed, you'll get a URL like:
- `https://voluntry-app.vercel.app` (Vercel)
- `https://voluntry-app.netlify.app` (Netlify)

Share this link with your clients! 🎉

