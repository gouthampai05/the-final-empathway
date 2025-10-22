import React from 'react';
import { EntityForm } from '@/components/shared/EntityForm';
import type { FormField } from '@/components/shared/EntityForm';
import type { Campaign, CampaignFormData } from '../../types/Campaign';

const campaignFormFields: FormField[] = [
  {
    name: 'name',
    label: 'Campaign Name',
    type: 'text',
    required: true,
    placeholder: 'Enter campaign name'
  },
  {
    name: 'subject',
    label: 'Email Subject',
    type: 'text',
    required: true,
    placeholder: 'Enter email subject line'
  },
  {
    name: 'content',
    label: 'Email Content',
    type: 'textarea',
    required: true,
    placeholder: 'Enter your email content here...'
  },
  {
    name: 'scheduledDate',
    label: 'Schedule Date (Optional)',
    type: 'datetime-local',
    placeholder: 'Leave empty to save as draft'
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'multiselect',
    placeholder: 'Enter tags separated by commas'
  }
];

interface CampaignFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formData: CampaignFormData;
  onFormDataChange: (data: Partial<CampaignFormData>) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  submitText: string;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  open,
  onOpenChange,
  title,
  description,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isLoading,
  submitText
}) => {
  return (
    <EntityForm
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      fields={campaignFormFields}
      formData={formData}
      onFormDataChange={onFormDataChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitText={submitText}
    />
  );
};
