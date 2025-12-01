import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./VipDashboard.css";
import { useUser } from "../contexts/UserContext";

export default function VipDashboard() {
  const { user } = useUser(); // 🔥 Use consistent VIP info
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 We use a single VIP mapping (same as UserContext)
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

  const currentVIP = user.vipTitle;           // "Professional"
  const currentLevel = user.vipLevelNumber;   // 5
  const badge = user.vipBadge;                // "Professional"

  const getLevelClass = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const levelClass = getLevelClass(currentVIP);

  useEffect(() => {
    const fetchVipData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const [historyRes, progressRes] = await Promise.all([
          axios.get("/api/vip/history", { headers }),
          axios.get("/api/vip/progress", { headers }),
        ]);

        setHistory(historyRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        console.error("Failed to fetch VIP data:", err);
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
      {progress && (
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
          {history.length > 0 ? (
            history.map((h, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
              >
                <span>
                  {h.details || h.source} — {h.points} pts
                </span>
                <span>{new Date(h.createdAt).toLocaleDateString("en-US")}</span>
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
