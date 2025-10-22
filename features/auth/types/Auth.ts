import type { z } from "zod";
import { loginSchema, therapistRegistrationSchema, patientRegistrationSchema } from "../validations/authValidations";

export type LoginFormData = z.infer<typeof loginSchema>;
export type TherapistRegistrationData = z.infer<typeof therapistRegistrationSchema>;
export type PatientRegistrationData = z.infer<typeof patientRegistrationSchema>;

export type UserRole = "patient" | "therapist";

export interface AuthResponse {
  message: string;
  redirectTo: string;
}

export interface CompleteTherapistProfileData {
  name: string;
  phoneNumber: string;
  companyName: string;
  yearsExperience: string;
  expertise: string[];
  bio: string;
  profilePic: string;
}

export interface ProfileData {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  company_name: string;
  role: UserRole;
  profile_pic_url: string | null;
}
