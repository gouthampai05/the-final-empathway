'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';
import { calculateReadTime } from '@/lib/contentUtils';
import { CreateBlogData, Blog } from '../types/Blog';
import { requireAuth, getAuthorName } from '@/lib/supabaseHelpers';
import { mapDatabaseRowToBlog } from '../utils/blogMappers';

/**
 * Server Action to create a new blog post
 *
 * Refactored to use helper utilities:
 * - requireAuth() for authentication
 * - getAuthorName() for profile fetching
 * - mapDatabaseRowToBlog() for data transformation
 *
 * @param data - Blog creation data
 * @returns Created blog with all fields populated
 */
export async function createBlog(data: CreateBlogData): Promise<Blog> {
  try {
    const supabase = await createClient();

    // Require authenticated user
    const user = await requireAuth(supabase);

    const readTime = calculateReadTime(data.content);

    const insertData: any = {
      user_id: user.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags,
      category: data.category,
      featured: data.featured,
      status: data.status,
      read_time: readTime,
      published_at: data.status === 'published' ? new Date().toISOString() : null,
    };

    const { data: newBlog, error } = await supabase
      .from('blogs')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('createBlog error:', error);
      throw new Error(error.message || 'Failed to create blog');
    }

    // Get author name and map to Blog object
    const authorName = await getAuthorName(supabase, user.id, user.email || 'Unknown');
    const blog = mapDatabaseRowToBlog(newBlog, authorName);

    // Revalidate blog list page
    revalidatePath('/blogs');

    // Revalidate the public blog page if published
    if (data.status === 'published') {
      revalidatePath(`/blogs/${blog.slug}`);
      revalidatePath('/blogs/[slug]', 'page');
    }

    return blog;
  } catch (error) {
    console.error('createBlog action error:', error);
    throw error;
  }
}
