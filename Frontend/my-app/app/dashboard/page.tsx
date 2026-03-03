"use client"
import AppNavbar from "@/components/app-navbar"
import * as React from "react"



export default function DashBoard() {

   return (
    <div className=" w-full border rounded-2xl p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Salon Management System</h1>
      <AppNavbar/>
      
    </div>
  )
}
