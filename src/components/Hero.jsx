// Hero.jsx
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import heroImage from "/images/hero.png";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

const Hero = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <section className="hero-section">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: false,
          particles: {
            number: { value: 60 },
            size: { value: 2 },
            color: { value: "#00ffff" },
            opacity: { value: 0.5 },
            links: {
              enable: true,
              color: "#00ffff",
              distance: 150,
              opacity: 0.4,
            },
            move: {
              enable: true,
              speed: 1,
              outModes: { default: "bounce" },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
            },
            modes: {
              repulse: { distance: 100 },
            },
          },
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Hero Content */}
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



