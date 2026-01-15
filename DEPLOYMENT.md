# GitHub Pages Deployment Guide

## Prerequisites

1. Push your code to a GitHub repository
2. Enable GitHub Pages in your repository settings

## Step 1: Add Firebase Secrets to GitHub

Since your `.env` file contains sensitive Firebase credentials, you need to add them as GitHub Secrets:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of these:

   - `VITE_FIREBASE_API_KEY` = Your Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN` = Your Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID` = Your Firebase project ID
   - `VITE_FIREBASE_STORAGE_BUCKET` = Your Firebase storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = Your Firebase messaging sender ID
   - `VITE_FIREBASE_APP_ID` = Your Firebase app ID

   You can copy these values from your local `.env` file.

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Deploy from a branch**: `gh-pages` (if using manual deployment)
   - **OR** **GitHub Actions** (if using the workflow - recommended)
4. Save the settings

## Step 3: Deploy

### Automatic Deployment (Recommended)

The GitHub Actions workflow will automatically deploy when you push to the `main` branch:

1. Make sure your code is on the `main` branch
2. Push your code:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. Go to **Actions** tab in your repository
4. Watch the workflow run - it will build and deploy automatically
5. Once complete, your site will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
npm install -D gh-pages
npm run build
npx gh-pages -d dist
```

## Step 4: Update Firebase Allowed Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your GitHub Pages domain: `YOUR_USERNAME.github.io`

## Troubleshooting

- **404 errors**: Make sure you're using HashRouter (already configured)
- **Firebase errors**: Check that all secrets are added correctly
- **Build fails**: Check the Actions tab for error messages
- **Site not updating**: Wait a few minutes for GitHub Pages to propagate changes
