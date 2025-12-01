import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token"); // assumes you store admin JWT here
        const { data } = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data.stats);
      } catch (err) {
        setError("Failed to fetch admin stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const displayStats = [
    { title: "Total Users", value: stats.totalUsers, icon: "👥" },
    { title: "Active Users", value: stats.activeUsers, icon: "✅" },
    { title: "Total Transactions", value: stats.totalTransactions, icon: "💳" },
    { title: "Pending Withdrawals", value: stats.pendingWithdrawals, icon: "⏳" },
    { title: "Total Deposits", value: `$${stats.totalDeposits}`, icon: "💰" },
    { title: "Revenue", value: `$${stats.revenue}`, icon: "📈" },
  ];

  return (
    <div className="admin-dashboard">
      <h1>📊 Admin Overview</h1>
      <div className="stats-grid">
        {displayStats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
