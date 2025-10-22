# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- **Start dev server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build` (production build with Turbopack)
- **Start production**: `npm start`
- **Lint**: `npm run lint` (ESLint)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui components
- **Backend**: Supabase (authentication + database)
- **Forms**: react-hook-form + Zod validation
- **Rich Text**: TipTap editor (for blog content)

### Project Structure

The codebase follows a feature-based architecture:

```
app/              # Next.js App Router pages
├── (admin)/      # Admin route group (requires admin role)
├── therapist/    # Therapist-specific pages
├── blogs/        # Blog pages
├── email_list/   # Email list management
├── login/        # Authentication
└── register/     # Registration flows

features/         # Feature modules
├── auth/         # Authentication logic
├── blogs/        # Blog management
└── email_list/   # Email campaigns & subscribers

components/       # React components
├── ui/           # shadcn/ui components
├── shared/       # Reusable components (DataTable, EntityForm, etc.)
└── templates/    # Page templates

lib/              # Utilities (utils.ts, contentUtils.ts, etc.)
supabase/         # Supabase client setup (client.ts, server.ts)
types/            # Shared TypeScript types
hooks/            # Custom React hooks
```

### Feature Module Pattern

Each feature follows a consistent structure as defined in `/docs/feature-module-design.md`:
- `actions/` - Next.js Server Actions (optional)
- `components/` - Feature-specific UI components
- `config/` - Feature-specific configurations
- `data/` - Mock data and constants (optional)
- `hooks/` - Custom React hooks
- `pages/` - Feature page components
- `services/` - API/business logic (e.g., `blogServices.ts`, `SubscriberService.ts`)
- `types/` - TypeScript interfaces and type definitions
- `utils/` - Feature-specific helper functions
- `validations/` - Zod schemas for form validation
- `index.ts` - **Required** - Barrel export for public API

**All features must have index.ts files in subdirectories** (components/, types/, etc.) for clean barrel exports.

### Authentication & Authorization

- **Auth Provider**: Supabase Auth
- **Middleware**: `middleware.ts` handles route protection
  - Unauthenticated users → `/login`
  - Therapists with incomplete profiles → `/therapist/details`
- **Supabase Clients**:
  - `supabase/client.ts` - Client-side (browser)
  - `supabase/server.ts` - Server-side (SSR, Server Components)
- **User Roles**: `patient`, `therapist`
- **Role-based routing**: Auth services check `profiles.role` to determine redirect paths

### Key Patterns

1. **Imports**: Always use barrel exports when importing from features
   - ✅ `import { LoginForm, useAuth } from '@/features/auth'`
   - ❌ `import { LoginForm } from '@/features/auth/components/LoginForm'`
2. **Data Fetching**: Use Server Components when possible; services layer abstracts API calls
3. **Form Handling**: react-hook-form + Zod schemas in `validations/` folders
4. **UI Components**: shadcn/ui components in `components/ui/`, composed into shared components
5. **Supabase Usage**:
   - Always use `createClient()` from appropriate location (`supabase/client.ts` or `supabase/server.ts`)
   - Server Components: use `supabase/server.ts`
   - Client Components: use `supabase/client.ts`
6. **Path Aliases**: `@/*` maps to root directory (configured in `tsconfig.json`)
7. **Global vs Feature Resources**:
   - **Global** (`hooks/`, `lib/`, `types/`): Only for resources shared by 2+ features
   - **Feature-specific**: Keep in feature directory if used by only 1 feature
   - See README files in `hooks/`, `lib/`, and `types/` for guidance

### Important Files

- `middleware.ts` - Authentication guards and therapist profile completion gate
- `docs/feature-module-design.md` - **Authoritative** feature module design patterns
- `components.json` - shadcn/ui configuration
- `app/globals.css` - Global styles and Tailwind imports
- `features/auth/` - Complete auth feature with components, hooks, types, services
- `components/shared/DataTable.tsx` - Reusable table component for admin views
- `components/shared/EntityForm.tsx` - Generic form wrapper for CRUD operations
- README files in `hooks/`, `lib/`, `types/` - Document global resource usage

### Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Database Schema Notes

Key tables (inferred from code):
- `profiles` - User profiles with `role`, `name`, `phone_number`, `company_name`
- `therapists` - Extended therapist information (`years_experience`, etc.)
- Email list tables for campaigns and subscribers

### Development Notes

- The project uses **Turbopack** for faster builds (`--turbopack` flag)
- TipTap editor is extensively configured with many extensions for rich blog editing
- shadcn/ui style: "new-york" with neutral base color
- TypeScript strict mode enabled
