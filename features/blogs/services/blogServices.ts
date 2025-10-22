import { Blog, CreateBlogData, UpdateBlogData, BlogStats, BlogFilters } from '../types/Blog';
import { calculateReadTime, generateSlug } from '@/lib/contentUtils';
import { createClient } from '@/supabase/client';

export const blogService = {
  async getBlogs(filters?: BlogFilters): Promise<Blog[]> {
    try {
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error('Authentication required');
      if (!user) return [];

      let query = supabase
        .from('blogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.tag) {
        query = query.contains('tags', [filters.tag]);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code || 'unknown'})`);
      }

      // Get author name from profiles
      let authorName = user.email || 'Unknown';
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        if (profile?.name) {
          authorName = profile.name;
        }
      } catch (err) {
        console.warn('Could not fetch profile name:', err);
      }

      return (data || []).map(blog => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug || generateSlug(blog.title),
        content: blog.content,
        excerpt: blog.excerpt,
        status: blog.status,
        author: authorName,
        authorId: blog.user_id,
        tags: blog.tags || [],
        category: blog.category,
        featured: blog.featured,
        publishedAt: blog.published_at,
        createdAt: blog.created_at,
        updatedAt: blog.updated_at,
        readTime: blog.read_time,
        views: blog.views,
        likes: blog.likes,
      }));
    } catch (error) {
      console.error('getBlogs error:', error);
      throw error;
    }
  },

  async getBlogById(id: string): Promise<Blog | null> {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('getBlogById error:', error);
        throw error;
      }

      if (!data) return null;

      // Get author name from profiles
      let authorName = 'Unknown';
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', data.user_id)
          .single();
        if (profile?.name) {
          authorName = profile.name;
        }
      } catch (err) {
        console.warn('Could not fetch profile name:', err);
      }

      return {
        id: data.id,
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        author: authorName,
        authorId: data.user_id,
        tags: data.tags || [],
        category: data.category,
        featured: data.featured,
        publishedAt: data.published_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        readTime: data.read_time,
        views: data.views,
        likes: data.likes,
      };
    } catch (error) {
      console.error('getBlogById error:', error);
      throw error;
    }
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('getBlogBySlug error:', error);
        throw error;
      }

      if (!data) return null;

      // Get author name from profiles
      let authorName = 'Unknown';
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', data.user_id)
          .single();
        if (profile?.name) {
          authorName = profile.name;
        }
      } catch (err) {
        console.warn('Could not fetch profile name:', err);
      }

      // Increment view count
      await supabase
        .from('blogs')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id);

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        author: authorName,
        authorId: data.user_id,
        tags: data.tags || [],
        category: data.category,
        featured: data.featured,
        publishedAt: data.published_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        readTime: data.read_time,
        views: data.views || 0,
        likes: data.likes,
      };
    } catch (error) {
      console.error('getBlogBySlug error:', error);
      throw error;
    }
  },

  async createBlog(data: CreateBlogData): Promise<Blog> {
    try {
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error('User not authenticated');
      if (!user) throw new Error('User not authenticated');

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

      // Don't try to insert slug - column doesn't exist yet
      const { data: newBlog, error } = await supabase
        .from('blogs')
        .insert(insertData)
        .select('*')
        .single();

      if (error) {
        console.error('createBlog error:', error);
        throw error;
      }

      // Get author name from profiles
      let authorName = user.email || 'Unknown';
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        if (profile?.name) {
          authorName = profile.name;
        }
      } catch (err) {
        console.warn('Could not fetch profile name:', err);
      }

      const blog = {
        id: newBlog.id,
        title: newBlog.title,
        slug: newBlog.slug || generateSlug(newBlog.title),
        content: newBlog.content,
        excerpt: newBlog.excerpt,
        status: newBlog.status,
        author: authorName,
        authorId: user.id,
        tags: newBlog.tags || [],
        category: newBlog.category,
        featured: newBlog.featured,
        publishedAt: newBlog.published_at,
        createdAt: newBlog.created_at,
        updatedAt: newBlog.updated_at,
        readTime: newBlog.read_time,
        views: newBlog.views || 0,
        likes: newBlog.likes || 0,
      };

      // Revalidate the blog page if published
      if (data.status === 'published') {
        try {
          await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: blog.slug }),
          });
        } catch (err) {
          console.warn('Failed to revalidate blog page:', err);
        }
      }

      return blog;
    } catch (error) {
      console.error('createBlog error:', error);
      throw error;
    }
  },

  async updateBlog(data: UpdateBlogData): Promise<Blog> {
    try {
      const supabase = createClient();

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

      // Don't try to update slug - column doesn't exist yet
      const { data: updatedBlog, error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', data.id)
        .select('*')
        .single();

      if (error) {
        console.error('updateBlog error:', error);
        throw error;
      }

      // Get author name from profiles
      let authorName = 'Unknown';
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', updatedBlog.user_id)
          .single();
        if (profile?.name) {
          authorName = profile.name;
        }
      } catch (err) {
        console.warn('Could not fetch profile name:', err);
      }

      const blog = {
        id: updatedBlog.id,
        title: updatedBlog.title,
        slug: updatedBlog.slug || generateSlug(updatedBlog.title),
        content: updatedBlog.content,
        excerpt: updatedBlog.excerpt,
        status: updatedBlog.status,
        author: authorName,
        authorId: updatedBlog.user_id,
        tags: updatedBlog.tags || [],
        category: updatedBlog.category,
        featured: updatedBlog.featured,
        publishedAt: updatedBlog.published_at,
        createdAt: updatedBlog.created_at,
        updatedAt: updatedBlog.updated_at,
        readTime: updatedBlog.read_time,
        views: updatedBlog.views || 0,
        likes: updatedBlog.likes || 0,
      };

      // Revalidate the blog page if published
      if (updatedBlog.status === 'published') {
        try {
          await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: blog.slug }),
          });
        } catch (err) {
          console.warn('Failed to revalidate blog page:', err);
        }
      }

      return blog;
    } catch (error) {
      console.error('updateBlog error:', error);
      throw error;
    }
  },

  async deleteBlog(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getBlogStats(): Promise<BlogStats> {
    try {
      const supabase = createClient();

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
        console.error('Supabase stats error:', error);
        // Return empty stats instead of throwing
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
      console.error('getBlogStats error:', error);
      return {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
      };
    }
  },
};
