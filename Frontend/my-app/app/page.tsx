"use client"
import AppNavbar from "@/components/app-navbar"
import { store } from "./store"
import { Provider } from "react-redux"



export default function Home() {

  return (
    <div className=" w-full border rounded-2xl p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Salon Management System</h1>
      <Provider store={store}>
        <AppNavbar />
      </Provider>

    </div>
  )
}
