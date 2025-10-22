'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Blog } from '../types/Blog';
import {
  BlogHeader,
  BlogContent,
  BlogFooter,
  RecommendedBlogs,
} from '../components/blog-view';

interface BlogViewPageProps {
  blog: Blog;
  profilePicUrl?: string | null;
  recommendedBlogs?: Blog[];
}

export const BlogViewPage: React.FC<BlogViewPageProps> = ({
  blog,
  profilePicUrl,
  recommendedBlogs = []
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Main Content */}
      <div className="relative">
        {/* Blog Header */}
        <BlogHeader blog={blog} profilePicUrl={profilePicUrl} />

        {/* Blog Content */}
        <div className="max-w-4xl mx-auto px-6">
          <BlogContent content={blog.content} />
        </div>

        {/* Blog Footer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <BlogFooter blog={blog} />
        </motion.div>

        {/* Recommended Blogs Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <RecommendedBlogs blogs={recommendedBlogs} currentBlogId={blog.id} />
        </div>
      </div>

      {/* Bottom Padding with Gradient */}
      <div className="h-20 bg-gradient-to-b from-transparent to-muted/10" />
    </div>
  );
};
