'use server';

import { createClient } from '@/supabase/server';
import { Subscriber, SubscriberFilters } from '../types/Subscriber';

/**
 * Server Action to fetch subscribers for the authenticated user
 * Supports filtering by status, source, and tags
 */
export async function getSubscribers(filters?: SubscriberFilters): Promise<Subscriber[]> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Authentication required');
    if (!user) return [];

    let query = supabase
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.source) {
      query = query.eq('source', filters.source);
    }
    if (filters?.tag) {
      query = query.contains('tags', [filters.tag]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('getSubscribers error:', error);
      throw new Error(error.message || 'Failed to fetch subscribers');
    }

    return (data || []).map(sub => ({
      id: sub.id,
      name: sub.name,
      email: sub.email,
      status: sub.status,
      source: sub.source,
      tags: sub.tags || [],
      subscriptionDate: sub.subscription_date,
      lastActivity: sub.last_activity,
      createdAt: sub.created_at,
      updatedAt: sub.updated_at,
    }));
  } catch (error) {
    console.error('getSubscribers action error:', error);
    throw error;
  }
}
