import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Referrals.css";

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [referralLink, setReferralLink] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // --- Fetch referrals ---
        const refRes = await axios.get("/api/referrals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReferrals(refRes.data.referrals || []);

        // --- Fetch user referral code ---
        const meRes = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const referralCode = meRes.data?.referralCode;
        if (referralCode) {
          setReferralLink(`${window.location.origin}/register?ref=${referralCode}`);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load referrals.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div className="referral-container">Loading...</div>;

  return (
    <div className="referral-container">
      <h2>My Referrals</h2>

      {error && <p className="error">{error}</p>}

      {/* Referral Link Box */}
      <div className="referral-link-box">
        <input type="text" value={referralLink} readOnly />
        <button
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(referralLink);
            alert("Referral link copied!");
          }}
        >
          Copy Link
        </button>
      </div>

      {/* Referral List */}
      {referrals.length === 0 ? (
        <p>No referrals yet.</p>
      ) : (
        referrals.map((ref) => (
          <div key={ref._id} className="referral-card">
            <strong>{ref.email}</strong>
            <small>Joined: {new Date(ref.createdAt).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Referrals;

