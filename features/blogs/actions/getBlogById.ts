'use server';

import { createClient } from '@/supabase/server';
import { Blog } from '../types/Blog';
import { getAuthorName } from '@/lib/supabaseHelpers';
import { mapDatabaseRowToBlog } from '../utils/blogMappers';

/**
 * Server Action to fetch a single blog by ID
 *
 * Refactored to use helper utilities for common patterns:
 * - getAuthorName() for profile fetching
 * - mapDatabaseRowToBlog() for data transformation
 *
 * @param id - Blog ID
 * @returns Blog or null if not found
 */
export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('getBlogById error:', error);
      throw new Error(error.message || 'Failed to fetch blog');
    }

    if (!data) return null;

    // Get author name using helper
    const authorName = await getAuthorName(supabase, data.user_id);

    // Map to Blog object using helper
    return mapDatabaseRowToBlog(data, authorName);
  } catch (error) {
    console.error('getBlogById action error:', error);
    throw error;
  }
}
