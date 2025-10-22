import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fadeInUp, getStaggerDelay, STAGGER_DELAY } from '@/lib/animations';

export interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: {
    default?: number;
    md?: number;
    lg?: number;
  };
  variant?: 'default' | 'compact';
  animate?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = { default: 1, md: 2, lg: 4 },
  variant = 'compact',
  animate = true,
}) => {
  // Build grid class based on column configuration
  const getGridClass = () => {
    const cols = columns.default || 1;
    const mdCols = columns.md || 2;
    const lgCols = columns.lg || 4;

    const colsClass = cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-4';
    const mdClass = mdCols === 1 ? 'md:grid-cols-1' : mdCols === 2 ? 'md:grid-cols-2' : mdCols === 3 ? 'md:grid-cols-3' : mdCols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-5';
    const lgClass = lgCols === 1 ? 'lg:grid-cols-1' : lgCols === 2 ? 'lg:grid-cols-2' : lgCols === 3 ? 'lg:grid-cols-3' : lgCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5';

    return `grid gap-4 ${colsClass} ${mdClass} ${lgClass}`;
  };

  if (variant === 'default') {
    // Blog-style stats (header/content layout with icon in header)
    return (
      <div className={getGridClass()}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Compact style (email_list style with icon on right)
  return (
    <div className={getGridClass()}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const content = (
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor || 'bg-gray-50'} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );

        if (animate) {
          return (
            <motion.div
              key={stat.title}
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              transition={{ delay: getStaggerDelay(index, STAGGER_DELAY.normal) }}
            >
              {content}
            </motion.div>
          );
        }

        return <div key={stat.title}>{content}</div>;
      })}
    </div>
  );
};
