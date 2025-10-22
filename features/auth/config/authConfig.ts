import type { UserRole } from '../types';

export const AUTH_CONFIG = {
  defaultValues: {
    login: {
      email: "dummy@gmail.com",
      password: "password",
      role: "patient" as UserRole
    }
  },

  redirects: {
    patient: "/patient/dashboard",
    therapist: "/therapist/dashboard",
    therapistIncomplete: "/therapist/details",
    patientIncomplete: "/patient/complete-profile",
    default: "/"
  },

  validation: {
    minPhoneLength: 10
  },

  labels: {
    patient: "Construction Worker",
    therapist: "Mental Health Professional"
  }
} as const;
