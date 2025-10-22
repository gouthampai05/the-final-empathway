'use server';

import { createClient } from '@/supabase/server';
import { SubscriberStats } from '../types/Subscriber';

/**
 * Server Action to fetch subscriber statistics
 */
export async function getSubscriberStats(): Promise<SubscriberStats> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        totalSubscribers: 0,
        activeSubscribers: 0,
        inactiveSubscribers: 0,
        pendingSubscribers: 0,
      };
    }

    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('status')
      .eq('user_id', user.id);

    if (error) {
      console.error('getSubscriberStats error:', error);
      return {
        totalSubscribers: 0,
        activeSubscribers: 0,
        inactiveSubscribers: 0,
        pendingSubscribers: 0,
      };
    }

    const stats = (subscribers || []).reduce(
      (acc, sub) => {
        acc.totalSubscribers++;
        if (sub.status === 'Active') acc.activeSubscribers++;
        if (sub.status === 'Inactive') acc.inactiveSubscribers++;
        if (sub.status === 'Pending') acc.pendingSubscribers++;
        return acc;
      },
      {
        totalSubscribers: 0,
        activeSubscribers: 0,
        inactiveSubscribers: 0,
        pendingSubscribers: 0,
      }
    );

    return stats;
  } catch (error) {
    console.error('getSubscriberStats action error:', error);
    return {
      totalSubscribers: 0,
      activeSubscribers: 0,
      inactiveSubscribers: 0,
      pendingSubscribers: 0,
    };
  }
}
