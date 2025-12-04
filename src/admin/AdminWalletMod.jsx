// src/admin/AdminWalletMod.jsx
import React, { useState, useEffect } from "react";
import api from "../utils/axiosInstance";
import "./AdminWalletMod.css";

export default function AdminWalletMod() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch users safely
  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");

      const userArray =
        res?.data?.users ||
        res?.data?.data ||
        res?.data ||
        [];

      setUsers(Array.isArray(userArray) ? userArray : []);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      setUsers([]); // ✅ prevent crash
    }
  };

  // ✅ Wallet modification
  const handleUpdate = async (type) => {
    if (!selectedUser || !amount || Number(amount) <= 0) {
      setMessage("Please select a user and enter a valid amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        type === "add"
          ? "/api/admin/wallet-mod/add"
          : "/api/admin/wallet-mod/subtract";

      const res = await api.patch(endpoint, {
        userId: selectedUser,
        amount: Number(amount),
      });

      setMessage(res?.data?.message || "Wallet updated successfully!");
      setAmount("");
    } catch (err) {
      console.error("❌ Wallet mod error:", err);
      setMessage(err?.response?.data?.message || "Failed to update wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-wallet-mod">
      <h2>Admin Mod Box: Update User Wallet</h2>

      {message && <p className="mod-message">{message}</p>}

      <div className="mod-controls">
        <label>
          Select User:
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username} ({u.email})
              </option>
            ))}
          </select>
        </label>

        <label>
          Amount ($):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
        </label>

        <div className="mod-buttons">
          <button
            onClick={() => handleUpdate("add")}
            disabled={loading}
            className="btn-add"
          >
            {loading ? "Processing..." : "Add Deposit"}
          </button>

          <button
            onClick={() => handleUpdate("subtract")}
            disabled={loading}
            className="btn-subtract"
          >
            {loading ? "Processing..." : "Subtract / Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}
