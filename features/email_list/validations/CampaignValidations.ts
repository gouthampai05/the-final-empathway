import { z } from "zod";

// Campaign status enum
export const campaignStatusValidation = z.enum(["Draft", "Scheduled", "Sending", "Sent", "Failed"], {
  message: 'Invalid campaign status'
});

// Individual field validations
export const campaignNameValidation = z
  .string()
  .min(1, "Campaign name is required")
  .min(3, "Campaign name must be at least 3 characters")
  .max(200, "Campaign name must be less than 200 characters")
  .trim();

export const campaignSubjectValidation = z
  .string()
  .min(1, "Email subject is required")
  .min(3, "Email subject must be at least 3 characters")
  .max(200, "Email subject must be less than 200 characters")
  .trim();

export const campaignContentValidation = z
  .string()
  .min(1, "Email content is required")
  .min(10, "Email content must be at least 10 characters");

export const campaignDateValidation = z
  .string()
  .datetime({ message: "Invalid date format" })
  .optional();

export const recipientFiltersValidation = z.object({
  statuses: z.array(z.string()).default([]),
  sources: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
});

export const campaignTagsValidation = z
  .array(z.string().min(1, "Tag cannot be empty"))
  .max(20, "Maximum 20 tags allowed")
  .default([]);

// Full campaign schema (for database records)
export const campaignSchema = z.object({
  id: z.string(),
  name: campaignNameValidation,
  subject: campaignSubjectValidation,
  content: campaignContentValidation,
  status: campaignStatusValidation,
  createdDate: z.string(),
  sentDate: campaignDateValidation,
  scheduledDate: campaignDateValidation,
  templateId: z.string().optional(),
  totalRecipients: z.number().int().min(0, "Total recipients cannot be negative"),
  sentCount: z.number().int().min(0, "Sent count cannot be negative"),
  openCount: z.number().int().min(0, "Open count cannot be negative"),
  clickCount: z.number().int().min(0, "Click count cannot be negative"),
  bounceCount: z.number().int().min(0, "Bounce count cannot be negative"),
  unsubscribeCount: z.number().int().min(0, "Unsubscribe count cannot be negative"),
  recipientFilters: recipientFiltersValidation,
  createdBy: z.string(),
  tags: campaignTagsValidation,
  createdAt: z.string(),
  updatedAt: z.string(),
  recipientCount: z.number().int().min(0),
  openRate: z.number().min(0).max(100),
  clickRate: z.number().min(0).max(100),
});

// Campaign form schema (for creating/editing campaigns)
export const campaignFormSchema = z.object({
  name: campaignNameValidation,
  subject: campaignSubjectValidation,
  content: campaignContentValidation,
  scheduledDate: z.string().optional().refine(
    (date) => !date || new Date(date) > new Date(),
    { message: "Scheduled date must be in the future" }
  ),
  templateId: z.string().optional(),
  recipientFilters: recipientFiltersValidation,
  tags: campaignTagsValidation,
});

// Campaign update schema (partial)
export const campaignUpdateSchema = campaignFormSchema.partial();
