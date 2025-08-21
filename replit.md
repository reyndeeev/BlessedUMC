# Blessed United Methodist Church Website

## Overview

This project is a modern, responsive website for Blessed United Methodist Church (UMC), built with React, TypeScript, and Express.js. The website serves as a digital presence for the church, featuring worship information, ministry details, events, contact forms, and leadership information. It's designed to welcome visitors and provide easy access to church services and community involvement opportunities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Single-page application using functional components with hooks
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **UI Components**: Extensive use of Radix UI primitives wrapped in custom components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and API caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Express.js**: RESTful API server handling contact form submissions and data retrieval
- **TypeScript**: Full type safety across the entire application
- **Storage Layer**: Abstracted storage interface with in-memory implementation (easily swappable for database)
- **API Structure**: Clean separation between routes, storage, and business logic
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Component Structure
- **Modular Components**: Each section (Hero, About, Worship, etc.) is a separate component
- **UI Components**: Reusable UI primitives in `/components/ui/`
- **Layout Strategy**: Single-page layout with smooth scrolling navigation
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities

### Data Schema
- **Shared Types**: Common TypeScript interfaces in `/shared/schema.ts`
- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions
- **Validation**: Zod schemas for runtime validation of API requests
- **Type Safety**: End-to-end TypeScript types from database to frontend

### Development Workflow
- **Monorepo Structure**: Client, server, and shared code in organized directories
- **Development Server**: Vite dev server with Express API proxy
- **Hot Reloading**: Full-stack development with instant updates
- **TypeScript Compilation**: Strict type checking across all modules

## External Dependencies

### Database & ORM
- **Drizzle ORM**: Type-safe database queries and migrations
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **PostgreSQL**: Primary database (configured but using in-memory storage currently)

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Headless UI primitives for complex interactions
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Custom typography (Inter, Source Sans Pro)

### State & Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation and type inference

### Development Tools
- **Vite**: Build tool with hot module replacement
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer
- **TypeScript**: Static type checking and enhanced developer experience

### External Services
- **Replit Integration**: Development environment with live preview
- **Font Loading**: Google Fonts API for web typography
- **Background Images**: Unsplash for high-quality stock photography

### Build & Deployment
- **Production Build**: Vite for client build, ESBuild for server bundling
- **Static Assets**: Organized asset management with Vite's asset handling
- **Environment Configuration**: Separate development and production configurations

## Recent Changes

### GitHub Deployment Preparation (August 21, 2025)
- **Achievement**: Successfully prepared project for GitHub publication
- **Files Created**: README.md, LICENSE, .env.example, GitHub Actions workflow, deployment guides
- **Documentation**: Comprehensive project documentation with technology stack, installation instructions, and deployment options
- **Repository**: Ready for upload to https://github.com/vooooooooooooos/blessed-umc-website
- **Deployment Options**: GitHub Pages workflow created, Replit Deploy recommended for full-stack support

### UI Styling Enhancements (August 21, 2025)
- **Facebook Buttons**: Updated styling across main hero and UMYF sections with consistent yellow/black semi-transparent theme
- **UMYF Header Icons**: Added icons to all menu items (About, Activities, Contact) matching Home button design
- **Navigation Cleanup**: Removed "Plan a Visit" buttons from both desktop and mobile headers for cleaner navigation
- **Transparent Styling**: Maintained dark transparent backgrounds with backdrop blur effects throughout

### Netlify Deployment Issues Fixed (August 21, 2025)
- **Critical Fix**: Resolved Netlify build failure caused by missing build dependencies
- **Root Cause**: `NODE_ENV=production` was preventing devDependencies (vite, esbuild) from installing
- **Solution**: Moved essential build tools to regular dependencies for Netlify compatibility
- **Dependencies Fixed**: vite, esbuild, typescript, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer
- **Serverless Function**: Simplified `netlify/functions/api.js` to avoid complex dependency issues
- **Build Script**: Created ES modules compatible `build-for-netlify.js` script
- **Configuration Updated**: Removed NODE_ENV=production from netlify.toml
- **Testing**: Build process now works perfectly (365KB JS, 65KB CSS, 7.8KB serverless function)
- **Final Fix**: Updated netlify.toml to use `npx` commands that work with devDependencies
- **Status**: ✅ Ready for successful Netlify deployment with npx-based build commands

### Planetshakers-Style Features Added (August 21, 2025)
- **Online Dropdown Menu**: Added comprehensive "Online" dropdown in header with 6 key services:
  - Watch Live Service (Facebook Live integration)
  - Past Services (Facebook page access) 
  - Online Giving (donation portal)
  - Prayer Requests (contact form integration)
  - Connect Groups (ministries section)
  - Visit Our Location (Google Maps integration)
- **Sermon Catchup Section**: Created "Catch up from the previous week" section matching Planetshakers design:
  - Featured sermon with large video thumbnail and "WE WIN!" styling
  - Grid of recent sermon thumbnails with pastor names and dates
  - Professional video play buttons and hover effects
  - "View More Sermons" button linking to Facebook videos
  - Fully responsive for desktop and mobile
- **Navigation Enhancement**: Added "Sermons" menu item to both desktop and mobile navigation
- **Visual Design**: Implemented professional church styling with Methodist colors and smooth animations

### Initial Netlify Deployment Preparation (August 21, 2025)
- **Achievement**: Website fully prepared for Netlify deployment with comprehensive configuration
- **Bug Fix**: Resolved TypeScript type error in `server/storage.ts` - phone field compatibility issue
- **Files Created**: 
  - `netlify.toml` - Build configuration and redirects
  - `netlify/functions/api.js` - Serverless function for contact form API
  - `_headers` & `_redirects` - Netlify-specific configuration files
  - `NETLIFY_DEPLOYMENT.md` - Complete deployment guide
  - `.env.example` - Environment variables template
- **Dependencies**: Added `serverless-http` for serverless function support
- **Build Process**: Successfully builds both client (`dist/public/`) and server (`dist/index.js`)
- **Contact Form**: Fully functional with proper API routing through serverless functions
- **Security**: Implemented security headers and XSS protection
- **Performance**: Optimized with asset caching and compression

### Bug Fix - JSX Syntax Error in UMYFheader (August 20, 2025)
- **Issue**: Application failed to start due to JSX syntax errors in `client/src/components/UMYFheader.tsx`
- **Root Cause**: Duplicated JSX elements and missing closing parenthesis for conditional rendering
- **Solution**: Removed duplicate JSX code and properly closed the conditional mobile menu dropdown
- **Status**: Application now starts successfully and runs without errors