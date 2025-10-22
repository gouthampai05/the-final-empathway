import React from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import type { TableColumn } from '@/components/shared/DataTable';
import type { Campaign } from '../../types/Campaign';
import { 
  CampaignStatusBadge, 
  CampaignOpenRate, 
  CampaignTags 
} from './CampaignTableCells';

const campaignTableColumns: TableColumn<Campaign>[] = [
  {
    key: 'name',
    label: 'Campaign Name'
  },
  {
    key: 'subject',
    label: 'Subject'
  },
  {
    key: 'status',
    label: 'Status',
    render: campaign => <CampaignStatusBadge status={campaign.status} />
  },
  {
    key: 'totalRecipients',
    label: 'Recipients',
    render: campaign => campaign.totalRecipients.toLocaleString()
  },
  {
    key: 'createdDate',
    label: 'Created'
  },
  {
    key: 'openCount',
    label: 'Open Rate',
    render: campaign => <CampaignOpenRate campaign={campaign} />
  },
  {
    key: 'tags',
    label: 'Tags',
    render: campaign => <CampaignTags tags={campaign.tags} />
  }
];

interface CampaignTableProps {
  data: Campaign[];
  onPreview: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
  data,
  onPreview,
  onEdit,
  onDelete
}) => {
  const columns = campaignTableColumns;

  const actions = [
    {
      label: 'Preview',
      icon: <Eye className="h-4 w-4" />,
      onClick: onPreview
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
      disabled: (campaign: Campaign) => 
        campaign.status === 'Sent' || campaign.status === 'Sending'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: onDelete,
      variant: 'destructive' as const,
      disabled: (campaign: Campaign) => campaign.status === 'Sending'
    }
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      actions={actions}
      emptyMessage="No campaigns found."
    />
  );
};
