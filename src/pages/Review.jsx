// src/components/Reviews.jsx
import React, { useState, useMemo } from "react";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import { FaChartLine, FaRobot, FaShieldAlt } from "react-icons/fa";
import { reviewsData, overallRating as presetRating } from "../components/ReviewData";
import "../styles/Review.css";

const PER_PAGE = 10;

function Stars({ value }) {
  const full = Math.floor(value);
  const empty = 5 - full;
  return (
    <span className="stars">
      {Array.from({ length: full }).map((_, i) => (
        <span key={i} className="star">★</span>
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={i} className="star empty">☆</span>
      ))}
    </span>
  );
}

export default function Reviews() {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState({}); // track expanded comments

  const total = reviewsData.length;
  const totalPages = Math.ceil(total / PER_PAGE);

  const pageReviews = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return reviewsData.slice(start, start + PER_PAGE);
  }, [page]);

  // compute overall (derived from data)
  const overall = useMemo(() => {
    const totalRating = reviewsData.reduce((s, r) => s + r.rating, 0);
    const avg = Math.round((totalRating / reviewsData.length) * 100) / 100;
    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = Math.round((reviewsData.filter(r => r.rating === i).length / reviewsData.length) * 100);
    }
    return { rating: avg, votes: reviewsData.length, distribution };
  }, []);

  const toggle = (idx) => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="reviews-page">
      <h1>What our users say</h1>

      <div className="review-top-grid">
        <section className="review-download-card" aria-label="Download MetaTrader X app">
          <div className="review-download-brand">
            <img src="/logos/MetaC.png" alt="MetaTrader X" className="review-download-logo" />
            <div>
              <p className="review-download-kicker">Mobile App</p>
              <h2>Download MetaTrader X</h2>
              <p>
                Trade smarter. Trade faster. Access advanced charts, demo trading,
                live market tools, and AI-powered copy trading from your phone.
              </p>
            </div>
          </div>

          <div className="review-download-features">
            <span><FaChartLine /> Advanced charts</span>
            <span><FaShieldAlt /> Secure wallet</span>
            <span><FaRobot /> AI copy trading</span>
          </div>

          <div className="review-download-actions">
            <a className="review-download-btn primary" href="/downloads/MetaTraderX.apk" download>
              <FiDownload /> Download Android App
            </a>
            <a className="review-download-btn secondary" href="/dashboard">
              <FiExternalLink /> Open Web Platform
            </a>
          </div>
        </section>

        <div className="overall-wrap">
          <div className="overall-card">
            <div className="avg-block">
              <div className="avg-number">{overall.rating}</div>
              <div className="avg-stars"><Stars value={Math.round(overall.rating)} /></div>
              <div className="avg-votes">{overall.votes} reviews</div>
            </div>

            <div className="distribution">
              {Object.entries(overall.distribution).sort((a,b)=>b[0]-a[0]).map(([star, pct]) => (
                <div key={star} className="dist-row">
                  <div className="star-label">{star} <span className="small-star">★</span></div>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="pct">{pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="list-wrap">
        {pageReviews.map((r, i) => {
          const globalIndex = (page - 1) * PER_PAGE + i;
          const isExpanded = Boolean(expanded[globalIndex]);
          const short = r.comment.length > 220 ? r.comment.slice(0, 220) + "..." : r.comment;

          return (
            <article key={globalIndex} className="review-card">
              <div className="left">
                <img className="avatar" src={r.avatar} alt={r.name} />
              </div>
              <div className="right">
                <div className="rhead">
                  <div className="name">{r.name}</div>
                  <div className="meta">
                    <span className="registered">{new Date(r.registered).toLocaleDateString()}</span>
                    <span className="earned">Earned: ${Number(r.earned).toLocaleString()}</span>
                  </div>
                </div>

                <div className="rating-row">
                  <Stars value={r.rating} />
                  <span className="rating-num">{r.rating}.0</span>
                </div>

                <p className="comment">
                  {isExpanded ? r.comment : short}
                </p>

                {r.comment.length > 220 && (
                  <button className="read-toggle" onClick={() => toggle(globalIndex)}>
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            </article>
          );
        })}

        {/* pagination */}
        <div className="pagination">
          <button onClick={() => setPage(1)} disabled={page === 1}>« First</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last »</button>
        </div>

      </div>
    </div>
  );
}
