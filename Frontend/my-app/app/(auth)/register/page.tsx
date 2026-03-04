"use client";

import { AuthCard } from "@/components/auth-card";
import { RegisterForm } from "@/components/register-form";
import { useAuth } from "@/hooks/useAuth";
import { register as registerApi } from "@/lib/api/auth";
import { RegisterInput } from "@/lib/validations/authSchema";


export default function Register() {
    const { register, error, loading,message } = useAuth();


  return(
    <AuthCard title="Welcome" subtitle="Register To Continue">
          {message && <div className="text-green-600 text-sm mb-4">{message}</div>}
            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <RegisterForm onSubmit={register} loading={loading}/>
    </AuthCard>
  );
}
