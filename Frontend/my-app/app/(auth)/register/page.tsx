"use client";

import { LoginForm } from "@/components/login-form";
import { AuthCard } from "@/components/auth-card";
import { RegisterForm } from "@/components/register-form";

export default function Login() {
  return(
    <AuthCard title="Welcome" subtitle="Register To Continue">
        <RegisterForm/>
    </AuthCard>
  );
}
