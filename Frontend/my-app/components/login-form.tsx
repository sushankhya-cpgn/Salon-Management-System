import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "../lib/validations/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormProps {
  onSubmit: (data: LoginInput) => void | Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="mt-1"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="flex relative">
          <Input
            type={!showPassword ? "password" : "text"}
            placeholder="Enter your password"
            className="mt-1"
            {...register("password")}
          />
          <div
            className="flex justify-center items-center px-2 absolute right-0 h-full cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {!showPassword ? <Eye /> : <EyeClosed />}
          </div>
        </div>
        {errors.password && (
          <p className="text-xs text-red-600 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full mt-4" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Login"}
      </Button>

      <p className="text-sm text-center text-gray-500 mt-4">
        Don't have an account?{" "}
        <Link href="/register" className=" text-blue-700">
          Register
        </Link>
      </p>
    </form>
  );
}
