import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/DashboardLayout.css";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";

const DashboardLayout = () => {
  const { user, loading } = useUser();
  const location = useLocation();
  const current = location.pathname;
  const { theme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  const navItems = [
    { name: "Profile", path: "/dashboard/profile" },
    { name: "Wallet", path: "/dashboard/wallet" },
    { name: "Transactions", path: "/dashboard/transactions" },
    { name: "Trade", path: "/dashboard/trade" },
    { name: "VIP", path: "/dashboard/vip" },
    { name: "Referral", path: "/dashboard/referrals" },
    { name: "Settings", path: "/dashboard/settings" },
  ];

  if (user?.isAdmin) {
    navItems.push({ name: "Admin Panel", path: "/admin" });
  }

  return (
    <div className="dashboard-container">

      {/* ☰ MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link to="/" className="sidebar-title">
          MetaTraderX
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${
                current.startsWith(item.path) ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)} // auto-close on click
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;


