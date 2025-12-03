import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./VipDashboard.css";
import { useUser } from "../contexts/UserContext";
import api from "../utils/axiosInstance"; // ✅ USE CENTRALIZED API

export default function VipDashboard() {
  const { user } = useUser();

  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(null);
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

  const currentVIP = user?.vipTitle || vipNames[0];
  const currentLevel = user?.vipLevelNumber ?? 0;
  const badge = user?.vipBadge || vipNames[0];

  const getLevelClass = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const levelClass = getLevelClass(currentVIP);

  useEffect(() => {
    const fetchVipData = async () => {
      try {
        const [historyRes, progressRes] = await Promise.all([
          api.get("/api/vip/history"),
          api.get("/api/vip/progress"),
        ]);

        // ✅ FORCE ARRAY SHAPE (PREVENTS map() CRASH)
        const historyList =
          historyRes.data?.history ||
          historyRes.data?.data ||
          historyRes.data ||
          [];

        setHistory(Array.isArray(historyList) ? historyList : []);

        // ✅ SAFE PROGRESS OBJECT
        const progressObj =
          progressRes.data?.progress ||
          progressRes.data?.data ||
          progressRes.data ||
          null;

        setProgress(progressObj && typeof progressObj === "object" ? progressObj : null);
      } catch (err) {
        console.error("❌ Failed to fetch VIP data:", err);
        setHistory([]);
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVipData();
  }, []);

  if (loading) return <div>Loading VIP status...</div>;

  return (
    <motion.div
      className={`vip-dashboard ${levelClass}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        VIP Dashboard
      </motion.h2>

      {/* VIP Status */}
      <motion.div
        className={`vip-status ${levelClass}`}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p>
          <strong>Current Level:</strong> {currentVIP} (LVL {currentLevel})
        </p>
        <p>
          <strong>Badge:</strong> {badge}
        </p>
      </motion.div>

      {/* Progress Bar */}
      {progress?.progress !== undefined && (
        <motion.div
          className="vip-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Progress towards next level:</p>
          <div className="progress-bar">
            <motion.div
              className={`progress-fill ${levelClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* VIP History */}
      <motion.div
        className="vip-history"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3>VIP Points History</h3>
        <ul>
          {Array.isArray(history) && history.length > 0 ? (
            history.map((h, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
              >
                <span>
                  {h.details || h.source || "VIP Activity"} — {h.points || 0} pts
                </span>
                <span>
                  {h.createdAt
                    ? new Date(h.createdAt).toLocaleDateString("en-US")
                    : "—"}
                </span>
              </motion.li>
            ))
          ) : (
            <li>No VIP history yet.</li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
