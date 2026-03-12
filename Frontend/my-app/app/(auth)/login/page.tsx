"use client";

import { LoginForm } from "@/components/login-form";
import { AuthCard } from "@/components/auth-card";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { login, error } = useAuth();

  return (
    <AuthCard title="Welcome" subtitle="Login To Continue">
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
      <LoginForm onSubmit={login} />
    </AuthCard>
  );
}
