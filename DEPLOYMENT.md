# Deployment Guide

This guide covers different ways to deploy your Blessed UMC website.

## Quick Deploy Options

### Option 1: Replit Deployment (Recommended)
1. In your Replit workspace, click the "Deploy" button
2. Choose "Autoscale Deployment" for automatic scaling
3. Configure your domain (optional)
4. Click "Deploy"
5. Your site will be live at `yourproject.replit.app`

### Option 2: Vercel (Free Tier Available)
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Set environment variables in Vercel dashboard
6. Deploy!

### Option 3: Netlify (Free Tier Available)
1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Set environment variables in Netlify dashboard
7. Deploy!

## Database Setup

### For Production Deployment
You'll need a PostgreSQL database. Here are some options:

#### Free Options:
- **Neon** (recommended): Free PostgreSQL with generous limits
- **Supabase**: Free tier with 500MB database
- **Railway**: Free tier with PostgreSQL

#### Paid Options:
- **PlanetScale**: MySQL-compatible with great performance
- **AWS RDS**: Enterprise-grade database
- **Google Cloud SQL**: Managed PostgreSQL

### Environment Variables Setup

For any deployment platform, you'll need to set these environment variables:

```
DATABASE_URL=your_postgresql_connection_string
VITE_API_URL=your_deployed_api_url
```

## Step-by-Step: GitHub + Vercel Deployment

### 1. Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Blessed UMC website"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/blessed-umc-website.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `VITE_API_URL`: Will be your Vercel URL + `/api`
6. Click "Deploy"

### 3. Set up Database
1. Sign up for [Neon](https://neon.tech) (free)
2. Create a new project
3. Copy the connection string
4. Add it to Vercel environment variables as `DATABASE_URL`
5. Redeploy your project

## Custom Domain Setup

### On Vercel:
1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### On Netlify:
1. Go to "Domain settings"
2. Add custom domain
3. Configure DNS with your domain provider

## Performance Optimizations

### Before Deploying:
1. Optimize images and compress assets
2. Enable gzip compression
3. Set up proper caching headers
4. Test on multiple devices and browsers

### After Deploying:
1. Set up monitoring (Vercel Analytics, Google Analytics)
2. Configure CDN for faster global loading
3. Set up SSL certificate (automatic on most platforms)
4. Monitor performance with tools like Lighthouse

## Troubleshooting

### Common Issues:
1. **Build fails**: Check node version and dependencies
2. **Database connection**: Verify DATABASE_URL format
3. **API calls fail**: Check VITE_API_URL configuration
4. **Images not loading**: Ensure proper asset handling

### Getting Help:
- Check deployment platform documentation
- Review build logs for specific errors
- Test locally with production build: `npm run build && npm run preview`

## Maintenance

### Regular Updates:
1. Keep dependencies updated
2. Monitor for security vulnerabilities
3. Backup database regularly
4. Update content and events regularly

### Content Updates:
- Church events and announcements
- UMYF activities and schedules
- Ministry information
- Contact details and leadership changes