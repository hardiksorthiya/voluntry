# GitHub Pages Deployment Checklist

## ✅ Step-by-Step Setup

### 1. Enable GitHub Pages in Repository Settings

1. Go to: https://github.com/hardiksorthiya/voluntry
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select: **GitHub Actions**
5. Click **Save**

**Important**: If you see "Deploy from a branch", change it to "GitHub Actions"

---

### 2. Verify Workflow File Exists

Make sure `.github/workflows/ploy-gh-pages.yml` exists and is committed.

---

### 3. Push Code to Trigger Deployment

```bash
git add .
git commit -m "Setup GitHub Pages"
git push origin main
```

---

### 4. Check Workflow Status

1. Go to your repository: https://github.com/hardiksorthiya/voluntry
2. Click **Actions** tab
3. You should see "build & deploy to gh-pages" workflow
4. Click on it to see if it's running/completed
5. Wait for it to finish (green checkmark ✅)

---

### 5. Verify Deployment

After the workflow completes:

1. Go back to **Settings** → **Pages**
2. You should see: "Your site is live at https://hardiksorthiya.github.io/voluntry/"
3. Wait 1-2 minutes for DNS propagation
4. Visit: https://hardiksorthiya.github.io/voluntry/

---

## 🔍 Troubleshooting

### If workflow fails:
- Check the **Actions** tab for error messages
- Make sure all files are committed and pushed
- Verify Node.js version is 20 in the workflow

### If "There isn't a GitHub Pages site here":
- **Check 1**: Is GitHub Pages enabled? (Settings → Pages → Source: GitHub Actions)
- **Check 2**: Did the workflow run? (Actions tab)
- **Check 3**: Did the workflow succeed? (Green checkmark)
- **Check 4**: Wait 2-3 minutes after workflow completes
- **Check 5**: Clear browser cache and try again

### If workflow shows permission errors:
- Go to Settings → Actions → General
- Under "Workflow permissions", select "Read and write permissions"
- Save and re-run the workflow

---

## 📝 Quick Fix Commands

If you need to trigger deployment manually:

```bash
# Make a small change to trigger workflow
echo "" >> web/README.md
git add .
git commit -m "Trigger deployment"
git push origin main
```

Then check the Actions tab!

