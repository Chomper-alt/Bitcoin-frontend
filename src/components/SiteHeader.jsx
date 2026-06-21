import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { useUser } from "../contexts/UserContext";
import "../styles/Header.css";

const SiteHeader = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useUser();
  const logoSrc = theme === "light" ? "/logos/MetaX-light.png" : "/logos/MetaX-dark.png";
  const isLoggedIn = Boolean(user);

  return (
    <motion.header
      className={`site-header ${isLoggedIn ? "site-header-authenticated" : "site-header-guest"}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="logo"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <span className="site-logo-brand" aria-label="Meta X Broker">
          <img src={logoSrc} alt="Meta X Broker" className="site-logo-img" />
        </span>
      </motion.div>

      <motion.div
        className="nav-buttons"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {isLoggedIn ? (
          <Link to="/dashboard/profile" className="nav-btn nav-btn-dashboard" aria-label="Open dashboard">
            <UserRound size={18} aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
        ) : (
          <>
            <Link to="/register" className={`nav-btn ${location.pathname === "/register" ? "active" : ""}`}>
              Register
            </Link>
            <Link to="/login" className={`nav-btn ${location.pathname === "/login" ? "active" : ""}`}>
              Login
            </Link>
            <Link to="/support" className={`nav-btn ${location.pathname === "/support" ? "active" : ""}`}>
              Support
            </Link>
            <Link to="/review" className={`nav-btn ${location.pathname === "/review" ? "active" : ""}`}>
              Review
            </Link>
            <Link to="/about" className={`nav-btn ${location.pathname === "/about" ? "active" : ""}`}>
              About Us
            </Link>
          </>
        )}
      </motion.div>
    </motion.header>
  );
};

export default SiteHeader;
