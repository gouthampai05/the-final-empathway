export type CampaignStatus = 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Failed';

export interface CampaignRecipientFilters {
  statuses: string[];
  sources: string[];
  tags: string[];
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: CampaignStatus;
  createdDate: string;
  sentDate?: string;
  scheduledDate?: string;
  templateId?: string;
  totalRecipients: number;
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
  recipientFilters: CampaignRecipientFilters;
  createdBy: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
}

export interface CampaignFilters {
  status?: CampaignStatus;
}

export interface CampaignStats {
  totalCampaigns: number;
  draftCampaigns: number;
  scheduledCampaigns: number;
  sentCampaigns: number;
  totalRecipients: number;
}

export interface CampaignFormData extends Record<string, unknown> {
  name: string;
  subject: string;
  content: string;
  scheduledDate?: string;
  templateId?: string;
  recipientFilters: CampaignRecipientFilters;
  tags: string[];
}
