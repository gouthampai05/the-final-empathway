"use client";

import React from 'react';
import { toast } from 'sonner';

// Components
import { FilterSection } from '@/components/shared/FilterSection';
import { EmailListTemplate } from '../components/EmailListTemplate';
import { StatCard } from '../components/StatCard';
import { CampaignForm, CampaignTable } from '../components/campaign';

// Hooks
import { useCampaignManager } from '../hooks/useCampaignManager';
import { useTableState } from '@/hooks/useTableState';
import { useCampaignFormDialog } from '../hooks/useCampaignFormDialog';

// Utils & Helpers
import { exportToCSV } from '@/lib/exportToCSV';
import { filterCampaigns, calculateCampaignStats } from '../utils/campaignUtils';

// Types
import type { Campaign } from '../types/Campaign';

// Data
import { mockCampaigns, initialCampaignFormData } from '../data/mockData';

// Constants
import { campaignFilterConfigs } from '../components/campaign/constants';
import { getStatsConfig } from '../components/StatCard';

export default function CampaignPage(): React.ReactElement {
  const campaignManager = useCampaignManager(mockCampaigns);
  
  const tableState = useTableState({
    data: campaignManager.campaigns,
    filterFunction: filterCampaigns
  });
  
  const formDialog = useCampaignFormDialog(initialCampaignFormData);
  const stats = calculateCampaignStats(campaignManager.campaigns);

  const handleExport = () => {
    const headers = ['Name', 'Subject', 'Status', 'Created Date', 'Recipients', 'Open Rate', 'Tags'];
    const data = campaignManager.campaigns.map(campaign => [
      campaign.name,
      campaign.subject,
      campaign.status,
      campaign.createdDate,
      campaign.totalRecipients.toString(),
      campaign.sentCount > 0 ? `${((campaign.openCount / campaign.sentCount) * 100).toFixed(1)}%` : '-',
      campaign.tags.join(', ')
    ]);
    exportToCSV(data, headers, 'campaigns.csv');
    toast.success('Campaigns exported successfully');
  };

  const handleAddCampaign = async () => {
    const success = await campaignManager.createCampaign(formDialog.formData);
    if (success) formDialog.closeDialogs();
  };

  const handleEditCampaign = (campaign: Campaign) => {
    formDialog.openEditDialog(campaign, (c) => ({
      name: c.name,
      subject: c.subject,
      content: c.content,
      templateId: c.templateId,
      scheduledDate: c.scheduledDate,
      recipientFilters: c.recipientFilters,
      tags: c.tags
    }));
  };

  const handleUpdateCampaign = async () => {
    if (!formDialog.editingCampaign) return;
    const success = await campaignManager.updateCampaign(
      formDialog.editingCampaign.id,
      formDialog.formData
    );
    if (success) formDialog.closeDialogs();
  };

  const handleClearFilters = () => {
    tableState.handleClearFilters();
    toast.success('Filters cleared');
  };

  return (
    <EmailListTemplate>
      <EmailListTemplate.Header
        title="Email Campaigns"
        description="Create, manage, and track your email marketing campaigns"
        onExport={handleExport}
        onAdd={formDialog.openAddDialog}
        addLabel="Create Campaign"
      />

      <EmailListTemplate.Stats>
        {getStatsConfig(stats).map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </EmailListTemplate.Stats>

      <EmailListTemplate.Filters>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <FilterSection
            searchValue={tableState.searchTerm}
            onSearchChange={tableState.handleSearchChange}
            searchPlaceholder="Search campaigns by name, subject, or tags..."
            filters={tableState.filters}
            filterConfigs={campaignFilterConfigs}
            onFilterChange={tableState.handleFilterChange}
            hasActiveFilters={tableState.hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
      </EmailListTemplate.Filters>

      <EmailListTemplate.Table
        title="Campaigns"
        itemCount={tableState.filteredData.length}
        totalCount={campaignManager.campaigns.length}
        pagination={tableState.paginationConfig}
      >
        <CampaignTable
          data={tableState.paginatedData}
          onPreview={(campaign) => console.log('Preview:', campaign)}
          onEdit={handleEditCampaign}
          onDelete={(campaign) => campaignManager.deleteCampaign(campaign.id)}
        />
      </EmailListTemplate.Table>

      <CampaignForm
        open={formDialog.showAddDialog}
        onOpenChange={formDialog.setShowAddDialog}
        title="Create New Campaign"
        description="Create a new email campaign to engage with your subscribers."
        formData={formDialog.formData}
        onFormDataChange={formDialog.updateFormData}
        onSubmit={handleAddCampaign}
        onCancel={formDialog.closeDialogs}
        isLoading={campaignManager.isLoading}
        submitText="Create Campaign"
      />
      
      <CampaignForm
        open={formDialog.showEditDialog}
        onOpenChange={formDialog.setShowEditDialog}
        title="Edit Campaign"
        description="Update your campaign details and settings."
        formData={formDialog.formData}
        onFormDataChange={formDialog.updateFormData}
        onSubmit={handleUpdateCampaign}
        onCancel={formDialog.closeDialogs}
        isLoading={campaignManager.isLoading}
        submitText="Update Campaign"
      />
    </EmailListTemplate>
  );
}
