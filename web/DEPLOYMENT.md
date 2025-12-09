# Deployment Guide

This guide will help you deploy your Voluntry web app to share with clients.

## 🚀 Option 1: Vercel (Recommended - Easiest & Free)

Vercel is the easiest way to deploy React/Vite apps with zero configuration.

### Steps:

1. **Install Vercel CLI** (optional, or use web interface):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from web folder**:
   ```bash
   cd web
   vercel
   ```
   
   Or use the web interface:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `web`
   - Add environment variable: `VITE_API_URL` = your backend API URL
   - Click "Deploy"

3. **Set Environment Variables**:
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Redeploy after adding variables

4. **Your app will be live at**: `https://your-project.vercel.app`

---

## 🌐 Option 2: Netlify (Also Easy & Free)

### Steps:

1. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   cd web
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```
   
   Or use the web interface:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Base directory: `web`
     - Build command: `npm run build`
     - Publish directory: `web/dist`
   - Add environment variable: `VITE_API_URL`
   - Click "Deploy site"

4. **Your app will be live at**: `https://your-project.netlify.app`

---

## 📦 Option 3: GitHub Pages

### Steps:

1. **Update vite.config.js** (if deploying to subdirectory):
   ```javascript
   base: '/your-repo-name/',  // Change this to your GitHub repo name
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your GitHub repository
   - Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on push to main

4. **Set Environment Variables** (if needed):
   - Repository Settings → Secrets and variables → Actions
   - Add: `VITE_API_URL` = your backend API URL

5. **Your app will be live at**: `https://your-username.github.io/your-repo-name/`

---

## 🔧 Environment Variables

Make sure to set your backend API URL:

- **Development**: `http://localhost:4000/api`
- **Production**: `https://your-backend-domain.com/api`

### For Vercel/Netlify:
Add in their dashboard under Environment Variables.

### For GitHub Pages:
Add as GitHub Secret: `VITE_API_URL`

---

## 📝 Important Notes

1. **Backend must be deployed**: Your backend API must be accessible from the internet (not localhost).

2. **CORS Configuration**: Make sure your backend allows requests from your frontend domain.

3. **Environment Variables**: Always set `VITE_API_URL` to your production backend URL.

4. **Custom Domain**: All platforms support custom domains (check their documentation).

---

## 🎯 Quick Deploy Commands

### Vercel:
```bash
cd web
vercel --prod
```

### Netlify:
```bash
cd web
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages:
Just push to main branch, GitHub Actions will handle it automatically.

---

## ✅ After Deployment

1. Test your live URL
2. Share the link with your clients
3. Monitor for any errors
4. Update environment variables if backend URL changes

---

## 🆘 Troubleshooting

- **404 errors on routes**: Make sure your hosting platform is configured for SPA routing (rewrites to index.html)
- **API errors**: Check that `VITE_API_URL` is set correctly
- **Build fails**: Check that all dependencies are in package.json

