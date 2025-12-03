import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Set axios Authorization header
  const setAuthHeader = (tkn) => {
    if (tkn) {
      api.defaults.headers.common["Authorization"] = `Bearer ${tkn}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  // ✅ SAFELY normalize profile image URL (NO double prefix, NO http)
  const normalizeProfileImage = (serverUser) => {
    if (serverUser?.profileImage) {
      if (serverUser.profileImage.startsWith("http")) {
        return serverUser;
      } else {
        serverUser.profileImage = `https://api.metaxtrader.com${serverUser.profileImage}`;
      }
    }
    return serverUser;
  };

  // ✅ Fetch canonical logged-in user from backend
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      let serverUser = res.data?.user ?? res.data;

      if (serverUser) {
        serverUser = normalizeProfileImage(serverUser);
        setUser(serverUser);
        localStorage.setItem("userInfo", JSON.stringify(serverUser));
        return serverUser;
      } else {
        setUser(null);
        localStorage.removeItem("userInfo");
        return null;
      }
    } catch (err) {
      console.error("fetchCurrentUser error:", err?.response?.data ?? err.message);
      await safeLogout();
      return null;
    }
  };

  // ✅ Restore session on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      setAuthHeader(storedToken);
      fetchCurrentUser().finally(() => setLoading(false));
    } else {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("userInfo");
        }
      }
      setLoading(false);
    }
  }, []);

  // ✅ Safe logout
  const safeLogout = async () => {
    try {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        await api.post("/api/auth/logout").catch(() => {});
      }
    } catch (_) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      setAuthHeader(null);
    }
  };

  const logout = async () => {
    await safeLogout();
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });

      if (res.data?.token) {
        const tkn = res.data.token;
        setToken(tkn);
        localStorage.setItem("token", tkn);
        setAuthHeader(tkn);

        let serverUser = await fetchCurrentUser().catch(() => null);
        const finalUser = serverUser || res.data?.user;

        if (finalUser) {
          const normalizedUser = normalizeProfileImage(finalUser);
          setUser(normalizedUser);
          localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
        }

        return { success: true, data: res.data };
      } else {
        return { success: false, error: "No token returned from server" };
      }
    } catch (err) {
      console.error("Login error:", err?.response?.data ?? err.message);
      return {
        success: false,
        error: err?.response?.data?.message || "Login failed",
      };
    }
  };

  // ✅ REGISTER
  const register = async (formData) => {
    try {
      const res = await api.post("/api/auth/register", formData);

      if (res.data?.token) {
        const tkn = res.data.token;
        setToken(tkn);
        localStorage.setItem("token", tkn);
        setAuthHeader(tkn);

        let serverUser = await fetchCurrentUser().catch(() => null);
        const finalUser = serverUser || res.data?.user;

        if (finalUser) {
          const normalizedUser = normalizeProfileImage(finalUser);
          setUser(normalizedUser);
          localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
        }

        return { success: true, data: res.data };
      } else {
        return { success: false, error: "No token returned from server" };
      }
    } catch (err) {
      console.error("Register error:", err?.response?.data ?? err.message);
      return {
        success: false,
        error: err?.response?.data?.message || "Registration failed",
      };
    }
  };

  // ✅ FORGOT PASSWORD
  const forgotPassword = async (email) => {
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Forgot password error:", err?.response?.data ?? err.message);
      return {
        success: false,
        error: err?.response?.data?.message || "Request failed",
      };
    }
  };

  // ✅ RESET PASSWORD
  const resetPassword = async (tokenParam, password) => {
    try {
      const res = await api.post(`/api/auth/reset-password/${tokenParam}`, {
        password,
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Reset password error:", err?.response?.data ?? err.message);
      return {
        success: false,
        error: err?.response?.data?.message || "Reset failed",
      };
    }
  };

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


