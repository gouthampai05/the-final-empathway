"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { FilterSection } from '@/components/shared/FilterSection';
import { StatCard } from '../components/StatCard';

import { useSubscriberManager } from '@/features/email_list/hooks/useSubscriberManager';
import { useTableState } from '@/hooks/useTableState';
import { useSubscriberFormDialog } from '@/features/email_list/hooks/useSubscriberFormDialog';

import { EmailListTemplate } from '../components/EmailListTemplate';
import { DataTable } from '@/components/shared/DataTable';
import { EntityForm } from '@/components/shared/EntityForm';

import { type Subscriber, type SubscriberFormData } from '../types/Subscriber';
import { createSubscriber, updateSubscriber } from '../services/SubscriberService';
import { exportToCSV } from '@/lib/exportToCSV';
import { getCurrentDate } from '@/lib/getCurrentDate';
import { copyToClipboard } from '@/lib/copyToClipboard';
import { filterSubscribers, calculateSubscriberStats, mockSubscribers } from '../utils/subscriberUtils';
import { getTableColumns, getTableActions, getFormFields, getFilterConfigs, getStatsConfig } from '../config/subscriberConfig';

const initialFormData: SubscriberFormData = {
  name: "",
  email: "",
  status: "Active",
  source: "Manual",
  tags: []
};

export default function AllSubscribers(): React.ReactElement {
  const manager = useSubscriberManager(mockSubscribers);
  
  const tableState = useTableState({
    data: manager.subscribers,
    filterFunction: filterSubscribers
  });
  
  const formDialog = useSubscriberFormDialog(initialFormData);

  const stats = calculateSubscriberStats(manager.subscribers);

  const handleExport = () => {
    try {
      const headers = ["Name", "Email", "Status", "Source", "Subscription Date", "Last Activity", "Tags"];
      const rows = tableState.filteredData.map(s => [
        s.name, s.email, s.status, s.source,
        s.subscriptionDate, s.lastActivity || '', s.tags.join("; ")
      ]);
      exportToCSV(rows, headers, `subscribers-${getCurrentDate()}.csv`);
      toast.success(`${tableState.filteredData.length} subscribers exported successfully`);
    } catch (error) {
      toast.error('Failed to export subscribers');
    }
  };

  const handleAddSubscriber = async () => {
    const success = await manager.createSubscriber(formDialog.formData);
    if (success) formDialog.closeDialogs();
  };

  const handleEditSubscriber = (subscriber: Subscriber) => {
    formDialog.openEditDialog(subscriber, (s) => ({
      name: s.name,
      email: s.email,
      status: s.status,
      source: s.source,
      tags: s.tags,
    }));
  };

  const handleUpdateSubscriber = async () => {
    if (!formDialog.editingEntity) return;
    const success = await manager.updateSubscriber(formDialog.editingEntity.id, formDialog.formData);
    if (success) formDialog.closeDialogs();
  };

  const handleDeleteSelected = async () => {
    const count = tableState.selectedIds.size;
    await manager.bulkDeleteSubscribers(tableState.selectedIds);
    tableState.clearSelection();
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await copyToClipboard(email);
      toast.success('Email copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy email');
    }
  };

  const handleClearFilters = () => {
    tableState.handleClearFilters();
    toast.success("Filters cleared");
  };

  const additionalFilterActions = tableState.selectedIds.size > 0 ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Selected ({tableState.selectedIds.size})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {tableState.selectedIds.size} subscriber{tableState.selectedIds.size > 1 ? 's' : ''}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteSelected}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;

  return (
    <EmailListTemplate>
      <EmailListTemplate.Header
        title="All Subscribers"
        description="Manage your email subscribers and track their engagement"
        onExport={handleExport}
        onAdd={formDialog.openAddDialog}
        addLabel="Add Subscriber"
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
            searchPlaceholder="Search by name, email, or tags..."
            filters={tableState.filters}
            filterConfigs={getFilterConfigs()}
            onFilterChange={tableState.handleFilterChange}
            hasActiveFilters={tableState.hasActiveFilters}
            onClearFilters={handleClearFilters}
            additionalActions={additionalFilterActions}
          />
        </div>
      </EmailListTemplate.Filters>

      <EmailListTemplate.Table
        title="Subscribers"
        itemCount={tableState.filteredData.length}
        totalCount={manager.subscribers.length}
        pagination={tableState.paginationConfig}
      >
        <DataTable
          data={tableState.paginatedData}
          columns={getTableColumns()}
          actions={getTableActions(handleEditSubscriber, manager.deleteSubscriber, handleCopyEmail)}
          selectedIds={tableState.selectedIds}
          onToggleSelection={tableState.toggleSelection}
          onToggleSelectAll={tableState.toggleSelectAll}
          areAllSelected={tableState.areAllSelected}
          showSelection={true}
          emptyMessage="No subscribers found."
        />
      </EmailListTemplate.Table>

      <EntityForm
        open={formDialog.showAddDialog}
        onOpenChange={formDialog.setShowAddDialog}
        title="Add New Subscriber"
        description="Add a new subscriber to your email list manually."
        fields={getFormFields()}
        formData={formDialog.formData}
        onFormDataChange={formDialog.updateFormData}
        onSubmit={handleAddSubscriber}
        onCancel={formDialog.closeDialogs}
        isLoading={manager.isLoading}
        submitText="Add Subscriber"
      />
      <EntityForm
        open={formDialog.showEditDialog}
        onOpenChange={formDialog.setShowEditDialog}
        title="Edit Subscriber"
        description="Update subscriber information and preferences."
        fields={getFormFields()}
        formData={formDialog.formData}
        onFormDataChange={formDialog.updateFormData}
        onSubmit={handleUpdateSubscriber}
        onCancel={formDialog.closeDialogs}
        isLoading={manager.isLoading}
        submitText="Update Subscriber"
      />
    </EmailListTemplate>
  );
}
