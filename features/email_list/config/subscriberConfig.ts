import React from 'react';
import { Edit, Trash2, Copy } from 'lucide-react';
import type { Subscriber } from '@/features/email_list/types/Subscriber';
import type { TableAction, TableColumn } from '@/components/shared/DataTable';
import type { FormField } from '@/components/shared/EntityForm';
import type { FilterConfig } from '@/types/FilterConfig';
import type { StatCard as StatCardType } from '@/types/StatCard';

export const getTableColumns = (): TableColumn<Subscriber>[] => [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'source', label: 'Source' },
  { key: 'subscriptionDate', label: 'Subscribed' },
  { key: 'lastActivity', label: 'Last Activity', render: (s) => s.lastActivity || '-' },
  { key: 'tags', label: 'Tags', render: (s) => (s.tags && s.tags.length ? s.tags.join(', ') : '-') },
];

export const getTableActions = (
  onEdit: (subscriber: Subscriber) => void,
  onDelete: (id: string) => Promise<void> | void,
  onCopyEmail: (email: string) => Promise<void> | void
): TableAction<Subscriber>[] => [
  {
    label: 'Edit',
    icon: React.createElement(Edit, { className: 'w-4 h-4' }),
    onClick: (s) => onEdit(s),
  },
  {
    label: 'Copy Email',
    icon: React.createElement(Copy, { className: 'w-4 h-4' }),
    onClick: (s) => onCopyEmail(s.email),
  },
  {
    label: 'Delete',
    icon: React.createElement(Trash2, { className: 'w-4 h-4' }),
    onClick: (s) => onDelete(s.id),
    variant: 'destructive',
  },
];

export const getFormFields = (): FormField[] => [
  { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Subscriber name' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'name@example.com' },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select', 
    required: true, 
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
      { value: 'Pending', label: 'Pending' },
    ]
  },
  { 
    name: 'source', 
    label: 'Source', 
    type: 'select', 
    required: true, 
    options: [
      { value: 'Website', label: 'Website' },
      { value: 'Manual', label: 'Manual' },
      { value: 'Import', label: 'Import' },
      { value: 'API', label: 'API' },
    ]
  },
  { name: 'tags', label: 'Tags', type: 'multiselect', placeholder: 'e.g. vip, beta, trial' },
];

export const getFilterConfigs = (): FilterConfig[] => [
  {
    key: 'status',
    placeholder: 'Status',
    options: [
      { value: 'All', label: 'All Status' },
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
      { value: 'Pending', label: 'Pending' },
    ],
  },
  {
    key: 'source',
    placeholder: 'Source',
    options: [
      { value: 'All', label: 'All Sources' },
      { value: 'Website', label: 'Website' },
      { value: 'Manual', label: 'Manual' },
      { value: 'Import', label: 'Import' },
      { value: 'API', label: 'API' },
    ],
  },
];

export const getStatsConfig = (stats: { total: number; active: number; inactive: number; pending: number }): StatCardType[] => [
  {
    title: 'Total Subscribers',
    value: stats.total,
    description: 'All records',
    icon: null,
  },
  {
    title: 'Active',
    value: stats.active,
    description: 'Currently subscribed',
    icon: null,
  },
  {
    title: 'Inactive',
    value: stats.inactive,
    description: 'Unsubscribed or disabled',
    icon: null,
  },
  {
    title: 'Pending',
    value: stats.pending,
    description: 'Awaiting confirmation',
    icon: null,
  },
];


