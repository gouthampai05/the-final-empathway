'use client';

import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '../../types/Blog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface RecommendedBlogsProps {
  blogs: Blog[];
  currentBlogId: string;
}

export const RecommendedBlogs: React.FC<RecommendedBlogsProps> = ({ blogs, currentBlogId }) => {
  // Use fake data if no blogs provided
  const fakeBlogs: Blog[] = [
    {
      id: 'fake-1',
      title: 'Understanding Anxiety: A Comprehensive Guide',
      slug: 'understanding-anxiety',
      excerpt: 'Learn about the signs, symptoms, and effective coping strategies for managing anxiety.',
      category: 'Mental Health',
      readTime: 8,
      featured: false,
      content: '',
      status: 'published',
      author: 'Dr. Sarah Johnson',
      authorId: 'fake-author',
      tags: ['anxiety', 'mental-health'],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1234,
      likes: 45
    },
    {
      id: 'fake-2',
      title: 'Building Resilience in Difficult Times',
      slug: 'building-resilience',
      excerpt: 'Practical techniques to strengthen your mental resilience and bounce back from challenges.',
      category: 'Self-Care',
      readTime: 6,
      featured: true,
      content: '',
      status: 'published',
      author: 'Dr. Michael Chen',
      authorId: 'fake-author',
      tags: ['resilience', 'wellness'],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 2156,
      likes: 89
    },
    {
      id: 'fake-3',
      title: 'The Power of Mindfulness Meditation',
      slug: 'mindfulness-meditation',
      excerpt: 'Discover how daily mindfulness practice can transform your mental well-being.',
      category: 'Mindfulness',
      readTime: 5,
      featured: false,
      content: '',
      status: 'published',
      author: 'Dr. Emily Rodriguez',
      authorId: 'fake-author',
      tags: ['mindfulness', 'meditation'],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 987,
      likes: 34
    },
    {
      id: 'fake-4',
      title: 'Healthy Boundaries: Why They Matter',
      slug: 'healthy-boundaries',
      excerpt: 'Learn to set and maintain healthy boundaries in your relationships and daily life.',
      category: 'Relationships',
      readTime: 7,
      featured: false,
      content: '',
      status: 'published',
      author: 'Dr. James Wilson',
      authorId: 'fake-author',
      tags: ['boundaries', 'relationships'],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1543,
      likes: 67
    },
    {
      id: 'fake-5',
      title: 'Sleep and Mental Health Connection',
      slug: 'sleep-mental-health',
      excerpt: 'Understanding the crucial link between quality sleep and emotional well-being.',
      category: 'Wellness',
      readTime: 6,
      featured: false,
      content: '',
      status: 'published',
      author: 'Dr. Lisa Martinez',
      authorId: 'fake-author',
      tags: ['sleep', 'wellness'],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1876,
      likes: 53
    }
  ];

  const allBlogs = blogs.length > 0
    ? blogs.filter(blog => blog.id !== currentBlogId)
    : fakeBlogs;

  const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const INITIAL_LOAD = 3;
  const LOAD_MORE = 3;

  useEffect(() => {
    // Initial load
    setDisplayedBlogs(allBlogs.slice(0, INITIAL_LOAD));
    setHasMore(allBlogs.length > INITIAL_LOAD);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore) return;

      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // Load more when user is 300px from bottom
      if (scrollPosition > pageHeight - 300) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, displayedBlogs.length]);

  const loadMore = () => {
    const currentLength = displayedBlogs.length;
    const nextBlogs = allBlogs.slice(currentLength, currentLength + LOAD_MORE);

    if (nextBlogs.length > 0) {
      setDisplayedBlogs(prev => [...prev, ...nextBlogs]);
      if (currentLength + nextBlogs.length >= allBlogs.length) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Subscribed! We\'ll notify you of new content');
        setEmail('');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">More Articles</h2>
        <p className="text-muted-foreground">Continue exploring our content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBlogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={`/blogs/${blog.slug}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-border/50 hover:border-primary/30 h-full">
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full bg-muted overflow-hidden">
                    {blog.featured ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-background" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl font-bold text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                        {blog.title.charAt(0)}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="text-xs bg-background/90 backdrop-blur-sm">
                        {blog.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h4 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {blog.title}
                    </h4>

                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{blog.readTime} min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="font-medium">Read</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* End of content message with newsletter signup */}
      {!hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12 px-4 max-w-md mx-auto"
        >
          <p className="text-lg text-muted-foreground mb-2">
            No more content to feed your cranium as of now :(
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            More coming soon though, so sign up to our newsletter to be notified ;)
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};
