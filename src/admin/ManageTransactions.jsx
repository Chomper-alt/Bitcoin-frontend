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

      // ✅ SAFE API CALL
      const res = await api.get("/api/admin/transactions");

      // ✅ FORCE ARRAY SHAPE
      const txArray =
        res?.data?.transactions ||
        res?.data ||
        [];

      setTransactions(Array.isArray(txArray) ? txArray : []);
    } catch (err) {
      console.error("❌ Failed to fetch transactions:", err);
      setError("Failed to fetch transactions. Please try again.");
      setTransactions([]); // ✅ prevent crash
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      await api.patch(`/api/admin/transactions/${id}`, { status });

      await fetchTransactions();
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
              {transactions.length > 0 ? (
                transactions.map((tx) => {
                  const status = tx.status?.toLowerCase?.() || "unknown";

                  return (
                    <tr key={tx._id}>
                      <td>{tx.user?.username || "Unknown"}</td>
                      <td>{tx.type}</td>
                      <td>${tx.amount}</td>
                      <td>{tx.currency || "-"}</td>

                      <td>
                        <span className={`status-badge ${status}`}>
                          {status}
                        </span>
                      </td>

                      <td>
                        {tx.createdAt
                          ? new Date(tx.createdAt).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        {status === "pending" ? (
                          <>
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                updateStatus(tx._id, "approved")
                              }
                              disabled={updatingId === tx._id}
                            >
                              {updatingId === tx._id
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                updateStatus(tx._id, "rejected")
                              }
                              disabled={updatingId === tx._id}
                            >
                              {updatingId === tx._id
                                ? "Processing..."
                                : "Reject"}
                            </button>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-text">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
