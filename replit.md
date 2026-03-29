# Label & Lens - Energy Label Service Platform

## Overview

Label & Lens is a professional energy label service platform for Amsterdam properties. The application provides an online calculator for pricing energy labels, property measurements (NEN 2580), WWS point calculations for rental properties, and professional photography services. The platform features a marketing website with service information and a contact/quote request system.

**Core Purpose**: Enable property owners in Amsterdam to calculate costs and request official energy labels and related services through a streamlined web interface.

**Key Features**:
- Interactive pricing calculator with property type and size selections
- Service packages for rental and purchase properties
- Contact form and quote request system with toast notifications
- Multi-page marketing site (home, services, pricing, about, FAQ, contact)
- Responsive design optimized for mobile and desktop
- Authentic Amsterdam canal photography on all hero sections
- Founder portraits and team section on About page

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**Routing**: Client-side routing implemented with Wouter (lightweight React router)

**UI Component System**: 
- shadcn/ui components based on Radix UI primitives
- Tailwind CSS for styling with custom design system
- Class Variance Authority (CVA) for component variants
- Custom Amsterdam-themed color palette (lime green primary at HSL 84 75% 55%)

**State Management**:
- React Hook Form for form state with Zod validation
- TanStack Query (React Query) for server state and API calls
- Local component state for UI interactions

**Design Approach**:
- Utility-focused professional design
- Light mode primary with optional dark mode support
- Scroll-reveal animations for progressive disclosure
- Mobile-first responsive layouts
- Authentic Amsterdam photography with dark overlays on hero sections
- Professional founder portraits on About page (Paulo and Silke)

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode

**API Design**: RESTful JSON API with two main endpoints:
- POST `/api/contact` - Contact form submissions
- POST `/api/quote` - Quote request submissions with calculator state

**Request Validation**: Zod schemas shared between client and server for type safety

**Development Setup**:
- Vite middleware mode for development HMR
- Separate build process for client (Vite) and server (esbuild)
- Custom error overlay and development tooling for Replit environment

### Data Storage Solutions

**Current Implementation**: PostgreSQL database with Drizzle ORM (actively used)

**Database Connection**: Neon serverless PostgreSQL accessed via DATABASE_URL environment variable

**Storage Interface**: DatabaseStorage class implementing IStorage interface for data persistence

**Data Models** (submissions table with snake_case columns):
- **Contact/Quote submissions**: All form data persisted to PostgreSQL
  - Personal: name, company_name (optional), email, phone
  - Property: property_postcode, property_address, property_type (koop/huur)
  - Service: selected_service (energielabel/fotografie), property_size, fotografie_pakket (basis/totaal/exclusief)
  - Add-ons: puntentelling, adviesrapport, spoed_service (booleans)
  - Pricing: total_price (integer, VAT-inclusive in euros)
  - Metadata: id (serial primary key), created_at (timestamp)

**Google Sheets Integration**: Parallel export to Google Sheets for backup/reporting alongside PostgreSQL storage

### Authentication and Authorization

**Current State**: No authentication implemented - public-facing marketing site

**Design Note**: Contact and quote submissions are unauthenticated public endpoints intended for lead generation

### Type Safety and Validation

**Shared Schema Layer**: 
- Zod schemas in `shared/schema.ts` used for both client and server validation
- TypeScript types derived from Zod schemas for compile-time safety
- Validation happens on both client (UI feedback) and server (security)

**Calculator Pricing Logic**:
- **Energy Label base prices** (excl. BTW): €229-€349 based on property size (tot-50, 50-100, 100-150, 150-plus)
- **Photography packages**: Visuals Basis €249, Visuals Totaal €325 (Populair), Visuals Exclusief €399
- **Add-on services** (huurwoning only): WWS Puntentelling +€120, Adviesrapport +€100, Spoed service +€50
- **BTW calculation**: 21% added to subtotal, VAT-inclusive total stored in database
- Pricing configuration centralized in shared schema

### Project Structure

```
client/               - React frontend application
  src/
    components/       - Reusable UI components
      ui/            - shadcn/ui component library
    pages/           - Route-level page components
    hooks/           - Custom React hooks
    lib/             - Utility functions and query client
server/              - Express backend
  routes.ts          - API endpoint definitions
  storage.ts         - Data storage abstraction
  vite.ts            - Development server setup
shared/              - Code shared between client and server
  schema.ts          - Zod schemas and TypeScript types
```

### Build and Deployment

**Development**: 
- Single command starts both Vite dev server and Express API
- HMR enabled for instant client updates
- TypeScript checking without emit

**Production Build**:
1. Vite builds client to `dist/public`
2. esbuild bundles server to `dist/index.js`
3. Express serves static files in production

**Environment**: Optimized for Replit deployment with custom plugins for development experience

## External Dependencies

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS
- **shadcn/ui**: Pre-built accessible component system
- **Lucide React**: Icon library
- **Inter Font**: Typography from Google Fonts

### Form Management
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation library
- **@hookform/resolvers**: Zod integration for React Hook Form

### Data Fetching
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing

### Database (Active)
- **Drizzle ORM**: TypeScript ORM for SQL databases
- **@neondatabase/serverless**: Neon PostgreSQL client for serverless environments
- **PostgreSQL**: All submissions stored in database with automatic schema sync

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety across stack
- **esbuild**: Fast production server bundling
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx + tailwind-merge**: Conditional className composition
- **nanoid**: Unique ID generation for sessions/requests
- **embla-carousel-react**: Touch-friendly carousel component

### Media Assets
- **Hero Images**: Authentic Amsterdam canal photography on all pages
  - Home: Colorful evening canal houses
  - Prijzen: Aerial canal view
  - Energielabels: Nature/sustainability theme
  - Over Ons: Classic Amsterdam canal scene
  - FAQ: Canal scene with bridges
  - Contact: Bridge over canal
- **Team Portraits**: Professional founder photos (Paulo and Silke) on About page

### Email Integration (Active)
- **Resend**: Transactional email service for admin notifications and customer confirmations
- **Admin notifications**: Detailed quote information sent to business email
- **Customer confirmations**: Professional "thank you" emails sent to customers
- Automatic email sending on all quote/appointment submissions

### Future Service Integrations
- Potential analytics or monitoring services (Vercel Analytics referenced in attached assets)