import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { useUser } from "../contexts/UserContext";

const Dashboard = () => {
  const { user: contextUser } = useUser(); // context user for display fallback
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDashboardData(res.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!dashboardData) return <div className="text-center mt-10">Failed to load dashboard</div>;

  const { user, tradeSummary } = dashboardData; // all info from API

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user.firstName} {user.lastName} — VIP {user.vipLevel}
      </h1>

      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <p><strong>Balance:</strong> ${user.wallet?.balance || 0}</p>
        <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>Referrals:</strong> {user.referrals?.length || 0}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Trade Summary</h2>
        <p>Total Trades: {tradeSummary.totalTrades}</p>
        <p>Total Bought: {tradeSummary.totalBought}</p>
        <p>Total Sold: {tradeSummary.totalSold}</p>
        <p>Net Holdings: {tradeSummary.netHoldings}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        {user.transactions?.length === 0 ? (
          <p>No recent trades.</p>
        ) : (
          <ul className="space-y-2">
            {user.transactions.map((tx) => (
              <li key={tx._id} className="border-b pb-2">
                {tx.type} {tx.amount} BTC @ ${tx.price} — {new Date(tx.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
