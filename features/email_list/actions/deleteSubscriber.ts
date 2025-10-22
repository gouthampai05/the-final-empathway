'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';

/**
 * Server Action to delete a subscriber
 */
export async function deleteSubscriber(id: string): Promise<void> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('deleteSubscriber error:', error);
      throw new Error(error.message || 'Failed to delete subscriber');
    }

    revalidatePath('/email_list/subscribers');
  } catch (error) {
    console.error('deleteSubscriber action error:', error);
    throw error;
  }
}
