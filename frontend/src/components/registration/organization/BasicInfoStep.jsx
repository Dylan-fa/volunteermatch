import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

const organizationTypes = [
  { id: 'nonprofit', label: 'Non-Profit Organization', icon: '🤝' },
  { id: 'education', label: 'Educational Institution', icon: '🎓' },
  { id: 'government', label: 'Government Agency', icon: '🏛️' },
  { id: 'community', label: 'Community Group', icon: '👥' },
  { id: 'religious', label: 'Religious Organization', icon: '⛪' },
  { id: 'other', label: 'Other', icon: '📋' }
];

const BasicInfoStep = ({ formData, setFormData, onNext, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.length < 3) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/charity-search/?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        const sortedData = data.sort((a, b) => {
          if (a.reg_status === 'RM' && b.reg_status !== 'RM') return 1;
          if (a.reg_status !== 'RM' && b.reg_status === 'RM') return -1;
          return a.charity_name.localeCompare(b.charity_name);
        });

        setSearchResults(sortedData);
        if (sortedData?.length > 0) {
          setShowResults(true);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 700)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleCharitySearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFormData({ ...formData, name: query });
    
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
    } else {
      setIsSearching(true);
      debouncedSearch(query);
    }
  };

  const fetchCharityDetails = async (regNumber, suffix = 0) => {
    try {
      const response = await fetch(`/api/charity-details/${regNumber}/${suffix}`);
      const data = await response.json();
      if (data.activities) {
        setFormData(prev => ({
          ...prev,
          description: data.activities
        }));
      }
    } catch (err) {
      console.error('Failed to fetch charity details:', err);
    }
  };

  const selectCharity = (charity) => {
    setFormData(prev => ({
      ...prev,
      name: charity.charity_name,
      charity_number: charity.reg_charity_number,
      selected_charity_data: charity
    }));
    setSearchQuery(charity.charity_name);
    setSearchResults([]);
    setShowResults(false);
    
    if (charity.reg_charity_number) {
      fetchCharityDetails(charity.reg_charity_number, charity.group_subsid_suffix || 0);
    }
  };

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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative" ref={searchContainerRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name / Search Registered Charity
          </label>
          <input
            type="text"
            required
            value={searchQuery || formData.name}
            onChange={handleCharitySearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter organization name or search registered charity"
          />
          {isSearching && (
            <div className="absolute right-3 top-9">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
              {searchResults.map((charity) => (
                <div
                  key={`${charity.reg_charity_number}-${charity.organisation_number}`}
                  className="cursor-pointer hover:bg-gray-100 py-2 px-4"
                  onClick={() => selectCharity(charity)}
                >
                  <div className="font-medium text-gray-900">{charity.charity_name}</div>
                  <div className="text-sm text-gray-500">
                    Charity Number: {charity.reg_charity_number}
                    {charity.reg_status === 'RM' && (
                      <span className="ml-2 text-red-500">(Removed)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Organization Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {organizationTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({ ...formData, organizationType: type.id })}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2
                  ${formData.organizationType === type.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
              >
                <span className="text-xl">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Description
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
            placeholder="Tell us about your organization's mission and impact..."
          />
        </div>

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
            Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BasicInfoStep;
