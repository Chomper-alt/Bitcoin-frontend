import React, { useEffect, useMemo, useState } from "react";
import "./UserProfile.css";
import { useUser } from "../contexts/UserContext";
import { getUserAvatarUrl } from "../utils/normalizeImageUrl";
import AppLoader from "../components/AppLoader";

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
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.profileImage, user?.imageUrl, user?.profilePicture, user?.avatar]);

  const profileImage = useMemo(() => {
    if (avatarFailed) return "/images/default-avatar.png";

    // UserContext is source of truth, but keep a localStorage fallback so a
    // freshly uploaded avatar survives route changes before the next /me refresh.
    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      storedUser = null;
    }

    return getUserAvatarUrl(user) || getUserAvatarUrl(storedUser) || "/images/default-avatar.png";
  }, [user, avatarFailed]);

  if (loading) return <AppLoader label="Loading profile..." compact />;
  if (!user) return <div className="user-profile">No user data found.</div>;

  const vipName = vipNames[user.vipLevelNumber ?? 0];

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
              if (e.currentTarget.src.includes("default-avatar")) return;
              setAvatarFailed(true);
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