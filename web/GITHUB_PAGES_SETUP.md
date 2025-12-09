# 📦 GitHub Pages Setup Guide

## ✅ Step-by-Step Instructions

### Step 1: Enable GitHub Pages

1. Go to: https://github.com/hardiksorthiya/voluntry
2. Click **Settings** (top menu)
3. Scroll to **Pages** (left sidebar)
4. Under **Source**, select: **GitHub Actions**
5. Click **Save**

---

### Step 2: Push Your Code

Make sure all your code is pushed to GitHub:

```bash
git add .
git commit -m "Setup GitHub Pages"
git push origin main
```

---

### Step 3: Check Workflow Status

1. Go to **Actions** tab in your repository
2. You should see "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (green checkmark ✅)
4. Usually takes 2-3 minutes

---

### Step 4: Access Your Site

After workflow completes, your site will be live at:

**https://hardiksorthiya.github.io/voluntry/**

Wait 1-2 minutes after workflow completes for DNS propagation.

---

## 🔧 Configuration

- **Base Path**: `/voluntry/` (configured in `vite.config.js`)
- **Build Output**: `web/dist`
- **Workflow**: `.github/workflows/gh-pages.yml`

---

## 🆘 Troubleshooting

### If "There isn't a GitHub Pages site here":
1. Check Settings → Pages → Source = **GitHub Actions**
2. Check Actions tab - workflow must complete successfully
3. Wait 2-3 minutes after workflow completes

### If pages show blank:
1. Check browser console for errors
2. Verify base path is `/voluntry/` in `vite.config.js`
3. Make sure `BrowserRouter` has `basename={basename}` in `main.jsx`

### If workflow fails:
1. Check Actions tab for error messages
2. Verify Node.js version is 20
3. Make sure `package-lock.json` exists in `web/` folder

---

## ✅ Checklist

- [ ] GitHub Pages enabled (Settings → Pages → GitHub Actions)
- [ ] Code pushed to GitHub
- [ ] Workflow ran successfully (Actions tab)
- [ ] Site accessible at https://hardiksorthiya.github.io/voluntry/

---

## 🎯 That's It!

Your site should be live now. Every push to `main` branch will automatically redeploy!

