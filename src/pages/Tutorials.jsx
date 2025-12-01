import React, { useState } from "react";
import "../styles/Support.css"; // reuse existing Support styles

export default function Tutorials() {
  const [openIndex, setOpenIndex] = useState(null);

  const tutorials = [
    {
      title: "How to Register an Account",
      content: "Visit the Register page, fill out the form with your name, email, and password, then confirm your email to activate your account."
    },
    {
      title: "How to Deposit Funds",
      content: "Go to your Wallet, click on Deposit, select your preferred cryptocurrency or fiat option, and follow the instructions to add funds to your account."
    },
    {
      title: "How to Start a Copy Trade",
      content: "Navigate to the Copy Trading page, choose a signal provider, enter your capital, and start copying trades automatically."
    },
    {
      title: "How to Withdraw Funds",
      content: "Go to your Wallet, click on Withdraw, enter the amount and your destination wallet address, then confirm the transaction."
    },
    {
      title: "Understanding Signal Providers",
      content: "Signal providers are experienced traders whose trades you can copy."
    },
    {
      title: "Understanding VIP system",
      content: "Your VIP level increases as you trade, refer new users, and stay active on the platform. Each activity earns VIP points, which accumulate to unlock higher ranks. Higher VIP levels reward you with better trading conditions, exclusive promotions, reduced commission rates, faster withdrawals, and premium support. The more points you earn, the faster you climb the VIP ladder."
    }
    // add more tutorials as needed
  ];

  const toggleTutorial = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="tutorials">
      <h2>Basic Tutorials</h2>
      {tutorials.map((tut, index) => (
        <div key={index} className="tutorial-item">
          <div
            className="tutorial-title"
            onClick={() => toggleTutorial(index)}
          >
            {tut.title}
            <span className="tutorial-toggle">
              {openIndex === index ? "−" : "+"}
            </span>
          </div>
          {openIndex === index && (
            <div className="tutorial-content">{tut.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
