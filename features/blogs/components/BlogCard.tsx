'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Blog } from '../types/Blog';
import { Eye, Heart, Clock, Edit, Trash2, Sparkles, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fadeInUpWithDelay,
  cardHover,
  scaleInCenter,
  statusPulse,
  buttonTap,
  STAGGER_DELAY,
  transition,
} from '@/lib/animations';

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  index?: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onEdit,
  onDelete,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: Blog['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
      .replace('about ', '')
      .replace(' ago', '');
  };

  return (
    <motion.div
      {...fadeInUpWithDelay(index, STAGGER_DELAY.fast)}
      whileHover={cardHover.hover}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg hover:border-primary/30 transition-all duration-200">
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={transition.fast}
        />

        {/* Sparkle effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              variants={scaleInCenter}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="absolute top-3 right-3 z-10"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="pb-3 relative z-10">
          {/* Status indicator and category */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {blog.category}
            </Badge>
            <div className="flex items-center gap-1.5">
              <motion.div animate={statusPulse}>
                <Circle className={`h-2 w-2 ${getStatusColor(blog.status)} rounded-full`} fill="currentColor" />
              </motion.div>
              <span className="text-xs text-muted-foreground capitalize">{blog.status}</span>
            </div>
          </div>

          {/* Title */}
          <motion.h3
            className="font-semibold line-clamp-2 text-base leading-snug group-hover:text-primary transition-colors"
            layout
          >
            {blog.title}
          </motion.h3>
        </CardHeader>

        <CardContent className="flex-1 pb-3 relative z-10 space-y-3">
          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Meta info - icon only, compact */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1" title={`${blog.readTime} min read`}>
              <Clock className="h-3.5 w-3.5" />
              <span>{blog.readTime}m</span>
            </div>
            <div className="flex items-center gap-1" title={`${blog.views} views`}>
              <Eye className="h-3.5 w-3.5" />
              <span>{blog.views}</span>
            </div>
            <div className="flex items-center gap-1" title={`${blog.likes} likes`}>
              <Heart className="h-3.5 w-3.5" />
              <span>{blog.likes}</span>
            </div>
            <div className="ml-auto text-muted-foreground/60" title={new Date(blog.createdAt).toLocaleString()}>
              {formatTimeAgo(blog.createdAt)}
            </div>
          </div>

          {/* Tags - minimal */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.tags.slice(0, 2).map((tag, idx) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    ...transition.fast,
                    delay: 0.1 + idx * STAGGER_DELAY.fast,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge variant="secondary" className="text-xs px-2 py-0">
                    {tag}
                  </Badge>
                </motion.div>
              ))}
              {blog.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  +{blog.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 relative z-10">
          <motion.div
            className="flex gap-2 w-full"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            transition={transition.fast}
          >
            <motion.div className="flex-1" whileTap={buttonTap}>
              <Button
                variant="default"
                size="sm"
                className="w-full gap-1.5"
                onClick={() => onEdit(blog)}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </motion.div>
            <motion.div whileTap={buttonTap}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(blog)}
                className="px-3"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
