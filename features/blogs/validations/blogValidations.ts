import { z } from 'zod';
import { BLOG_CONFIG } from '../config/blogConfig';

// Individual field validations
export const blogTitleValidation = z
  .string()
  .min(1, 'Title is required')
  .min(5, 'Title must be at least 5 characters')
  .max(BLOG_CONFIG.maxTitleLength, `Title must be less than ${BLOG_CONFIG.maxTitleLength} characters`)
  .trim();

export const blogContentValidation = z
  .string()
  .min(1, 'Content is required')
  .min(50, 'Content must be at least 50 characters for a meaningful blog post');

export const blogExcerptValidation = z
  .string()
  .max(BLOG_CONFIG.maxExcerptLength, `Excerpt must be less than ${BLOG_CONFIG.maxExcerptLength} characters`)
  .trim()
  .optional();

export const blogCategoryValidation = z
  .string()
  .min(1, 'Category is required')
  .trim();

export const blogTagsValidation = z
  .array(z.string().min(1, 'Tag cannot be empty').trim())
  .max(BLOG_CONFIG.maxTagsCount, `Maximum ${BLOG_CONFIG.maxTagsCount} tags allowed`)
  .default([]);

export const blogStatusValidation = z
  .enum(['draft', 'published', 'archived'], {
    message: 'Status must be draft, published, or archived'
  })
  .default('draft');

export const blogFeaturedValidation = z
  .boolean()
  .default(false);

// Main blog schema
export const blogSchema = z.object({
  title: blogTitleValidation,
  content: blogContentValidation,
  excerpt: blogExcerptValidation,
  category: blogCategoryValidation,
  tags: blogTagsValidation,
  status: blogStatusValidation,
  featured: blogFeaturedValidation,
});

// Blog update schema (partial)
export const blogUpdateSchema = blogSchema.partial();

export type BlogFormData = z.infer<typeof blogSchema>;
export type BlogUpdateData = z.infer<typeof blogUpdateSchema>;

// Helper function for validation
export const validateBlogForm = (data: unknown) => {
  return blogSchema.safeParse(data);
};
