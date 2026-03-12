import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInput, registerSchema } from "@/lib/validations/schemas/authSchema";

export function RegisterForm({ onSubmit, loading }: any) {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema), // Integrate Zod resolver
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  async function handleFormSubmit(data:any){
    await onSubmit(data);
    reset();
  }


  return (
    <form
      className="mt-8 space-y-5 "
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div>
        <label className="text-sm font-medium text-gray-700">Name</label>
        <Input
          type="text"
          placeholder="Enter your name"
          className="mt-1"
          {...register("name")}
        />
      </div>
      <p className=" text-sm text-red-500">{errors.name?.message}</p>
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="mt-1"
          {...register("email")}
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
            {...register("password")}
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
      <div>
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
         <div className="flex relative">
        <Input
          type={!showConfirmPassword ? "password" : "text"}
          placeholder="Enter your password again"
          className="mt-1"
          {...register("confirmPassword")}
        />
            <div
            className="flex justify-center items-center px-2 absolute right-0 h-full cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {!showConfirmPassword ? <Eye /> : <EyeClosed />}
          </div>
        </div>
      </div>
      <p className=" text-sm text-red-500">{errors.confirmPassword?.message}</p>

      <Button type="submit" className="w-full mt-4" size="lg">
        {!loading ? "Register" : "Creating Account..."}
      </Button>

      <p className="text-sm text-center text-gray-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className=" text-blue-700">
          Login
        </Link>
      </p>
    </form>
  );
}
