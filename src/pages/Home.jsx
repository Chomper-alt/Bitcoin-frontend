import React, { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import { Capacitor } from "@capacitor/core";
import { loadFull } from "tsparticles";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import WhatWeDo from "../components/WhatWeDo";
import JoinTheCommunity from "../components/JoinTheCommunity";
import SponsoredAds from "../components/SponsoredAds";
import Footer from "../components/Footer";
import "../styles/Home.css";

const createHomeParticleOptions = ({ lite = false } = {}) => ({
  fullScreen: false,
  background: { color: { value: "transparent" } },
  fpsLimit: lite ? 30 : 45,
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  particles: {
    number: { value: lite ? 28 : 58, density: { enable: true, area: lite ? 1150 : 1000 } },
    size: { value: { min: 1, max: lite ? 2.2 : 2.8 } },
    color: { value: ["#00e5ff", "#0ea5ff", "#14f1ff"] },
    opacity: { value: { min: lite ? 0.1 : 0.14, max: lite ? 0.28 : 0.42 } },
    links: {
      enable: true,
      color: "#00e5ff",
      distance: lite ? 110 : 145,
      opacity: lite ? 0.16 : 0.24,
      width: 1,
    },
    move: {
      enable: true,
      speed: lite ? 0.32 : 0.55,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: !lite, mode: "repulse" },
      resize: true,
    },
    modes: { repulse: { distance: 90, duration: 0.3 } },
  },
  detectRetina: !lite,
});

const Home = () => {
  const isNativeApp = Capacitor.isNativePlatform();
  const particleOptions = useMemo(() => createHomeParticleOptions({ lite: false }), []);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <>
      <div className="home-page-flow">
        {!isNativeApp && (
          <Particles
            id="home-flow-particles"
            className="home-flow-particles"
            init={particlesInit}
            options={particleOptions}
          />
        )}
        <div className="home-page-content">
          <Hero />
          <Features />
          <HowItWorks />
          <WhatWeDo />
          <JoinTheCommunity />
          <SponsoredAds />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
