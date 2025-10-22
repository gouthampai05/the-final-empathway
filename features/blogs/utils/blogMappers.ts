/**
 * Blog Data Mappers
 *
 * Utilities for transforming database rows into Blog objects.
 * Centralizes the mapping logic to eliminate duplication across actions and services.
 */

import { Blog } from '../types/Blog';
import { generateSlug } from '@/lib/contentUtils';

/**
 * Map database row to Blog object
 *
 * Transforms a raw database row from the 'blogs' table into a properly typed Blog object.
 * Handles default values, null coalescing, and slug generation.
 *
 * @param dbRow - Raw blog row from Supabase
 * @param authorName - Author's display name
 * @returns Fully typed Blog object
 *
 * @example
 * const { data: blogRow } = await supabase.from('blogs').select('*').eq('id', id).single();
 * const authorName = await getAuthorName(supabase, blogRow.user_id);
 * const blog = mapDatabaseRowToBlog(blogRow, authorName);
 */
export function mapDatabaseRowToBlog(
  dbRow: any,
  authorName: string
): Blog {
  return {
    id: dbRow.id,
    title: dbRow.title,
    slug: dbRow.slug || generateSlug(dbRow.title),
    content: dbRow.content,
    excerpt: dbRow.excerpt,
    status: dbRow.status,
    author: authorName,
    authorId: dbRow.user_id,
    tags: dbRow.tags || [],
    category: dbRow.category,
    featured: dbRow.featured,
    publishedAt: dbRow.published_at,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
    readTime: dbRow.read_time,
    views: dbRow.views || 0,
    likes: dbRow.likes || 0,
  };
}

/**
 * Map multiple database rows to Blog objects
 *
 * Batch version of mapDatabaseRowToBlog for mapping arrays of blog rows.
 * All blogs will have the same author name (useful when querying by user_id).
 *
 * @param dbRows - Array of raw blog rows from Supabase
 * @param authorName - Author's display name (same for all blogs)
 * @returns Array of fully typed Blog objects
 *
 * @example
 * const { data: blogRows } = await supabase.from('blogs').select('*').eq('user_id', userId);
 * const authorName = await getAuthorName(supabase, userId);
 * const blogs = mapDatabaseRowsToBlogs(blogRows, authorName);
 */
export function mapDatabaseRowsToBlogs(
  dbRows: any[] | null,
  authorName: string
): Blog[] {
  if (!dbRows) return [];
  return dbRows.map(row => mapDatabaseRowToBlog(row, authorName));
}
