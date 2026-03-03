"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
// import { useLogin } from "@/hooks/use-login";
import { useState } from "react";

export default function Login() {
    // const {login,loading, error} = useLogin();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    return (

        <form>
            <div className=" h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="w-full  h-3/4 bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

                    {/* Left Image Section */}
                    <div className="hidden md:block relative">
                        <Image
                            src="/login.jpg"
                            alt="Login"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Right Form Section */}
                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
                        <p className="text-gray-500 mt-2">
                            Please enter your details to sign in
                        </p>

                        <form className="mt-8 space-y-5">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="mt-1"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="mt-1"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Button className="w-full mt-4" size="lg">
                                Login
                            </Button>

                            <p className="text-sm text-center text-gray-500 mt-4">
                                Don't have an account?{" "}
                                <a
                                    href="/register"
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Register
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </form>
    );
}