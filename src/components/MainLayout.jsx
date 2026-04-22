import React from "react";
import SiteHeader from "./SiteHeader";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
};

export default MainLayout;