import React from "react";
import "./UserProfile.css";
import { useUser } from "../contexts/UserContext";
import { normalizeImageUrl } from "../utils/normalizeImageUrl"; // ✅ IMPORTANT

const vipNames = [
  "Beginner",
  "Amateur",
  "Senior",
  "Talented",
  "Expert",
  "Professional",
  "Master",
  "Legendary",
  "Eternal",
];

const UserProfile = () => {
  const { user, loading } = useUser();

  if (loading) return <div className="user-profile">Loading...</div>;
  if (!user) return <div className="user-profile">No user data found.</div>;

  const vipName = vipNames[user.vipLevelNumber ?? 0];

  const profileImage =
    normalizeImageUrl(user.profileImage) || "/images/default-avatar.png";

  return (
    <div className="user-profile">
      <h2>User Profile</h2>

      {/* Profile Picture */}
      <div className="profile-picture-section">
        <div className="avatar-wrapper">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-avatar"
            onError={(e) => {
              e.currentTarget.src = "/images/default-avatar.png";
            }}
          />
        </div>
      </div>

      {/* Admin Badge */}
      {user.isAdmin && (
        <div className="admin-badge">
          <span>Admin</span>
        </div>
      )}

      {/* Profile Details */}
      <form className="profile-form">
        <label>First Name</label>
        <input type="text" disabled value={user.firstName || ""} />

        <label>Last Name</label>
        <input type="text" disabled value={user.lastName || ""} />

        <label>Email</label>
        <input type="email" disabled value={user.email || ""} />

        <label>Phone Number</label>
        <input type="text" disabled value={user.phone || ""} />

        <label>Country</label>
        <input
          type="text"
          disabled
          value={
            user.country
              ? `${user.country.name || ""} (${user.country.code || ""})`
              : ""
          }
        />

        {/* VIP Level */}
        <div className="vip-section simple-vip">
          <span className="vip-name">{vipName}</span>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;


