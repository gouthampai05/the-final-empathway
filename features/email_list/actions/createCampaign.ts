'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';
import { Campaign, CampaignFormData } from '../types/Campaign';

export async function createCampaign(data: CampaignFormData): Promise<Campaign> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('User not authenticated');

  const { data: newCampaign, error } = await supabase.from('campaigns').insert({
    user_id: user.id, name: data.name, subject: data.subject, content: data.content,
    status: 'Draft', scheduled_at: data.scheduledDate, recipient_count: 0,
    open_rate: 0, click_rate: 0
  }).select('*').single();

  if (error) throw new Error(error.message || 'Failed to create campaign');
  revalidatePath('/email_list/campaigns');

  return {
    id: newCampaign.id, name: newCampaign.name, subject: newCampaign.subject,
    content: newCampaign.content, status: newCampaign.status, scheduledDate: newCampaign.scheduled_at,
    sentDate: newCampaign.sent_at, recipientCount: 0, openRate: 0, clickRate: 0,
    createdAt: newCampaign.created_at, updatedAt: newCampaign.updated_at,
    createdDate: newCampaign.created_at, totalRecipients: 0, sentCount: 0, openCount: 0,
    clickCount: 0, bounceCount: 0, unsubscribeCount: 0,
    recipientFilters: { statuses: [], sources: [], tags: [] }, createdBy: user.id, tags: []
  };
}
