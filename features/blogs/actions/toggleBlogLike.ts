'use server';

import { createClient } from '@/supabase/server';
import { generateDeviceFingerprint, getClientIp } from '@/lib/deviceFingerprint';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export interface ToggleBlogLikeResult {
  success: boolean;
  liked: boolean;
  likes: number;
  error?: string;
}

/**
 * Server Action to toggle a blog like/unlike
 * Uses device fingerprinting for anonymous tracking
 * Implements optimistic UI pattern with immediate response
 */
export async function toggleBlogLike(blogId: string): Promise<ToggleBlogLikeResult> {
  try {
    // Get request headers for device fingerprinting
    const headersList = await headers();
    const ipAddress = getClientIp(headersList);
    const userAgent = headersList.get('user-agent');
    const deviceFingerprint = generateDeviceFingerprint(ipAddress, userAgent);

    const supabase = await createClient();

    // Check if this device has already liked this blog
    const { data: existingLike } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('blog_id', blogId)
      .eq('device_fingerprint', deviceFingerprint)
      .maybeSingle();

    if (existingLike) {
      // Unlike: Remove the like
      const { error: deleteError } = await supabase
        .from('blog_likes')
        .delete()
        .eq('blog_id', blogId)
        .eq('device_fingerprint', deviceFingerprint);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        return {
          success: false,
          liked: true,
          likes: 0,
          error: 'Failed to remove like',
        };
      }

      // Decrement the like count
      const { error: updateError } = await supabase.rpc('decrement_blog_likes', {
        blog_id: blogId,
      });

      if (updateError) {
        console.error('Error decrementing like count:', updateError);
      }
    } else {
      // Like: Add a new like
      const { error: insertError } = await supabase
        .from('blog_likes')
        .insert({
          blog_id: blogId,
          device_fingerprint: deviceFingerprint,
        });

      if (insertError) {
        console.error('Error adding like:', insertError);
        return {
          success: false,
          liked: false,
          likes: 0,
          error: 'Failed to add like',
        };
      }

      // Increment the like count
      const { error: updateError } = await supabase.rpc('increment_blog_likes', {
        blog_id: blogId,
      });

      if (updateError) {
        console.error('Error incrementing like count:', updateError);
      }
    }

    // Get updated like count
    const { data: blog } = await supabase
      .from('blogs')
      .select('likes')
      .eq('id', blogId)
      .single();

    // Revalidate the blog page to update SSR
    revalidatePath('/blogs/[slug]', 'page');

    return {
      success: true,
      liked: !existingLike,
      likes: blog?.likes || 0,
    };
  } catch (error) {
    console.error('Error in toggleBlogLike:', error);
    return {
      success: false,
      liked: false,
      likes: 0,
      error: 'Internal server error',
    };
  }
}
