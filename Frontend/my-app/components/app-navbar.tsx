"use client"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, User } from "lucide-react"
import Link from "next/link";
import { logout } from "@/lib/api/auth";
import { useSelector } from "react-redux"




export default function AppNavbar() {
  const { theme, setTheme } = useTheme();
  const user = useSelector((state: any) => state.user);

  const sayHi = () => {
    console.log(user)
  }

  return (
    <div className=" w-full flex justify-between items-center gap-4">
      <h1 className="text-2xl font-bold">Saloon Management System</h1>
          <div className=" flex gap-4">
            <p className=" text-2xl "> Hi, {user && <span>{user.name || user.email.split('@')[0] || "ss"}</span>}</p>
      <NavigationMenu className="w-full">
        <NavigationMenuList>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            {/* User Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                  <User className="cursor-pointer" />
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid  gap-2 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/profile">Profile</Link>
                    </NavigationMenuLink>
                  </li>

                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/settings">Settings</Link>
                    </NavigationMenuLink>
                  </li>

                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/login" onClick={logout}>Logout</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>

            </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
          </div>
    </div>
  )
}