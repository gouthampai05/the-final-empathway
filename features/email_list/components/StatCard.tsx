import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, Mail, TrendingUp, Users } from 'lucide-react';
import { StatCard as StatCardType } from "@/types/StatCard";

export const getStatsConfig = (stats: { total: number; sent: number; avgOpenRate: number; totalRecipients: number }): StatCardType[] => [
  {
    title: "Total Campaigns",
    value: stats.total,
    description: "All campaigns",
    icon: <Send className="w-4 h-4 text-muted-foreground" />
  },
  {
    title: "Sent Campaigns",
    value: stats.sent,
    description: "Successfully sent",
    icon: <Mail className="w-4 h-4 text-green-600" />,
    color: "text-green-600"
  },
  {
    title: "Avg. Open Rate",
    value: `${stats.avgOpenRate.toFixed(1)}%`,
    description: "Email opens",
    icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
    color: "text-blue-600"
  },
  {
    title: "Total Recipients",
    value: stats.totalRecipients,
    description: "Emails sent",
    icon: <Users className="w-4 h-4 text-purple-600" />,
    color: "text-purple-600"
  }
];

export function StatCard({ stat }: { stat: StatCardType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        {stat.icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${stat.color || ''}`}>
          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
        </div>
        <p className="text-xs text-muted-foreground">{stat.description}</p>
      </CardContent>
    </Card>
  );
}