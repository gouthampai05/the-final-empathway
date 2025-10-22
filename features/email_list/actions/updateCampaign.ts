'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';
import { Campaign, CampaignFormData } from '../types/Campaign';

export async function updateCampaign(id: string, data: CampaignFormData): Promise<Campaign> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('User not authenticated');

  const { data: updated, error } = await supabase.from('campaigns').update({
    name: data.name, subject: data.subject, content: data.content,
    scheduled_at: data.scheduledDate
  }).eq('id', id).eq('user_id', user.id).select('*').single();

  if (error) throw new Error(error.message || 'Failed to update campaign');
  revalidatePath('/email_list/campaigns');

  return {
    id: updated.id, name: updated.name, subject: updated.subject, content: updated.content,
    status: updated.status, scheduledDate: updated.scheduled_at, sentDate: updated.sent_at,
    recipientCount: updated.recipient_count || 0, openRate: updated.open_rate || 0,
    clickRate: updated.click_rate || 0, createdAt: updated.created_at,
    updatedAt: updated.updated_at, createdDate: updated.created_at,
    totalRecipients: updated.recipient_count || 0, sentCount: 0, openCount: 0, clickCount: 0,
    bounceCount: 0, unsubscribeCount: 0, recipientFilters: { statuses: [], sources: [], tags: [] },
    createdBy: user.id, tags: []
  };
}
