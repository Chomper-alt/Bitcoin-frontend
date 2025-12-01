import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/DashboardLayout.css";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";

const DashboardLayout = () => {
  const { user, loading } = useUser();
  const location = useLocation();
  const current = location.pathname;
  const { theme } = useTheme();

  // ✅ Wait until user data is loaded
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
      <aside className="sidebar">
        <Link to="/" className="sidebar-title">
          MetaTraderX
        </Link>

         <div className={`dashboard-layout ${theme}`}></div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${current.startsWith(item.path) ? "active" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

