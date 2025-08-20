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

### Bug Fix - JSX Syntax Error in UMYFheader (August 20, 2025)
- **Issue**: Application failed to start due to JSX syntax errors in `client/src/components/UMYFheader.tsx`
- **Root Cause**: Duplicated JSX elements and missing closing parenthesis for conditional rendering
- **Solution**: Removed duplicate JSX code and properly closed the conditional mobile menu dropdown
- **Status**: Application now starts successfully and runs without errors