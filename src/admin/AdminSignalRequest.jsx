import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance.js";
import "./AdminSignalRequest.css";

const AdminSignalRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/signals/requests");
      setRequests(res.data);
    } catch (err) {
      console.error("Error loading requests:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/signals/requests/${id}`, { status });
      fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="admin-signal-container">
      <h2>📨 Signal Code Requests</h2>
      <table className="signal-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Type</th>
            <th>VIP Level</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r._id}>
              <td>{r.user?.username || "N/A"}</td>
              <td>{r.email}</td>
              <td>{r.type}</td>
              <td>{r.user?.vipLevel}</td>
              <td>
                <span className={`status ${r.status}`}>{r.status}</span>
              </td>
              <td>
                {r.status === "pending" ? (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => updateStatus(r._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => updateStatus(r._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span>-</span>
                )}
              </td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSignalRequests;


