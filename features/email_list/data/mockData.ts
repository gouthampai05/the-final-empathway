import { Campaign, CampaignFormData } from '../types/Campaign';

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Welcome Series - Week 1",
    subject: "Welcome to Empathway!",
    content: "Thank you for joining our community...",
    status: "Sent",
    createdDate: "2025-08-01",
    sentDate: "2025-08-01",
    totalRecipients: 1250,
    sentCount: 1250,
    openCount: 625,
    clickCount: 185,
    bounceCount: 12,
    unsubscribeCount: 3,
    recipientFilters: {
      statuses: ["Active"],
      sources: ["Website"],
      tags: ["New Users"]
    },
    createdBy: "John Doe",
    tags: ["Welcome", "Onboarding"],
    createdAt: "2025-07-28T10:00:00Z",
    updatedAt: "2025-08-01T14:30:00Z",
    recipientCount: 1250,
    openRate: 50,
    clickRate: 14.8
  },
  {
    id: "2",
    name: "Monthly Newsletter - September",
    subject: "Your Monthly Mental Health Insights",
    content: "This month's top articles and resources...",
    status: "Scheduled",
    createdDate: "2025-08-28",
    scheduledDate: "2025-09-01",
    totalRecipients: 5000,
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    bounceCount: 0,
    unsubscribeCount: 0,
    recipientFilters: {
      statuses: ["Active", "Engaged"],
      sources: ["All"],
      tags: ["Newsletter"]
    },
    createdBy: "Jane Smith",
    tags: ["Newsletter", "Monthly"],
    createdAt: "2025-08-28T09:15:00Z",
    updatedAt: "2025-08-29T11:30:00Z",
    recipientCount: 5000,
    openRate: 0,
    clickRate: 0
  },
  {
    id: "3",
    name: "Therapist Survey Campaign",
    subject: "Help Us Improve Your Experience",
    content: "We value your feedback...",
    status: "Draft",
    createdDate: "2025-08-30",
    totalRecipients: 0,
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    bounceCount: 0,
    unsubscribeCount: 0,
    recipientFilters: {
      statuses: ["Active"],
      sources: ["Therapist Portal"],
      tags: ["Therapists"]
    },
    createdBy: "Alex Johnson",
    tags: ["Survey", "Therapists", "Feedback"],
    createdAt: "2025-08-30T16:45:00Z",
    updatedAt: "2025-08-30T16:45:00Z",
    recipientCount: 0,
    openRate: 0,
    clickRate: 0
  }
];

export const initialCampaignFormData: CampaignFormData = {
  name: "",
  subject: "",
  content: "",
  recipientFilters: {
    statuses: [],
    sources: [],
    tags: []
  },
  tags: []
};
