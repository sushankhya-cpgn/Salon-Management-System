import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "../lib/validations/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema), // Integrate Zod resolver
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    console.log(data); // Data is validated and type-safe here
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="mt-1"
          value={email}
          {...register("email")}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <p className=" text-sm text-red-500">{errors.email?.message}</p>

      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="flex relative">
          <Input
            type={!showPassword ? "password" : "text"}
            placeholder="Enter your password"
            className="mt-1"
            value={password}
            {...register("password")}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="flex justify-center items-center px-2 absolute right-0 h-full cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {!showPassword ? <Eye /> : <EyeClosed />}
          </div>
        </div>
      </div>
          <p className=" text-sm text-red-500">{errors.password?.message}</p>

      <Button type="submit" className="w-full mt-4" size="lg">
        Login
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
