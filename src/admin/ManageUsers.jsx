import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import "./ManageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // ✅ FIXED ENDPOINT
      const res = await api.get("/api/admin/users");

      // ✅ FORCE SAFE ARRAY
      const usersArray = res?.data?.users || res?.data || [];
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await api.patch(`/api/admin/users/${id}/role`, { role });
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to update role:", err);
    }
  };

  const handleSuspend = async (id) => {
    try {
      await api.patch(`/api/admin/users/${id}/suspend`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to suspend/unsuspend user:", err);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this account?")) return;

    try {
      await api.patch(`/api/admin/users/${id}/deactivate`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to deactivate user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="manage-users">
      <h2 className="page-title">👥 Manage Users</h2>

      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : (
        <div className="user-grid">
          {users.length > 0 ? (
            users.map((u) => (
              <div key={u._id} className="user-card">
                <div>
                  <h3 className="user-name">{u.username}</h3>
                  <p className="user-email">{u.email}</p>

                  <span
                    className={`role-badge ${
                      u.role === "admin" ? "admin" : "user"
                    }`}
                  >
                    {u.role?.toUpperCase()}
                  </span>

                  {!u.isActive && (
                    <span className="badge deactivated">Deactivated</span>
                  )}

                  {u.isSuspended && (
                    <span className="badge suspended">Suspended</span>
                  )}
                </div>

                <div className="card-actions">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      updateRole(u._id, e.target.value)
                    }
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    onClick={() => handleSuspend(u._id)}
                    className={`btn ${
                      u.isSuspended
                        ? "btn-warning"
                        : "btn-secondary"
                    }`}
                  >
                    {u.isSuspended ? "Unsuspend" : "Suspend"}
                  </button>

                  <button
                    onClick={() => handleDeactivate(u._id)}
                    className="btn btn-danger"
                    disabled={!u.isActive}
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ opacity: 0.7 }}>No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
