import type { Campaign } from '../types/Campaign';
import type { FilterState } from '../types/Filter';

export const filterCampaigns = (
  campaigns: Campaign[], 
  searchTerm: string, 
  filters: FilterState['filters']
) => {
  let filtered = [...campaigns];

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(searchLower) ||
      c.subject.toLowerCase().includes(searchLower) ||
      c.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filters.statusFilter && filters.statusFilter !== 'All') {
    filtered = filtered.filter(c => c.status === filters.statusFilter);
  }

  if (filters.dateFilter && filters.dateFilter !== 'All') {
    const now = new Date();
    const filterDate = new Date();
    
    switch (filters.dateFilter) {
      case 'Today':
        filterDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(c => new Date(c.createdDate) >= filterDate);
        break;
      case 'This Week':
        filterDate.setDate(now.getDate() - 7);
        filtered = filtered.filter(c => new Date(c.createdDate) >= filterDate);
        break;
      case 'This Month':
        filterDate.setMonth(now.getMonth() - 1);
        filtered = filtered.filter(c => new Date(c.createdDate) >= filterDate);
        break;
    }
  }

  return filtered;
};

export const calculateCampaignStats = (campaigns: Campaign[]) => {
  const stats = campaigns.reduce((acc, campaign) => {
    acc.total++;
    acc.totalRecipients += campaign.totalRecipients;
    
    switch (campaign.status) {
      case 'Draft': acc.draft++; break;
      case 'Scheduled': acc.scheduled++; break;
      case 'Sent': acc.sent++; break;
      case 'Failed': acc.failed++; break;
    }
    
    return acc;
  }, { total: 0, draft: 0, scheduled: 0, sent: 0, failed: 0, totalRecipients: 0, avgOpenRate: 0 });

  const sentCampaigns = campaigns.filter(c => c.status === 'Sent' && c.sentCount > 0);
  if (sentCampaigns.length > 0) {
    const totalOpenRate = sentCampaigns.reduce((sum, c) => sum + (c.openCount / c.sentCount * 100), 0);
    stats.avgOpenRate = totalOpenRate / sentCampaigns.length;
  }

  return stats;
};
