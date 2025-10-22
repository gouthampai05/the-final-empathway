'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';

/**
 * Server Action to delete a blog post
 * Removes the blog from the database and revalidates cached pages
 *
 * @param id - Blog ID to delete
 */
export async function deleteBlog(id: string): Promise<void> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Get blog info before deleting (for permission check and revalidation)
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('title, user_id, status')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message || 'Failed to fetch blog');
    }

    if (!blog) {
      throw new Error('Blog not found');
    }

    // Verify user owns this blog
    if (blog.user_id !== user.id) {
      throw new Error('You do not have permission to delete this blog');
    }

    // Delete the blog
    const { error, data } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(error.message || 'Failed to delete blog');
    }

    // Check if any rows were actually deleted
    if (!data || data.length === 0) {
      throw new Error('Failed to delete blog. This may be due to database permissions.');
    }

    // Revalidate blog list page
    revalidatePath('/blogs');

    // Revalidate all public blog pages if it was published
    if (blog.status === 'published') {
      revalidatePath('/blogs/[slug]', 'page');
    }
  } catch (error) {
    console.error('deleteBlog action error:', error);
    throw error;
  }
}
