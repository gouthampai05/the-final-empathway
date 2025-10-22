import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { generateSlug } from '@/lib/contentUtils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://empathway.com';

  // Use service client for sitemap generation (no cookies needed)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  );

  // Fetch all published blogs
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, title, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Generate blog URLs
  const blogUrls: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug || generateSlug(blog.title)}`,
    lastModified: new Date(blog.updated_at || blog.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...blogUrls];
}
