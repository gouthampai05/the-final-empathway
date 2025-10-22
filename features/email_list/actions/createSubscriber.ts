'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';
import { Subscriber, SubscriberFormData } from '../types/Subscriber';

/**
 * Server Action to create a new subscriber
 */
export async function createSubscriber(data: SubscriberFormData): Promise<Subscriber> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('User not authenticated');
    if (!user) throw new Error('User not authenticated');

    // Check for duplicate email
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('user_id', user.id)
      .eq('email', data.email.toLowerCase())
      .maybeSingle();

    if (existing) {
      throw new Error('A subscriber with this email already exists');
    }

    const insertData = {
      user_id: user.id,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      status: data.status,
      source: data.source,
      tags: data.tags,
      subscription_date: new Date().toISOString(),
      last_activity: new Date().toISOString(),
    };

    const { data: newSubscriber, error } = await supabase
      .from('subscribers')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('createSubscriber error:', error);
      throw new Error(error.message || 'Failed to create subscriber');
    }

    revalidatePath('/email_list/subscribers');

    return {
      id: newSubscriber.id,
      name: newSubscriber.name,
      email: newSubscriber.email,
      status: newSubscriber.status,
      source: newSubscriber.source,
      tags: newSubscriber.tags || [],
      subscriptionDate: newSubscriber.subscription_date,
      lastActivity: newSubscriber.last_activity,
      createdAt: newSubscriber.created_at,
      updatedAt: newSubscriber.updated_at,
    };
  } catch (error) {
    console.error('createSubscriber action error:', error);
    throw error;
  }
}
