import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import "./ManageTransactions.css";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch transactions:", err);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      await api.patch(`/admin/transactions/${id}`, { status });
      fetchTransactions();
    } catch (err) {
      console.error("❌ Failed to update transaction:", err);
      setError("Failed to update transaction. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="admin-transactions">
      <h2 className="page-title">💰 Manage Transactions</h2>

      {loading ? (
        <p className="loading-text">Loading transactions...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="transaction-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{tx.user?.username || "Unknown"}</td>
                  <td>{tx.type}</td>
                  <td>${tx.amount}</td>
                  <td>{tx.currency || "-"}</td>
                  <td>
                    <span className={`status-badge ${tx.status.toLowerCase()}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  <td>
                    {tx.status === "Pending" ? (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => updateStatus(tx._id, "Approved")}
                          disabled={updatingId === tx._id}
                        >
                          {updatingId === tx._id && "Processing... "}
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => updateStatus(tx._id, "Rejected")}
                          disabled={updatingId === tx._id}
                        >
                          {updatingId === tx._id && "Processing... "}
                          Reject
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <p className="empty-text">No transactions found.</p>
          )}
        </div>
      )}
    </div>
  );
}
