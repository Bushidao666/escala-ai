# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Basic Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint checks

### Quality Assurance
Always run `npm run lint` after making changes to ensure code quality and consistency.

## Architecture Overview

This is a Next.js 15.3.4 AI creative generation platform that creates marketing materials using OpenAI's API. The application is built for internal team use to automate creative content generation.

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **UI Components**: Radix UI components with custom glass morphism styling
- **Database**: Supabase (PostgreSQL with real-time subscriptions)  
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage with CDN
- **AI Integration**: OpenAI API for creative generation
- **State Management**: Zustand + SWR for data fetching
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system and brand colors

### Project Structure Deep Dive

#### `/src/app/` - Next.js App Router Pages
- **`layout.tsx`** - Root layout with sidebar, authentication, theme provider
- **`page.tsx`** - Homepage dashboard with stats, recent activity, achievements
- **`globals.css`** - Global styles and CSS variables

#### **`/src/app/auth/`** - Authentication System
- **`login/page.tsx`** - Login interface
- **`signup/page.tsx`** - Registration interface  
- **`callback/route.ts`** - OAuth callback handler
- **`actions.ts`** - Server actions for auth operations

#### **`/src/app/new/`** - Creative Creation
- **`page.tsx`** - Main creation form with tabs (Basic, Media, Design, Technical)
- **`actions.ts`** - Server actions for creating and managing creatives
- Features multi-format support, file uploads, color pickers, style selection

#### **`/src/app/gallery/`** - Creative Gallery
- **`page.tsx`** - Advanced gallery with search, filters, multiple view modes
- **`ActionBar.tsx`** - Bulk actions toolbar
- **`FilterSidebar.tsx`** - Advanced filtering sidebar
- **`CreativeCard.tsx`** - Individual creative display card
- **`CreativeRequestGalleryCard.tsx`** - Specialized card for multi-format creative requests
- **`CreativeLightbox.tsx`** - Full-screen preview modal
- **`UnifiedGalleryCard.tsx`** - Unified card for different item types
- **`gallery.types.ts`** - TypeScript definitions for gallery
- **`actions.ts`** - Server actions for gallery operations

#### **`/src/app/queue/`** - Processing Queue
- **`page.tsx`** - Real-time queue monitoring dashboard
- **`UnifiedCreativeCard.tsx`** - Card component for queue items
- Shows processing status, progress, real-time updates

#### **`/src/app/settings/`** - Configuration
- **`page.tsx`** - User settings and API configuration
- **`actions.ts`** - Server actions for settings management
- Includes OpenAI API key management, default preferences

#### **`/src/app/homepage/`** - Dashboard Components
- **`components/`** - Specialized dashboard components
- **`types.ts`** - Dashboard-specific types
- **`utils/achievementIcons.ts`** - Achievement system utilities
- **`actions.ts`** - Dashboard data server actions

### Key Features & Business Logic

#### **Creative Generation System**
1. **Single Format Creation** - Traditional one-format-at-a-time creation
2. **Multi-Format Requests** - Generate multiple aspect ratios in one request
3. **AI-Powered** - Uses OpenAI API for image generation
4. **File Upload Support** - Logo and product image integration
5. **Style Customization** - Colors, styles, text overlays

#### **Queue Processing System**
- Real-time status updates via Supabase subscriptions
- Background processing with retry logic
- Status tracking: draft → queued → processing → completed/failed
- Auto-fix system for inconsistent statuses

#### **Gallery & Management**
- Multiple view modes (masonry, grid, list)
- Advanced search and filtering
- Bulk operations (select, delete, download)
- Lightbox preview with download capabilities
- Favorite system

#### **Real-time Features**
- Live status updates using Supabase real-time
- Auto-refresh queue and gallery
- Smart status correction system
- Connection status indicators

### Database Architecture (Supabase)

#### **Main Tables**
- **`creatives`** - Individual creative items
- **`creative_requests`** - Multi-format generation requests
- **`queue_jobs`** - Processing queue management
- **`user_stats`** - Achievement and analytics tracking
- **`user_settings`** - User preferences and API keys

#### **Real-time Subscriptions**
- Creative status changes
- Queue updates
- Stats modifications
- Auto-refresh triggers

### Custom Design System

#### **Glass Morphism Theme**
- `card-glass-intense` - Main card styling
- `btn-neon` - Primary action buttons
- `btn-ghost` - Secondary buttons
- `input-glass` - Form inputs with glass effect

#### **Brand Colors**
- `brand-neon-green` - Primary accent color
- `brand-gray-*` - Grayscale palette
- `brand-black` - Primary background

#### **Spacing System**
- Unified spacing constants (SPACING.xs to SPACING.xxxl)
- Consistent heights system (HEIGHTS object)
- Responsive breakpoints

### Important Implementation Patterns

#### **Server Actions Pattern**
All data mutations use Next.js server actions in `actions.ts` files:
- Form submissions
- Database operations  
- File uploads
- API calls
- No traditional API routes (except `/auth/callback/route.ts` for OAuth)

#### **Middleware Architecture**
- **`/src/middleware.ts`** - Root middleware for request handling
- **`/src/lib/supabase/middleware.ts`** - Supabase authentication middleware

#### **Real-time Updates Pattern**
Custom hook `useSupabaseRealtime` provides:
- Connection management
- Auto-fix capabilities
- Status synchronization
- Debug logging

#### **Form Validation Pattern**
- Zod schemas in `/src/lib/schemas/`
- React Hook Form integration
- Real-time validation
- Error handling

#### **File Upload Pattern**
- Custom `ImageUpload` component
- Supabase Storage integration
- Preview capabilities
- Multiple file support

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

OpenAI API key is managed through the settings interface and stored securely in Supabase.

### Development Workflow
1. Run `npm run dev` for development server
2. Use the app router structure for new pages
3. Follow the existing component patterns
4. Always run `npm run lint` before committing
5. Test real-time features with multiple browser tabs
6. Verify authentication flows work correctly

### Key Dependencies to Note
- `@supabase/ssr` - Server-side rendering support
- `@radix-ui/*` - Accessible UI components
- `react-hook-form` + `@hookform/resolvers` - Form management
- `zod` - Schema validation  
- `framer-motion` - Animations
- `sonner` - Toast notifications
- `zustand` - State management
- `openai` - AI API integration

### Testing Considerations
- Test real-time subscriptions with multiple users
- Verify file upload edge cases
- Test queue processing under load
- Validate form submissions and error states
- Check responsive design across devices

### TypeScript Configuration
- **Strict mode enabled** - All TypeScript strict checks are on
- **Path alias** - Use `@/*` to import from `src/*`
- **Target ES2017** - Modern JavaScript features supported