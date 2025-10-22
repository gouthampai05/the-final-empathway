'use server';

import { createClient } from '@/supabase/server';
import { getBlogs } from '@/features/blogs/actions/getBlogs';
import { getBlogStats } from '@/features/blogs/actions/getBlogStats';
import { getCampaignStats } from '@/features/email_list/actions/getCampaignStats';
import { getSubscriberStats } from '@/features/email_list/actions/getSubscriberStats';
import { getCampaigns } from '@/features/email_list/actions/getCampaigns';

export interface TherapistProfile {
  id: string;
  email: string;
  name: string | null;
  phone_number: string | null;
  company_name: string | null;
  role: string;
  profile_pic_url: string | null;
}

export interface TherapistDetails {
  id: string;
  years_experience: number | null;
  expertise: string[] | null;
  bio: string | null;
}

export interface LatestBlogPerformance {
  id: string;
  title: string;
  views: number;
  likes: number;
  publishedAt: string;
}

export interface LatestCampaignPerformance {
  id: string;
  name: string;
  status: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
}

export interface DashboardData {
  profile: TherapistProfile | null;
  therapistDetails: TherapistDetails | null;
  blogStats: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalViews: number;
    totalLikes: number;
  };
  campaignStats: {
    totalCampaigns: number;
    draftCampaigns: number;
    scheduledCampaigns: number;
    sentCampaigns: number;
    totalRecipients: number;
  };
  subscriberStats: {
    totalSubscribers: number;
    activeSubscribers: number;
    inactiveSubscribers: number;
    pendingSubscribers: number;
  };
  latestBlogs: LatestBlogPerformance[];
  latestCampaigns: LatestCampaignPerformance[];
}

/**
 * Fetches all dashboard data in one server action
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Fetch all data in parallel
    const [profileData, therapistData, blogStats, campaignStats, subscriberStats, blogs, campaigns] = await Promise.all([
      // Profile data
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      // Therapist details
      supabase.from('therapists').select('*').eq('id', user.id).single(),
      // Blog stats
      getBlogStats(),
      // Campaign stats
      getCampaignStats(),
      // Subscriber stats
      getSubscriberStats(),
      // Latest blogs
      getBlogs({ status: 'published' }),
      // Latest campaigns
      getCampaigns(),
    ]);

    // Get top 3 performing blogs
    const latestBlogs: LatestBlogPerformance[] = blogs
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3)
      .map(blog => ({
        id: blog.id,
        title: blog.title,
        views: blog.views || 0,
        likes: blog.likes || 0,
        publishedAt: blog.publishedAt || blog.createdAt,
      }));

    // Get top 3 recent campaigns
    const latestCampaigns: LatestCampaignPerformance[] = campaigns
      .slice(0, 3)
      .map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        recipientCount: campaign.recipientCount || 0,
        openRate: campaign.openRate || 0,
        clickRate: campaign.clickRate || 0,
        createdAt: campaign.createdAt,
      }));

    return {
      profile: profileData.data,
      therapistDetails: therapistData.data,
      blogStats,
      campaignStats,
      subscriberStats,
      latestBlogs,
      latestCampaigns,
    };
  } catch (error) {
    console.error('getDashboardData error:', error);
    throw error;
  }
}

/**
 * Update therapist profile
 */
export async function updateTherapistProfile(data: {
  name?: string;
  phone_number?: string;
  company_name?: string;
}): Promise<void> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('updateTherapistProfile error:', error);
    throw error;
  }
}

/**
 * Update therapist details
 */
export async function updateTherapistDetails(data: {
  years_experience?: number;
  expertise?: string[];
  bio?: string;
}): Promise<void> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('therapists')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('updateTherapistDetails error:', error);
    throw error;
  }
}
