import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Campaign, CampaignFormData } from '../types/Campaign';
import { createCampaign, updateCampaign, deleteCampaign } from '../services/CampaignService';

export function useCampaignManager(initialData: Campaign[]) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const createNewCampaign = useCallback(async (formData: CampaignFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const newCampaign = await createCampaign(formData, campaigns);
      setCampaigns(prev => [...prev, newCampaign]);
      toast.success('Campaign created successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create campaign';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [campaigns]);

  const updateExistingCampaign = useCallback(async (id: string, formData: CampaignFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const updatedCampaign = await updateCampaign(id, formData, campaigns);
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === id ? updatedCampaign : campaign
      ));
      toast.success('Campaign updated successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update campaign';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [campaigns]);

  const deleteCampaignById = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteCampaign(id, campaigns);
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      toast.success('Campaign deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete campaign';
      toast.error(message);
    }
  }, [campaigns]);

  const bulkDeleteCampaigns = useCallback(async (ids: Set<string>): Promise<void> => {
    try {
      // Could be optimized to use a bulk delete API endpoint
      for (const id of ids) {
        await deleteCampaign(id, campaigns);
      }
      setCampaigns(prev => prev.filter(campaign => !ids.has(campaign.id)));
      toast.success('Campaigns deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete campaigns';
      toast.error(message);
    }
  }, [campaigns]);

  return {
    campaigns,
    isLoading,
    createCampaign: createNewCampaign,
    updateCampaign: updateExistingCampaign,
    deleteCampaign: deleteCampaignById,
    bulkDeleteCampaigns
  };
}
