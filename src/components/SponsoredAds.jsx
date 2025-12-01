// src/components/SponsoredAds.jsx
import React from "react";
import "../styles/SponsoredAds.css";

const logos = [
  "/logos/logo1.png",
  "/logos/logo2.png",
  "/logos/logo3.png",
  "/logos/logo4.png",
  "/logos/logo5.png",
  "/logos/logo6.png",
  "/logos/logo7.png",
  "/logos/logo8.png",
  "/logos/logo9.png",
  "/logos/logo10.png",
];

const SponsoredAds = () => {
  return (
    <section className="sponsored-section">
      <h2 className="sponsored-title">Sponsored Ads</h2>
      <div className="logo-carousel">
        <div className="carousel-track">
          {/* Duplicate logos for infinite scroll */}
          {logos.concat(logos).map((src, index) => (
            <div className="logo-container" key={index}>
              <img src={src} alt={`Brand ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsoredAds;


