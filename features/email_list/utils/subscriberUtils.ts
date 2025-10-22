import { Subscriber } from "../types/Subscriber";

export const calculateSubscriberStats = (subscribers: Subscriber[]) => {
  return subscribers.reduce((acc, subscriber) => {
    acc.total++;
    const status = subscriber.status.toLowerCase() as 'active' | 'inactive' | 'pending';
    acc[status]++;
    return acc;
  }, { total: 0, active: 0, inactive: 0, pending: 0 });
};

export const filterSubscribers = (subscribers: Subscriber[], searchTerm: string, filters: Record<string, string>) => {
  let filtered = [...subscribers];

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower) ||
      s.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filters.statusFilter && filters.statusFilter !== 'All') {
    filtered = filtered.filter(s => s.status === filters.statusFilter);
  }

  if (filters.sourceFilter && filters.sourceFilter !== 'All') {
    filtered = filtered.filter(s => s.source === filters.sourceFilter);
  }

  return filtered;
};

export const mockSubscribers: Subscriber[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    subscriptionDate: "2025-01-15",
    status: "Active",
    source: "Website",
    tags: ["Newsletter", "Premium"],
    lastActivity: "2025-08-10",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-08-10T14:30:00Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    subscriptionDate: "2025-02-20",
    status: "Active",
    source: "Manual",
    tags: ["Newsletter"],
    lastActivity: "2025-08-12",
    createdAt: "2025-02-20T11:00:00Z",
    updatedAt: "2025-08-12T16:45:00Z"
  }
];
