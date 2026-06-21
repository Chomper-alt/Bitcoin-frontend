import React from "react";
import { Shield, TrendingUp, Users, Coins } from "lucide-react";
import "../styles/Features.css";

export default function Features() {
  const features = [
    {
      id: 1,
      title: "Secure Wallet",
      desc: "Your funds are protected with bank-grade security.",
      icon: <Shield size={40} />,
      gradient: "linear-gradient(135deg, #00d4ff, #0077ff)",
    },
    {
      id: 2,
      title: "Smart Trading",
      desc: "AI-powered tools for seamless crypto trading.",
      icon: <TrendingUp size={40} />,
      gradient: "linear-gradient(135deg, #ff8a00, #e52e71)",
    },
    {
      id: 3,
      title: "Global Community",
      desc: "Join traders worldwide and share insights.",
      icon: <Users size={40} />,
      gradient: "linear-gradient(135deg, #42e695, #3bb2b8)",
    },
    {
      id: 4,
      title: "Multi-Currency",
      desc: "Trade and manage multiple cryptocurrencies easily.",
      icon: <Coins size={40} />,
      gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
    },
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Platform Features</h2>
      <div className="features-grid">
        {features.map((feat) => (
          <div
            key={feat.id}
            className="feature-card"
            style={{ background: feat.gradient }}
          >
            <div className="feature-icon">{feat.icon}</div>
            <h3>{feat.title}</h3>
            <p>{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
