'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Eye, Share2, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Blog } from '../../types/Blog';
import { useBlogLike } from '../../hooks';
import { toast } from 'sonner';

interface BlogHeaderProps {
  blog: Blog;
  profilePicUrl?: string | null;
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({ blog, profilePicUrl }) => {
  const { likes, hasLiked, toggleLike } = useBlogLike({
    blogId: blog.id,
    initialLikes: blog.likes,
  });

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: url,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      {/* Category Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Badge className="text-sm px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20">
          {blog.category}
        </Badge>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
      >
        {blog.title}
      </motion.h1>

      {/* Author & Meta Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-col gap-6"
      >
        {/* Author Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={profilePicUrl || undefined} alt={blog.author} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(blog.author)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-base">{blog.author}</p>
            <p className="text-sm text-muted-foreground">Psychologist</p>
          </div>
        </div>

        {/* Meta Info & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.publishedAt || blog.createdAt}>
                {format(new Date(blog.publishedAt || blog.createdAt), 'MMMM dd, yyyy')}
              </time>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{blog.readTime} min read</span>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{blog.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLike}
              className={hasLiked ? 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100' : ''}
            >
              <motion.div
                key={hasLiked ? 'liked' : 'unliked'}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <Heart className={`h-4 w-4 mr-2 inline-block ${hasLiked ? 'fill-current' : ''}`} />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={likes}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {likes.toLocaleString()}
                </motion.span>
              </AnimatePresence>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-8 origin-center"
      />
    </motion.header>
  );
};
