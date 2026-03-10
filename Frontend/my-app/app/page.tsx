"use client"
import AppNavbar from "@/components/app-navbar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"



import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-screen">
      
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Book Your Appointments Easily
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Find doctors, schedule visits, and manage your appointments online.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/appointments"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Book Appointment
          </Link>
          <Link
            href="/login"
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p>Schedule appointments with doctors in just a few clicks.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Manage Appointments</h3>
            <p>View upcoming visits, reschedule, or cancel easily.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Reminders & Notifications</h3>
            <p>Get timely reminders about your appointments.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl mb-2">1️⃣</div>
            <p>Register an account</p>
          </div>
          <div>
            <div className="text-4xl mb-2">2️⃣</div>
            <p>Choose a doctor</p>
          </div>
          <div>
            <div className="text-4xl mb-2">3️⃣</div>
            <p>Book your appointment</p>
          </div>
          <div>
            <div className="text-4xl mb-2">4️⃣</div>
            <p>Manage appointments easily</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to book your appointment?
        </h2>
        <Link
          href="/appointments"
          className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition"
        >
          Book Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-6 text-center">
        &copy; {new Date().getFullYear()} My Appointment App. All rights reserved.
      </footer>
    </div>
  );
}