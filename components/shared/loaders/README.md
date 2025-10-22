# Loader Components

This directory contains reusable loading skeleton components that provide consistent loading UX across the application. All loaders use Framer Motion for smooth animations.

## Available Loaders

### PageLoader
Full-page loading spinner with optional message.

**Usage:**
```typescript
import { PageLoader } from '@/components/shared';

<PageLoader message="Loading..." />
```

**Props:**
- `message?: string` - Optional loading message to display

**Use Cases:**
- Full page transitions
- Initial app loading states
- Fallback loading states

---

### ContentLoader
Skeleton lines with staggered animations for text content.

**Usage:**
```typescript
import { ContentLoader } from '@/components/shared';

<ContentLoader />
```

**Use Cases:**
- Article content loading
- Text-heavy sections
- Description blocks

---

### CardLoader
Grid of card skeletons for entity lists.

**Usage:**
```typescript
import { CardLoader } from '@/components/shared';

<CardLoader count={6} />
```

**Props:**
- `count?: number` - Number of card skeletons to show (default: 6)
- `className?: string` - Additional CSS classes

**Use Cases:**
- Blog post grids
- Product listings
- Any card-based layouts

---

### EditorLoader
Rich editor-specific loading state with header and content sections.

**Usage:**
```typescript
import { EditorLoader } from '@/components/shared';

<EditorLoader />
```

**Layout:**
- Sticky header with back button, title, and action buttons
- Title input field skeleton
- Rich text editor content area skeleton
- Sidebar with settings cards

**Use Cases:**
- Blog editor page (`BlogEditorPage`)
- Campaign editor page (`CampaignEditorPage`)
- Any rich text editing interface

---

### TableLoader
Comprehensive table skeleton with optional stats, filters, and pagination.

**Usage:**
```typescript
import { TableLoader } from '@/components/shared';

<TableLoader rows={10} columns={6} showStats={true} statsCount={5} />
```

**Props:**
- `rows?: number` - Number of table rows (default: 10)
- `columns?: number` - Number of table columns (default: 6)
- `showStats?: boolean` - Show stats grid at top (default: true)
- `statsCount?: number` - Number of stat cards (default: 5, or 4 for compact layout)

**Layout:**
- Stats grid (5 cards)
- Header with filters and action button
- Table with animated rows
- Pagination controls

**Use Cases:**
- Admin list pages
- `BlogListPage`
- `SubscriberListPage`
- `CampaignListPage`

---

### DashboardLoader
Dashboard-specific skeleton matching the dashboard layout.

**Usage:**
```typescript
import { DashboardLoader } from '@/components/shared';

<DashboardLoader />
```

**Layout:**
- Welcome header section
- Profile overview card with 3-column grid
- 6 stat cards in responsive grid
- Side-by-side performance cards (blogs & campaigns)
- Quick actions section

**Use Cases:**
- Admin dashboard page
- Any dashboard-style overview page

---

### BlogViewLoader
Public blog viewing skeleton with header, content, and recommendations.

**Usage:**
```typescript
import { BlogViewLoader } from '@/components/shared';

<BlogViewLoader />
```

**Layout:**
- Blog header (category badge, title, author info, tags)
- Content blocks with image placeholders
- Footer (like/share buttons, author card)
- Recommended blogs grid (3 cards)

**Use Cases:**
- Public blog viewing pages (`/blogs/[slug]`)
- Article reading interfaces
- Next.js `loading.tsx` for blog routes

---

## Design Principles

### Consistency
All loaders follow the same design patterns:
- Use Skeleton component from `@/components/ui/skeleton`
- Implement Framer Motion animations
- Match the actual page layout structure
- Use staggered animation delays for visual polish

### Animation Patterns

All loaders use **consistent Framer Motion animations** with the same timing and easing:

**Container Pattern (Staggered Children):**
```typescript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 100ms delay between children
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

<motion.div
  variants={container}
  initial="hidden"
  animate="show"
>
  <motion.div variants={item}>{/* Child 1 */}</motion.div>
  <motion.div variants={item}>{/* Child 2 */}</motion.div>
</motion.div>
```

**Individual Element Pattern:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.1 }}
>
  {/* Content */}
</motion.div>
```

**Skeleton Component:**
All loaders use the `Skeleton` component from `@/components/ui/skeleton` instead of raw CSS `animate-pulse` for consistent pulsing animation.

### When to Create New Loaders

Create a new loader component when:
1. A page has a unique layout not covered by existing loaders
2. The page is reused across multiple routes
3. The loading state is complex enough to warrant abstraction

Keep loaders inline when:
1. The loading state is trivial (single spinner)
2. It's used only once
3. It's feature-specific and tightly coupled to one component

---

## Integration Examples

### With List Pages
```typescript
export const BlogListPage: React.FC = () => {
  const { loading } = useBlogData();

  if (loading) {
    return <TableLoader rows={10} columns={6} />;
  }

  // ... rest of component
};
```

### With Editor Pages
```typescript
export const BlogEditorPage: React.FC = ({ blogId }) => {
  const { blog, loading } = useBlogById(blogId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <EditorLoader />
      </div>
    );
  }

  // ... rest of component
};
```

### With Next.js loading.tsx
```typescript
// app/blogs/[slug]/loading.tsx
import { BlogViewLoader } from '@/components/shared';

export default function Loading() {
  return <BlogViewLoader />;
}
```

### With Dashboard
```typescript
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <DashboardLoader />;
  }

  // ... rest of component
};
```

---

## Architecture Notes

According to `docs/feature-module-design.md` (section 10.5):
- Global loaders live in `components/shared/loaders/`
- Feature-specific loaders should be in `features/{feature}/components/`
- All loaders use Framer Motion for consistent animations
- Prefer global loaders over inline loading states for consistency

---

## Contributing

When adding new loaders:
1. Create the component in this directory
2. Export it from `index.ts`
3. Document it in this README with usage examples
4. Match the animation patterns used in existing loaders
5. Ensure it matches the actual page layout structure
