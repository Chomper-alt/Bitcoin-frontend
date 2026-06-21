import React from "react";
import "./AppLoader.css";

export default function AppLoader({ label = "Initializing secure trading environment…", title = "MetaTraderX", compact = false }) {
  return (
    <div className={compact ? "app-loader app-loader-compact" : "app-loader"} role="status" aria-live="polite">
      <div className="loader-box">
        <div className="spinner" aria-hidden="true"></div>
        {title && <h1 className="logo-text">{title}</h1>}
        {label && <p className="loading-text">{label}</p>}
      </div>
    </div>
  );
}
