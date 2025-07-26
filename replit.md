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
- January 22, 2025: Implemented comprehensive student profile system enhancements including: (1) Functional Change Password modal with strong password validation (min 8 chars, 1 uppercase, 1 number, 1 special character), secure backend API with bcrypt password hashing; (2) Profile Picture Upload from Profile Info page with camera icon trigger, file validation, and persistent storage; (3) Top-right avatar popup viewer replacing "Student Portal" button showing enlarged profile picture with user details; (4) Live Notes Count integration displaying real-time count from user_notes table in Learning Statistics; (5) Removed old upload icon and streamlined Progress Tracker to show only Notes Summary section with dynamic subject-wise breakdown
- January 22, 2025: Implemented conditional login-based access control system for "View" and "Add to Dashboard" buttons across Notes section with elegant authentication flow: (1) Created global AuthModalProvider with contextual popup showing "Sign in Required" message and Sign Up/Login buttons; (2) Enhanced NotesPageCard component with authentication checks that store current page URL and note ID in sessionStorage for post-login redirect; (3) Updated login/signup pages with automatic redirect logic that restores user's original intent after authentication; (4) Created unified /auth page handling both login and signup modes with URL parameters; (5) All authentication flows preserve user context and seamlessly return to exact content they were trying to access
- January 22, 2025: Connected Website's public notes page with Student Dashboard for complete note management system: (1) Implemented backend API endpoints (POST /api/student/notes, GET /api/student/notes, DELETE /api/student/notes/:noteId) for adding, viewing, and removing notes from student dashboard; (2) Enhanced storage interface with addUserNote, getUserNotes, and removeUserNote methods using PostgreSQL userNotes table with proper relationships; (3) Updated Notes page with React Query mutation for "Add to Dashboard" functionality with success/error toast notifications; (4) Modified Student Dashboard "My Notes" section to display collected notes with View and Remove buttons; (5) Implemented real-time dashboard updates with automatic query invalidation when notes are added/removed; (6) All note management operations properly authenticated with JWT tokens and provide seamless user experience
- January 22, 2025: Fixed homepage notes and formulas "Add to Dashboard" functionality: (1) Updated notes-formulas-section.tsx component to use correct API endpoint (/api/student/notes instead of /api/notes/add/); (2) Implemented proper React Query mutation with error handling and toast notifications; (3) Added real-time dashboard synchronization with query invalidation; (4) Removed old API routes causing storage method conflicts; (5) Homepage note cards now perfectly integrate with Student Dashboard using same backend system as Notes page; (6) Complete end-to-end functionality working from homepage → dashboard with authentication and duplicate prevention
- January 22, 2025: Implemented secure admin access system: (1) Removed "Admin" button from main navigation (both desktop and mobile); (2) Created admin-only route at /admin with dedicated login page requiring email/password authentication; (3) Set up Replit Database with admins collection, bcrypt password hashing, and default admin account (evaanilearn@gmail.com / V@an!@#123); (4) Implemented secure admin session management with HTTP-only cookies and 24-hour expiration; (5) Added admin authentication middleware with proper token validation; (6) Complete admin dashboard accessible only after successful login with logout functionality; (7) All admin operations now secured and isolated from public navigation
- January 25, 2025: Enhanced navbar authentication UX: (1) Replaced login/register buttons with student's profile picture and full name when logged in; (2) Made profile section clickable with dropdown menu containing Dashboard and Logout options; (3) Shows uploaded profile picture or gradient avatar fallback; (4) Updated mobile navigation with enhanced profile card showing user info, profile picture, and separate Dashboard/Logout buttons; (5) Improved responsive design for both desktop and mobile authentication states
- January 25, 2025: Implemented and fixed complete "Forgot Password" system using Resend email service: (1) Created password reset token database table with secure hashing and 15-minute expiration; (2) Built /forgot-password page with proper error handling - shows "This email is not registered" for invalid emails; (3) Created /reset-password?token=... page with token validation on page load and strong password requirements; (4) Implemented backend API endpoints (/api/auth/forgot-password, /api/auth/reset-password/:token, /api/auth/validate-reset-token/:token) with secure token generation, email sending via Resend, and password updates; (5) Fixed all ES module issues by replacing require() with proper ES6 imports; (6) Added comprehensive error logging with console.error("Reset error:", err) for debugging; (7) Complete security implementation with token validation, expiration cleanup, and bcrypt password hashing; (8) Email service now uses verified sender email no-reply@e-vaani.com with professional HTML template including Vaani branding and "Reset Password" button
- January 27, 2025: Created individual goal pages for educational tracks: (1) Built 5 dedicated pages at /explore/cee, /explore/ioe, /explore/loksewa, /explore/acca, /explore/others with complete routing integration; (2) Developed reusable CourseCard component with responsive design for mobile and tablet views; (3) Each goal page follows structured layout with bold heading, introductory paragraph, horizontal grid of course cards with "Coming Soon" buttons, and detailed description section; (4) Added hardcoded content specific to each educational goal including exam patterns, preparation strategies, and career opportunities; (5) Updated terminology from "IOM" to "IOE" (Institute of Engineering) throughout the IOE goal page; (6) Maintained full responsive design and integrated seamlessly with existing navbar without affecting other components
- January 27, 2025: Connected navbar and exam categories to database-driven goal pages: (1) Updated navbar to replace static "Courses" link with dynamic dropdown menu fetching goals from /api/goals endpoint; (2) Added ChevronDown icon and proper dropdown styling for both desktop and mobile navigation; (3) Enhanced exam-categories.tsx component to fetch goals from database instead of hardcoded data; (4) Implemented dynamic URL formatting (goalName.toLowerCase().replace(/\s+/g, "")) to match existing route structure; (5) Added loading state with skeleton placeholders for goal cards; (6) Created comprehensive goal display data mapping with icons, colors, and tags for each goal type; (7) Connected "Explore Goal" buttons to navigate to respective /explore/* pages; (8) Ensured both navbar dropdowns and homepage goal cards dynamically route to correct goal pages based on database content
- January 27, 2025: Enhanced navbar styling and goal sorting: (1) Moved Courses dropdown to first position in navbar as primary CTA; (2) Applied semi-transparent orange styling with rounded corners and bold font weight; (3) Implemented goal sorting logic with CEE always appearing first, followed by alphabetical order; (4) Updated both navbar dropdown and homepage goal cards to display sorted goals consistently
- January 27, 2025: Implemented complete HTTPS/SSL support for production deployment: (1) Added trust proxy configuration for proper HTTPS detection; (2) Implemented automatic HTTP to HTTPS redirect in production; (3) Enhanced cookie security settings with proper HTTPS flags; (4) Added comprehensive security headers (HSTS, XSS protection, content type options); (5) Created detailed deployment guide with platform-specific instructions; (6) Fixed profile picture persistence with public directory serving and proper URL generation
- January 27, 2025: Enhanced HTTPS/SSL security with universal deployment support: (1) Improved HTTPS detection across multiple platforms (Replit, Vercel, Railway, Heroku); (2) Added automatic HTTP to HTTPS redirects for all domains (not just production); (3) Enhanced security headers including CSP and HSTS preload; (4) Added debug logging for HTTPS redirect troubleshooting; (5) Updated deployment guide with platform-specific SSL troubleshooting; (6) Fixed TypeScript errors and improved connection security detection

## User Preferences
```
Preferred communication style: Simple, everyday language.
```