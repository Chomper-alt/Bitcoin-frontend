import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah K.",
    text: "BitStack is the fastest and most user-friendly platform I've ever used.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "James P.",
    text: "I love the referral rewards! Easy way to earn extra while trading.",
    image: "https://randomuser.me/api/portraits/men/35.jpg",
  },
  {
    name: "Aisha M.",
    text: "Secure wallet, quick trades, and amazing customer support.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-[#0d1117] text-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#1c1f26] rounded-xl p-8 shadow-lg"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-yellow-400"
              />
              <p className="text-gray-300 mb-4">"{t.text}"</p>
              <h4 className="font-semibold text-lg">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
