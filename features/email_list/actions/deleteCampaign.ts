'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';

export async function deleteCampaign(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('User not authenticated');

  const { error } = await supabase.from('campaigns').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw new Error(error.message || 'Failed to delete campaign');
  revalidatePath('/email_list/campaigns');
}
