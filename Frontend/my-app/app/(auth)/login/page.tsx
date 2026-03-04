"use client";

import { LoginForm } from "@/components/login-form";
import { AuthCard } from "@/components/auth-card";

export default function Login() {
  return(
    <AuthCard title="Welcome" subtitle="Login To Continue">
        <LoginForm/>
    </AuthCard>
  );
}
