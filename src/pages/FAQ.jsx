import React, { useState } from "react";
import "../styles/Support.css"; // keep FAQ styles in same CSS

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

 const faqs = [
  // General Crypto FAQs
   {
    question: "What is MetaXTrader?",
    answer: "MetaXTrader is a cutting-edge trading platform that empowers traders with the ability to copy the trades of experienced traders automatically. It is designed to help traders maximize their profits and minimize risks while making trading more accessible to everyone. The platform offers a user-friendly interface that is easy to navigate, and it provides traders with all the essentials and resources needed to make informed trading decisions. With MetaX Traders, you can access real-time market data, historical charts, news, and analysis, all in one place.",
   },

  {
    question: "What is cryptocurrency?",
    answer: "Cryptocurrency is a digital or virtual form of money that uses cryptography for security and operates on decentralized networks called blockchains."
  },
  {
    question: "How do cryptocurrencies work?",
    answer: "Transactions are recorded on a blockchain, a public ledger, and verified by a network of computers (nodes) using consensus algorithms."
  },
  {
    question: "What is blockchain technology?",
    answer: "A blockchain is a decentralized database where transactions are grouped in blocks and linked in chronological order, making them secure and tamper-resistant."
  },
  {
    question: "What is Bitcoin?",
    answer: "Bitcoin is the first cryptocurrency, created in 2009, and serves as digital gold and a store of value."
  },
  {
    question: "What are altcoins?",
    answer: "Altcoins are any cryptocurrencies other than Bitcoin, such as Ethereum, Litecoin, and Solana."
  },

  // Crypto Trading Basics
  {
    question: "What is crypto trading?",
    answer: "Buying and selling cryptocurrencies with the goal of making a profit, either via spot trading, margin trading, or derivatives."
  },
  {
    question: "What is a crypto exchange?",
    answer: "A platform where you can buy, sell, or trade cryptocurrencies, e.g., Binance, Coinbase, or Kraken."
  },
  {
    question: "What is spot trading?",
    answer: "Buying or selling actual cryptocurrency at current market prices."
  },
  {
    question: "What is margin trading?",
    answer: "Trading cryptocurrencies using borrowed funds to increase potential profits (and risks)."
  },
  {
    question: "What is a trading pair?",
    answer: "A trading pair is two assets that can be traded against each other, e.g., BTC/USDT."
  },
  {
    question: "What are orders in trading?",
    answer: "Market order: Buy/sell immediately at current market price. Limit order: Buy/sell at a specific price. Stop order: Trigger a buy/sell when a specific price is reached."
  },

  // Copy Trading / Signal Providers
  {
    question: "What is copy trading?",
    answer: "Copy trading allows you to automatically replicate the trades of experienced traders, following their strategies in real-time."
  },
  {
    question: "Who are signal providers?",
    answer: "Traders whose trades can be copied. They usually have verified track records."
  },
  {
    question: "Is copy trading safe?",
    answer: "It reduces manual trading errors but still carries risk. Always choose verified signal providers and start with a comfortable capital."
  },
  {
    question: "How are profits and losses calculated in copy trading?",
    answer: "Profits and losses mirror the performance of the signal provider you follow. Fees or commissions may apply."
  },
  {
    question: "Can I stop copying a trader anytime?",
    answer: "Yes, you can stop copying trades at any time, and your capital will no longer be affected by their trades."
  },

  // Wallets, Deposits & Withdrawals
  {
    question: "What is a crypto wallet?",
    answer: "A digital wallet that stores your cryptocurrencies and allows you to send, receive, and track balances."
  },
  {
    question: "How do I deposit funds?",
    answer: "Transfer crypto from another wallet or purchase via an exchange, then deposit into your platform wallet."
  },
  {
    question: "How do I withdraw funds?",
    answer: "Submit a withdrawal request from your wallet to transfer funds to another wallet or exchange."
  },
  {
    question: "Are deposits and withdrawals instant?",
    answer: "It depends on network congestion and confirmations; some transactions may take a few minutes to several hours."
  },

  // Security & Risk Management
  {
    question: "How do I secure my account?",
    answer: "Use strong passwords, enable two-factor authentication (2FA), and never share your private keys."
  },
  {
    question: "What is a private key?",
    answer: "A secret alphanumeric code that allows access to your crypto funds. Never share it."
  },
  {
    question: "What is a public key?",
    answer: "Your wallet address that others can use to send you cryptocurrency."
  },
  {
    question: "What risks are involved in crypto trading?",
    answer: "Market volatility, hacking, scams, and leverage risks are common. Never invest more than you can afford to lose."
  },
  {
    question: "What should I do if I suspect fraud or a scam?",
    answer: "Immediately report to support and cease any transactions with the suspicious party."
  },
];


  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq">
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question" onClick={() => toggleFAQ(index)}>
            {faq.question}
            <span className="faq-toggle">{openIndex === index ? "−" : "+"}</span>
          </div>
          {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
}
