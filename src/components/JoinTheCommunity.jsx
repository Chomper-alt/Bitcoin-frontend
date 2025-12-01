// src/components/JoinTheCommunity.jsx
import React from 'react';
import '../styles/JoinTheCommunity.css';
import { useNavigate } from 'react-router-dom';

const JoinTheCommunity = () => {
  const navigate = useNavigate();

  return (
    <section className="community-section">
      <div className="community-video">
        <video
          src="/videos/community.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="video-box"
        />
      </div>

      <div className="community-text">
        <h2>Join the Community</h2>
        <p>
          The collective wisdom of millions of investors is <span>at your fingertips</span>.
          <br />
          <strong>Learn</strong>, <strong>share</strong> your experience and join the conversation.
        </p>
        <p>
          Building connections leads to building confidence.
        </p>
        <button 
          className="learn-more" 
          onClick={() => navigate("/support")}
        >
          LEARN MORE
        </button>
      </div>
    </section>
  );
};

export default JoinTheCommunity;

