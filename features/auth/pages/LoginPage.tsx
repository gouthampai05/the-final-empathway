'use client';

import { AuthLayout } from "@/components/templates/AuthLayout";
import { LoginForm } from "../components";
import { useAuth } from "../hooks";

export default function LoginPage() {
  const { login, loading, error } = useAuth();

  return (
    <AuthLayout
      title="Log in to your account"
      description="Enter your credentials to access the platform"
    >
      <LoginForm onSubmit={login} loading={loading} error={error} />
    </AuthLayout>
  );
}
