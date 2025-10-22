import { z } from "zod";

export type SubscriberStatus = "Active" | "Inactive" | "Pending";
export type SubscriberSource = "Website" | "Manual" | "Import" | "API";

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscriptionDate: string;
  status: SubscriberStatus;
  source: SubscriberSource;
  tags: string[];
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriberFormData extends Record<string, unknown> {
  name: string;
  email: string;
  status: SubscriberStatus;
  source: SubscriberSource;
  tags: string[];
}

export interface SubscriberFilters {
  status?: SubscriberStatus;
  source?: SubscriberSource;
  tag?: string;
}

export interface SubscriberStats {
  totalSubscribers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;
  pendingSubscribers: number;
}
