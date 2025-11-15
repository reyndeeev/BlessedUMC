# Supabase + Netlify Deployment Guide

## Overview
This guide explains how to deploy the Blessed UMC website to Netlify with Supabase PostgreSQL database.

## Prerequisites
- Netlify account
- Supabase account with database created
- GitHub repository (for automatic deployments)

## Database Setup

### 1. Supabase Connection String
Your Supabase database is already configured with the connection string:
```
postgresql://postgres:09662301181Dan@db.rmjcxieniztdwgzbsjzh.supabase.co:5432/postgres
```

### 2. Database Schema
The database schema has been successfully migrated to Supabase. The following tables are created:
- `users` - Admin users for dashboard access
- `contact_messages` - Contact form submissions
- `sermons` - Sermon management
- `birthdays` - Birthday tracking
- `anniversaries` - Anniversary tracking

### 3. Default Admin User
A default admin user has been created:
- **Username**: `admin`
- **Password**: `admin123`
- **⚠️ IMPORTANT**: Change this password in production for security!

## Netlify Environment Variables

In your Netlify site settings, configure these environment variables:

### Required Variables
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:09662301181Dan@db.rmjcxieniztdwgzbsjzh.supabase.co:5432/postgres
JWT_SECRET=your-secure-random-secret-here-min-32-characters
```

### Optional Variables
```
SESSION_SECRET=another-secure-random-secret-here
```

### How to Generate Secure Secrets
For `JWT_SECRET` and `SESSION_SECRET`, generate random strings:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use any secure password generator
# Make sure it's at least 32 characters long
```

## Netlify Deployment Steps

### 1. Connect Repository to Netlify
1. Log in to Netlify
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`

### 2. Configure Environment Variables
1. Go to Site settings → Environment variables
2. Add all the required variables listed above
3. Make sure to generate secure secrets for JWT_SECRET

### 3. Deploy
1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at `https://your-site-name.netlify.app`

## Testing Your Deployment

### 1. Test the Website
Visit your Netlify URL and verify:
- Homepage loads correctly
- All sections are visible
- Contact form works

### 2. Test Admin Dashboard
1. Navigate to `/bumcdashboard`
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. Verify you can see:
   - Dashboard overview
   - Contact messages
   - Users management
   - Analytics

### 3. Test Authentication Security
Try logging in with wrong credentials to ensure they're rejected.

## Security Recommendations

### 1. Change Default Admin Password
**CRITICAL**: The default admin password is public in this documentation. Change it immediately:

1. Log in to the dashboard
2. Go to Users section
3. Create a new admin user with a strong password
4. Delete the default admin user

### 2. Rotate Secrets Regularly
- Change `JWT_SECRET` periodically (this will invalidate all existing sessions)
- Keep secrets secure and never commit them to Git

### 3. Monitor Database Access
- Review Supabase logs regularly
- Set up alerts for unusual activity

## Troubleshooting

### "Failed to load messages" Error
**Cause**: Database connection not configured or failing

**Solutions**:
1. Verify `DATABASE_URL` is set correctly in Netlify environment variables
2. Check Supabase database is running and accessible
3. Review Netlify function logs for detailed error messages

### Authentication Not Working
**Cause**: JWT_SECRET not configured or MemStorage fallback

**Solutions**:
1. Ensure `JWT_SECRET` is set in Netlify environment variables
2. Verify `NODE_ENV=production` is set
3. Check Netlify function logs for initialization messages

### Database Connection Timeout
**Cause**: Supabase connection pool exhausted or network issues

**Solutions**:
1. Check Supabase dashboard for connection limits
2. Verify the connection string is correct
3. Consider upgrading Supabase plan if hitting limits

## Database Management

### Adding New Admin Users
You can add admin users through the dashboard or programmatically:

```javascript
// Using the API (requires authentication)
POST /api/users
{
  "username": "newadmin",
  "password": "secure-password-here"
}
```

### Viewing Contact Messages
Contact form submissions are automatically saved to the database and visible in the dashboard under "Messages".

### Backing Up Data
Supabase provides automatic backups. You can also:
1. Export data from Supabase dashboard
2. Use `pg_dump` to create manual backups
3. Set up automated backup scripts

## Performance Optimization

### Connection Pooling
The app uses PostgreSQL connection pooling with these settings:
- Max connections: 10
- Idle timeout: 30 seconds
- Connection timeout: 10 seconds

These are optimized for Netlify's serverless functions.

### Caching
- Static assets are cached by Netlify CDN
- API responses use appropriate cache headers
- Consider enabling Netlify's edge functions for better performance

## Monitoring

### Netlify Logs
- Function logs: Check for database errors or authentication issues
- Deploy logs: Verify build completed successfully
- Analytics: Monitor site traffic and performance

### Supabase Monitoring
- Check database performance metrics
- Monitor query performance
- Review connection pool usage

## Support

If you encounter issues:
1. Check Netlify function logs for detailed error messages
2. Review Supabase logs for database errors
3. Verify all environment variables are set correctly
4. Ensure the database schema is up to date

## Summary

Your application is now configured to:
- ✅ Use Supabase PostgreSQL database (not in-memory storage)
- ✅ Enforce proper authentication (reject invalid credentials)
- ✅ Store contact messages in the database
- ✅ Work with Netlify serverless functions
- ✅ Support secure JWT-based authentication

The dashboard authentication has been fixed and will only accept valid credentials from the database.
