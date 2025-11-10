# Netlify Deployment Guide for Blessed UMC Website

## Overview

This guide will help you deploy your church website to Netlify with full admin dashboard support. The application has been specifically configured to work in a serverless environment.

## Prerequisites

1. A Netlify account (free tier works fine)
2. A Neon PostgreSQL database account (free tier available)
3. Your GitHub repository pushed to GitHub

## Step 1: Set Up Neon Database

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project (e.g., "blessed-umc-db")
3. Copy your database connection string - it will look like:
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```
4. Keep this connection string safe - you'll need it for Netlify

## Step 2: Connect to Netlify

1. Go to [Netlify](https://netlify.com) and log in
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository: `blessed-umc-website`
5. Netlify should auto-detect the build settings from `netlify.toml`

## Step 3: Configure Environment Variables

In Netlify's site settings, go to **Environment Variables** and add:

### Required Variables

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | PostgreSQL database connection |
| `JWT_SECRET` | Generate a random string (32+ characters) | Used for secure JWT token authentication |

### How to Generate JWT_SECRET

Use one of these methods:

**Option 1 - Online Generator:**
```bash
# Visit: https://www.random.org/strings/
# Generate a 32-character alphanumeric string
```

**Option 2 - Command Line:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example JWT_SECRET (DO NOT USE THIS EXACT ONE):**
```
a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8
```

## Step 4: Deploy

1. After adding environment variables, click "Deploy site"
2. Netlify will build and deploy your site automatically
3. The build process takes about 2-3 minutes

## Step 5: Create Your First Admin User

**IMPORTANT:** For security, the default admin account (admin/admin123) is NOT created in production.

You need to manually create your first admin user in the database:

### Option A: Using Neon Console SQL Editor

1. Go to your Neon dashboard → SQL Editor
2. Run this SQL command (replace `your-secure-password` with a strong password):

```sql
INSERT INTO users (id, username, password)
VALUES (
  '1',
  'admin',
  '$2b$10$YourBcryptHashedPasswordHere'
);
```

To generate a bcrypt hash of your password:

```javascript
// Run this in Node.js or browser console:
const bcrypt = require('bcrypt');
const password = 'your-secure-password';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

### Option B: Temporary Admin Creation Script

1. Temporarily set `NODE_ENV=development` in Netlify environment variables
2. Redeploy the site (this creates the default admin/admin123)
3. Log in to admin dashboard at `https://yoursite.netlify.app/admin`
4. Create a new admin user with a strong password
5. Remove `NODE_ENV=development` from Netlify
6. Delete the default admin user from the database:

```sql
DELETE FROM users WHERE username = 'admin' AND id = '1';
```

7. Redeploy again to return to production mode

## Step 6: Test Your Deployment

1. Visit your site: `https://yoursite.netlify.app`
2. Test the public pages (Home, UMYF, etc.)
3. Go to admin dashboard: `https://yoursite.netlify.app/admin`
4. Log in with your admin credentials
5. Test all admin features:
   - Sermons management
   - Birthdays/Anniversaries
   - Contact messages
   - User management

## Troubleshooting

### "JWT_SECRET environment variable must be set in production"

**Cause:** You forgot to add JWT_SECRET to Netlify environment variables  
**Fix:** Add JWT_SECRET in Netlify's site settings → Environment Variables

### "Database connection failed"

**Cause:** DATABASE_URL is incorrect or database is unreachable  
**Fix:** 
1. Check that DATABASE_URL is correctly copied from Neon
2. Ensure it includes `?sslmode=require` at the end
3. Verify your Neon database is active (not hibernated)

### "Authentication required" when logging in

**Cause:** No admin user exists in database  
**Fix:** Follow Step 5 to create your first admin user

### Admin dashboard shows blank or 404

**Cause:** Serverless function not deploying correctly  
**Fix:**
1. Check Netlify function logs for errors
2. Ensure `netlify/functions/api.ts` is in your repository
3. Redeploy the site

## Production Checklist

- [ ] DATABASE_URL environment variable set
- [ ] JWT_SECRET environment variable set (32+ random characters)
- [ ] First admin user created in database
- [ ] Default admin (admin/admin123) deleted from database
- [ ] NODE_ENV not set (defaults to production)
- [ ] Site deploys successfully
- [ ] Public pages load correctly
- [ ] Admin login works
- [ ] Admin dashboard loads all sections
- [ ] Can create/edit sermons, birthdays, etc.

## Security Notes

1. **Never commit secrets**: Don't put JWT_SECRET or DATABASE_URL in your code
2. **Strong passwords**: Use a password manager to generate strong admin passwords
3. **HTTPS only**: Netlify provides free HTTPS - ensure it's enabled
4. **Regular updates**: Keep dependencies updated for security patches
5. **Database backups**: Enable Neon's automatic backup feature

## Custom Domain (Optional)

1. In Netlify, go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow instructions to point your domain's DNS to Netlify
4. Netlify will automatically provision an SSL certificate

## Support

If you encounter issues:

1. Check Netlify function logs: Site → Functions → View logs
2. Check browser console for frontend errors
3. Review this guide's troubleshooting section
4. Contact Netlify support if infrastructure issues persist

## Architecture Notes

### How Authentication Works in Production

- **Development**: Uses Express sessions (in-memory) for convenience
- **Production**: Uses stateless JWT tokens (serverless-compatible)
- **Login flow**: 
  1. User submits credentials
  2. Server validates and generates JWT token
  3. Frontend stores token in localStorage
  4. All subsequent requests include token in Authorization header
  5. Server validates token on each request

### Why JWT Instead of Sessions?

Serverless functions (like Netlify Functions) are stateless - they don't maintain memory between requests. Traditional session storage doesn't work in this environment. JWT tokens are self-contained and don't require server-side storage.

## Performance Tips

1. **Enable Netlify CDN**: Automatic global distribution
2. **Asset optimization**: Netlify automatically optimizes images
3. **Branch deploys**: Test changes on preview URLs before production
4. **Build caching**: Netlify caches dependencies to speed up builds

---

**Deployment Date**: November 10, 2025  
**Status**: ✅ Production Ready
