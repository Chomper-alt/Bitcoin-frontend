// src/components/WhatWeDo.jsx
import React from "react";
import "../styles/WhatWeDo.css";
import { Wallet, LineChart, Cpu, Users } from "lucide-react";
import { Link } from "react-router-dom"; 


const WhatWeDo = () => {
  return (
    <section className="what-we-do-section">
      <div className="what-we-do-content">
        {/* Left Column - Illustration */}
        <div className="what-we-do-left">
          <img
            src="/images/WhatWeDo.png"
            alt="MetaXTrader Platform"
            className="what-we-do-image"
          />
        </div>

        {/* Right Column - Text Content */}
        <div className="what-we-do-right">
          <h2 className="what-we-do-title">WHAT WE DO</h2>
          <p className="what-we-do-subtitle">
            At <span className="highlight">MetaTraderX</span>, we are building the next generation 
            of crypto and investment trading. Our platform connects investors, traders, 
            and entrepreneurs through secure technology, transparent processes, 
            and innovative financial tools.
          </p>
          <p className="what-we-do-description">
            From crypto trading and mining to global investments and community-driven growth, 
            MetaTraderX provides everything you need to grow and manage your digital wealth. 
            We combine professional-grade trading features with accessibility 
            so that both beginners and pros can thrive.
          </p>

          <ul className="what-we-do-list">
            <li>Buy, sell, and trade cryptocurrencies instantly</li>
            <li>Access secure wallets with top-tier protection</li>
            <li>Join investment packages tailored to your goals</li>
            <li>Earn rewards through referrals and community growth</li>
          </ul>

          <Link to="/register" className="what-we-do-button">
          Sign Up to Start Trading
        </Link>
        </div>
      </div>

      {/* Services Grid */}
      <div className="what-we-do-grid">
        <div className="what-card">
          <Wallet className="what-icon" />
          <h3>Secure Wallet</h3>
          <p>Multi-layer protection for your assets with instant withdrawals.</p>
        </div>

        <div className="what-card">
          <LineChart className="what-icon" />
          <h3>Pro Trading</h3>
          <p>Real-time charts, analytics, and tools designed for serious traders.</p>
        </div>

        <div className="what-card">
          <Cpu className="what-icon" />
          <h3>Crypto Mining</h3>
          <p>Access mining packages with optimized performance and transparency.</p>
        </div>

        <div className="what-card">
          <Users className="what-icon" />
          <h3>Community Growth</h3>
          <p>Earn rewards and grow together through our referral system.</p>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
