import React from "react";
import style from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import Footer from "./../Footer/Footer";
import { MyNavbar } from "../Navbar/MyNavbar";

export default function Layout() {
  return (
   <>
    <div className="flex flex-col min-h-screen">
      <MyNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
   </>
  );
}
