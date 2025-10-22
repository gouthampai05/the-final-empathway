'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { loaderContainer, loaderItem } from './animations';

interface CardLoaderProps {
  count?: number;
  className?: string;
}

export const CardLoader: React.FC<CardLoaderProps> = ({
  count = 6,
  className = ''
}) => {
  return (
    <motion.div
      variants={loaderContainer}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} variants={loaderItem}>
          <Card className="overflow-hidden h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="space-y-2">
                {/* Category and status */}
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                {/* Title */}
                <Skeleton className="h-5 w-3/4" />
              </div>
            </CardHeader>
            <CardContent className="pb-3 flex-1 space-y-3">
              {/* Excerpt */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              {/* Meta info */}
              <div className="flex gap-3">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
              {/* Tags */}
              <div className="flex gap-1">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex gap-2 w-full">
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 w-10 rounded-lg" />
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
