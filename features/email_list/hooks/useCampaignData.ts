import { useState, useEffect, useCallback } from 'react';
import { Campaign, CampaignFilters, CampaignStats } from '../types/Campaign';
import { getCampaigns, getCampaignStats } from '../actions';

export const useCampaignData = (filters?: CampaignFilters) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [campaignsData, statsData] = await Promise.all([
        getCampaigns(filters),
        getCampaignStats(),
      ]);
      setCampaigns(campaignsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const refreshCampaigns = useCallback(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    stats,
    loading,
    error,
    refreshCampaigns,
  };
};

export const useCampaignById = (id: string) => {
  const { campaigns, loading } = useCampaignData();
  const campaign = campaigns.find(c => c.id === id) || null;

  return { campaign, loading };
};
