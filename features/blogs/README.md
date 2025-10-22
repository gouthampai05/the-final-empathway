# Blog Feature

A comprehensive blog management system with a Notion-style rich text editor, built following the feature module design pattern.

## Structure

```
features/blogs/
├── components/           # React components
│   ├── BlogCard.tsx     # Blog card display component
│   ├── BlogEditor.tsx   # Rich text editor component
│   ├── BlogStats.tsx    # Statistics display component
│   ├── KeyboardShortcuts.tsx # Keyboard shortcuts modal
│   └── index.ts         # Component exports
├── config/              # Feature configuration
│   ├── blogConfig.ts    # Blog settings and constants
│   └── index.ts         # Config exports
├── hooks/               # Custom React hooks
│   ├── useBlogData.ts   # Data fetching hooks
│   ├── useBlogEditor.ts # Editor-specific hooks
│   └── index.ts         # Hook exports
├── pages/               # Page components
│   ├── BlogEditorPage.tsx # Main editor page
│   ├── BlogListPage.tsx   # Blog listing page
│   └── index.ts         # Page exports
├── services/            # Business logic and API
│   ├── blogServices.ts  # Blog API services
│   └── index.ts         # Service exports
├── types/               # TypeScript definitions
│   ├── Blog.ts          # Blog-related types
│   └── index.ts         # Type exports
├── utils/               # Helper functions (empty)
├── validations/         # Form validation
│   ├── blogValidations.ts # Blog validation schemas
│   └── index.ts         # Validation exports
├── data/                # Mock data
│   └── mockBlogs.ts     # Sample blog data
├── index.ts             # Main feature exports
└── README.md            # This file
```

## Features

### Rich Text Editor
- Notion-style interface with slash commands
- Advanced formatting (bold, italic, underline, etc.)
- Headings, lists, blockquotes, code blocks
- Image and link embedding
- Text alignment and color formatting
- Mobile-responsive design

### Blog Management
- Create, edit, and delete blog posts
- Draft and published status management
- Category and tag organization
- Featured post functionality
- Auto-save with visual indicators

### User Experience
- Real-time word count and read time
- Keyboard shortcuts for power users
- SEO preview and excerpt editing
- Responsive sidebar with settings
- Error handling and loading states

## Usage

### Import Components
```typescript
import { BlogEditor, BlogCard, BlogStats } from '@/features/blogs';
```

### Use the Editor
```typescript
import { BlogEditorPage } from '@/features/blogs';

// For new blog
<BlogEditorPage />

// For editing existing blog
<BlogEditorPage blogId="blog-id" />
```

### Access Routes
- `/blogs/new` - Create new blog
- `/blogs/[id]/edit` - Edit existing blog
- `/new_blogs` - Admin create blog

## Configuration

All configuration is centralized in `config/blogConfig.ts`:
- Blog categories and status options
- Editor extensions and settings
- Validation rules and limits

## Types

Type definitions are in `types/Blog.ts`:
- `Blog` - Main blog entity
- `CreateBlogData` - New blog creation
- `UpdateBlogData` - Blog updates
- `BlogFilters` - Search and filter options

## Services

API and business logic in `services/blogServices.ts`:
- CRUD operations for blogs
- Data transformation
- Error handling

## Hooks

Custom hooks in `hooks/`:
- `useBlogData` - Data fetching and state management
- `useBlogEditor` - Editor-specific functionality

This structure follows the feature module design pattern for maintainability and scalability.
