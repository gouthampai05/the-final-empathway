'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { loaderContainer, loaderItem } from './animations';

interface TableLoaderProps {
  rows?: number;
  columns?: number;
  showStats?: boolean;
  statsCount?: number;
}

export const TableLoader: React.FC<TableLoaderProps> = ({
  rows = 10,
  columns = 6,
  showStats = true,
  statsCount = 5,
}) => {
  return (
    <motion.div
      variants={loaderContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats skeleton */}
      {showStats && (
        <motion.div
          variants={loaderItem}
          className={`grid gap-4 ${
            statsCount === 4
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
          }`}
        >
          {Array.from({ length: statsCount }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-12 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Header section */}
      <motion.div
        variants={loaderItem}
        className="flex flex-col gap-4"
      >
        {/* Page title and action */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 flex-1 sm:w-64 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </motion.div>

      {/* Table skeleton */}
      <motion.div
        variants={loaderItem}
        className="border rounded-lg bg-card overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="h-12 px-4 text-left align-middle">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-border last:border-b-0"
                >
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td key={colIndex} className="h-16 px-4 align-middle">
                      <Skeleton
                        className="h-4"
                        style={{
                          width: `${60 + Math.random() * 40}%`,
                        }}
                      />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination skeleton */}
      <motion.div
        variants={loaderItem}
        className="flex items-center justify-between"
      >
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
        </div>
      </motion.div>
    </motion.div>
  );
};
