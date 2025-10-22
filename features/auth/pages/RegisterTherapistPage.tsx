'use client';

import { AuthLayout } from "@/components/templates/AuthLayout";
import { RegisterTherapistForm } from "../components";
import { useAuth } from "../hooks";
import { AUTH_CONFIG } from "../config";

export default function RegisterTherapist() {
  const { registerTherapist, loading, error } = useAuth();

  return (
    <AuthLayout
      title={`Register as ${AUTH_CONFIG.labels.therapist}`}
      description="Create your therapist account"
      maxWidth="md:max-w-md"
    >
      <RegisterTherapistForm onSubmit={registerTherapist} loading={loading} error={error} />
    </AuthLayout>
  );
}
