import { useState, useEffect, useCallback } from 'react';
import { Subscriber, SubscriberFilters, SubscriberStats } from '../types/Subscriber';
import { getSubscribers, getSubscriberStats } from '../actions';

export const useSubscriberData = (filters?: SubscriberFilters) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<SubscriberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [subscribersData, statsData] = await Promise.all([
        getSubscribers(filters),
        getSubscriberStats(),
      ]);
      setSubscribers(subscribersData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const refreshSubscribers = useCallback(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return {
    subscribers,
    stats,
    loading,
    error,
    refreshSubscribers,
  };
};

export const useSubscriberById = (id: string) => {
  const { subscribers, loading } = useSubscriberData();
  const subscriber = subscribers.find(s => s.id === id) || null;

  return { subscriber, loading };
};
