'use client';

import { AuthLayout } from "@/components/templates/AuthLayout";
import { RegisterPatientForm } from "../components";
import { useAuth } from "../hooks";
import { AUTH_CONFIG } from "../config";

export default function RegisterPatientPage() {
  const { registerPatient, loading, error } = useAuth();

  return (
    <AuthLayout
      title={`Register as ${AUTH_CONFIG.labels.patient}`}
      description="Create your patient account"
      maxWidth="md:max-w-lg"
    >
      <RegisterPatientForm onSubmit={registerPatient} loading={loading} error={error} />
    </AuthLayout>
  );
}
