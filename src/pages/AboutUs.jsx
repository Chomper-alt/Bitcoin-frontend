//----ABOUT US

import React from "react";
import "../styles/AboutUs.css";
import OurJourney from "./OurJourney";

export default function AboutUs() {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About MetaTraderX</h1>
        <p>
          At MetaTraderX, our mission is to make trading simple, accessible, and
          rewarding for everyone. We combine cutting-edge technology with
          real-world expertise to empower traders at every level.
        </p>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          To democratize trading by offering a transparent, secure, and
          user-friendly platform. We believe that financial growth should be
          within everyone’s reach, not just a select few.
        </p>
      </section>

      {/* Vision Section */}
      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          To become the world’s most trusted trading partner by fostering a
          community where knowledge, opportunity, and success are shared.
        </p>
      </section>

      {/* Our Journey Section */}
      <OurJourney />

      {/* Values Section */}
      <section className="about-section values">
        <h2>Our Values</h2>
        <ul>
          <li>💡 Innovation — We embrace technology to create smarter solutions.</li>
          <li>🤝 Trust — Transparency and honesty are at the heart of what we do.</li>
          <li>🌍 Accessibility — Trading should be for everyone, everywhere.</li>
          <li>📈 Growth — We empower our users to achieve lasting success.</li>
        </ul>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Ready to Start Your Journey?</h2>
        <p>
          Join MetaTraderX today and be part of a growing community of traders
          achieving financial freedom.
        </p>
        <div className="cta-buttons">
          <a href="/register" className="btn primary-btn">Register</a>
          <a href="/login" className="btn secondary-btn">Login</a>
        </div>
      </section>
    </div>
  );
}
