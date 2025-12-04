import React, { useEffect, useState } from "react";
import "./Admin.css";
import api from "../utils/axiosInstance.js";

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/admin/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data || []);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Close a ticket
  const closeTicket = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/api/admin/tickets/${id}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTickets((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );
    } catch (err) {
      console.error("Failed to close ticket:", err);
    }
  };

  // Reply to a ticket
  const replyToTicket = async (id, message) => {
    if (!message) return;
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/api/admin/tickets/${id}/reply`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTickets((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );
      setReplyMessage(""); // clear input after reply
    } catch (err) {
      console.error("Failed to reply to ticket:", err);
    }
  };

  if (loading) return <p>Loading support tickets...</p>;

  return (
    <div className="admin-page">
      <h2>🎫 Manage Support Tickets</h2>

      <input
        type="text"
        placeholder="Search tickets..."
        className="admin-search"
      />

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.issue}</td>
                <td>{t.status}</td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>
                  <input
                    type="text"
                    placeholder="Reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                  <button
                    className="btn-sm"
                    onClick={() => replyToTicket(t._id, replyMessage)}
                  >
                    Reply
                  </button>
                  <button
                    className="btn-sm danger"
                    onClick={() => closeTicket(t._id)}
                  >
                    Close
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No support tickets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

