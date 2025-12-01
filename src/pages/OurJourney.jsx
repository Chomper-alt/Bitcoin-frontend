import React from "react";
import "../styles/OurJourney.css";

export default function OurJourney() {
  const timeline = [
    {
      year: "2009",
      title: "The Beginning",
      description:
        "MetaTrader was founded with a vision to make trading accessible to everyone. We started as a small team passionate about financial freedom.",
    },
    {
      year: "2014",
      title: "Early Growth",
      description:
        "We launched our first copy trading feature, Releasing the Meta Trader version X offically to the trading space, enabling users to mirror professional traders’ strategies seamlessly.",
    },
    {
      year: "2017",
      title: "Global Expansion",
      description:
        "Our platform grew rapidly, reaching thousands of users worldwide, with support for multiple assets and faster transactions.",
    },
    {
      year: "2022",
      title: "Innovation Era",
      description:
        "We introduced advanced AI-driven analytics and personalized trading insights to empower smarter decisions.",
    },
    {
      year: "2025",
      title: "Today & Beyond",
      description:
        "MetaTraderX continues to evolve as a trusted platform, committed to transparency, growth, and global accessibility.",
    },
  ];

  return (
    <div className="journey-page">
      {/* Hero Section */}
      <section className="journey-hero">
        <h1>Our Journey</h1>
        <p>
          Discover the milestones that shaped MetaXTrader into a global
          community-driven trading platform.
        </p>
      </section>

      {/* Timeline Section */}
      <section className="journey-timeline">
        {timeline.map((event, index) => (
          <div
            key={index}
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
          >
            <div className="timeline-content glass-effect">
              <span className="timeline-year">{event.year}</span>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
