import React, { useState } from "react";
import "../styles/Support.css";
import FAQ from "./FAQ";
import Tutorials from "./Tutorials";
import SubmitTicket from "./SubmitTicket";

export default function Support() {
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <div className="support-page">
      <h1>Support Center</h1>

      <div className="tabs">
        <button
          className={activeTab === "faq" ? "active" : ""}
          onClick={() => setActiveTab("faq")}
        >
          FAQ
        </button>
        <button
          className={activeTab === "tutorials" ? "active" : ""}
          onClick={() => setActiveTab("tutorials")}
        >
          Tutorials
        </button>
        <button
          className={activeTab === "ticket" ? "active" : ""}
          onClick={() => setActiveTab("ticket")}
        >
          Submit Ticket
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "faq" && <FAQ />}
        {activeTab === "tutorials" && <Tutorials />}
        {activeTab === "ticket" && <SubmitTicket />}
      </div>
    </div>
  );
}


