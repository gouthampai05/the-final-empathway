import { notFound } from 'next/navigation';
import { createClient } from '@/supabase/server';
import { BlogViewPage } from '@/features/blogs';
import { Blog } from '@/features/blogs/types/Blog';
import { generateSlug } from '@/lib/contentUtils';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogBySlug(slug: string): Promise<{ blog: Blog; profilePicUrl: string | null } | null> {
  const supabase = await createClient();

  // First try to find by slug
  let { data } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  // If not found by slug, try to find by matching generated slug from title
  if (!data) {
    const { data: allBlogs } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published');

    if (allBlogs) {
      data = allBlogs.find(blog => {
        const generatedSlug = blog.slug || generateSlug(blog.title);
        return generatedSlug === slug;
      }) || null;
    }
  }

  if (!data) {
    return null;
  }

  // Get author name and profile picture from profiles
  let authorName = 'Therapist'; // Default fallback
  let profilePicUrl: string | null = null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, profile_pic_url')
    .eq('id', data.user_id)
    .maybeSingle();

  // Use name if it exists and is not empty, otherwise keep "Therapist" as fallback
  if (profile?.name && profile.name.trim() !== '') {
    authorName = profile.name;
  }
  if (profile?.profile_pic_url) {
    profilePicUrl = profile.profile_pic_url;
  }

  // Increment view count (fire and forget)
  supabase
    .from('blogs')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', data.id)
    .then();

  return {
    blog: {
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
      views: data.views || 0,
      likes: data.likes || 0,
    },
    profilePicUrl,
  };
}

async function getRecommendedBlogs(currentBlog: Blog): Promise<Blog[]> {
  const supabase = await createClient();

  // Fetch published blogs from the same category, excluding current blog
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .eq('category', currentBlog.category)
    .neq('id', currentBlog.id)
    .order('published_at', { ascending: false })
    .limit(10);

  if (!blogs) return [];

  // Fetch all unique author IDs
  const authorIds = [...new Set(blogs.map(blog => blog.user_id))];

  // Fetch author names for all blogs at once
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name')
    .in('id', authorIds);

  // Create a map of user_id to author name, with fallback for empty names
  const authorMap = new Map(
    profiles?.map(p => [p.id, p.name && p.name.trim() !== '' ? p.name : 'Therapist']) || []
  );

  // Convert to Blog type and calculate relevance score based on shared tags
  const recommendedBlogs: Blog[] = blogs.map(data => ({
    id: data.id,
    title: data.title,
    slug: data.slug || generateSlug(data.title),
    content: data.content,
    excerpt: data.excerpt,
    status: data.status,
    author: authorMap.get(data.user_id) || 'Therapist',
    authorId: data.user_id,
    tags: data.tags || [],
    category: data.category,
    featured: data.featured,
    publishedAt: data.published_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    readTime: data.read_time,
    views: data.views || 0,
    likes: data.likes || 0,
  }));

  // Sort by shared tags (more relevant first)
  const currentTags = new Set(currentBlog.tags);
  recommendedBlogs.sort((a, b) => {
    const aSharedTags = a.tags.filter(tag => currentTags.has(tag)).length;
    const bSharedTags = b.tags.filter(tag => currentTags.has(tag)).length;
    return bSharedTags - aSharedTags;
  });

  return recommendedBlogs.slice(0, 5);
}

// Generate static params for published blogs (for build-time generation)
export async function generateStaticParams() {
  // Use service role client for build-time generation (no cookies needed)
  const { createClient: createServiceClient } = await import('@supabase/supabase-js');
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  );

  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, title')
    .eq('status', 'published')
    .limit(100); // Limit for build performance

  if (!blogs) return [];

  return blogs.map((blog) => ({
    slug: blog.slug || generateSlug(blog.title),
  }));
}

// Enable ISR with 60 second revalidation
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);

  if (!result) {
    return {
      title: 'Blog Not Found',
    };
  }

  const { blog } = result;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://empathway.com';
  const blogUrl = `${baseUrl}/blogs/${slug}`;

  return {
    title: blog.title,
    description: blog.excerpt,
    authors: [{ name: blog.author }],
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: blogUrl,
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author],
      tags: blog.tags,
      siteName: 'Empathway',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      creator: '@empathway',
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);

  if (!result) {
    notFound();
  }

  const { blog, profilePicUrl } = result;
  const recommendedBlogs = await getRecommendedBlogs(blog);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://empathway.com';
  const blogUrl = `${baseUrl}/blogs/${slug}`;

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    author: {
      '@type': 'Person',
      name: blog.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Empathway',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
    keywords: blog.tags.join(', '),
    articleSection: blog.category,
    wordCount: blog.readTime * 200, // Approximate word count
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogViewPage blog={blog} profilePicUrl={profilePicUrl} recommendedBlogs={recommendedBlogs} />
    </>
  );
}
