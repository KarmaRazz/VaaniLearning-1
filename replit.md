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
- January 10, 2025: Added third step to course upload form with dynamic curriculum builder (Subject → Chapter → Lesson hierarchy)
- January 10, 2025: Implemented complete /notes page with goal/subject dropdowns and note card grid layout
- January 10, 2025: Enhanced Notes page with collapsible sections - replaced Download with View buttons, added expandable content for chapters, formulas, and previous year questions with mock data
- January 13, 2025: Added Notes and Formulas sections to homepage with reusable NoteCard and FormulaCard components, featuring structured props for easy API integration
- January 14, 2025: Completely rebuilt Notes Page with new UI structure: goal filter buttons, search bar, horizontally scrollable subject tabs, Notes/Formulas toggle, and modular NotesPageCard component with structured data for database integration
- January 14, 2025: Created centralized data source with 20 notes and 18 formulas/derivations, updated homepage to fetch from shared data instead of hardcoded content, implemented reusable card system for easy API integration
- January 17, 2025: Enhanced homepage with horizontal scrollable views for Notes and Formulas sections (12 cards each), added navigation buttons linking to Notes page, implemented URL filter parameter support for direct formula access
- January 17, 2025: Integrated PostgreSQL database with Neon, implemented notes schema with API endpoints, seeded database with 38 notes and formulas, updated frontend to use React Query for data fetching from database instead of static data
- January 17, 2025: Enhanced Admin Dashboard with complete Notes management system including tabbed interface separating Notes from Formulas/Derivations, dynamic create buttons, filtered data display, and full CRUD operations with PostgreSQL backend
- January 18, 2025: Implemented complete authentication system with JWT tokens and HTTP-only cookies, including signup/login forms, password hashing with bcrypt, protected routes middleware, user session management, and authenticated navbar with logout functionality
- January 18, 2025: Created comprehensive Student Dashboard with My Notes, Test History, Profile Info, and Progress Tracker sections, all with protected API routes requiring authentication
- January 18, 2025: Added test student account (teststudent@vaani.com / test1234) and updated user schema to include name and email fields
- January 18, 2025: Removed all dummy data from notes database, updated seeding process to only create admin-added content, implemented empty state handling across homepage and notes page to show "no content available" messages when database is empty
- January 22, 2025: Implemented dynamic Goals and Subjects system - created database models for Goals and Subjects with proper relationships, added API endpoints (GET /api/goals, GET /api/goals/:goalId/subjects), seeded database with complete goal/subject mappings (CEE, IOE, Language, Boards with Science/Commerce categories, ACCA), and converted all hardcoded dropdowns in Admin and Notes pages to use dynamic data from backend
- January 22, 2025: Created comprehensive signup page with complete user registration including gender, goal selection, phone number validation, real-time form validation for username (lowercase, no spaces/numbers), strong password requirements, dynamic goal dropdown from backend API, duplicate email/username checking, success redirect to login with toast notifications, and updated navbar with separate Login/Sign Up buttons
- January 22, 2025: Updated CEE subjects in database - removed Biology and added Zoology and Botany as separate subjects for better academic categorization
- January 22, 2025: Enhanced Student Dashboard with dynamic user greeting ("Hi, [User's Name]"), profile picture upload functionality with camera icon, multer backend integration for file uploads, and updated Profile Info section to display real user data (name, email, username, phone number, goal) from authenticated user with Change Password button placeholder

## User Preferences
```
Preferred communication style: Simple, everyday language.
```