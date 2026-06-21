import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  CircleDollarSign,
  Crown,
  FileText,
  Home,
  Info,
  Menu,
  MessageCircle,
  ReceiptText,
  Settings,
  Star,
  UserRound,
  UsersRound,
  Wallet as WalletIcon,
} from "lucide-react";
import "../styles/DashboardLayout.css";
import { useUser } from "../contexts/UserContext";
import AppLoader from "../components/AppLoader";
import { useTheme } from "../contexts/ThemeContext.jsx";

const DashboardLayout = () => {
  const { user, loading } = useUser();
  const location = useLocation();
  const current = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const dashboardLogoSrc = theme === "light" ? "/logos/MetaX-light.png" : "/logos/MetaX-dark.png";

  if (loading) {
    return <AppLoader label="Loading account..." />;
  }

  const navItems = [
    { name: "Profile", path: "/dashboard/profile", icon: UserRound },
    { name: "Trade", path: "/dashboard/trade", icon: BarChart3 },
    { name: "Wallet", path: "/dashboard/wallet", icon: WalletIcon },
    { name: "Transaction", path: "/dashboard/transactions", icon: ReceiptText },
    { name: "VIP", path: "/dashboard/vip", icon: Crown },
    { name: "Referral", path: "/dashboard/referrals", icon: UsersRound },
    { name: "Review", path: "/review", icon: Star },
    { name: "Support", path: "/support", icon: MessageCircle },
    { name: "About", path: "/about", icon: Info },
    { name: "Terms", path: "/terms", icon: FileText },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  if (user?.isAdmin) {
    navItems.push({ name: "Admin Panel", path: "/admin", icon: CircleDollarSign });
  }

  const bottomItems = [
    { name: "Profile", path: "/dashboard/profile", icon: UserRound },
    { name: "Trade", path: "/dashboard/trade", icon: BarChart3 },
    { name: "Wallet", path: "/dashboard/wallet", icon: WalletIcon },
    { name: "Transaction", path: "/dashboard/transactions", icon: ReceiptText },
  ];

  const isWalletRoute = current === "/dashboard/wallet" || current.startsWith("/dashboard/wallet/");

  const isDedicatedSimulator =
    current === "/dashboard/trade/demo" ||
    current.startsWith("/dashboard/trade/demo/") ||
    current === "/dashboard/trade/live" ||
    current.startsWith("/dashboard/trade/live/");

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <div className={`dashboard-container ${isDedicatedSimulator ? "dashboard-simulator-mode" : ""} ${isWalletRoute ? "dashboard-wallet-mode" : ""}`}>
      <header className="dashboard-mobile-topbar">
        <div className="mobile-logo dashboard-logo-link" aria-label="Meta X Broker">
          <img src={dashboardLogoSrc} alt="Meta X Broker" className="dashboard-logo-img" />
        </div>

        <Link to="/" className="dashboard-header-home" aria-label="Open home page" onClick={closeSidebar}>
          <Home size={18} aria-hidden="true" />
          <span>Home</span>
        </Link>
      </header>

      {sidebarOpen && <button className="sidebar-backdrop" onClick={closeSidebar} aria-label="Close menu" />}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Dashboard full menu">
        <div className="sidebar-title">Dashboard Menu</div>

        <nav className="nav-links" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = current === item.path || current.startsWith(`${item.path}/`);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`nav-link ${active ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>

      {!isDedicatedSimulator && (
        <nav className="dashboard-bottom-nav" aria-label="Mobile dashboard navigation">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = current === item.path || current.startsWith(`${item.path}/`);
            return (
              <NavLink key={item.name} to={item.path} className={`bottom-nav-link ${active ? "active" : ""}`}>
                <Icon size={18} aria-hidden="true" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <button
            type="button"
            className={`bottom-nav-link bottom-nav-button ${sidebarOpen ? "active" : ""}`}
            onClick={openSidebar}
            aria-label="Open dashboard full menu"
          >
            <Menu size={18} aria-hidden="true" />
            <span>Menu</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default DashboardLayout;
