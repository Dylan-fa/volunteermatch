import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { useUser } from '../contexts/UserContext';  // Add this import

const OrganizationRegistration = () => {
  const [step, setStep] = useState(1);
  const [charityData, setCharityData] = useState({
    name: '',
    charity_number: '',
    description: '',
    logo: null,
    selected_charity_data: null
  });
  
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    password: '',
    password2: ''
  });

  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useUser();  // Add this hook

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
        
        // Sort results: active charities first, then sort by name
        const sortedData = data.sort((a, b) => {
          // First, sort by active/removed status
          if (a.reg_status === 'RM' && b.reg_status !== 'RM') return 1;
          if (a.reg_status !== 'RM' && b.reg_status === 'RM') return -1;
          // Then sort by name
          return a.charity_name.localeCompare(b.charity_name);
        });

        setSearchResults(sortedData);
        if (sortedData && sortedData.length > 0) {
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
    
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
    } else {
      // Show loading state immediately for better UX
      setIsSearching(true);
      debouncedSearch(query);
    }
  };

  const fetchCharityDetails = async (regNumber, suffix = 0) => {
    try {
      const response = await fetch(`/api/charity-details/${regNumber}/${suffix}`);
      const data = await response.json();
      if (data.activities) {
        setCharityData(prev => ({
          ...prev,
          description: data.activities
        }));
      }
    } catch (err) {
      console.error('Failed to fetch charity details:', err);
    }
  };

  const selectCharity = (charity) => {
    setCharityData(prev => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    const combinedData = {
      ...charityData,
      ...userData
    };

    Object.keys(combinedData).forEach(key => {
      if (key === 'selected_charity_data' && combinedData[key]) {
        formDataToSend.append(key, JSON.stringify(combinedData[key]));
      } else if (combinedData[key] !== null) {
        formDataToSend.append(key, combinedData[key]);
      }
    });

    try {
      const response = await fetch('/api/auth/organization/register/', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const data = await response.json();
      
      // Update tokens in localStorage
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      
      // Update user context to trigger UI updates
      login(data.user);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const searchInputSection = (
    <div className="relative" ref={searchContainerRef}>
      <label className="block text-sm font-medium text-gray-700">
        Search Registered Charity
      </label>
      <input
        type="text"
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter charity name or number (min 3 characters)"
        value={searchQuery}
        onChange={handleCharitySearch}
        onFocus={() => {
          if (searchResults.length > 0) {
            setShowResults(true);
          }
        }}
      />
      {isSearching && (
        <div className="absolute right-3 top-9">
          <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      {searchResults.length > 0 && (
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
              {charity.date_of_registration && (
                <div className="text-xs text-gray-400">
                  Registered: {new Date(charity.date_of_registration).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="mb-5">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setStep(1)}
              className={`${
                step === 1
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Organization Details
            </button>
            <button
              onClick={() => setStep(2)}
              className={`${
                step === 2
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Admin User
            </button>
          </nav>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {step === 1 ? (
          <>
            {searchInputSection}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={charityData.description}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setCharityData({...charityData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organization Logo
              </label>
              <div className="mt-1 flex items-center">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Choose File
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => setCharityData({...charityData, logo: e.target.files[0]})}
                  />
                </label>
                {charityData.logo && (
                  <span className="ml-3 text-sm text-gray-600">
                    {charityData.logo.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={userData.email}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setUserData({...userData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                required
                value={userData.username}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setUserData({...userData, username: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                value={userData.password}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setUserData({...userData, password: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={userData.password2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setUserData({...userData, password2: e.target.value})}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default OrganizationRegistration;
