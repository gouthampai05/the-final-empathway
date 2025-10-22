import type { FilterConfig } from '@/types/FilterConfig';

export const campaignFilterConfigs: FilterConfig[] = [
  {
    key: "statusFilter",
    placeholder: "Status",
    options: [
      { value: "All", label: "All Status" },
      { value: "Draft", label: "Draft" },
      { value: "Scheduled", label: "Scheduled" },
      { value: "Sending", label: "Sending" },
      { value: "Sent", label: "Sent" },
      { value: "Failed", label: "Failed" }
    ]
  },
  {
    key: "dateFilter",
    placeholder: "Date",
    options: [
      { value: "All", label: "All Dates" },
      { value: "Today", label: "Today" },
      { value: "This Week", label: "This Week" },
      { value: "This Month", label: "This Month" }
    ]
  }
];
