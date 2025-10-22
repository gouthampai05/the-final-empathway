'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Mail, Edit, Trash2, MoreVertical, Send, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, TableLoader } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsGrid, StatItem, ListPageHeader, SearchAndFilters, FilterConfig, Pagination, EmptyState } from '@/components/admin';
import { useCampaignData } from '../hooks/useCampaignData';
import { useTableState } from '@/hooks/useTableState';
import { Campaign, CampaignFilters, CampaignStatus } from '../types/Campaign';
import { deleteCampaign } from '../actions';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { formatDistanceToNow } from 'date-fns';

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Sent', label: 'Sent' },
  { value: 'Failed', label: 'Failed' },
];

export const CampaignListPage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<CampaignFilters>({});
  const { campaigns, stats, loading, error, refreshCampaigns } = useCampaignData(filters);
  const { submitForm } = useFormSubmission();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; campaign: Campaign | null }>({ open: false, campaign: null });
  const [navigating, setNavigating] = useState(false);

  const tableState = useTableState({
    data: campaigns,
    itemsPerPage: 20,
    filterFunction: (items, searchTerm) => {
      return items.filter(camp =>
        camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  });

  const handleAdd = () => {
    setNavigating(true);
    router.push('/email_list/campaign/new');
  };

  const handleEdit = (campaign: Campaign) => {
    router.push(`/email_list/campaign/edit/${campaign.id}`);
  };

  const handleDelete = (campaign: Campaign) => {
    setDeleteDialog({ open: true, campaign });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.campaign) return;
    const toastId = toast.loading('Deleting campaign...');
    try {
      await submitForm(async () => {
        await deleteCampaign(deleteDialog.campaign!.id);
      });
      toast.success('Campaign deleted successfully', { id: toastId });
      refreshCampaigns();
      setDeleteDialog({ open: false, campaign: null });
    } catch (error) {
      toast.error('Failed to delete campaign', { id: toastId, description: error instanceof Error ? error.message : 'Please try again' });
    }
  };

  const handleFilterChange = (key: keyof CampaignFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value && value !== 'all' ? value as CampaignStatus : undefined }));
  };

  const getStatusBadgeVariant = (status: CampaignStatus) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Scheduled': return 'outline';
      case 'Sent': return 'default';
      case 'Failed': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) return <TableLoader rows={10} columns={6} />;

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center py-12">
        <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Campaigns</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={refreshCampaigns} variant="outline">Try Again</Button>
      </motion.div>
    );
  }

  // Convert campaign stats to StatItem format
  const statsItems: StatItem[] = stats ? [
    { title: 'Total Campaigns', value: stats.totalCampaigns, icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Draft', value: stats.draftCampaigns, icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-50' },
    { title: 'Scheduled', value: stats.scheduledCampaigns, icon: Send, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { title: 'Sent', value: stats.sentCampaigns, icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
  ] : [];

  // Convert filter configs
  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      options: STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label })),
      value: filters.status,
      placeholder: 'Status',
      width: 'w-[140px]',
    },
  ];

  return (
    <div className="space-y-6">
      {stats && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <StatsGrid
            stats={statsItems}
            columns={{ default: 1, md: 2, lg: 4 }}
            variant="compact"
            animate={false}
          />
        </motion.div>
      )}

      <ListPageHeader
        title="Campaigns"
        description="Manage your email campaigns"
        actionLabel="New Campaign"
        actionIcon={Plus}
        onAction={handleAdd}
        actionLoading={navigating}
      />

      <SearchAndFilters
        searchTerm={tableState.searchTerm}
        onSearchChange={tableState.handleSearchChange}
        filters={filterConfigs}
        onFilterChange={(key, value) => handleFilterChange(key as keyof CampaignFilters, value)}
        hasActiveFilters={tableState.hasActiveFilters}
        onClearFilters={tableState.handleClearFilters}
        searchPlaceholder="Search campaigns..."
      />

      {tableState.paginatedData.length === 0 ? (
        campaigns.length === 0 && !tableState.hasActiveFilters ? (
          <EmptyState
            icon={Mail}
            title="No campaigns yet"
            description="Create your first campaign to get started"
            actionLabel="Create Campaign"
            onAction={handleAdd}
          />
        ) : (
          <EmptyState
            icon={Mail}
            title="No results"
            description="No campaigns match your current filters"
            actionLabel="Clear Filters"
            onAction={tableState.handleClearFilters}
          />
        )
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="border rounded-lg bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2">
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableState.paginatedData.map((campaign, index) => (
                <motion.tr key={campaign.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }} className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b last:border-b-0" onClick={() => handleEdit(campaign)}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {campaign.subject}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(campaign.status)}>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Send className="h-3 w-3 text-muted-foreground" />
                      {campaign.recipientCount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {campaign.status === 'Sent' && (
                        <div className="flex gap-2">
                          <span>Open: {campaign.openRate}%</span>
                          <span>Click: {campaign.clickRate}%</span>
                        </div>
                      )}
                      {campaign.status !== 'Sent' && <span className="text-muted-foreground/50">—</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                          <Edit className="h-4 w-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(campaign)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {tableState.paginationConfig && (
        <Pagination
          currentPage={tableState.paginationConfig.currentPage}
          totalPages={tableState.paginationConfig.totalPages}
          itemsPerPage={tableState.paginationConfig.itemsPerPage}
          totalItems={tableState.filteredData.length}
          onPreviousPage={tableState.paginationConfig.onPreviousPage}
          onNextPage={tableState.paginationConfig.onNextPage}
        />
      )}

      <ConfirmDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, campaign: null })} title="Delete Campaign" description={`Are you sure you want to delete "${deleteDialog.campaign?.name}"? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" onConfirm={confirmDelete} variant="destructive" />
    </div>
  );
};
