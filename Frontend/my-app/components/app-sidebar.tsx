import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { BarChart3, Calendar, ChevronDown, CreditCard, LayoutDashboard, Package, Plus, Scissors, Settings, User2, UserCog, Users } from "lucide-react"
import { Collapsible } from "radix-ui"
import Link from "next/link"


export const sideBarItems = [
    {
        label: "Main",
        items: [
            {
                title: "Dashboard",
                icon: <LayoutDashboard />,
                href: "/dashboard"
            },
            {
                title: "Appointments",
                icon: <Calendar />,
                href: "/appointments"
            },
            {
                title: "Customers",
                icon: <Users />,
                href: "/customers"
            }
        ]
    },
    {
        label: "Management",
        items: [
            {
                title: "Services",
                icon: <Scissors />,
                href: "/services"
            },
            {
                title: "Staff",
                icon: <UserCog />,
                href: "/staff"
            },
            {
                title: "Inventory",
                icon: <Package />,
                href: "/inventory"
            }
        ]
    },
    {
        label: "Finance",
        items: [
            {
                title: "Billing",
                icon: <CreditCard />,
                href: "/billing"
            }   
        ]
    },
    {
        label: "Settings",
        items: [
            {
                title: "Profile",
                icon: <User2 />,
                href: "/profile"
            },
            {
                title: "Preferences",
                icon: <Settings />,
                href: "/preferences"
            }
        ]
    },

    {
        label: "Analytics",
        items: [
            {
                title: "Reports",
                icon: <BarChart3 />,
                href: "/reports"
            }
        ]
    }


]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    Select Workspace
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {sideBarItems.map((group)=>{
                return(
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item)=>{
                                    return(
                                        <SidebarMenuItem key={item.title}>
                                            <Link href={item.href} className="w-full">
                                                <SidebarMenuButton className="cursor-pointer">
                                                    {item.icon}
                                                    {item.title}
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                            </SidebarGroupContent>
                    </SidebarGroup>
                )
            })}
       
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <User2 /> Username
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}