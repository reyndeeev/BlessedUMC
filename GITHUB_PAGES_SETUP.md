# GitHub Pages Setup Guide

Follow these steps to deploy your Blessed UMC website to GitHub Pages:

## Step 1: Make Repository Public
1. Go to your repository: https://github.com/vooooooooooooos/blessed-umc-website
2. Click **Settings** (top navigation)
3. Scroll to bottom → **"Danger Zone"**
4. Click **"Change repository visibility"**
5. Select **"Make public"**
6. Type the repository name to confirm
7. Click **"I understand, change repository visibility"**

## Step 2: Upload Your Files
Since git commands aren't working in Replit, upload your files manually:

1. **Download from Replit:**
   - Click three dots (⋯) in file panel
   - Select "Download as zip"
   - Extract the zip file

2. **Upload to GitHub:**
   - Go to your repository
   - Click "uploading an existing file"
   - Drag these folders/files:
     - `client/` folder
     - `server/` folder
     - `shared/` folder
     - `.github/` folder (important for deployment!)
     - `package.json`
     - `README.md`
     - All other files
   - Commit message: "Add Blessed UMC website files"
   - Click "Commit changes"

## Step 3: Enable GitHub Pages
1. In your repository, click **Settings**
2. Click **Pages** (left sidebar)
3. Under **Source**: Select **"GitHub Actions"**
4. The deploy.yml workflow will automatically run

## Step 4: Wait for Deployment
1. Go to **Actions** tab in your repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Wait for green checkmark (usually 2-3 minutes)
4. Your site will be live at: **https://vooooooooooooos.github.io/blessed-umc-website/**

## Alternative: Simple HTML Deployment
If the build process has issues, you can also:

1. Copy your built files from Replit's `dist/public` folder
2. Upload them directly to GitHub
3. Enable Pages with "Deploy from branch" → main → /docs

## Troubleshooting
- **Build fails**: Check the Actions tab for error details
- **Page not loading**: Make sure all files uploaded correctly
- **Styles missing**: Verify the .github/workflows/deploy.yml file was uploaded

## Custom Domain (Optional)
Once working, you can add your church's custom domain:
1. Settings → Pages
2. Add custom domain (e.g., blessedumc.org)
3. Configure DNS with your domain provider

## Benefits of GitHub Pages
✅ **Free hosting** for your church website
✅ **Automatic updates** when you push changes
✅ **Professional URL** you can share
✅ **Reliable hosting** with 99.9% uptime
✅ **Easy maintenance** through GitHub interface

Your church website will be live and accessible to everyone once these steps are complete!