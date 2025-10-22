import { z } from "zod";
import { type Subscriber, type SubscriberFormData } from "../types/Subscriber";

// Subscriber status enum
export const subscriberStatusValidation = z.enum(["Active", "Inactive", "Pending"], {
  message: 'Status must be Active, Inactive, or Pending'
});

// Subscriber source enum
export const subscriberSourceValidation = z.enum(["Website", "Manual", "Import", "API"], {
  message: 'Invalid subscriber source'
});

// Individual field validations
export const subscriberNameValidation = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .trim();

export const subscriberEmailValidation = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .toLowerCase()
  .trim();

export const subscriberTagsValidation = z
  .array(z.string().min(1, "Tag cannot be empty"))
  .max(15, "Maximum 15 tags allowed")
  .default([]);

// Full subscriber schema (for database records)
export const subscriberSchema = z.object({
  id: z.string(),
  name: subscriberNameValidation,
  email: subscriberEmailValidation,
  subscriptionDate: z.string(),
  status: subscriberStatusValidation,
  source: subscriberSourceValidation,
  tags: subscriberTagsValidation,
  lastActivity: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Subscriber form schema (for creating/editing subscribers)
export const subscriberFormSchema = z.object({
  name: subscriberNameValidation,
  email: subscriberEmailValidation,
  status: subscriberStatusValidation,
  source: subscriberSourceValidation,
  tags: subscriberTagsValidation,
}) satisfies z.ZodType<SubscriberFormData>;

// Subscriber update schema (partial)
export const subscriberUpdateSchema = subscriberFormSchema.partial();

export type SubscriberUpdateData = z.infer<typeof subscriberUpdateSchema>;
