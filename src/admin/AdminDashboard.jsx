import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import api from "../utils/axiosInstance"; // ✅ centralized axios

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/admin/stats");

        // ✅ FORCE SAFE SHAPE
        const statsObj =
          data?.stats ||
          data?.data ||
          data ||
          {};

        setStats(typeof statsObj === "object" && statsObj !== null ? statsObj : {});
      } catch (err) {
        setError("Failed to fetch admin stats");
        console.error("Admin stats fetch error:", err);
        setStats({}); // ✅ prevent undefined crashes
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const displayStats = [
    { title: "Total Users", value: stats?.totalUsers ?? 0, icon: "👥" },
    { title: "Active Users", value: stats?.activeUsers ?? 0, icon: "✅" },
    { title: "Total Transactions", value: stats?.totalTransactions ?? 0, icon: "💳" },
    { title: "Pending Withdrawals", value: stats?.pendingWithdrawals ?? 0, icon: "⏳" },
    { title: "Total Deposits", value: `$${stats?.totalDeposits ?? 0}`, icon: "💰" },
    { title: "Revenue", value: `$${stats?.revenue ?? 0}`, icon: "📈" },
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
