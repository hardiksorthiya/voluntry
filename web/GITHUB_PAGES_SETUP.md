# 📦 GitHub Pages Deployment Guide

Follow these steps to deploy your web app to GitHub Pages.

## Step 1: Update Base Path in vite.config.js

**Important**: You need to set the base path to match your GitHub repository name.

### Option A: If your repo is at root (e.g., `username.github.io`)
```javascript
base: '/',
```

### Option B: If your repo is a project (e.g., `username/voluntry`)
```javascript
base: '/voluntry/',  // Replace 'voluntry' with your actual repo name
```

**To find your repo name:**
- Go to your GitHub repository
- Look at the URL: `https://github.com/username/REPO-NAME`
- Use `REPO-NAME` in the base path

---

## Step 2: Push Code to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

---

## Step 3: Enable GitHub Pages

1. Go to your GitHub repository on GitHub.com
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select: **GitHub Actions**
5. Save (the page will refresh)

---

## Step 4: Set Environment Variable (Optional)

If your backend API URL is different from `http://localhost:4000/api`:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `VITE_API_URL`
5. Value: Your backend API URL (e.g., `https://your-backend.herokuapp.com/api`)
6. Click **Add secret**

---

## Step 5: Trigger Deployment

The GitHub Actions workflow will automatically run when you:
- Push to `main` or `master` branch
- Make changes to files in the `web/` folder

**To manually trigger:**
1. Make a small change in `web/` folder (or just push again)
2. Go to **Actions** tab in your GitHub repository
3. You'll see the workflow running
4. Wait for it to complete (usually 2-3 minutes)

---

## Step 6: Access Your Live Site

Once deployment completes, your site will be available at:

**If repo is at root:**
- `https://your-username.github.io`

**If repo is a project:**
- `https://your-username.github.io/your-repo-name/`

---

## ✅ Verify Deployment

1. Check the **Actions** tab - should show ✅ green checkmark
2. Visit your GitHub Pages URL
3. Test login/signup functionality
4. Share the link with your clients! 🎉

---

## 🔧 Troubleshooting

### Build fails?
- Check the **Actions** tab for error messages
- Make sure `package-lock.json` exists in `web/` folder
- Verify Node.js version in workflow (currently set to 18)

### 404 errors on routes?
- Make sure `base` path in `vite.config.js` matches your repo name
- Check that the base path starts and ends with `/`

### API not working?
- Verify `VITE_API_URL` secret is set correctly
- Make sure your backend allows CORS from your GitHub Pages domain
- Check browser console for API errors

### Site not updating?
- Wait 2-3 minutes after push
- Check Actions tab to see if workflow ran
- Clear browser cache and try again

---

## 📝 Important Notes

1. **First deployment** may take 3-5 minutes
2. **Subsequent deployments** are faster (1-2 minutes)
3. **Automatic**: Every push to main/master will trigger deployment
4. **Free**: GitHub Pages is completely free
5. **Custom Domain**: You can add a custom domain in Settings → Pages

---

## 🎯 Quick Checklist

- [ ] Updated `vite.config.js` base path
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled (Settings → Pages → GitHub Actions)
- [ ] Environment variable set (if needed)
- [ ] Workflow ran successfully (check Actions tab)
- [ ] Site accessible at GitHub Pages URL
- [ ] Tested login/signup functionality

---

## 🆘 Need Help?

- Check GitHub Actions logs in the **Actions** tab
- Verify all steps above are completed
- Make sure your backend is deployed and accessible

