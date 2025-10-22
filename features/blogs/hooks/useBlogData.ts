import { useState, useEffect, useCallback } from 'react';
import { Blog, BlogFilters, BlogStats } from '../types/Blog';
import { getBlogs, getBlogStats, getBlogById } from '../actions';

export const useBlogData = (filters?: BlogFilters) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [blogsData, statsData] = await Promise.all([
        getBlogs(filters),
        getBlogStats(),
      ]);
      setBlogs(blogsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const refreshBlogs = useCallback(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    stats,
    loading,
    error,
    refreshBlogs,
  };
};

export const useBlogById = (id: string) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const blogData = await getBlogById(id);
        setBlog(blogData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    } else {
      setBlog(null);
      setLoading(false);
      setError(null);
    }
  }, [id]);

  return {
    blog,
    loading,
    error,
  };
};
