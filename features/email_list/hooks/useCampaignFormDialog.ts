import { useState, useCallback } from 'react';
import type { Campaign, CampaignFormData } from '../types/Campaign';

export function useCampaignFormDialog(initialFormData: CampaignFormData) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const openAddDialog = useCallback(() => {
    setFormData(initialFormData);
    setShowAddDialog(true);
  }, [initialFormData]);

  const openEditDialog = useCallback((campaign: Campaign, mapper: (c: Campaign) => CampaignFormData) => {
    setEditingCampaign(campaign);
    setFormData(mapper(campaign));
    setShowEditDialog(true);
  }, []);

  const closeDialogs = useCallback(() => {
    setShowAddDialog(false);
    setShowEditDialog(false);
    setEditingCampaign(null);
    setFormData(initialFormData);
  }, [initialFormData]);

  const updateFormData = useCallback((data: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  return {
    showAddDialog,
    showEditDialog,
    formData,
    editingCampaign,
    setShowAddDialog,
    setShowEditDialog,
    openAddDialog,
    openEditDialog,
    closeDialogs,
    updateFormData
  };
}
