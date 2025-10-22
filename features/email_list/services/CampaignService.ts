/**
 * Campaign Service
 * 
 * Manages campaign operations with proper validation and error handling.
 */

import { z } from 'zod';
import { getCurrentDate } from '@/lib/getCurrentDate';
import type { Campaign, CampaignFormData, CampaignStatus } from '../types/Campaign';
import { campaignSchema, campaignFormSchema } from '../validations/CampaignValidations';

// Helper Functions
const validateCampaignName = (name: string, existingCampaigns: Campaign[], excludeId?: string): void => {
  const nameExists = existingCampaigns.some(
    c => c.name.toLowerCase() === name.toLowerCase() && c.id !== excludeId
  );
  if (nameExists) {
    throw new Error(`A campaign with the name "${name}" already exists.`);
  }
};

const validateCampaignExists = (id: string, existingCampaigns: Campaign[]): Campaign => {
  const campaign = existingCampaigns.find(c => c.id === id);
  if (!campaign) {
    throw new Error('Campaign not found');
  }
  return campaign;
};

const validateCampaignStatus = (status: CampaignStatus, operation: 'update' | 'delete' | 'send'): void => {
  const errorMessages = {
    update: 'Cannot update a campaign that has been sent or is currently sending',
    delete: 'Cannot delete a campaign that is currently sending',
    send: `Campaign cannot be sent: ${status === 'Sent' ? 'already sent' : 'already sending'}`
  };

  const invalidStates: Record<typeof operation, CampaignStatus[]> = {
    update: ['Sent', 'Sending'],
    delete: ['Sending'],
    send: ['Sent', 'Sending']
  };

  if (invalidStates[operation].includes(status)) {
    throw new Error(errorMessages[operation]);
  }
};

// Service Functions
export const createCampaign = async (
  data: CampaignFormData, 
  existingCampaigns: Campaign[]
): Promise<Campaign> => {
  try {
    const validatedData = await campaignFormSchema.parseAsync(data);
    validateCampaignName(validatedData.name, existingCampaigns);
    
    const newCampaign: Campaign = {
      id: (existingCampaigns.length + 1).toString(),
      name: validatedData.name.trim(),
      subject: validatedData.subject.trim(),
      content: validatedData.content,
      templateId: validatedData.templateId,
      status: validatedData.scheduledDate ? 'Scheduled' : 'Draft',
      createdDate: getCurrentDate(),
      scheduledDate: validatedData.scheduledDate,
      totalRecipients: 0,
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
      bounceCount: 0,
      unsubscribeCount: 0,
      recipientFilters: validatedData.recipientFilters,
      createdBy: "Current User",
      tags: validatedData.tags,
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
      recipientCount: 0,
      openRate: 0,
      clickRate: 0,
    };

    return await campaignSchema.parseAsync(newCampaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0].message);
    }
    throw error;
  }
};

export const updateCampaign = async (
  id: string, 
  data: CampaignFormData, 
  existingCampaigns: Campaign[]
): Promise<Campaign> => {
  try {
    const validatedData = await campaignFormSchema.parseAsync(data);
    const existingCampaign = validateCampaignExists(id, existingCampaigns);
    validateCampaignName(validatedData.name, existingCampaigns, id);
    validateCampaignStatus(existingCampaign.status, 'update');

    const updatedCampaign: Campaign = {
      ...existingCampaign,
      name: validatedData.name.trim(),
      subject: validatedData.subject.trim(),
      content: validatedData.content,
      templateId: validatedData.templateId,
      status: validatedData.scheduledDate ? 'Scheduled' : 'Draft',
      scheduledDate: validatedData.scheduledDate,
      recipientFilters: validatedData.recipientFilters,
      tags: validatedData.tags,
    };

    return await campaignSchema.parseAsync(updatedCampaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0].message);
    }
    throw error;
  }
};

export const deleteCampaign = async (id: string, existingCampaigns: Campaign[]): Promise<void> => {
  const campaign = validateCampaignExists(id, existingCampaigns);
  validateCampaignStatus(campaign.status, 'delete');
};

export const sendCampaign = async (id: string, existingCampaigns: Campaign[]): Promise<Campaign> => {
  const campaign = validateCampaignExists(id, existingCampaigns);
  validateCampaignStatus(campaign.status, 'send');

  const updatedCampaign: Campaign = {
    ...campaign,
    status: 'Sending',
    sentDate: getCurrentDate()
  };

  return await campaignSchema.parseAsync(updatedCampaign);
};
