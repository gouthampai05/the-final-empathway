'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Edit, Trash2, Mail, MoreVertical, UserCheck, UserX, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog, TableLoader } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { StatsGrid, StatItem, ListPageHeader, SearchAndFilters, FilterConfig, Pagination, EmptyState } from '@/components/admin';
import { useSubscriberData } from '../hooks/useSubscriberData';
import { useTableState } from '@/hooks/useTableState';
import { Subscriber, SubscriberFilters, SubscriberFormData, SubscriberStatus, SubscriberSource } from '../types/Subscriber';
import { createSubscriber, updateSubscriber, deleteSubscriber } from '../actions';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { formatDistanceToNow } from 'date-fns';

const STATUS_OPTIONS: { value: SubscriberStatus; label: string }[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Pending', label: 'Pending' },
];

const SOURCE_OPTIONS: { value: SubscriberSource; label: string }[] = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Website', label: 'Website' },
  { value: 'Import', label: 'Import' },
  { value: 'API', label: 'API' },
];

export const SubscriberListPage: React.FC = () => {
  const [filters, setFilters] = useState<SubscriberFilters>({});
  const { subscribers, stats, loading, error, refreshSubscribers } = useSubscriberData(filters);
  const { submitForm } = useFormSubmission();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; subscriber: Subscriber | null }>({ open: false, subscriber: null });
  const [formDialog, setFormDialog] = useState<{ open: boolean; subscriber: Subscriber | null }>({ open: false, subscriber: null });
  const [formData, setFormData] = useState<SubscriberFormData>({ name: '', email: '', status: 'Active', source: 'Manual', tags: [] });
  const [tagInput, setTagInput] = useState('');

  const tableState = useTableState({
    data: subscribers,
    itemsPerPage: 20,
    filterFunction: (items, searchTerm) => {
      return items.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    },
  });

  const handleAdd = () => {
    setFormData({ name: '', email: '', status: 'Active', source: 'Manual', tags: [] });
    setFormDialog({ open: true, subscriber: null });
  };

  const handleEdit = (subscriber: Subscriber) => {
    setFormData({ name: subscriber.name, email: subscriber.email, status: subscriber.status, source: subscriber.source, tags: subscriber.tags });
    setFormDialog({ open: true, subscriber });
  };

  const handleDelete = (subscriber: Subscriber) => {
    setDeleteDialog({ open: true, subscriber });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.subscriber) return;
    const toastId = toast.loading('Deleting subscriber...');
    try {
      await submitForm(async () => {
        await deleteSubscriber(deleteDialog.subscriber!.id);
      });
      toast.success('Subscriber deleted successfully', { id: toastId });
      refreshSubscribers();
      setDeleteDialog({ open: false, subscriber: null });
    } catch (error) {
      toast.error('Failed to delete subscriber', { id: toastId, description: error instanceof Error ? error.message : 'Please try again' });
    }
  };

  const handleSubmitForm = async () => {
    const toastId = toast.loading(formDialog.subscriber ? 'Updating subscriber...' : 'Creating subscriber...');
    try {
      await submitForm(async () => {
        if (formDialog.subscriber) {
          await updateSubscriber(formDialog.subscriber.id, formData);
        } else {
          await createSubscriber(formData);
        }
      });
      toast.success(formDialog.subscriber ? 'Subscriber updated successfully' : 'Subscriber created successfully', { id: toastId });
      refreshSubscribers();
      setFormDialog({ open: false, subscriber: null });
    } catch (error) {
      toast.error(formDialog.subscriber ? 'Failed to update subscriber' : 'Failed to create subscriber', { id: toastId, description: error instanceof Error ? error.message : 'Please try again' });
    }
  };

  const handleFilterChange = (key: keyof SubscriberFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value && value !== 'all' ? value : undefined }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const getStatusBadgeVariant = (status: SubscriberStatus) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) return <TableLoader rows={10} columns={6} />;

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center py-12">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Subscribers</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={refreshSubscribers} variant="outline">Try Again</Button>
      </motion.div>
    );
  }

  // Convert subscriber stats to StatItem format
  const statsItems: StatItem[] = stats ? [
    { title: 'Total Subscribers', value: stats.totalSubscribers, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Active', value: stats.activeSubscribers, icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Inactive', value: stats.inactiveSubscribers, icon: UserX, color: 'text-gray-600', bgColor: 'bg-gray-50' },
    { title: 'Pending', value: stats.pendingSubscribers, icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
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
    {
      key: 'source',
      label: 'Sources',
      options: SOURCE_OPTIONS.map(s => ({ value: s.value, label: s.label })),
      value: filters.source,
      placeholder: 'Source',
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
        title="Subscribers"
        description="Manage your email subscribers"
        actionLabel="New Subscriber"
        actionIcon={Plus}
        onAction={handleAdd}
      />

      <SearchAndFilters
        searchTerm={tableState.searchTerm}
        onSearchChange={tableState.handleSearchChange}
        filters={filterConfigs}
        onFilterChange={(key, value) => handleFilterChange(key as keyof SubscriberFilters, value)}
        hasActiveFilters={tableState.hasActiveFilters}
        onClearFilters={tableState.handleClearFilters}
        searchPlaceholder="Search subscribers..."
      />

      {tableState.paginatedData.length === 0 ? (
        subscribers.length === 0 && !tableState.hasActiveFilters ? (
          <EmptyState
            icon={Users}
            title="No subscribers yet"
            description="Add your first subscriber to get started"
            actionLabel="Add Subscriber"
            onAction={handleAdd}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No results"
            description="No subscribers match your current filters"
            actionLabel="Clear Filters"
            onAction={tableState.handleClearFilters}
          />
        )
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="border rounded-lg bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2">
                <TableHead>Subscriber</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableState.paginatedData.map((subscriber, index) => (
                <motion.tr key={subscriber.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }} className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b last:border-b-0" onClick={() => handleEdit(subscriber)}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{subscriber.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {subscriber.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{subscriber.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(subscriber.status)}>{subscriber.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {subscriber.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      {subscriber.tags.length > 2 && <Badge variant="secondary" className="text-xs">+{subscriber.tags.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(subscriber.subscriptionDate), { addSuffix: true })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(subscriber)}>
                          <Edit className="h-4 w-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(subscriber)} className="text-destructive">
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

      <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog({ open, subscriber: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formDialog.subscriber ? 'Edit Subscriber' : 'Add Subscriber'}</DialogTitle>
            <DialogDescription>{formDialog.subscriber ? 'Update subscriber information' : 'Add a new subscriber to your list'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="john@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: SubscriberStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={formData.source} onValueChange={(value: SubscriberSource) => setFormData(prev => ({ ...prev, source: value }))}>
                  <SelectTrigger id="source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_OPTIONS.map((source) => (
                      <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} placeholder="Add a tag..." />
                <Button type="button" onClick={handleAddTag} size="sm">Add</Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => handleRemoveTag(tag)}>{tag} ×</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormDialog({ open: false, subscriber: null })}>Cancel</Button>
            <Button onClick={handleSubmitForm}>{formDialog.subscriber ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, subscriber: null })} title="Delete Subscriber" description={`Are you sure you want to delete "${deleteDialog.subscriber?.name}"? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" onConfirm={confirmDelete} variant="destructive" />
    </div>
  );
};
