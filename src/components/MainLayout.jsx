import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Info, LogIn, MessageCircle, Star, UserPlus } from "lucide-react";
import SiteHeader from "./SiteHeader";
import { useUser } from "../contexts/UserContext";

const PublicAppBottomNav = () => {
  const location = useLocation();
  const { user } = useUser();

  const isLoggedIn = Boolean(user);

  const guestNavItems = [
    { name: "Register", path: "/register", icon: UserPlus },
    { name: "Login", path: "/login", icon: LogIn },
    { name: "Review", path: "/review", icon: Star },
    { name: "Support", path: "/support", icon: MessageCircle },
    { name: "About Us", path: "/about", icon: Info },
  ];

  const isActivePath = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  if (isLoggedIn) {
    return null;
  }

  return (
    <nav className="public-app-bottom-nav" aria-label="Guest app navigation">
      {guestNavItems.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(item.path);
        return (
          <NavLink key={item.name} to={item.path} className={`public-app-bottom-link ${active ? "active" : ""}`}>
            <Icon size={18} aria-hidden="true" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

const MainLayout = () => {
  const { user } = useUser();
  const isLoggedIn = Boolean(user);

  return (
    <>
      <SiteHeader />
      <main className={`public-app-body ${isLoggedIn ? "public-app-body-no-bottom" : ""}`}>
        <Outlet />
      </main>
      <PublicAppBottomNav />
    </>
  );
};

export default MainLayout;
