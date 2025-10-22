'use server';

import { createClient } from '@/supabase/server';
import { Blog, BlogFilters } from '../types/Blog';
import { getAuthUser, getAuthorName, applyFilters } from '@/lib/supabaseHelpers';
import { mapDatabaseRowsToBlogs } from '../utils/blogMappers';

/**
 * Server Action to fetch blogs for the authenticated user
 *
 * Refactored to use helper utilities:
 * - getAuthUser() for authentication
 * - getAuthorName() for profile fetching
 * - applyFilters() for query filtering
 * - mapDatabaseRowsToBlogs() for data transformation
 *
 * @param filters - Optional filters (status, category, tag)
 * @returns Array of blogs owned by the current user
 */
export async function getBlogs(filters?: BlogFilters): Promise<Blog[]> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const user = await getAuthUser(supabase);
    if (!user) return [];

    // Build base query
    let query = supabase
      .from('blogs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters using helper
    query = applyFilters(query, filters, {
      status: 'eq',
      category: 'eq',
      tag: 'contains',
    });

    const { data, error } = await query;

    if (error) {
      console.error('getBlogs error:', error);
      throw new Error(error.message || 'Failed to fetch blogs');
    }

    // Get author name and map all blogs
    const authorName = await getAuthorName(supabase, user.id, user.email || 'Unknown');
    return mapDatabaseRowsToBlogs(data, authorName);
  } catch (error) {
    console.error('getBlogs action error:', error);
    throw error;
  }
}
