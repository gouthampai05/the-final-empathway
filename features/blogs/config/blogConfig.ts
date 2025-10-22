import { BlogStatus } from '../types/Blog';

export const BLOG_CONFIG = {
  itemsPerPage: 12,
  maxTitleLength: 100,
  maxExcerptLength: 200,
  maxTagsCount: 10,
  readingSpeed: 200, // words per minute
};

export const BLOG_CATEGORIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'development', label: 'Development' },
  { value: 'lifestyle', label: 'Lifestyle' },
] as const;

export const BLOG_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
] as const;

export const EDITOR_EXTENSIONS = [
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'heading',
  'paragraph',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'link',
  'image',
  'horizontalRule',
] as const;
