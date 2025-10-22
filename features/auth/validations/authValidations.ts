import { z } from "zod";

export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const passwordValidation = {
  // Simple validation for login
  login: z.string().min(1, "Password is required"),
  
  // Strong validation for registration
  register: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/^(?=.*\d)/, "Password must contain at least one number")
    .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character")
};

export const roleValidation = z.enum(["patient", "therapist"]);

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation.login,
  role: roleValidation
});

export const registerSchema = z.object({
  email: emailValidation,
  password: passwordValidation.register,
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: roleValidation,
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Phone number validation
export const phoneValidation = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number")
  .min(10, "Phone number must be at least 10 characters");

// Name validation
export const nameValidation = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[a-zA-Z\s\-'.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes and periods");

// Company name validation
export const companyNameValidation = z
  .string()
  .min(1, "Company name is required")
  .min(2, "Company name must be at least 2 characters")
  .max(200, "Company name must be less than 200 characters");

// Years of experience validation
export const yearsExperienceValidation = z
  .string()
  .min(1, "Years of experience is required")
  .refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 0 && num <= 70;
  }, "Years of experience must be between 0 and 70");

// Bio validation
export const bioValidation = z
  .string()
  .max(2000, "Bio must be less than 2000 characters")
  .optional();

// Profile picture URL validation
export const profilePicValidation = z
  .string()
  .url("Invalid profile picture URL")
  .optional()
  .or(z.literal(""));

// Therapist registration schema
export const therapistRegistrationSchema = z.object({
  email: emailValidation,
  password: passwordValidation.register,
  phoneNumber: phoneValidation,
  companyName: companyNameValidation,
  name: nameValidation,
  yearsExperience: yearsExperienceValidation,
  expertise: z.array(z.string()).min(1, "Please select at least one area of expertise").max(10, "Maximum 10 areas of expertise allowed"),
  bio: bioValidation,
  profilePic: profilePicValidation,
});

// Complete therapist profile schema (for profile completion page)
export const completeTherapistProfileSchema = z.object({
  phoneNumber: phoneValidation,
  companyName: companyNameValidation,
  name: nameValidation,
  yearsExperience: yearsExperienceValidation,
  expertise: z.array(z.string()).min(1, "Please select at least one area of expertise").max(10, "Maximum 10 areas of expertise allowed"),
  bio: bioValidation,
  profilePic: profilePicValidation,
});

// Patient registration schema
export const patientRegistrationSchema = z.object({
  email: emailValidation,
  password: passwordValidation.register,
  phoneNumber: phoneValidation,
  companyName: companyNameValidation,
  name: nameValidation,
  profilePic: profilePicValidation,
});
