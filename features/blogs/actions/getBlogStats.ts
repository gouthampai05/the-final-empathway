'use server';

import { createClient } from '@/supabase/server';
import { BlogStats } from '../types/Blog';

/**
 * Server Action to fetch blog statistics for the authenticated user
 * Returns counts of total, published, draft blogs, and total views/likes
 *
 * @returns Blog statistics
 */
export async function getBlogStats(): Promise<BlogStats> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
      };
    }

    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('status, views, likes')
      .eq('user_id', user.id);

    if (error) {
      console.error('getBlogStats error:', error);
      return {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
      };
    }

    const stats = (blogs || []).reduce(
      (acc, blog) => {
        acc.totalBlogs++;
        if (blog.status === 'published') acc.publishedBlogs++;
        if (blog.status === 'draft') acc.draftBlogs++;
        acc.totalViews += blog.views || 0;
        acc.totalLikes += blog.likes || 0;
        return acc;
      },
      {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
      }
    );

    return stats;
  } catch (error) {
    console.error('getBlogStats action error:', error);
    return {
      totalBlogs: 0,
      publishedBlogs: 0,
      draftBlogs: 0,
      totalViews: 0,
      totalLikes: 0,
    };
  }
}
