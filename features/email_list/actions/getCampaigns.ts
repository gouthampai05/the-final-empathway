'use server';

import { createClient } from '@/supabase/server';
import { Campaign, CampaignFilters } from '../types/Campaign';
import { getAuthUser, applyFilters } from '@/lib/supabaseHelpers';
import { mapDatabaseRowsToCampaigns } from '../utils/campaignMappers';

/**
 * Server Action to fetch campaigns for the authenticated user
 *
 * Refactored to use helper utilities:
 * - getAuthUser() for authentication
 * - applyFilters() for query filtering
 * - mapDatabaseRowsToCampaigns() for data transformation
 *
 * @param filters - Optional filters (status)
 * @returns Array of campaigns owned by the current user
 */
export async function getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const user = await getAuthUser(supabase);
    if (!user) return [];

    // Build base query
    let query = supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters using helper
    query = applyFilters(query, filters, {
      status: 'eq',
    });

    const { data, error } = await query;
    if (error) throw new Error(error.message || 'Failed to fetch campaigns');

    // Map to Campaign objects using helper
    return mapDatabaseRowsToCampaigns(data, user.id);
  } catch (error) {
    console.error('getCampaigns error:', error);
    throw error;
  }
}
