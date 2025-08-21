# Netlify Build Fix - Final Solution

## Problem
Netlify still can't find `vite` even though we moved it to dependencies because the Git repository has the old package.json structure.

## Solution Applied
Updated `netlify.toml` to use `npx` which will find and run packages whether they're in dependencies or devDependencies:

```toml
[build]
  command = "npm install && npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  environment.NPM_FLAGS = "--include=dev"
```

## How This Fixes The Issue

1. **npm install**: Ensures all packages are installed
2. **npx vite build**: Uses npx to find and run vite (works with both dependencies and devDependencies)
3. **npx esbuild**: Uses npx to find and run esbuild
4. **NPM_FLAGS = "--include=dev"**: Forces npm to install devDependencies even in production

## Alternative Manual Fix
If you can edit your repository's package.json directly, move these packages from devDependencies to dependencies:
- vite
- esbuild
- typescript
- @vitejs/plugin-react
- tailwindcss
- postcss
- autoprefixer

## Expected Result
The build should now succeed on Netlify with the contact form functionality intact.