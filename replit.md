# Replit.md - Vaani Learning Platform

## Overview

Vaani is a comprehensive online learning platform designed specifically for Nepalese students preparing for government examinations like Lok Sewa Aayog, CEE (Medical), and IOE (Engineering). The platform provides video classes, study notes, mock tests, and 24x7 doubt support. This is a full-stack web application built with a modern tech stack featuring React frontend, Express backend, and PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom Vaani branding (orange/red color scheme)
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: TSX for TypeScript execution in development
- **Production Build**: ESBuild for server-side bundling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon database)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Validation**: Drizzle-Zod integration for runtime validation

## Key Components

### Authentication System
- User registration and login functionality
- Schema defined for users table with username/password fields
- Session management infrastructure prepared (using connect-pg-simple)

### Educational Content Management
- Course catalog with detailed course information
- Study notes system (10,000+ notes mentioned)
- Mock test and quiz functionality
- Video class delivery system

### User Interface Components
- Responsive navigation with mobile menu
- Hero section with instructor imagery
- Feature cards highlighting platform benefits
- Statistics section showing platform metrics
- Exam category organization (CEE, IOE, Lok Sewa, Languages, Board, License)
- Course listing and detail pages

### Admin Panel
- Content management system for courses, notes, and quizzes
- User and instructor management
- Website CMS for managing hero section, stats, testimonials
- Reports and analytics dashboard

## Data Flow

### Client-Server Communication
- RESTful API architecture with `/api` prefix for all backend routes
- JSON-based request/response format
- TanStack React Query for caching and synchronization
- Error handling with custom error boundaries

### Database Operations
- Storage abstraction layer with IStorage interface
- Memory storage implementation for development
- Database storage implementation using Drizzle ORM
- Type-safe operations with shared schema definitions

### Asset Management
- Static asset serving through Express
- Vite dev server integration for development
- Build-time asset optimization

## External Dependencies

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Custom fonts (Inter) for typography

### Development Tools
- TypeScript for type safety
- ESLint and Prettier for code quality
- Vite for development server and building
- Replit-specific development plugins

### Database and ORM
- Neon serverless PostgreSQL
- Drizzle ORM with PostgreSQL dialect
- Connection pooling and query optimization

## Deployment Strategy

### Development Environment
- Replit-based development with hot reload
- Vite dev server with HMR (Hot Module Replacement)
- PostgreSQL module integration
- Port 5000 for local development

### Production Deployment
- Build process: `npm run build` (Vite + ESBuild)
- Start command: `npm run start` with production Node.js
- Autoscale deployment target on Replit
- Environment variable configuration for database URL

### Database Management
- Drizzle migrations stored in `/migrations` directory
- Schema changes managed through `drizzle-kit push`
- Database URL configuration through environment variables

## Recent Changes
- June 27, 2025: Initial setup with complete landing page and admin dashboard
- June 27, 2025: Created Course Landing Page with tabbed content (Curriculum, Description, Instructor, Reviews)
- June 27, 2025: Updated terminology from "Categories" to "Goals" throughout exam selection section
- June 27, 2025: Built comprehensive Course Upload Form in Admin Dashboard with 12 fields including pricing preview

## User Preferences
```
Preferred communication style: Simple, everyday language.
```