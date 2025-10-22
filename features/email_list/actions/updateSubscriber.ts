'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';
import { Subscriber, SubscriberFormData } from '../types/Subscriber';

/**
 * Server Action to update an existing subscriber
 */
export async function updateSubscriber(id: string, data: SubscriberFormData): Promise<Subscriber> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('User not authenticated');
    if (!user) throw new Error('User not authenticated');

    // Check for duplicate email (excluding current subscriber)
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('user_id', user.id)
      .eq('email', data.email.toLowerCase())
      .neq('id', id)
      .maybeSingle();

    if (existing) {
      throw new Error('A subscriber with this email already exists');
    }

    const updateData = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      status: data.status,
      source: data.source,
      tags: data.tags,
      last_activity: new Date().toISOString(),
    };

    const { data: updatedSubscriber, error } = await supabase
      .from('subscribers')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('updateSubscriber error:', error);
      throw new Error(error.message || 'Failed to update subscriber');
    }

    revalidatePath('/email_list/subscribers');

    return {
      id: updatedSubscriber.id,
      name: updatedSubscriber.name,
      email: updatedSubscriber.email,
      status: updatedSubscriber.status,
      source: updatedSubscriber.source,
      tags: updatedSubscriber.tags || [],
      subscriptionDate: updatedSubscriber.subscription_date,
      lastActivity: updatedSubscriber.last_activity,
      createdAt: updatedSubscriber.created_at,
      updatedAt: updatedSubscriber.updated_at,
    };
  } catch (error) {
    console.error('updateSubscriber action error:', error);
    throw error;
  }
}
