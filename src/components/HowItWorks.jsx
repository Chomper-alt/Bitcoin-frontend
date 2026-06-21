// src/components/HowItWorks.jsx
import React from "react";
import "../styles/HowItWorks.css";
import { Link } from "react-router-dom"; 

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-container">
        {/* Left - Video */}
        <div className="how-video">
          <video
            src="/videos/investor.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="how-video-box"
            aria-label="How Meta X Broker works"
            onContextMenu={(event) => event.preventDefault()}
          />
        </div>

        {/* Right - Text */}
        <div className="how-text">
          <h2>How It Works</h2>
          <p>
            Our platform is designed for both beginners and pros. Watch real
            investors trade, learn the strategies, and start your own journey
            with confidence.
          </p>
          <ul>
            <li>📊 Create an account in minutes</li>
            <li>💰 Deposit funds securely</li>
            <li>🚀 Start trading with real-time insights</li>
          </ul>
         <Link to="/register" className="what-we-do-button">
          Get Started Now
        </Link>

        </div>
      </div>
    </section>
  );
}



