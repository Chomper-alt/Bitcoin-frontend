// auth.js
import api from "../utils/axiosInstance.js";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (formData) => {
    try {
      const res = await api.post("/api/auth/register", formData, {
        headers: { "Content-Type": "application/json" }
      });

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token); // ✅ SAVE TOKEN
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Registration failed" };
    }
  };

  const login = async (credentials) => {
    try {
      const res = await api.post("/api/auth/login", credentials, {
        headers: { "Content-Type": "application/json" }
      });

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token); // ✅ SAVE TOKEN
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Login failed" };
    }
  };

  const logout = async () => {
    await api.post("/api/auth/logout"); // ✅ ALSO USE api
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
