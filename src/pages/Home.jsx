import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import WhatWeDo from "../components/WhatWeDo";
import JoinTheCommunity from "../components/JoinTheCommunity";
import SponsoredAds from "../components/SponsoredAds";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <WhatWeDo />
      <JoinTheCommunity />
      <SponsoredAds />
      <Footer />
    </>
    
  );
};

export default Home;


