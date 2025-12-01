import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminTransactions.css";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/transactions/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.pending || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        `/api/admin/transactions/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPending(); // Refresh list
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} transaction`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="admin-transactions">Loading...</div>;
  if (error) return <div className="admin-transactions">{error}</div>;

  return (
    <div className="admin-transactions">
      <h2>Pending Transactions</h2>
      {transactions.length === 0 ? (
        <p>No pending transactions</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.user.username} ({tx.user.email})</td>
                <td>{tx.type}</td>
                <td>₦{tx.amount}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    disabled={submitting}
                    onClick={() => handleAction(tx._id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    disabled={submitting}
                    onClick={() => handleAction(tx._id, "reject")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTransactions;
