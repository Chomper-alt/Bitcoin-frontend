import React from "react";
import "./AppLoader.css";

export default function AppLoader() {
  return (
    <div className="app-loader">
      <div className="loader-box">
        <div className="spinner"></div>
        <h1 className="logo-text">MetaTraderX</h1>
        <p className="loading-text">Initializing secure trading environment…</p>
      </div>
    </div>
  );
}
