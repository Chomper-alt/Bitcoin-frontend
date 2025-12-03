// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance.js";
import { normalizeImageUrl } from "../utils/normalizeImageUrl.js"; // ✅ IMPORTANT

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUserState] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const stored = localStorage.getItem("userInfo");

      if (!token || !stored) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        return null;
      }

      const parsed = JSON.parse(stored);

      // 🔥 Ensure avatar is valid even if bad data was saved earlier
      parsed.profileImage = normalizeImageUrl(parsed.profileImage);

      return parsed;
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

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

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserState(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/auth/me");

      const data = res.data;

      const vipLevelNumber = data.vipLevel ?? 0;
      const vipTitle = vipNames[vipLevelNumber] || "Beginner";

      const userData = {
        ...data,
        token,
        vipLevelNumber,
        vipTitle,
        vipBadge: vipTitle,
        isAdmin: data.role === "admin",
        profileImage: normalizeImageUrl(data.profileImage), // 🔥 Fix avatar ALWAYS
      };

      setUserState(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));
    } catch (err) {
      console.error("Failed to fetch user:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      setUserState(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // -------- UPDATE USER --------
  const setUser = (data) => {
    const vipLevelNumber = data.vipLevel ?? 0;
    const vipTitle = vipNames[vipLevelNumber] || "Beginner";

    const userData = {
      ...data,
      vipLevelNumber,
      vipTitle,
      vipBadge: vipTitle,
      isAdmin: data.role === "admin",
      profileImage: normalizeImageUrl(data.profileImage), // 🔥 Ensure safe URL
    };

    setUserState(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    if (userData.token) localStorage.setItem("token", userData.token);
  };

  // -------- LOGOUT --------
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch {
      console.warn("Logout failed (token probably expired). Continuing...");
    }

    setUserState(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
