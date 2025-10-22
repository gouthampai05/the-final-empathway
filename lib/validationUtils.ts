import { z } from 'zod';

/**
 * Common validation utilities used across multiple features
 * These are generic validations that can be reused throughout the application
 */

// Email validation (reusable)
export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .toLowerCase()
  .trim();

// Phone number validation (reusable)
export const phoneNumberValidation = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number")
  .min(10, "Phone number must be at least 10 characters");

// Name validation (for person names)
export const personNameValidation = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[a-zA-Z\s\-'.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes and periods")
  .trim();

// URL validation (optional)
export const urlValidation = z
  .string()
  .url("Invalid URL format")
  .optional()
  .or(z.literal(""));

// UUID validation
export const uuidValidation = z
  .string()
  .uuid("Invalid ID format");

// Positive integer validation
export const positiveIntValidation = (fieldName: string = "Value") =>
  z.number().int().min(0, `${fieldName} cannot be negative`);

// Date string validation (ISO 8601)
export const dateStringValidation = z
  .string()
  .datetime({ message: "Invalid date format" });

// Future date validation
export const futureDateValidation = z
  .string()
  .refine(
    (date) => !date || new Date(date) > new Date(),
    { message: "Date must be in the future" }
  );

// Text validation with min/max length
export const textValidation = (options: {
  fieldName: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
}) => {
  const { fieldName, minLength = 1, maxLength = 1000, required = true } = options;

  let validation = z.string();

  if (required) {
    validation = validation.min(1, `${fieldName} is required`);
  }

  if (minLength > 1) {
    validation = validation.min(minLength, `${fieldName} must be at least ${minLength} characters`);
  }

  if (maxLength) {
    validation = validation.max(maxLength, `${fieldName} must be less than ${maxLength} characters`);
  }

  return validation.trim();
};

// Tags array validation
export const tagsValidation = (maxCount: number = 15) =>
  z
    .array(z.string().min(1, "Tag cannot be empty").trim())
    .max(maxCount, `Maximum ${maxCount} tags allowed`)
    .default([]);

// Slug validation (URL-friendly string)
export const slugValidation = z
  .string()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens only")
  .trim();

// Status enum validation helper
export const createStatusValidation = <T extends [string, ...string[]]>(
  statuses: T,
  errorMessage?: string
) =>
  z.enum(statuses, {
    message: errorMessage || 'Invalid status'
  });

// Helper function to create a safe parse validator
export const createValidator = <T extends z.ZodTypeAny>(schema: T) => {
  return (data: unknown) => {
    return schema.safeParse(data);
  };
};

// Helper to extract error messages from Zod errors
export const getZodErrorMessages = (error: z.ZodError<unknown>): Record<string, string> => {
  const errors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });

  return errors;
};

// Helper to get first error message
export const getFirstZodError = (error: z.ZodError<unknown>): string | null => {
  return error.issues[0]?.message || null;
};
