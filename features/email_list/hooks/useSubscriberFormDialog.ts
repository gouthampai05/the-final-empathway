import { useState, useCallback } from 'react';
import type { Subscriber, SubscriberFormData } from '../types/Subscriber';

export function useSubscriberFormDialog(initialFormData: SubscriberFormData) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState<SubscriberFormData>(initialFormData);
  const [editingEntity, setEditingEntity] = useState<Subscriber | null>(null);

  const openAddDialog = useCallback(() => {
    setFormData(initialFormData);
    setShowAddDialog(true);
  }, [initialFormData]);

  const openEditDialog = useCallback((entity: Subscriber, mapper: (s: Subscriber) => SubscriberFormData) => {
    setEditingEntity(entity);
    setFormData(mapper(entity));
    setShowEditDialog(true);
  }, []);

  const closeDialogs = useCallback(() => {
    setShowAddDialog(false);
    setShowEditDialog(false);
    setEditingEntity(null);
    setFormData(initialFormData);
  }, [initialFormData]);

  const updateFormData = useCallback((data: Partial<SubscriberFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  return {
    showAddDialog,
    showEditDialog,
    formData,
    editingEntity,
    setShowAddDialog,
    setShowEditDialog,
    openAddDialog,
    openEditDialog,
    closeDialogs,
    updateFormData
  };
}


