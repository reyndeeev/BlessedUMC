#!/usr/bin/env node

// Simple build script for Netlify deployment
// This ensures all required dependencies are available during build

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting Netlify build process...');

try {
  // Build the frontend
  console.log('Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build the backend for serverless functions
  console.log('Building backend with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  // Check if files were created
  const publicDir = path.join(__dirname, 'dist', 'public');
  const serverFile = path.join(__dirname, 'dist', 'index.js');
  
  if (fs.existsSync(publicDir) && fs.existsSync(serverFile)) {
    console.log('✅ Build completed successfully!');
    console.log('📁 Frontend files:', fs.readdirSync(publicDir));
    console.log('📄 Server file size:', fs.statSync(serverFile).size + ' bytes');
  } else {
    throw new Error('Build files not found');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}