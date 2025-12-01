import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/components/AdminSidebar";
import "../styles/Admin.css";

export default function Admin() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
