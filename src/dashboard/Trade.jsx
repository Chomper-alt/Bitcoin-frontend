// src/dashboard/Trade.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaFlask, FaWallet } from "react-icons/fa";
import "./Trade.css";

const Trade = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Demo Trading",
      description: "Practice with your demo balance. No real funds are used.",
      route: "/dashboard/trade/demo",
      Icon: FaFlask,
    },
    {
      title: "Live Trading",
      description: "Trade with your real wallet balance for actual profits.",
      route: "/dashboard/trade/live",
      Icon: FaWallet,
    },
    {
      title: "Copy Trading",
      description: "Automatically copy the admin’s trades and earn with them.",
      route: "/dashboard/trade/copy",
      Icon: FaChartLine,
    },
  ];

  return (
    <div className="trade-landing">
      <h2 className="trade-title">Choose Your Trading Mode</h2>
      <div className="trade-options">
        {options.map(({ title, description, route, Icon }) => (
          <button
            key={route}
            type="button"
            className="trade-card"
            onClick={() => navigate(route)}
            aria-label={`Open ${title}`}
          >
            <span className="trade-icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="trade-card-copy">
              <h3>{title}</h3>
              <p>{description}</p>
            </span>
            <span className="trade-btn">Enter</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Trade;
