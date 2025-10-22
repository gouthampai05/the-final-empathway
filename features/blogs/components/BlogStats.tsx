import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogStats as BlogStatsType } from '../types/Blog';
import { FileText, Eye, Heart, Archive } from 'lucide-react';

interface BlogStatsProps {
  stats: BlogStatsType;
}

export const BlogStats: React.FC<BlogStatsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Published',
      value: stats.publishedBlogs,
      icon: Eye,
      color: 'text-green-600',
    },
    {
      title: 'Drafts',
      value: stats.draftBlogs,
      icon: Archive,
      color: 'text-yellow-600',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-600',
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
