// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance.js";
import { getUserAvatarUrl } from "../utils/normalizeImageUrl.js";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

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

const unwrapUserPayload = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  // Supported backend shapes:
  // direct user object, { user }, { data }, { data: { user } }
  const candidate =
    payload.user ||
    payload.data?.user ||
    payload.data ||
    payload;

  if (!candidate || typeof candidate !== "object") return null;
  return candidate;
};

const buildUserData = (source, token, previous = {}) => {
  const base = {
    ...(previous || {}),
    ...(source || {}),
  };

  const vipLevelNumber = base.vipLevel ?? base.vipLevelNumber ?? 0;
  const vipTitle = vipNames[vipLevelNumber] || "Beginner";
  const profileImage = getUserAvatarUrl(base) || base.profileImage || null;

  return {
    ...base,
    token: token || base.token || localStorage.getItem("token") || "",
    vipLevelNumber,
    vipTitle,
    vipBadge: vipTitle,
    isAdmin: base.role === "admin" || base.isAdmin === true,
    profileImage,
  };
};

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

      return buildUserData(JSON.parse(stored), token);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserState(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await api.get("/api/auth/me");
      const payload = unwrapUserPayload(res.data);

      if (!payload) {
        // Do not destroy a valid session because of an unexpected payload shape.
        const fallback = localStorage.getItem("userInfo");
        if (fallback) {
          const fallbackUser = buildUserData(JSON.parse(fallback), token);
          setUserState(fallbackUser);
          return fallbackUser;
        }
        throw new Error("Invalid /me response");
      }

      const userData = buildUserData(payload, token);
      setUserState(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error("Failed to fetch user:", err);

      const status = err?.response?.status;
      const isAuthFailure = status === 401 || status === 403;

      // Only clear the saved session when the server explicitly says the
      // token is invalid. Normal mobile/offline/network failures must keep
      // the cached user so profile data, including profileImage, survives.
      if (isAuthFailure) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        setUserState(null);
        navigate("/login");
        return null;
      }

      const fallback = localStorage.getItem("userInfo");
      if (fallback) {
        try {
          const fallbackUser = buildUserData(JSON.parse(fallback), token, user || {});
          setUserState(fallbackUser);
          return fallbackUser;
        } catch (parseErr) {
          console.warn("Failed to restore cached user after fetch error:", parseErr);
        }
      }

      return user || null;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const setUser = useCallback((dataOrUpdater) => {
    setUserState((prev) => {
      const incoming =
        typeof dataOrUpdater === "function"
          ? dataOrUpdater(prev || {})
          : dataOrUpdater;

      if (!incoming || typeof incoming !== "object") {
        return prev || null;
      }

      const token = localStorage.getItem("token") || prev?.token || incoming?.token || "";
      const userData = buildUserData(incoming, token, prev || {});

      localStorage.setItem("userInfo", JSON.stringify(userData));
      if (userData.token) localStorage.setItem("token", userData.token);
      return userData;
    });
  }, []);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await api.post(
          "/api/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
      console.warn("Logout failed (token probably expired). Continuing...");
    }

    setUserState(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
