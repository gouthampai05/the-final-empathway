'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { loaderContainer, loaderItemLeft } from './animations';

interface ContentLoaderProps {
  lines?: number;
  className?: string;
}

export const ContentLoader: React.FC<ContentLoaderProps> = ({
  lines = 5,
  className = ''
}) => {
  return (
    <motion.div
      variants={loaderContainer}
      initial="hidden"
      animate="show"
      className={`space-y-3 ${className}`}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div key={i} variants={loaderItemLeft}>
          <Skeleton
            className="h-4"
            style={{ width: `${Math.random() * 30 + 70}%` }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
