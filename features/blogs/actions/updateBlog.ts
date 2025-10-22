'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';
import { calculateReadTime } from '@/lib/contentUtils';
import { UpdateBlogData, Blog } from '../types/Blog';
import { getAuthorName } from '@/lib/supabaseHelpers';
import { mapDatabaseRowToBlog } from '../utils/blogMappers';

/**
 * Server Action to update an existing blog post
 *
 * Refactored to use helper utilities:
 * - getAuthorName() for profile fetching
 * - mapDatabaseRowToBlog() for data transformation
 *
 * @param data - Blog update data with id
 * @returns Updated blog with all fields populated
 */
export async function updateBlog(data: UpdateBlogData): Promise<Blog> {
  try {
    const supabase = await createClient();

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) {
      updateData.content = data.content;
      updateData.read_time = calculateReadTime(data.content);
    }
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.status !== undefined) {
      updateData.status = data.status;
      // Set published_at if status changed to published and it wasn't published before
      if (data.status === 'published') {
        const { data: currentBlog } = await supabase
          .from('blogs')
          .select('published_at')
          .eq('id', data.id)
          .single();

        if (currentBlog && !currentBlog.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }
    }

    const { data: updatedBlog, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', data.id)
      .select('*')
      .single();

    if (error) {
      console.error('updateBlog error:', error);
      throw new Error(error.message || 'Failed to update blog');
    }

    // Get author name and map to Blog object
    const authorName = await getAuthorName(supabase, updatedBlog.user_id);
    const blog = mapDatabaseRowToBlog(updatedBlog, authorName);

    // Revalidate blog list page
    revalidatePath('/blogs');

    // Revalidate the public blog page if published
    if (updatedBlog.status === 'published') {
      revalidatePath(`/blogs/${blog.slug}`);
      revalidatePath('/blogs/[slug]', 'page');
    }

    return blog;
  } catch (error) {
    console.error('updateBlog action error:', error);
    throw error;
  }
}
