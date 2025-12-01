import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../admin/Admin.css";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard"); // normal user dashboard
  };

  return (
    <aside className="admin-sidebar">
      <h2>Admin Panel</h2>

      {/* Go Back Button */}
      <button className="btn-go-back" onClick={handleGoBack}>
        ← Go Back to User Dashboard
      </button>

      <nav>
        <ul>
          <li>
            <NavLink to="/admin/dashboard" end>
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">Manage Users</NavLink>
          </li>
          <li>
            <NavLink to="/admin/mod">Admin Mod</NavLink>
          </li>
          <li>
            <NavLink to="/admin/transactions">Transactions</NavLink>
          </li>
          <li>
            <NavLink to="/admin/tickets">Tickets</NavLink>
          </li>
          <li>
            <NavLink to="/admin/signals">Signals</NavLink>
          </li>
          <li>
            <NavLink to="/admin/signal-requests">Signal Requests</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
