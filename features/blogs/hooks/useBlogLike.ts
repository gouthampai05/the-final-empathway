import { useState, useEffect, useTransition } from 'react';
import { toggleBlogLike, getBlogLikeStatus } from '../actions';
import { toast } from 'sonner';

interface UseBlogLikeOptions {
  blogId: string;
  initialLikes: number;
  onSuccess?: (liked: boolean, likes: number) => void;
  onError?: (error: string) => void;
}

interface UseBlogLikeReturn {
  likes: number;
  hasLiked: boolean;
  toggleLike: () => void;
  isPending: boolean;
}

/**
 * Custom hook for handling blog like functionality with optimistic updates
 * Implements instant UI feedback with server-side validation
 *
 * @param options - Configuration options
 * @returns Like state and toggle function
 *
 * @example
 * const { likes, hasLiked, toggleLike, isPending } = useBlogLike({
 *   blogId: blog.id,
 *   initialLikes: blog.likes,
 * });
 */
export function useBlogLike({
  blogId,
  initialLikes,
  onSuccess,
  onError,
}: UseBlogLikeOptions): UseBlogLikeReturn {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Fetch initial like status on mount
  useEffect(() => {
    let isMounted = true;

    const fetchLikeStatus = async () => {
      try {
        const status = await getBlogLikeStatus(blogId);
        if (isMounted) {
          setHasLiked(status.liked);
          setLikes(status.likes);
        }
      } catch (error) {
        console.error('Failed to fetch like status:', error);
      }
    };

    fetchLikeStatus();

    return () => {
      isMounted = false;
    };
  }, [blogId]);

  const toggleLike = () => {
    // Optimistic update: Update UI immediately
    const previousLikes = likes;
    const previousHasLiked = hasLiked;

    // Update UI instantly
    setHasLiked(!hasLiked);
    setLikes(hasLiked ? likes - 1 : likes + 1);

    // Show immediate feedback
    toast.success(hasLiked ? 'Like removed' : 'Thanks for liking this article!', {
      duration: 2000,
    });

    // Start server action in transition
    startTransition(async () => {
      try {
        const result = await toggleBlogLike(blogId);

        if (!result.success) {
          // Revert on error
          setHasLiked(previousHasLiked);
          setLikes(previousLikes);

          const errorMessage = result.error || 'Failed to update like';
          toast.error(errorMessage);

          if (onError) {
            onError(errorMessage);
          }
        } else {
          // Sync with server response
          setHasLiked(result.liked);
          setLikes(result.likes);

          if (onSuccess) {
            onSuccess(result.liked, result.likes);
          }
        }
      } catch (error) {
        // Revert on error
        setHasLiked(previousHasLiked);
        setLikes(previousLikes);

        const errorMessage = 'Failed to update like';
        toast.error(errorMessage);

        if (onError) {
          onError(errorMessage);
        }
      }
    });
  };

  return {
    likes,
    hasLiked,
    toggleLike,
    isPending,
  };
}
