import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children
}:{children: React.ReactNode}){

    return(
        <SidebarProvider>
               <div className="flex min-h-screen w-full">
              <AppSidebar />
             <main className="flex-1 p-6">
            <div className="flex justify-center items-center">
          <SidebarTrigger />
          {children}
          </div>
        </main>
          </div>
            </SidebarProvider>
    );
    
}