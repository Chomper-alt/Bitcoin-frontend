import axios from "axios";

const api = axios.create({
  baseURL: "https://api.metaxtrader.com",
  withCredentials: true, // ✅ important for cookies & auth sync
});

// ✅ ALWAYS attach token correctly
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ THIS is the real token source

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
