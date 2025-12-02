// AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Helper: Set axios Authorization header ---
  const setAuthHeader = (tkn) => {
    if (tkn) {
      api.defaults.headers.common["Authorization"] = `Bearer ${tkn}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  // --- Helper: Fetch current user from backend ---
  const fetchCurrentUser = async () => {
    try {
      // ✅ FIXED: correct endpoint is /api/auth/me
      const res = await api.get("/api/auth/me");

      // Some backends return { user: {...} }, others return direct object
      const serverUser = res.data?.user ?? res.data;

      if (serverUser) {
        // Normalize profile image URL
        if (
          serverUser.profileImage &&
          !serverUser.profileImage.startsWith("http")
        ) {
          serverUser.profileImage = `http://api.metaxtrader.com${serverUser.profileImage}`;
        }

        setUser(serverUser);
        localStorage.setItem("user", JSON.stringify(serverUser));
        return serverUser;
      } else {
        setUser(null);
        localStorage.removeItem("user");
        return null;
      }
    } catch (err) {
      console.error("fetchCurrentUser error:", err?.response?.data ?? err.message);
      await safeLogout();
      return null;
    }
  };

  // --- On mount: restore session ---
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setAuthHeader(storedToken);

      // Fetch canonical user for sync
      fetchCurrentUser().finally(() => setLoading(false));
    } else {
      // fallback restore user only if cached
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {}
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Safe logout helper ---
  const safeLogout = async () => {
    try {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        await api
          .post("/api/auth/logout", null, {
            headers: { Authorization: `Bearer ${localToken}` },
          })
          .catch(() => {});
      }
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setAuthHeader(null);
    }
  };

  // --- Public logout function ---
  const logout = async () => {
    await safeLogout();
  };

  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });

      if (res.data?.token) {
        const tkn = res.data.token;
        setToken(tkn);
        localStorage.setItem("token", tkn);
        setAuthHeader(tkn);

        // Fetch canonical user after login
        let serverUser = null;
        try {
          serverUser = await fetchCurrentUser();
        } catch {}

        const finalUser = serverUser || res.data?.user;
        if (finalUser) {
          setUser(finalUser);
          localStorage.setItem("user", JSON.stringify(finalUser));
        }

        return { success: true, data: res.data };
      } else {
        return { success: false, error: "No token returned from server" };
      }
    } catch (err) {
      console.error("Login error:", err?.response?.data ?? err.message);
      const message = err?.response?.data?.message || "Login failed";
      return { success: false, error: message };
    }
  };

  // --- REGISTER ---
  const register = async (formData) => {
    try {
      const res = await api.post("/api/auth/register", formData);
      if (res.data?.token) {
        const tkn = res.data.token;
        setToken(tkn);
        localStorage.setItem("token", tkn);
        setAuthHeader(tkn);

        const serverUser = await fetchCurrentUser();
        if (!serverUser && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        return { success: true, data: res.data };
      } else {
        return { success: false, error: "No token returned from server" };
      }
    } catch (err) {
      console.error("Register error:", err?.response?.data ?? err.message);
      const message = err?.response?.data?.message || "Registration failed";
      return { success: false, error: message };
    }
  };

  // --- FORGOT PASSWORD ---
  const forgotPassword = async (email) => {
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Forgot password error:", err?.response?.data ?? err.message);
      return { success: false, error: err?.response?.data?.message || "Request failed" };
    }
  };

  // --- RESET PASSWORD ---
  const resetPassword = async (tokenParam, password) => {
    try {
      const res = await api.post(`/api/auth/reset-password/${tokenParam}`, { password });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Reset password error:", err?.response?.data ?? err.message);
      return { success: false, error: err?.response?.data?.message || "Reset failed" };
    }
  };

  // --- Context Value ---
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


