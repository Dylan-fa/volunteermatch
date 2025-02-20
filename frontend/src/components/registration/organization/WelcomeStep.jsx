import React from 'react';
import { motion } from 'framer-motion';

const WelcomeStep = ({ onNext }) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="text-6xl mb-8"
      >
        🏢
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Volunteera for Organizations
        </h2>
        <p className="text-gray-600 mb-8">
          Join our platform to connect with passionate volunteers and make a difference in your community.
        </p>

        <div className="space-y-6 max-w-lg mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-green-50 rounded-lg border border-green-100"
          >
            <h3 className="font-medium text-green-900 mb-2">✨ What you can do</h3>
            <ul className="text-green-700 text-sm space-y-2">
              <li>• Post and manage volunteer opportunities</li>
              <li>• Connect with skilled volunteers</li>
              <li>• Track volunteer engagement</li>
              <li>• Share your organization's impact</li>
            </ul>
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={onNext}
          className="px-8 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transform hover:scale-105 transition-all duration-200"
        >
          Let's Get Started
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomeStep; 
