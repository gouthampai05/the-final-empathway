/**
 * Campaign Send Service
 *
 * Handles the complex logic for sending email campaigns.
 * Extracted from sendCampaign action to follow single responsibility principle.
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface CampaignData {
  campaign: any;
  profile: any;
  therapist: any | null;
}

/**
 * Get campaign with profile and therapist data
 *
 * Fetches all necessary data for sending a campaign including campaign details,
 * creator profile, and therapist credentials.
 *
 * @param supabase - Supabase client instance
 * @param campaignId - Campaign ID to fetch
 * @returns Campaign data with profile and therapist information
 * @throws Error if campaign not found or not in draft status
 *
 * @example
 * const { campaign, profile, therapist } = await getCampaignData(supabase, campaignId);
 */
export async function getCampaignData(
  supabase: SupabaseClient,
  campaignId: string
): Promise<CampaignData> {
  //  Get the campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (campaignError || !campaign) {
    throw new Error('Campaign not found');
  }

  // Check if campaign is in Draft status
  if (campaign.status !== 'Draft') {
    throw new Error('Only draft campaigns can be sent');
  }

  // Get the campaign creator's profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, company_name, email')
    .eq('id', campaign.user_id)
    .single();

  if (profileError || !profile) {
    throw new Error('Campaign creator profile not found');
  }

  // Get therapist details if available
  const { data: therapist } = await supabase
    .from('therapists')
    .select('years_experience')
    .eq('id', campaign.user_id)
    .maybeSingle();

  return { campaign, profile, therapist };
}

/**
 * Get filtered subscribers for campaign
 *
 * Fetches subscribers based on campaign recipient filters (status, source, tags).
 *
 * @param supabase - Supabase client instance
 * @param recipientFilters - Filter criteria from campaign
 * @returns Array of matching subscribers
 * @throws Error if no subscribers match or query fails
 *
 * @example
 * const subscribers = await getFilteredSubscribers(supabase, campaign.recipient_filters);
 */
export async function getFilteredSubscribers(
  supabase: SupabaseClient,
  recipientFilters: any,
  userId?: string
) {
  console.log('[getFilteredSubscribers] Fetching subscribers with filters:', recipientFilters);
  console.log('[getFilteredSubscribers] userId:', userId);

  // Build subscriber query based on recipient filters
  let query = supabase
    .from('subscribers')
    .select('id, name, email, user_id, status');

  // IMPORTANT: Always filter by user_id to ensure we only get the current user's subscribers
  if (userId) {
    console.log('[getFilteredSubscribers] Filtering by user_id:', userId);
    query = query.eq('user_id', userId);
  } else {
    console.warn('[getFilteredSubscribers] WARNING: No userId provided, will fetch all subscribers!');
  }

  // Apply status filters ONLY if explicitly provided
  if (recipientFilters?.statuses?.length > 0) {
    console.log('[getFilteredSubscribers] Applying status filters:', recipientFilters.statuses);
    query = query.in('status', recipientFilters.statuses);
  } else {
    console.log('[getFilteredSubscribers] No status filters - including all statuses');
  }

  // Apply source filters ONLY if explicitly provided
  if (recipientFilters?.sources?.length > 0) {
    console.log('[getFilteredSubscribers] Applying source filters:', recipientFilters.sources);
    query = query.in('source', recipientFilters.sources);
  } else {
    console.log('[getFilteredSubscribers] No source filters - including all sources');
  }

  // Apply tag filters ONLY if explicitly provided (if any subscriber has at least one of the tags)
  if (recipientFilters?.tags?.length > 0) {
    console.log('[getFilteredSubscribers] Applying tag filters:', recipientFilters.tags);
    query = query.overlaps('tags', recipientFilters.tags);
  } else {
    console.log('[getFilteredSubscribers] No tag filters - including all tags');
  }

  // Get all matching subscribers
  const { data: subscribers, error: subscribersError } = await query;

  console.log('[getFilteredSubscribers] Query result:', {
    count: subscribers?.length || 0,
    hasError: !!subscribersError,
    errorMessage: subscribersError?.message,
    sampleSubscriber: subscribers?.[0]
  });

  if (subscribersError) {
    console.error('[getFilteredSubscribers] Error fetching subscribers:', subscribersError);
    throw new Error('Failed to fetch subscribers: ' + subscribersError.message);
  }

  if (!subscribers || subscribers.length === 0) {
    console.error('[getFilteredSubscribers] No subscribers found!');
    throw new Error('No subscribers found. Please add subscribers before sending a campaign.');
  }

  console.log('[getFilteredSubscribers] Successfully fetched', subscribers.length, 'subscribers');
  return subscribers;
}

/**
 * Update campaign status
 *
 * Updates campaign status and optionally other fields like sent_date, total_recipients, etc.
 *
 * @param supabase - Supabase client instance
 * @param campaignId - Campaign ID to update
 * @param status - New campaign status
 * @param additionalData - Additional fields to update (sent_date, total_recipients, etc.)
 *
 * @example
 * await updateCampaignStatus(supabase, campaignId, 'Sending');
 * await updateCampaignStatus(supabase, campaignId, 'Sent', {
 *   sent_date: new Date().toISOString(),
 *   total_recipients: 100
 * });
 */
export async function updateCampaignStatus(
  supabase: SupabaseClient,
  campaignId: string,
  status: string,
  additionalData: Record<string, any> = {}
) {
  console.log('[updateCampaignStatus] Updating campaign:', { campaignId, status, additionalData });

  // First, verify the campaign exists
  const { data: existingCampaign, error: fetchError } = await supabase
    .from('campaigns')
    .select('id, status, user_id')
    .eq('id', campaignId)
    .single();

  console.log('[updateCampaignStatus] Existing campaign:', existingCampaign, 'fetchError:', fetchError);

  const updatePayload = {
    status,
    updated_at: new Date().toISOString(),
    ...additionalData,
  };

  console.log('[updateCampaignStatus] Update payload:', updatePayload);

  const { data, error, count } = await supabase
    .from('campaigns')
    .update(updatePayload)
    .eq('id', campaignId)
    .select();

  console.log('[updateCampaignStatus] Update result:', { data, error, count, rowsAffected: data?.length });

  if (error) {
    console.error('[updateCampaignStatus] Failed to update campaign:', error);
    throw new Error('Failed to update campaign status: ' + error.message);
  }

  if (!data || data.length === 0) {
    console.error('[updateCampaignStatus] No rows were updated!');
    throw new Error('Campaign update succeeded but no rows were affected. This might be an RLS policy issue.');
  }

  console.log('[updateCampaignStatus] Campaign updated successfully:', data[0]);
  return data[0];
}
