import Image from "next/image";

export default function AuthLayout({
  children,
 
}: {
  children: React.ReactNode;
  title:string;
  subtitle:string
}) {
  return (
    <div className=" h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-3/4  h-3/4 bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
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
  );
}
