import React, { useEffect, useMemo, useState } from "react";
import { FaCopy, FaLink, FaTicketAlt, FaUserFriends } from "react-icons/fa";
import api from "../utils/axiosInstance.js";
import "./Referrals.css";
import AppLoader from "../components/AppLoader";

const copyToClipboard = async (value) => {
  if (!value) return false;

  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(input);
  return copied;
};

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const refRes = await api.get("/api/referrals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReferrals(refRes.data.referrals || []);

        const meRes = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const code = meRes.data?.referralCode || "";
        setReferralCode(code);
        setReferralLink(code ? `${window.location.origin}/register?ref=${code}` : "");
      } catch (err) {
        console.error(err);
        setError("Failed to load referrals.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const referralEarnings = useMemo(() => {
    return referrals.reduce((total, ref) => {
      const value = Number(ref.earnings || ref.commission || ref.reward || ref.bonus || 0);
      return total + (Number.isFinite(value) ? value : 0);
    }, 0);
  }, [referrals]);

  const handleCopy = async (type, value) => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(type);
      window.setTimeout(() => setCopied(""), 1800);
    }
  };

  if (loading) return <AppLoader label="Loading referrals..." compact />;

  return (
    <div className="referral-container">
      <div className="referral-hero-card">
        <div>
          <p className="referral-eyebrow">Referral Program</p>
          <h2>My Referrals</h2>
          <p className="referral-subtitle">Share your link or referral code and grow your network.</p>
        </div>
        <div className="referral-hero-icon" aria-hidden="true">
          <FaUserFriends />
        </div>
      </div>

      {error && <p className="referral-error">{error}</p>}

      <div className="referral-stats-grid">
        <div className="referral-stat-card">
          <span>Total Referrals</span>
          <strong>{referrals.length}</strong>
        </div>
        <div className="referral-stat-card">
          <span>Earnings</span>
          <strong>${referralEarnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <div className="referral-share-grid">
        <section className="referral-share-card">
          <div className="referral-share-head">
            <span className="referral-share-icon"><FaLink /></span>
            <div>
              <h3>Referral Link</h3>
              <p>Send the full registration link.</p>
            </div>
          </div>
          <div className="referral-value-box" title={referralLink || "Referral link unavailable"}>
            {referralLink || "Referral link unavailable"}
          </div>
          <button
            type="button"
            className="referral-copy-btn"
            disabled={!referralLink}
            onClick={() => handleCopy("link", referralLink)}
          >
            <FaCopy /> {copied === "link" ? "Copied" : "Copy Link"}
          </button>
        </section>

        <section className="referral-share-card">
          <div className="referral-share-head">
            <span className="referral-share-icon"><FaTicketAlt /></span>
            <div>
              <h3>Referral Code</h3>
              <p>Share only your code.</p>
            </div>
          </div>
          <div className="referral-value-box referral-code-box" title={referralCode || "Referral code unavailable"}>
            {referralCode || "Unavailable"}
          </div>
          <button
            type="button"
            className="referral-copy-btn secondary"
            disabled={!referralCode}
            onClick={() => handleCopy("code", referralCode)}
          >
            <FaCopy /> {copied === "code" ? "Copied" : "Copy Code"}
          </button>
        </section>
      </div>

      <section className="referral-list-card">
        <div className="referral-list-head">
          <h3>Referral List</h3>
          <span>{referrals.length}</span>
        </div>

        {referrals.length === 0 ? (
          <div className="referral-empty-state">No referrals yet.</div>
        ) : (
          <div className="referrals-list">
            {referrals.map((ref) => (
              <div key={ref._id || ref.email} className="referral-card">
                <div>
                  <strong>{ref.email || ref.name || "Referral User"}</strong>
                  <small>Joined: {ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : "Pending"}</small>
                </div>
                <span className="referral-status">Active</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Referrals;
