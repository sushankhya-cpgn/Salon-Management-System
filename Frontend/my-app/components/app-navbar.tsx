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
import {  Moon, Sun, User } from "lucide-react"
import Link from "next/link";
import { logout } from "@/lib/api/auth";

 

export default function AppNavbar() {
  const { theme, setTheme } = useTheme();
  

  return (
    <NavigationMenu>
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
  )
}