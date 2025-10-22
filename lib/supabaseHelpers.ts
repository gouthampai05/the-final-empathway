/**
 * Supabase Helper Utilities
 *
 * Common utilities for Supabase operations to reduce code duplication
 * and standardize patterns across features.
 */

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Get author name from profile
 *
 * Fetches the profile name for a given user ID, with fallback support.
 * Commonly used when displaying blog posts, campaigns, or other user-generated content.
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID to fetch profile for
 * @param fallback - Fallback name if profile not found (default: 'Unknown')
 * @returns Author name from profile or fallback
 *
 * @example
 * const authorName = await getAuthorName(supabase, user.id, user.email || 'Unknown');
 */
export async function getAuthorName(
  supabase: SupabaseClient,
  userId: string,
  fallback: string = 'Unknown'
): Promise<string> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .maybeSingle();

    return profile?.name || fallback;
  } catch (err) {
    console.warn('Could not fetch profile name:', err);
    return fallback;
  }
}

/**
 * Require authenticated user
 *
 * Gets the current authenticated user and throws an error if not authenticated.
 * Use this for operations that must have an authenticated user.
 *
 * @param supabase - Supabase client instance
 * @returns Authenticated user object
 * @throws Error if user is not authenticated
 *
 * @example
 * const user = await requireAuth(supabase); // Throws if not authenticated
 */
export async function requireAuth(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User not authenticated');
  }

  return user;
}

/**
 * Get authenticated user (nullable)
 *
 * Gets the current authenticated user, returning null if not authenticated.
 * Use this for operations that can handle unauthenticated users.
 *
 * @param supabase - Supabase client instance
 * @returns User object or null if not authenticated
 * @throws Error if there's an authentication error (but not if user is simply null)
 *
 * @example
 * const user = await getAuthUser(supabase);
 * if (!user) return []; // Handle unauthenticated case
 */
export async function getAuthUser(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error('Authentication required');
  }

  return user; // Can be null
}

/**
 * Apply filters to Supabase query
 *
 * Dynamically applies filters to a Supabase query based on a filter configuration.
 * Supports common filter operations: eq, in, contains, overlaps.
 *
 * @param query - Supabase query builder instance
 * @param filters - Filter values object
 * @param filterConfig - Configuration mapping filter keys to operators
 * @returns Modified query with filters applied
 *
 * @example
 * let query = supabase.from('blogs').select('*').eq('user_id', user.id);
 * query = applyFilters(query, filters, {
 *   status: 'eq',      // blogs.status = filters.status
 *   category: 'eq',    // blogs.category = filters.category
 *   tag: 'contains'    // blogs.tags @> [filters.tag]
 * });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyFilters<T extends object, Q extends Record<string, any> = any>(
  query: Q,
  filters: T | undefined,
  filterConfig: Partial<Record<keyof T, 'eq' | 'in' | 'contains' | 'overlaps'>>
): Q {
  if (!filters) return query;

  for (const [key, operator] of Object.entries(filterConfig)) {
    const value = filters[key as keyof T];
    if (value === undefined || value === null || value === '') continue;

    switch (operator) {
      case 'eq':
        query = query.eq(key, value);
        break;
      case 'in':
        if (Array.isArray(value) && value.length > 0) {
          query = query.in(key, value);
        }
        break;
      case 'contains':
        if (Array.isArray(value)) {
          query = query.contains(key, value);
        } else {
          query = query.contains(key, [value]);
        }
        break;
      case 'overlaps':
        if (Array.isArray(value) && value.length > 0) {
          query = query.overlaps(key, value);
        }
        break;
    }
  }

  return query;
}

/**
 * Get profile with therapist details
 *
 * Fetches both profile and therapist information for a user.
 * Commonly used in email campaigns to include author credentials.
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID to fetch data for
 * @returns Object with profile and therapist data
 *
 * @example
 * const { profile, therapist } = await getProfileWithTherapist(supabase, user.id);
 * const authorInfo = {
 *   name: profile?.name,
 *   company: profile?.company_name,
 *   experience: therapist?.years_experience
 * };
 */
export async function getProfileWithTherapist(
  supabase: SupabaseClient,
  userId: string
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email, company_name')
    .eq('id', userId)
    .maybeSingle();

  const { data: therapist } = await supabase
    .from('therapists')
    .select('years_experience')
    .eq('id', userId)
    .maybeSingle();

  return { profile, therapist };
}
