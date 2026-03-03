import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function LoginLayout({
    children
}: { children: React.ReactNode }) {

    return (

        <div className="flex min-h-screen w-full h-full justify-center items-center">
            {children}
        </div>

    );

}