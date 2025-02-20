import React from 'react';
import { motion } from 'framer-motion';

const WelcomeStep = ({ onNext }) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl mb-6"
      >
        👋
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gray-900 mb-4"
      >
        Welcome to Volunteera
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-8"
      >
        Join our community of volunteers and make a difference in your local area.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={onNext}
        className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
      >
        Let's Get Started
      </motion.button>
    </div>
  );
};

export default WelcomeStep; 
