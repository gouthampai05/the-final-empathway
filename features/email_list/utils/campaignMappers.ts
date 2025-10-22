/**
 * Campaign Data Mappers
 *
 * Utilities for transforming database rows into Campaign objects.
 * Centralizes the mapping logic to eliminate duplication across actions.
 */

import { Campaign } from '../types/Campaign';

/**
 * Map database row to Campaign object
 *
 * Transforms a raw database row from the 'campaigns' table into a properly typed Campaign object.
 * Handles default values and null coalescing.
 *
 * @param dbRow - Raw campaign row from Supabase
 * @param userId - User ID who created the campaign
 * @returns Fully typed Campaign object
 *
 * @example
 * const { data: campaignRow } = await supabase.from('campaigns').select('*').eq('id', id).single();
 * const campaign = mapDatabaseRowToCampaign(campaignRow, user.id);
 */
export function mapDatabaseRowToCampaign(
  dbRow: any,
  userId: string
): Campaign {
  return {
    id: dbRow.id,
    name: dbRow.name,
    subject: dbRow.subject,
    content: dbRow.content,
    status: dbRow.status,
    scheduledDate: dbRow.scheduled_at,
    sentDate: dbRow.sent_at,
    recipientCount: dbRow.recipient_count || 0,
    openRate: dbRow.open_rate || 0,
    clickRate: dbRow.click_rate || 0,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
    createdDate: dbRow.created_at,
    totalRecipients: dbRow.total_recipients || dbRow.recipient_count || 0,
    sentCount: dbRow.sent_count || 0,
    openCount: dbRow.open_count || 0,
    clickCount: dbRow.click_count || 0,
    bounceCount: dbRow.bounce_count || 0,
    unsubscribeCount: dbRow.unsubscribe_count || 0,
    recipientFilters: dbRow.recipient_filters || {
      statuses: [],
      sources: [],
      tags: []
    },
    createdBy: dbRow.user_id || userId,
    tags: dbRow.tags || [],
    templateId: dbRow.template_id,
  };
}

/**
 * Map multiple database rows to Campaign objects
 *
 * Batch version of mapDatabaseRowToCampaign for mapping arrays of campaign rows.
 *
 * @param dbRows - Array of raw campaign rows from Supabase
 * @param userId - User ID who created the campaigns
 * @returns Array of fully typed Campaign objects
 *
 * @example
 * const { data: campaignRows } = await supabase.from('campaigns').select('*').eq('created_by', userId);
 * const campaigns = mapDatabaseRowsToCampaigns(campaignRows, user.id);
 */
export function mapDatabaseRowsToCampaigns(
  dbRows: any[] | null,
  userId: string
): Campaign[] {
  if (!dbRows) return [];
  return dbRows.map(row => mapDatabaseRowToCampaign(row, userId));
}
