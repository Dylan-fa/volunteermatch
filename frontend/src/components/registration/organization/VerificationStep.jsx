import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const VerificationStep = ({ formData, setFormData, onNext, onBack }) => {
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Registration Number
          </label>
          <input
            type="text"
            required
            value={formData.registrationNumber}
            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter registration number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax ID / EIN
          </label>
          <input
            type="text"
            required
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter tax ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Logo
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
          >
            {formData.logo ? (
              <div className="text-center">
                <p className="text-sm text-gray-600">Selected file:</p>
                <p className="text-green-600 font-medium">{formData.logo.name}</p>
              </div>
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-1 text-sm text-gray-600">Click to upload logo</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-50 border border-yellow-100 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            🔒 Verification Notice
          </h4>
          <p className="text-sm text-yellow-700">
            We'll review your organization's information within 1-2 business days. 
            You'll receive an email confirmation once your account is verified.
          </p>
        </motion.div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Submit for Verification
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default VerificationStep; 
