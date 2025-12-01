// src/dashboard/Trade.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Trade.css";

const Trade = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Demo Trading",
      description: "Practice with your demo balance. No real funds are used.",
      route: "/dashboard/trade/demo",
      icon: "🧪",
    },
    {
      title: "Live Trading",
      description: "Trade with your real wallet balance for actual profits.",
      route: "/dashboard/trade/live",
      icon: "💰",
    },
    {
      title: "Copy Trading",
      description: "Automatically copy the admin’s trades and earn with them.",
      route: "/dashboard/trade/copy",
      icon: "📊",
    },
  ];

  return (
    <div className="trade-landing">
      <h2 className="trade-title">Choose Your Trading Mode</h2>
      <div className="trade-options">
        {options.map((opt, index) => (
          <div
            key={index}
            className="trade-card"
            onClick={() => navigate(opt.route)}
          >
            <div className="trade-icon">{opt.icon}</div>
            <h3>{opt.title}</h3>
            <p>{opt.description}</p>
            <button className="trade-btn">Enter</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trade;
