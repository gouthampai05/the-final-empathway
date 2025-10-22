import { motion } from 'framer-motion';
import { Mail, FileText, Send, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CampaignStats as CampaignStatsType } from '../../types/Campaign';
import { fadeInUp, getStaggerDelay, STAGGER_DELAY } from '@/lib/animations';

interface CampaignStatsCardProps {
  stats: CampaignStatsType;
}

export const CampaignStatsCard: React.FC<CampaignStatsCardProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Campaigns',
      value: stats.totalCampaigns,
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Draft',
      value: stats.draftCampaigns,
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Scheduled',
      value: stats.scheduledCampaigns,
      icon: Send,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Sent',
      value: stats.sentCampaigns,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            transition={{ delay: getStaggerDelay(index, STAGGER_DELAY.normal) }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
