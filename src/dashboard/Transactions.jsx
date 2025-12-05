import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance.js";
import "./Transactions.css";
import { FaBell } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // fetch balance
        const balanceRes = await api.get("/api/wallet/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(balanceRes.data.balance ?? 0);

        // fetch transactions
        const txRes = await api.get("/api/wallet/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(txRes.data.transactions || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const formatAmount = (amt) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt);

  const filteredTx =
    filter === "All"
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  if (loading) return <div className="transactions-page">Loading...</div>;
  if (error) return <div className="transactions-page error">{error}</div>;

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h2>Transactions</h2>
        <FaBell className="icon" />
      </div>

      {/* Balance Card */}
      <div className="balance-box">
        <span>{formatAmount(balance ?? 0)}</span>
        <p>Available balance</p>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <label>Filter by:</label>
        <div
          className={`dropdown ${dropdownOpen ? "open" : ""}`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{filter} Transactions</span>
          <FiChevronDown />
          {dropdownOpen && (
            <ul className="dropdown-menu">
              {["All", "Deposit", "Withdraw"].map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    setFilter(opt);
                    setDropdownOpen(false);
                  }}
                >
                  {opt} Transactions
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-list">
        {filteredTx.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          filteredTx.map((tx, index) => (
            <div className="transaction-card" key={index}>
              <img
                src={
                  tx.type === "Deposit"
                    ? "/logos/deposit.png"
                    : tx.type === "Withdraw"
                    ? "/logos/withdraw.png"
                    : "/logos/transaction.png"
                }
                alt="icon"
              />
              <div className="tx-details">
                <h4>{tx.type}</h4>
                <p>{new Date(tx.createdAt).toDateString()}</p>
              </div>
              <div className="tx-right">
                <h4
                  className={tx.type === "Withdraw" ? "negative" : "positive"}
                >
                  {tx.type === "Withdraw"
                    ? `-${formatAmount(tx.amount)}`
                    : `+${formatAmount(tx.amount)}`}
                </h4>
                <span className={`status ${tx.status}`}>{tx.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
