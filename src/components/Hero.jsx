// Hero.jsx
import React from "react";
import heroImage from "/images/hero.png";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-text">
          <h1 className="fade-up">The Most Convenient Trading Platform</h1>
          <p className="fade-up delay-1">
            Provides a secure, unified platform where you can store, trade, and
            mine cryptocurrencies. All in one place.
          </p>
          <Link to="/register" className="cta-button fade-up delay-2">
            Get Started
          </Link>
        </div>

        <div className="hero-image floating">
          <img src={heroImage} alt="Hero" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
