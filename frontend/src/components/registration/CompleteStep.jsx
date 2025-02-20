import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

const CompleteStep = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center max-w-xl mx-auto">
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
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Registration Complete!
        </h2>
        <p className="text-gray-600 mb-8">
          Your organization account has been created. We'll review your information and get back to you soon.
        </p>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-green-50 rounded-lg border border-green-100"
          >
            <h3 className="font-medium text-green-900 mb-2">🎯 Next Steps</h3>
            <ul className="text-green-700 text-sm space-y-2">
              <li>Check your email for verification details</li>
              <li>Complete your organization profile</li>
              <li>Start posting volunteer opportunities</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteStep; 
