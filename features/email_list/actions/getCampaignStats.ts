'use server';

import { createClient } from '@/supabase/server';
import { CampaignStats } from '../types/Campaign';

export async function getCampaignStats(): Promise<CampaignStats> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { totalCampaigns: 0, draftCampaigns: 0, scheduledCampaigns: 0, sentCampaigns: 0, totalRecipients: 0 };
    }

    const { data: campaigns, error } = await supabase.from('campaigns').select('status, recipient_count').eq('user_id', user.id);
    if (error) {
      console.error('getCampaignStats error:', error);
      return { totalCampaigns: 0, draftCampaigns: 0, scheduledCampaigns: 0, sentCampaigns: 0, totalRecipients: 0 };
    }

    return (campaigns || []).reduce((acc, c) => {
      acc.totalCampaigns++;
      if (c.status === 'Draft') acc.draftCampaigns++;
      if (c.status === 'Scheduled') acc.scheduledCampaigns++;
      if (c.status === 'Sent') acc.sentCampaigns++;
      acc.totalRecipients += c.recipient_count || 0;
      return acc;
    }, { totalCampaigns: 0, draftCampaigns: 0, scheduledCampaigns: 0, sentCampaigns: 0, totalRecipients: 0 });
  } catch (error) {
    console.error('getCampaignStats error:', error);
    return { totalCampaigns: 0, draftCampaigns: 0, scheduledCampaigns: 0, sentCampaigns: 0, totalRecipients: 0 };
  }
}
