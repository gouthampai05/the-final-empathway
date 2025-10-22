'use server';

import { createClient } from '@/supabase/server';
import { generateDeviceFingerprint, getClientIp } from '@/lib/deviceFingerprint';
import { headers } from 'next/headers';

export interface BlogLikeStatus {
  liked: boolean;
  likes: number;
}

/**
 * Server Action to get the like status for a blog
 * Returns whether the current device has liked the blog and total like count
 */
export async function getBlogLikeStatus(blogId: string): Promise<BlogLikeStatus> {
  try {
    // Get request headers for device fingerprinting
    const headersList = await headers();
    const ipAddress = getClientIp(headersList);
    const userAgent = headersList.get('user-agent');
    const deviceFingerprint = generateDeviceFingerprint(ipAddress, userAgent);

    const supabase = await createClient();

    // Check if this device has liked this blog
    const { data: existingLike } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('blog_id', blogId)
      .eq('device_fingerprint', deviceFingerprint)
      .maybeSingle();

    // Get total like count
    const { data: blog } = await supabase
      .from('blogs')
      .select('likes')
      .eq('id', blogId)
      .single();

    return {
      liked: !!existingLike,
      likes: blog?.likes || 0,
    };
  } catch (error) {
    console.error('Error in getBlogLikeStatus:', error);
    return {
      liked: false,
      likes: 0,
    };
  }
}
