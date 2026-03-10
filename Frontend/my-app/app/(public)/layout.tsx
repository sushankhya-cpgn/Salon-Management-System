"use client"

import AppNavbar from "@/components/app-navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { fetchUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";


export default function PublicLayout({
    children
}: { children: React.ReactNode }) {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const userString = localStorage.getItem('user');
        if (!token) {
            router.push('/login');
        } else {
            if (userString) {
                const user = JSON.parse(userString);
                if (user && user.id) {
                    dispatch(fetchUser(user.id));
                }
            }
            setIsLoading(false);
        }
    }, [router, dispatch]);

    if (isLoading) {
        return <div className="flex h-screen w-screen items-center justify-center min-h-screen text-4xl"><LoaderCircle className="animate-spin text-primary " /></div>;
    }

    return (

        <div className="flex min-h-screen w-full bg-background text-foreground">

            {/* Sidebar */}
            <AppSidebar />

            {/* Main */}
            <div className="flex flex-col flex-1 p-4 ">

                {/* Navbar */}
                <div className="flex items-center gap-3 w-full mb-4 border rounded-2xl p-4 ">
                    <SidebarTrigger />
                    <AppNavbar />
                </div>

                {/* Content */}
                <main className="flex-1 border rounded-2xl p-4">
                    {children}
                </main>

            </div>
        </div>

    );

}