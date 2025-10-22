import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Subscriber, SubscriberFormData } from '../types/Subscriber';
import { createSubscriber as createSubscriberService, updateSubscriber as updateSubscriberService } from '../services/SubscriberService';

export function useSubscriberManager(initialData: Subscriber[]) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const createSubscriber = useCallback(async (formData: SubscriberFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const newSubscriber = await createSubscriberService(formData, subscribers);
      setSubscribers(prev => [...prev, newSubscriber]);
      toast.success('Subscriber added successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add subscriber';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscribers]);

  const updateSubscriber = useCallback(async (id: string, formData: SubscriberFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const updated = await updateSubscriberService(id, formData, subscribers);
      setSubscribers(prev => prev.map(s => s.id === id ? updated : s));
      toast.success('Subscriber updated successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update subscriber';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscribers]);

  const deleteSubscriber = useCallback(async (id: string): Promise<void> => {
    try {
      // In a real app, call a delete service here
      setSubscribers(prev => prev.filter(s => s.id !== id));
      toast.success('Subscriber deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete subscriber';
      toast.error(message);
    }
  }, []);

  const bulkDeleteSubscribers = useCallback(async (ids: Set<string>): Promise<void> => {
    try {
      setSubscribers(prev => prev.filter(s => !ids.has(s.id)));
      toast.success('Subscribers deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete subscribers';
      toast.error(message);
    }
  }, []);

  return {
    subscribers,
    isLoading,
    createSubscriber,
    updateSubscriber,
    deleteSubscriber,
    bulkDeleteSubscribers,
  };
}


