import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';
import { generateDeviceFingerprint, getClientIp } from '@/lib/deviceFingerprint';

export async function POST(request: NextRequest) {
  try {
    const { blogId } = await request.json();

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Generate device fingerprint from IP and User-Agent
    const ipAddress = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent');
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
        return NextResponse.json(
          { error: 'Failed to remove like' },
          { status: 500 }
        );
      }

      // Decrement the like count in blogs table
      const { error: updateError } = await supabase.rpc('decrement_blog_likes', {
        blog_id: blogId,
      });

      if (updateError) {
        console.error('Error decrementing like count:', updateError);
      }

      // Get updated like count
      const { data: blog } = await supabase
        .from('blogs')
        .select('likes')
        .eq('id', blogId)
        .single();

      return NextResponse.json({
        liked: false,
        likes: blog?.likes || 0,
      });
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
        return NextResponse.json(
          { error: 'Failed to add like' },
          { status: 500 }
        );
      }

      // Increment the like count in blogs table
      const { error: updateError } = await supabase.rpc('increment_blog_likes', {
        blog_id: blogId,
      });

      if (updateError) {
        console.error('Error incrementing like count:', updateError);
      }

      // Get updated like count
      const { data: blog } = await supabase
        .from('blogs')
        .select('likes')
        .eq('id', blogId)
        .single();

      return NextResponse.json({
        liked: true,
        likes: blog?.likes || 0,
      });
    }
  } catch (error) {
    console.error('Error in like API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const blogId = searchParams.get('blogId');

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Generate device fingerprint
    const ipAddress = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent');
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

    return NextResponse.json({
      liked: !!existingLike,
      likes: blog?.likes || 0,
    });
  } catch (error) {
    console.error('Error in like status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
