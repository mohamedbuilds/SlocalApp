import React from "react";
import style from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import Footer from "./../Footer/Footer";
import { MyNavbar } from "../Navbar/MyNavbar";

export default function Layout() {
  return (
   <>
      <MyNavbar />
      <Outlet />
      <Footer />
   </>
  );
}
