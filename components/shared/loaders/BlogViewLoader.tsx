'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { loaderContainer, loaderItem, scaleIn, loaderTransitionQuick } from './animations';

/**
 * BlogViewLoader - Loading skeleton for public blog viewing pages
 * Matches the layout of BlogViewPage component with consistent Framer Motion animations
 */
export const BlogViewLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <motion.div
        variants={loaderContainer}
        initial="hidden"
        animate="show"
        className="relative"
      >
        {/* Blog Header Skeleton */}
        <motion.div
          variants={loaderItem}
          className="max-w-4xl mx-auto px-6 pt-12 pb-8"
        >
          {/* Category Badge */}
          <Skeleton className="h-6 w-24 rounded-full mb-6" />

          {/* Title */}
          <Skeleton className="h-12 w-full max-w-3xl mb-4" />
          <Skeleton className="h-12 w-3/4 mb-6" />

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-18 rounded-full" />
          </div>
        </motion.div>

        {/* Blog Content Skeleton */}
        <motion.div
          variants={loaderItem}
          className="max-w-4xl mx-auto px-6 space-y-6 py-8"
        >
          {/* Paragraph blocks */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={loaderTransitionQuick}
              className="space-y-3"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              {i % 3 === 0 && <div className="py-2" />}
            </motion.div>
          ))}

          {/* Image placeholder */}
          <motion.div
            {...scaleIn}
          >
            <Skeleton className="h-64 w-full rounded-lg my-8" />
          </motion.div>

          {/* More paragraphs */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`p2-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={loaderTransitionQuick}
              className="space-y-3"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </motion.div>
          ))}
        </motion.div>

        {/* Blog Footer Skeleton */}
        <motion.div
          variants={loaderItem}
          className="max-w-4xl mx-auto px-6 py-8 mt-12"
        >
          <Separator className="mb-8" />

          {/* Like/Share buttons */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>

          {/* Author Card */}
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommended Blogs Skeleton */}
        <motion.div
          variants={loaderItem}
          className="max-w-7xl mx-auto px-6 py-12"
        >
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={loaderTransitionQuick}
                className="space-y-4"
              >
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center gap-4 pt-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
