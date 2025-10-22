'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FileText,
  Users,
  Eye,
  Send,
  TrendingUp,
  Mail,
  User,
  Phone,
  Building,
  Award,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { DashboardLoader } from '@/components/shared';
import { Separator } from '@/components/ui/separator';
import { getDashboardData, type DashboardData } from './actions';
import { ProfileEditDialog } from './components/ProfileEditDialog';
import { formatDistanceToNow } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
}

function StatCard({ title, value, description, icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={color || 'text-muted-foreground'}>{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error || 'Failed to load dashboard'}</p>
        <Button onClick={fetchData} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const { profile, therapistDetails, blogStats, campaignStats, subscriberStats, latestBlogs, latestCampaigns } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Section with Profile Integration */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
        onMouseEnter={() => setHoveredSection('header')}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {profile?.name || 'Therapist'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening with your practice today
            </p>
          </div>
          {hoveredSection === 'header' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Profile Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative"
        onMouseEnter={() => setHoveredSection('profile')}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <Card className="relative overflow-hidden">
          {hoveredSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 right-4 z-10"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </motion.div>
          )}
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Professional information and expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.name || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.phone_number || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.company_name || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Experience</p>
                    <p className="text-sm text-muted-foreground">
                      {therapistDetails?.years_experience || 0} years
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {therapistDetails?.expertise?.length ? (
                    therapistDetails.expertise.map((area, index) => (
                      <Badge key={index} variant="secondary">
                        {area}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No specializations added</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Blogs"
          value={blogStats.totalBlogs}
          description="All articles"
          icon={<FileText className="h-4 w-4" />}
          color="text-blue-600"
          delay={0.15}
        />
        <StatCard
          title="Blog Views"
          value={blogStats.totalViews}
          description="Total impressions"
          icon={<Eye className="h-4 w-4" />}
          color="text-green-600"
          delay={0.2}
        />
        <StatCard
          title="Subscribers"
          value={subscriberStats.totalSubscribers}
          description="Email list size"
          icon={<Users className="h-4 w-4" />}
          color="text-purple-600"
          delay={0.25}
        />
        <StatCard
          title="Active Subscribers"
          value={subscriberStats.activeSubscribers}
          description="Engaged audience"
          icon={<TrendingUp className="h-4 w-4" />}
          color="text-emerald-600"
          delay={0.3}
        />
        <StatCard
          title="Total Campaigns"
          value={campaignStats.totalCampaigns}
          description="Email campaigns"
          icon={<Mail className="h-4 w-4" />}
          color="text-orange-600"
          delay={0.35}
        />
        <StatCard
          title="Campaigns Sent"
          value={campaignStats.sentCampaigns}
          description="Successfully delivered"
          icon={<Send className="h-4 w-4" />}
          color="text-pink-600"
          delay={0.4}
        />
      </div>

      {/* Latest Blog Performance & Email Campaign Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* Latest Blog Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Latest Blog Performance</CardTitle>
                <CardDescription>Top performing articles</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/blogs')}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestBlogs.length > 0 ? (
              latestBlogs.map((blog, index) => (
                <div key={blog.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="space-y-1">
                    <p className="font-medium text-sm line-clamp-1">{blog.title}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {blog.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {blog.likes} likes
                      </div>
                      <span>
                        {formatDistanceToNow(new Date(blog.publishedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No published blogs yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Latest Email Campaign Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Latest Email Campaigns</CardTitle>
                <CardDescription>Recent campaign activity</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/email_list/campaign')}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestCampaigns.length > 0 ? (
              latestCampaigns.map((campaign, index) => (
                <div key={campaign.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm line-clamp-1">{campaign.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {campaign.recipientCount} recipients
                      </div>
                      {campaign.status === 'Sent' && (
                        <>
                          <span>Open: {campaign.openRate}%</span>
                          <span>Click: {campaign.clickRate}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No campaigns yet
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push('/blogs/new')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Create New Blog
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push('/email_list/campaign/new')}
            >
              <Send className="h-4 w-4 mr-2" />
              New Email Campaign
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push('/blogs')}
            >
              <FileText className="h-4 w-4 mr-2" />
              View All Blogs
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push('/email_list/subscribers')}
            >
              <Users className="h-4 w-4 mr-2" />
              View Subscribers
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Edit Dialog */}
      <ProfileEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        profile={profile}
        therapistDetails={therapistDetails}
        onSuccess={fetchData}
      />
    </div>
  );
}
