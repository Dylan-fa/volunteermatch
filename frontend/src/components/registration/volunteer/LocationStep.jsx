import React from 'react';
import { motion } from 'framer-motion';

const LocationStep = ({ formData, setFormData, onNext, onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <motion.label
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Location
          </motion.label>
          <motion.input
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            type="text"
            placeholder="Enter your city"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Radius (km)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="50"
              value={formData.radius}
              onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-gray-700 font-medium w-12">
              {formData.radius}km
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Availability
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Weekdays', 'Weekends', 'Morning', 'Afternoon', 'Evening', 'Flexible'].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => {
                  const newAvailability = formData.availability.includes(time)
                    ? formData.availability.filter(t => t !== time)
                    : [...formData.availability, time];
                  setFormData({ ...formData, availability: newAvailability });
                }}
                className={`p-2 rounded-lg border-2 transition-all duration-200
                  ${formData.availability.includes(time)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between pt-4"
        >
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default LocationStep; 
