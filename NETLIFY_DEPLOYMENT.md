# Netlify Deployment Guide for Blessed UMC Website

## Quick Deploy Steps

### Option 1: Direct File Upload (Simplest)
1. Run `npm run build` to create the production build
2. Upload the `dist/public` folder contents to Netlify via drag-and-drop
3. The contact form won't work with this method (static files only)

### Option 2: Git Repository Deploy (Recommended)
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Netlify:
   - Go to [netlify.com](https://netlify.com) and sign up/log in
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider and select your repository
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Base directory**: (leave blank)
4. Click "Deploy site"

## Configuration Files Created

The following files have been added to make your site Netlify-ready:

### `netlify.toml`
Main configuration file with build settings and redirects

### `build-for-netlify.js`
Custom build script that ensures all dependencies are available during Netlify build

### `_redirects`
Fallback file for Single Page Application routing

### `_headers`
Security headers for better website protection

### `netlify/functions/api.js`
Simplified serverless function for contact form API (works with Git deployment)

### `.env.example`
Template for environment variables

## Important Notes

- **Contact Form**: Only works with Git-based deployment (Option 2)
- **Static Deployment**: If using file upload (Option 1), contact form will not function
- **Environment Variables**: Add any needed variables in Netlify dashboard under Site settings → Environment variables
- **Custom Domain**: Can be configured in Netlify dashboard under Domain management

## Build Process

Your website builds in two parts:
1. **Frontend**: React app compiled to static files (`dist/public/`)
2. **API**: Express server bundled for serverless functions (`dist/index.js`)

## Security Features

- XSS Protection enabled
- Content Security headers configured
- Frame options set to prevent clickjacking
- Cache optimization for static assets

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (requires Node 18+)

### Contact Form Not Working
- Ensure you're using Git deployment, not file upload
- Check serverless function logs in Netlify dashboard
- Verify API routes are properly configured

### Images Not Loading
- Check that image paths are correct in the code
- Ensure images are in the `attached_assets` folder
- Verify Vite asset handling configuration

## Performance Optimization

✅ **Already Implemented:**
- Asset minification and compression
- Image optimization through Vite
- CSS bundling and tree-shaking
- JavaScript code splitting
- Cache headers for static assets

Your website is now ready for deployment to Netlify! 🚀