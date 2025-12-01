// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance.js";

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

      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // VIP name list mapped to numeric vipLevel
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
      const res = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  const setUser = (data) => {
    const vipLevelNumber = data.vipLevel ?? 0;
    const vipTitle = vipNames[vipLevelNumber] || "Beginner";

    const userData = {
      ...data,
      vipLevelNumber,
      vipTitle,
      vipBadge: vipTitle,
      isAdmin: data.role === "admin",
    };

    setUserState(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    if (userData.token) localStorage.setItem("token", userData.token);
  };

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
  } catch (err) {
    console.warn("Logout request failed (probably expired token). Continuing...");
  }

  // Clear local data ALWAYS
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
