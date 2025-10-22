'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Blog } from '../../types/Blog';

interface BlogFooterProps {
  blog: Blog;
}

export const BlogFooter: React.FC<BlogFooterProps> = ({ blog }) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="max-w-4xl">
        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Badge variant="secondary" className="text-sm px-3 py-1.5 cursor-pointer">
                    #{tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.footer>
  );
};
