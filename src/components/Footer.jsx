// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0d1117] to-[#1c1f26] text-white px-10 pt-12">
      <div className="footer text-sm pb-8 border-b border-gray-700">
        {/* Logo and contact */}
        <div>
          <img
            src="/logos/MetaX.png"
            alt="MetaX Logo"
            className="footer-logo"
          />
          <p className="mb-1">📧 support@MetaX.com</p>
          <p>© MetaX. All Rights Reserved.</p>
        </div>

        {/* Access Account */}
        <div className="footer-column">
          <h3>Access Account</h3>
          <ul>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Learn More */}
        <div className="footer-column">
          <h3>Learn More</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/review">Review</Link></li>
            <li><Link to="/support">Support</Link></li>
          </ul>
        </div>

        {/* Privacy */}
        <div className="footer-column">
          <h3>Privacy</h3>
          <ul>
            <li><Link to="/terms">Cookie Policy</Link></li>
            <li><Link to="/terms">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/terms">Risk Disclosure</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar with Social Icons */}
      <div className="footer-bottom">
        <div className="social-icons">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaLinkedinIn /></a>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          © {new Date().getFullYear()} MetaTraderX. Built to protect your capital. Designed to empower your growth.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
