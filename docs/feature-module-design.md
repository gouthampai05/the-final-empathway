# Feature Module Design Document

## 1. Directory Structure Overview

Each feature in the application should be organized in a modular way under the `features/` directory. This structure helps keep related code together and makes the codebase easier to maintain.

```
features/
  ├── feature-name/
      ├── actions/         # Next.js Server Actions (optional)
      ├── components/      # React components specific to this feature
      ├── config/          # Feature-specific configurations
      ├── data/            # Mock data, constants, and static content (optional)
      ├── hooks/           # Custom React hooks
      ├── pages/           # Page components
      ├── services/        # API and business logic services
      ├── types/           # TypeScript types/interfaces
      ├── utils/           # Helper functions and utilities
      ├── validations/     # Form and data validation schemas
      └── index.ts         # Public API exports (required)
```

### Directory Purposes

#### actions/ (optional)
Next.js Server Actions for server-side mutations and operations:
- Form submissions requiring server context
- Database operations that need server-side security
- Data mutations that should not expose implementation to client
- Examples: `createUser.ts`, `updateProfile.ts`, `deleteEntity.ts`
- Use 'use server' directive at the top of each file

#### components/
This directory contains all React components specific to the feature. Think of components as building blocks - like LEGO pieces that make up your feature's user interface.
- Place smaller, reusable UI pieces here
- Each component should have a single responsibility
- Must have an `index.ts` file for clean exports
- Examples: `UserCard.tsx`, `ProductList.tsx`, `SettingsForm.tsx`

#### hooks/
Custom React hooks that handle reusable logic across your feature.
- State management logic
- Data fetching patterns
- Shared behaviors
- Examples: `useUserData.ts`, `useProductFilters.ts`

#### pages/
Complete page components that combine smaller components into full pages.
- These usually correspond to routes in your application
- Handle page-level state and data fetching
- Compose smaller components together
- Examples: `UserListPage.tsx`, `ProductDetailsPage.tsx`

#### services/
Contains all the business logic and API communication:
- API calls to your backend
- Data transformation logic
- Complex business rules
- Examples: `userService.ts`, `productService.ts`

#### types/
TypeScript type definitions specific to your feature:
- Interface definitions
- Type aliases
- Enum declarations
- Must have an `index.ts` file to export all types
- Examples: `User.ts`, `Product.ts`, `OrderStatus.ts`

#### utils/
Helper functions and utilities that are specific to your feature:
- Data formatting functions
- Calculation utilities
- Helper functions
- Examples: `formatUserName.ts`, `calculateTotalPrice.ts`

#### validations/
Form and data validation rules:
- Input validation schemas
- Form validation rules
- Data integrity checks
- Examples: `userValidations.ts`, `productValidations.ts`

#### data/ (optional)
Static data and mock data for development:
- Constants
- Mock API responses
- Test data
- Examples: `mockUsers.ts`, `constants.ts`

## 2. Component Structure Guidelines

### 2.1 Component Files (.tsx)
- Keep UI-related logic only in component files
- Define prop types within the same file using TypeScript interfaces
- Follow naming convention: `ComponentName.tsx`
- Use named exports: `export const ComponentName`
- Include component-specific styled components in the same file
```typescript
// Example: components/FeatureComponent.tsx
interface FeatureComponentProps {
  title: string;
  onAction: () => void;
}

export const FeatureComponent: React.FC<FeatureComponentProps> = ({ title, onAction }) => {
  // Component implementation
};
```

### 2.2 Page Components
- Place in `pages/` directory
- Handle data fetching and state management
- Compose smaller components
- Use "Page" suffix: `FeaturePage.tsx`

## 3. Business Logic Organization

### 3.1 Services
- Place API calls and business logic in `services/`
- Use TypeScript for type safety
- Follow naming convention: `featureService.ts`
- Implement error handling
```typescript
// Example: services/featureService.ts
export async function createEntity(data: EntityType): Promise<ResponseType> {
  // Implementation
}
```

### 3.2 Hooks
- Custom hooks in `hooks/` directory
- Prefix with "use": `useFeature.ts`
- Handle reusable state logic and side effects
- Document parameters and return types

## 4. Type Definitions

### 4.1 Types Directory
- Keep all feature-specific types in `types/`
- One type definition file per domain model
- Use descriptive interfaces/types
- Export all types from an index file
```typescript
// Example: types/FeatureTypes.ts
export interface FeatureModel {
  id: string;
  name: string;
  // ...other properties
}
```

## 5. Configuration

### 5.1 Config Files
- Store in `config/` directory
- Include table configurations, form fields, validation rules
- Use TypeScript for type safety
- Name clearly: `featureConfig.ts`

## 6. Utilities and Helpers

### 6.1 Utils Directory
- Pure functions only
- Feature-specific helper functions
- Data transformation utilities
- Export named functions
```typescript
// Example: utils/featureUtils.ts
export function transformData(input: InputType): OutputType {
  // Implementation
}
```

## 7. Validation

### 7.1 Validation Files
- Keep validation schemas in `validations/`
- Use Zod for type-safe validation
- One file per feature entity
- Export individual field validations and composed schemas
- Must have an `index.ts` file for barrel exports

### 7.2 Validation Structure Pattern
Follow this pattern for all validation files:

```typescript
// Example: validations/featureValidations.ts
import { z } from 'zod';

// Individual field validations (reusable)
export const featureNameValidation = z
  .string()
  .min(1, "Name is required")
  .min(3, "Name must be at least 3 characters")
  .max(100, "Name must be less than 100 characters")
  .trim();

export const featureEmailValidation = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .toLowerCase()
  .trim();

// Main schema (compose field validations)
export const featureSchema = z.object({
  name: featureNameValidation,
  email: featureEmailValidation,
  // ... other fields
});

// Form schema (for creating/editing)
export const featureFormSchema = featureSchema.omit({ id: true });

// Update schema (partial, for PATCH operations)
export const featureUpdateSchema = featureFormSchema.partial();

// Infer types from schemas
export type Feature = z.infer<typeof featureSchema>;
export type FeatureFormData = z.infer<typeof featureFormSchema>;
export type FeatureUpdateData = z.infer<typeof featureUpdateSchema>;
```

### 7.3 Validation Best Practices

#### Field-Level Validation
- Export individual field validations for reusability
- Include clear, user-friendly error messages
- Use `.trim()` for string inputs to remove whitespace
- Use `.toLowerCase()` for case-insensitive fields (emails)
- Chain validations from general to specific
- Include both presence and format validation

```typescript
// Good: Detailed, reusable validation
export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .toLowerCase()
  .trim();

// Bad: Generic, non-reusable
const email = z.string().email();
```

#### Enum Validation
- Use `z.enum()` with custom error messages
- Export enum validations separately

```typescript
export const statusValidation = z.enum(["active", "inactive", "pending"], {
  errorMap: () => ({ message: 'Status must be active, inactive, or pending' })
});
```

#### Array Validation
- Validate array length with meaningful limits
- Validate individual array items
- Provide defaults when appropriate

```typescript
export const tagsValidation = z
  .array(z.string().min(1, "Tag cannot be empty").trim())
  .max(15, "Maximum 15 tags allowed")
  .default([]);
```

#### Number Validation
- Use `.int()` for integers
- Use `.min()` and `.max()` with descriptive messages
- Validate ranges specific to your domain

```typescript
export const ageValidation = z
  .number()
  .int()
  .min(0, "Age cannot be negative")
  .max(150, "Please enter a valid age");
```

#### Date Validation
- Use `.datetime()` for ISO 8601 date strings
- Use `.refine()` for complex date logic (future dates, date ranges)

```typescript
export const scheduledDateValidation = z
  .string()
  .datetime()
  .refine(
    (date) => new Date(date) > new Date(),
    { message: "Scheduled date must be in the future" }
  );
```

#### Custom Validation with Refine
- Use `.refine()` for business logic validation
- Provide clear error messages

```typescript
export const passwordConfirmSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });
```

### 7.4 Schema Variants

Every feature entity should have these schema variants:

1. **Full Schema** (`entitySchema`): Complete database record with all fields including IDs, timestamps
2. **Form Schema** (`entityFormSchema`): For creating entities (omits auto-generated fields)
3. **Update Schema** (`entityUpdateSchema`): Partial form schema for updates
4. **Inferred Types**: TypeScript types derived from schemas

```typescript
// 1. Full schema
export const blogSchema = z.object({
  id: z.string().uuid(),
  title: blogTitleValidation,
  createdAt: z.string().datetime(),
  // ... all fields
});

// 2. Form schema (omit auto-generated fields)
export const blogFormSchema = blogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// 3. Update schema (all fields optional)
export const blogUpdateSchema = blogFormSchema.partial();

// 4. Types
export type Blog = z.infer<typeof blogSchema>;
export type BlogFormData = z.infer<typeof blogFormSchema>;
export type BlogUpdateData = z.infer<typeof blogUpdateSchema>;
```

### 7.5 Common Validation Utilities

For validations used by 2+ features, use `lib/validationUtils.ts`:

```typescript
import { emailValidation, phoneNumberValidation } from '@/lib/validationUtils';

export const userFormSchema = z.object({
  email: emailValidation,
  phone: phoneNumberValidation,
});
```

Available common validations:
- `emailValidation`: Email with lowercase and trim
- `phoneNumberValidation`: Phone number with format validation
- `personNameValidation`: Human name validation
- `urlValidation`: Optional URL validation
- `uuidValidation`: UUID format validation
- `dateStringValidation`: ISO 8601 date validation
- `tagsValidation()`: Configurable tags array validation
- Helper functions: `createValidator()`, `getZodErrorMessages()`, `getFirstZodError()`

### 7.6 Integration with Forms

Use with `react-hook-form` and `@hookform/resolvers/zod`:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { featureFormSchema, type FeatureFormData } from '@/features/feature/validations';

const form = useForm<FeatureFormData>({
  resolver: zodResolver(featureFormSchema),
  defaultValues: {
    name: '',
    email: '',
  }
});
```

### 7.7 Validation Index Files

Always create `validations/index.ts`:

```typescript
// validations/index.ts
export * from './featureValidations';
export * from './anotherValidation';
```

This allows clean imports:
```typescript
import { featureSchema, featureFormSchema } from '@/features/feature/validations';
```

## 8. Global vs Feature Resources

### 8.1 When to Use Root-Level Directories
Code should be placed in root-level directories (`hooks/`, `types/`, `lib/`, `components/shared/`) only when:
- **Shared by 2+ features**: If a hook, type, or utility is used by multiple features
- **Truly generic**: The code has no feature-specific logic
- **Examples**: `useTableState`, `PaginationConfig`, `cn()`, `formatDate()`

### 8.2 When to Keep in Feature
Code should stay in the feature directory when:
- Used by only one feature
- Contains feature-specific logic or business rules
- Helps maintain feature independence and low coupling

### 8.3 Moving from Feature to Global
When you find yourself importing a feature's hook/util/type into another feature:
1. Move it to the appropriate root directory
2. Make it more generic if needed
3. Update imports in both features
4. Document why it's global in a comment

## 9. Index Files (Barrel Exports)

### 9.1 Required Index Files
Every feature must have these index files:
- `feature-name/index.ts` - Export the public API of the entire feature
- `components/index.ts` - Export all components
- `types/index.ts` - Export all types

### 9.2 Recommended Index Files
These are optional but improve code organization:
- `hooks/index.ts` - Export all hooks
- `services/index.ts` - Export all services
- `validations/index.ts` - Export all validation schemas
- `utils/index.ts` - Export all utilities
- `pages/index.ts` - Export all page components
- `config/index.ts` - Export all configuration

### 9.3 Benefits of Index Files
- Cleaner imports: `import { BlogEditor } from '@/features/blogs'`
- Clear public API: Only exported items are meant to be used externally
- Easier refactoring: Internal file structure can change without breaking imports
- Better discoverability: index.ts shows what's available

### 9.4 Index File Example
```typescript
// features/blogs/index.ts
export * from './components'
export * from './types'
export * from './hooks'
export * from './services'
```

## 10. Best Practices

### 10.1 Code Organization
- Keep related code close together
- Use index files for clean exports
- Maintain clear separation of concerns
- Follow consistent naming conventions

### 10.2 File Naming Conventions
- **Components**: `FeatureComponent.tsx` (PascalCase)
- **Pages**: `FeaturePage.tsx` (PascalCase + "Page" suffix)
- **Services**: `featureService.ts` (camelCase + "Service" suffix)
- **Utilities**: `featureUtils.ts` (camelCase + "Utils" suffix)
- **Types**: `FeatureType.ts` (PascalCase)
- **Validations**: `featureValidations.ts` (camelCase + "Validations" suffix)
- **Hooks**: `useFeature.ts` (camelCase + "use" prefix)
- **Actions**: `actionName.ts` (camelCase, descriptive verb)
- **Config**: `featureConfig.ts` (camelCase + "Config" suffix)
- **Directories**: `feature-name/` (kebab-case)

### 10.3 Component Design
- Keep components focused and single-responsibility
- Extract reusable logic to custom hooks
- Use composition over inheritance
- Implement proper prop typing
- Use Framer Motion for animations when creating polished UX
- Follow loading state patterns with reusable loader components

### 10.4 State Management
- Keep state as close as possible to where it's used
- Use context for shared state when necessary
- Implement proper loading and error states using global loader components
- Handle side effects in hooks or services
- Use optimistic UI updates where appropriate

#### Optimistic UI Updates Pattern
For user interactions that should feel instant (likes, votes, bookmarks):

1. **Server Actions**: Create in `actions/` directory with 'use server' directive
   ```typescript
   // actions/toggleLike.ts
   'use server';
   export async function toggleLike(id: string) {
     // Server-side mutation
     return { success: true, liked: true, count: 10 };
   }
   ```

2. **Custom Hooks**: Implement optimistic updates in `hooks/` directory
   ```typescript
   // hooks/useLike.ts
   import { useTransition } from 'react';

   export function useLike({ id, initialCount }) {
     const [count, setCount] = useState(initialCount);
     const [liked, setLiked] = useState(false);
     const [isPending, startTransition] = useTransition();

     const toggle = () => {
       // 1. Update UI immediately (optimistic)
       const prev = { count, liked };
       setLiked(!liked);
       setCount(liked ? count - 1 : count + 1);

       // 2. Call server action in transition
       startTransition(async () => {
         const result = await toggleLike(id);
         if (!result.success) {
           // Revert on error
           setLiked(prev.liked);
           setCount(prev.count);
         }
       });
     };

     return { count, liked, toggle, isPending };
   }
   ```

3. **Components**: Use the hook for instant feedback
   ```typescript
   const { count, liked, toggle } = useLike({ id: item.id, initialCount: item.likes });
   ```

Benefits:
- Instant visual feedback (no loading spinner needed)
- Server validation with automatic rollback on error
- Progressive enhancement (works with/without JavaScript)
- Better UX with animations using Framer Motion

### 10.5 Global Loader Components
Located in `components/shared/loaders/`, these reusable components provide consistent loading UX:
- **PageLoader**: Full-page loading spinner with optional message
- **ContentLoader**: Skeleton lines with staggered animations
- **CardLoader**: Grid of card skeletons (used for blog/entity lists)
- **EditorLoader**: Rich editor-specific loading state
- All loaders use Framer Motion for smooth animations
- Always prefer these over inline loading states for consistency

## 11. Sub-features Organization

When a feature has distinct sub-domains (e.g., campaigns and subscribers within email_list):

### 11.1 Component Organization
Organize sub-feature components in subdirectories:
```
email_list/
  components/
    campaign/         # Campaign-specific components
    subscriber/       # Subscriber-specific components
    shared/           # Components used by both (optional)
    index.ts          # Export all components
```

### 11.2 When to Split into Separate Features
Consider splitting into separate top-level features when:
- Sub-features have completely independent data models
- They would be developed by different teams
- They have no shared business logic
- They could exist as standalone applications

For most cases, keep related sub-domains in a single feature directory to maintain cohesion.

### 11.3 Example: Blog Feature with Public Viewing
The blog feature demonstrates organizing sub-components for different views:
```
features/blogs/
  components/
    blog-view/        # Public blog reading components
      BlogHeader.tsx
      BlogContent.tsx
      BlogFooter.tsx
      ProgressBar.tsx
      ShareButtons.tsx
      TableOfContents.tsx
    editor/           # Blog editing components
    BlogCard.tsx      # List view component
  pages/
    BlogEditorPage.tsx  # Admin editing page
    BlogListPage.tsx    # Admin list page
    BlogViewPage.tsx    # Public reading page
```

**Public Viewing with ISR:**
- Use `app/blogs/[slug]/page.tsx` as Server Component
- Enable ISR with `export const revalidate = 60`
- Implement `generateStaticParams()` for build-time generation
- Generate SEO metadata with `generateMetadata()`
- Use server-side Supabase client for data fetching

## 12. Testing Structure (Optional)
```
feature-name/
  └── __tests__/
      ├── components/
      ├── hooks/
      └── utils/
```

## 13. Reusable Admin List Components

### 13.1 Purpose and Location
For admin list pages (blogs, campaigns, subscribers) that share common UI patterns, use reusable components in `components/admin/`. These components provide consistent UX across all admin list pages.

### 13.2 Available Components

#### StatsGrid
Displays a grid of statistics cards with icons at the top of list pages.

**Props:**
```typescript
interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: { default?: number; md?: number; lg?: number };
  variant?: 'default' | 'compact';
  animate?: boolean;
}
```

**Usage:**
```typescript
const statsItems: StatItem[] = [
  { title: 'Total Blogs', value: 42, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { title: 'Published', value: 35, icon: Eye, color: 'text-green-600', bgColor: 'bg-green-50' },
];

<StatsGrid
  stats={statsItems}
  columns={{ default: 1, md: 3, lg: 5 }}
  variant="default"
/>
```

**Variants:**
- `default`: Blog-style stats with icon in header and value below
- `compact`: Email list-style stats with icon on right side

#### ListPageHeader
Standard page header with title, description, and action button.

**Props:**
```typescript
interface ListPageHeaderProps {
  title: string;
  description: string;
  actionLabel: string;
  actionIcon: LucideIcon;
  onAction: () => void;
  animate?: boolean;
}
```

**Usage:**
```typescript
<ListPageHeader
  title="Blogs"
  description="Manage your blog posts"
  actionLabel="New Blog"
  actionIcon={Plus}
  onAction={() => router.push('/blogs/new')}
/>
```

#### SearchAndFilters
Combined search input and filter dropdowns with clear button.

**Props:**
```typescript
interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value?: string;
  placeholder?: string;
  width?: string;
}

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterConfig[];
  onFilterChange: (key: string, value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  animate?: boolean;
  searchPlaceholder?: string;
}
```

**Usage:**
```typescript
const filterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }],
    value: filters.status,
    width: 'w-[140px]',
  },
];

<SearchAndFilters
  searchTerm={tableState.searchTerm}
  onSearchChange={tableState.handleSearchChange}
  filters={filterConfigs}
  onFilterChange={(key, value) => handleFilterChange(key as keyof Filters, value)}
  hasActiveFilters={tableState.hasActiveFilters}
  onClearFilters={tableState.handleClearFilters}
  searchPlaceholder="Search blogs..."
/>
```

#### Pagination
Standard pagination controls with previous/next buttons and item counts.

**Props:**
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  startIndex?: number;
  endIndex?: number;
}
```

**Usage:**
```typescript
<Pagination
  currentPage={tableState.paginationConfig.currentPage}
  totalPages={tableState.paginationConfig.totalPages}
  itemsPerPage={tableState.paginationConfig.itemsPerPage}
  totalItems={tableState.filteredData.length}
  onPreviousPage={tableState.paginationConfig.onPreviousPage}
  onNextPage={tableState.paginationConfig.onNextPage}
/>
```

#### EmptyState
Empty state component for "no data" and "no results" scenarios.

**Props:**
```typescript
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  animate?: boolean;
}
```

**Usage:**
```typescript
<EmptyState
  icon={FileText}
  title="No blogs yet"
  description="Create your first blog post to get started"
  actionLabel="Create Blog"
  onAction={() => router.push('/blogs/new')}
/>
```

### 13.3 Integration Pattern

Admin list pages should follow this structure:

```typescript
export const FeatureListPage: React.FC = () => {
  // ... hooks and state

  // Convert feature-specific stats to StatItem format
  const statsItems: StatItem[] = stats ? [
    { title: 'Total', value: stats.total, icon: Icon, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    // ... more stats
  ] : [];

  // Convert filter configs
  const filterConfigs: FilterConfig[] = [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS, value: filters.status, width: 'w-[140px]' },
    // ... more filters
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <StatsGrid stats={statsItems} columns={{ default: 1, md: 2, lg: 4 }} variant="compact" animate={false} />
        </motion.div>
      )}

      {/* Header */}
      <ListPageHeader
        title="Features"
        description="Manage your features"
        actionLabel="New Feature"
        actionIcon={Plus}
        onAction={handleAdd}
      />

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={tableState.searchTerm}
        onSearchChange={tableState.handleSearchChange}
        filters={filterConfigs}
        onFilterChange={(key, value) => handleFilterChange(key as keyof Filters, value)}
        hasActiveFilters={tableState.hasActiveFilters}
        onClearFilters={tableState.handleClearFilters}
        searchPlaceholder="Search features..."
      />

      {/* Table or Empty State */}
      {tableState.paginatedData.length === 0 ? (
        <EmptyState icon={Icon} title="No items" description="Get started" actionLabel="Create" onAction={handleAdd} />
      ) : (
        {/* Table implementation */}
      )}

      {/* Pagination */}
      {tableState.paginationConfig && <Pagination {...tableState.paginationConfig} totalItems={tableState.filteredData.length} />}
    </div>
  );
};
```

### 13.4 When to Use Admin Components

Use these components for:
- Admin list pages showing tables of data
- Pages with search and filter functionality
- Pages requiring statistics displays
- Consistent empty state handling
- Standard pagination needs

Don't use these components for:
- Public-facing pages
- Form pages
- Detail/view pages
- Dashboard pages with custom layouts

### 13.5 Customization

All admin components support:
- **Animation control**: Set `animate={false}` to disable Framer Motion animations
- **Responsive layouts**: Configure column grids for different breakpoints
- **Icon flexibility**: Pass any Lucide icon as a component prop
- **Styling**: Components use Tailwind classes and inherit theme styling

## 14. Email Integration Patterns

### 14.1 Email Service Architecture
For features that send emails (e.g., email campaigns), follow these patterns:

#### Service Layer
Create an email service in `services/` for API integration:
```typescript
// services/BrevoService.ts or services/EmailService.ts
import * as brevo from '@getbrevo/brevo';

// Helper to create authenticated API instance
function createTransactionalEmailsApi() {
  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');
  return apiInstance;
}

export async function sendTransactionalEmail(params: SendEmailParams) {
  const apiInstance = createTransactionalEmailsApi();
  // Implementation
}

export async function sendCampaignEmails(data: CampaignEmailData) {
  // Batch sending with rate limit handling
}
```

**Key principles:**
- Abstract third-party API behind service functions
- Handle batching for bulk email sends (respect rate limits)
- Include proper error handling and logging
- Return standardized response format
- Store API keys in environment variables

#### Email Templates
Create template generators in `utils/emailTemplate.ts`:
```typescript
// utils/emailTemplate.ts
export interface EmailTemplateData {
  subject: string;
  content: string;
  authorName: string;
  authorCompany: string;
  authorYearsExperience: number;
}

export function generateEmailTemplate(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Inline CSS for email client compatibility */
        </style>
      </head>
      <body>
        <!-- Email content with author profile -->
      </body>
    </html>
  `;
}
```

**Template best practices:**
- Use inline CSS for email client compatibility
- Include responsive design with media queries
- Add proper HTML structure (doctype, meta tags)
- Include author/sender profile information
- Provide unsubscribe/preferences links
- Use HTML escaping for user content
- Generate both HTML and plain text versions

#### Email Editor Component
Reuse rich text editor components for email content:
```typescript
// components/EmailEditor.tsx
import { useEditor } from '@tiptap/react';

export const EmailEditor: React.FC<EmailEditorProps> = ({ initialContent, onChange }) => {
  const editor = useEditor({
    extensions: [
      // Email-appropriate extensions (no code blocks, no YouTube embeds)
    ],
  });

  return <EditorContent editor={editor} />;
};
```

**Email editor considerations:**
- Remove features not compatible with email (code syntax highlighting, video embeds)
- Keep essential formatting (headings, lists, links, images, colors)
- Use same slash command pattern as blog editor for consistency
- Provide live HTML preview
- Validate image URLs and sizes

#### Campaign Editor Page
Create a full-featured campaign editor in `pages/`:
```typescript
// pages/CampaignEditorPage.tsx
export const CampaignEditorPage: React.FC<CampaignEditorPageProps> = ({ campaign, isEdit }) => {
  return (
    <div>
      {/* Edit/Preview tabs */}
      <Tabs>
        <TabsContent value="edit">
          <EmailEditor />
        </TabsContent>
        <TabsContent value="preview">
          <iframe srcDoc={previewHtml} />
        </TabsContent>
      </Tabs>

      {/* Recipient filters */}
      {/* Send options */}
    </div>
  );
};
```

**Campaign editor features:**
- Campaign details form (name, subject, scheduled date)
- Rich text email editor
- Live HTML preview in iframe
- Recipient filtering (status, source, tags)
- Estimated recipient count
- Save draft and send functionality
- Campaign statistics (for sent campaigns)

#### Server Actions
Implement send functionality as server actions in `actions/`:
```typescript
// actions/sendCampaign.ts
'use server';

export async function sendCampaign(campaignId: string) {
  // 1. Fetch campaign from database
  // 2. Get creator's profile (name, email, company, experience)
  // 3. Query subscribers based on recipient filters
  // 4. Generate HTML email template with profile
  // 5. Send via email service with batching
  // 6. Update campaign status and results
  // 7. Revalidate path for fresh data
}
```

**Send action best practices:**
- Validate campaign status before sending
- Include sender profile information
- Apply recipient filters properly
- Use batch processing for large lists
- Update campaign with send results
- Handle partial failures gracefully
- Revalidate data after mutation

### 14.2 Email Feature Structure Example

```
email_list/
  actions/
    sendCampaign.ts           # Server action to send campaign
    createCampaign.ts         # Create campaign draft
    updateCampaign.ts         # Update campaign details
  components/
    EmailEditor.tsx           # Rich text email editor
    campaign/                 # Campaign-specific components
    subscriber/               # Subscriber-specific components
  pages/
    CampaignEditorPage.tsx    # Campaign creation/editing
    CampaignListPage.tsx      # Campaign management list
    SubscriberListPage.tsx    # Subscriber management list
  services/
    BrevoService.ts           # Email API integration
    SubscriberService.ts      # Subscriber data operations
  utils/
    emailTemplate.ts          # HTML email template generator
  types/
    Campaign.ts               # Campaign data types
    Subscriber.ts             # Subscriber data types
  validations/
    campaignValidations.ts    # Campaign form validation
    subscriberValidations.ts  # Subscriber form validation
  index.ts                    # Public API exports
```

### 14.3 Environment Variables for Email Integration

Required environment variables:
```env
# Email Service API
BREVO_API_KEY=your_api_key_here
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Your Company Name

# App URLs for email links
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Document these requirements in your README or .env.example file.

### 14.4 Email Sending Flow

1. **Draft Creation**: User creates campaign with name, subject, content
2. **Content Editing**: Rich text editor with preview
3. **Recipient Selection**: Filter subscribers by status, source, tags
4. **Validation**: Check all required fields, validate recipients exist
5. **Profile Injection**: Fetch sender's profile from database
6. **Template Generation**: Create HTML email with profile and content
7. **Batch Sending**: Split recipients into batches, respect rate limits
8. **Status Updates**: Track sending progress, handle failures
9. **Campaign Results**: Store success/failure counts, update status
10. **Revalidation**: Refresh data to show updated campaign status

### 14.5 Integration with User Profiles

Email campaigns should include sender information from user profiles:
```typescript
// In sendCampaign action
const supabase = await createClient();

// Get creator's profile
const { data: profile } = await supabase
  .from('profiles')
  .select('name, email, company_name')
  .eq('id', campaign.created_by)
  .single();

// Get therapist details
const { data: therapist } = await supabase
  .from('therapists')
  .select('years_experience')
  .eq('user_id', campaign.created_by)
  .single();

// Generate email with profile
const html = generateEmailTemplate({
  subject: campaign.subject,
  content: campaign.content,
  authorName: profile.name,
  authorCompany: profile.company_name,
  authorYearsExperience: therapist.years_experience,
});
```

This pattern ensures emails have a personal touch with sender credentials, similar to how blog posts display author information.

## 15. Benefits

This structure promotes:
- Modularity and reusability
- Clear separation of concerns
- Type safety and maintainability
- Consistent patterns across features
- Easy navigation and discoverability
- Scalable feature development
- Clean imports through barrel exports
- Clear boundaries between global and feature code
- Consistent admin UX across all list pages
- Professional email integration with third-party services

Follow these guidelines when creating new features to maintain consistency and maintainability across the application.
