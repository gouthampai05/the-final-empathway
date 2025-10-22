export interface FilterState {
  searchTerm: string;
  filters: {
    statusFilter?: 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Failed' | 'All';
    dateFilter?: 'Today' | 'This Week' | 'This Month' | 'All';
  };
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}
