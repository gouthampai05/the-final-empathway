'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { loaderContainer, loaderItem } from './animations';

export const EditorLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </motion.header>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <motion.main
          variants={loaderContainer}
          initial="hidden"
          animate="show"
          className="flex-1 max-w-4xl mx-auto px-4 py-6 lg:px-6"
        >
          {/* Title Skeleton */}
          <motion.div variants={loaderItem} className="mb-8">
            <Skeleton className="h-12 w-3/4 rounded" />
          </motion.div>

          {/* Editor Toolbar Skeleton */}
          <motion.div variants={loaderItem} className="mb-4">
            <div className="flex gap-1 flex-wrap border-b pb-2">
              {Array.from({ length: 18 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded" />
              ))}
            </div>
          </motion.div>

          {/* Editor Content Skeleton */}
          <motion.div
            variants={loaderItem}
            className="min-h-[500px] bg-muted/30 rounded-lg border border-border p-6 space-y-4"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-4"
                style={{
                  width: `${Math.random() * 30 + 60}%`,
                }}
              />
            ))}
          </motion.div>
        </motion.main>

        {/* Sidebar Skeleton */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full lg:w-80 border-l-0 lg:border-l border-t lg:border-t-0 bg-muted/30 p-4 lg:p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Tabs */}
          <Skeleton className="h-10 w-full rounded-lg" />

          {/* Cards */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </motion.aside>
      </div>
    </div>
  );
};
