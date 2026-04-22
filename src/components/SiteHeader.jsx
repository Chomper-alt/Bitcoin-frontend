import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Header.css";

const SiteHeader = () => {
  const location = useLocation();

  return (
    <motion.header
      className="site-header"
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
        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          MetaTraderX
        </Link>
      </motion.div>

      <motion.div
        className="nav-buttons"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <Link
          to="/register"
          className={`nav-btn ${location.pathname === "/register" ? "active" : ""}`}
        >
          Register
        </Link>

        <Link
          to="/login"
          className={`nav-btn ${location.pathname === "/login" ? "active" : ""}`}
        >
          Login
        </Link>

        <Link
          to="/support"
          className={`nav-btn ${location.pathname === "/support" ? "active" : ""}`}
        >
          Support
        </Link>

        <Link
          to="/review"
          className={`nav-btn ${location.pathname === "/review" ? "active" : ""}`}
        >
          Review
        </Link>

        <Link
          to="/about"
          className={`nav-btn ${location.pathname === "/about" ? "active" : ""}`}
        >
          About Us
        </Link>
      </motion.div>
    </motion.header>
  );
};

export default SiteHeader;