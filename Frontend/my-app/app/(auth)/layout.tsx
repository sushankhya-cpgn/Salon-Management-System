import { ThemeProvider } from "@/components/theme-provider";
import Image from "next/image";

export default function AuthLayout({
  children,
 
}: {
  children: React.ReactNode;
  title:string;
  subtitle:string
}) {
  return (
    // <ThemeProvider>
    <div className=" min-h-screen w-screen flex items-center justify-center px-4">
      <div className="w-3/4  h-[700px]  rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
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
        {children}
      </div>
    </div>
    // </ThemeProvider>
  );
}
