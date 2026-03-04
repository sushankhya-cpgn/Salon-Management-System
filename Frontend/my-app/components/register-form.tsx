import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="mt-8 space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="flex relative">
          <Input
            type={!showPassword ? "password" : "text"}
            placeholder="Enter your password"
            className="mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-center items-center px-2 absolute right-0 h-full cursor-pointer">
            {!showPassword ? <Eye /> : <EyeClosed />}
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <Input
          type={!showPassword ? "password" : "text"}
          placeholder="Enter your password"
          className="mt-1"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <Button className="w-full mt-4" size="lg">
        Register
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
