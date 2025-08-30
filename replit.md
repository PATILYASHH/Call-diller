# Overview

CallConnect is a modern Progressive Web Application (PWA) that functions as a smart phone dialer with comprehensive contact management and call logging capabilities. The application provides a mobile-first interface with three main features: a dialer for making calls, contact management with search functionality, and call history tracking. Built as a full-stack application, it combines a React frontend with an Express.js backend and PostgreSQL database for persistent data storage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built using React with TypeScript, implementing a single-page application architecture. The UI leverages shadcn/ui components built on top of Radix UI primitives for consistent, accessible design patterns. Tailwind CSS provides utility-first styling with a custom design system using CSS variables for theming.

**Key architectural decisions:**
- **Component Library**: Uses shadcn/ui for pre-built, customizable components that maintain design consistency
- **Routing**: Implements wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) handles server state management, caching, and synchronization
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **PWA Features**: Service worker implementation for offline functionality and installable app experience

## Backend Architecture

The server implements a RESTful API using Express.js with TypeScript. The architecture follows a clean separation of concerns with dedicated modules for routing, storage abstraction, and middleware.

**Key architectural decisions:**
- **API Design**: RESTful endpoints for contacts and call logs with proper HTTP status codes
- **Storage Abstraction**: Interface-based storage layer (`IStorage`) allowing for multiple implementations (currently in-memory with future database support)
- **Middleware**: Custom logging middleware for API request monitoring and error handling
- **Development Setup**: Vite integration for hot module replacement in development mode

## Data Storage Solutions

The application uses a hybrid storage approach with Drizzle ORM for database operations and PostgreSQL as the primary database.

**Key architectural decisions:**
- **ORM Choice**: Drizzle ORM provides type-safe database queries with TypeScript integration
- **Schema Management**: Centralized schema definitions in `/shared/schema.ts` for consistency between frontend and backend
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL hosting
- **Migration Strategy**: Drizzle Kit for database schema migrations and management

## External Dependencies

**Database & ORM:**
- PostgreSQL database via Neon Database serverless platform
- Drizzle ORM for type-safe database operations
- Drizzle Kit for schema migrations

**Frontend Libraries:**
- React Query for server state management and caching
- Radix UI primitives for accessible component foundations
- React Hook Form with Hookform Resolvers for form validation
- Wouter for client-side routing
- Date-fns for date manipulation utilities

**UI & Styling:**
- Tailwind CSS for utility-first styling
- Class Variance Authority for component variant management
- Lucide React for consistent iconography
- Embla Carousel for touch-friendly carousel components

**Development Tools:**
- Vite for fast development builds and HMR
- TypeScript for type safety across the stack
- ESBuild for production bundling
- Replit-specific plugins for development environment integration

**PWA & Mobile Features:**
- Service Worker for offline functionality and caching
- Web App Manifest for installable app experience
- Haptic feedback support for mobile interactions