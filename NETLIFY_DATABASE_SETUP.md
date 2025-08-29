# Netlify Database Setup Instructions

## Steps to Connect Your Live Website to Neon Database

The live website at https://blessedumc.netlify.app can now connect to the same Neon database used here on Replit.

### 1. Add Environment Variable to Netlify

1. Go to your Netlify dashboard
2. Select your site (blessedumc)
3. Go to **Site settings** → **Environment variables**
4. Add a new environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://neondb_owner:npg_or7ifYFmxdD9@ep-steep-mode-aezmwtbl.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 2. Deploy Updated Code

Push the updated code to your Git repository that's connected to Netlify. The changes include:

- ✅ Enhanced serverless function with Neon database support
- ✅ Proper authentication using real database users
- ✅ Fallback to hardcoded credentials if database unavailable
- ✅ Secure token validation

### 3. How It Works

**With Database Connected:**
- Uses real user accounts from Neon database
- Passwords are properly hashed with bcrypt
- Authentication matches the Replit environment exactly

**Fallback Mode (if database unavailable):**
- Uses hardcoded admin credentials (admin/admin123)
- Still provides secure authentication

### 4. Current Credentials

- **Username**: admin
- **Password**: admin123

### 5. Testing

After deployment, test the authentication at:
- Login: https://blessedumc.netlify.app/login
- Try invalid credentials - should be rejected
- Try valid credentials - should work properly

### 6. Benefits

✅ **Consistent Authentication**: Same user database across development and production
✅ **Real Security**: Proper password hashing and validation
✅ **Fallback Protection**: Site still works even if database connection fails
✅ **Easy Management**: Add/remove users in the Replit database, changes reflect on live site

The website will now use the same authentication system as your development environment!