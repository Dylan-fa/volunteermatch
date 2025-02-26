import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

const NavBar = ({ isScrolled = false, gradientStyle = {} }) => {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [rainbowVisible, setRainbowVisible] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);

  useEffect(() => {
    // Delay the rainbow animation to start after page load
    const timer = setTimeout(() => {
      setRainbowVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    // Optional: Add navigation to home page here
  };

  return (
    <nav className="fixed w-full z-50">
      {/* Rainbow Gradient Bar */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ 
          scaleY: rainbowVisible ? 1 : 0,
          opacity: rainbowVisible ? 1 : 0
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
        className="h-1 w-full bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 bg-[length:200%_auto] animate-gradient"
      />

      {/* Navbar Content */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span 
                  className={`transition-all duration-500 transform ${
                    isScrolled 
                      ? "animate-gradient bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent text-xl font-semibold"
                      : "text-xl font-semibold text-gray-900"
                  }`}
                  style={isScrolled ? gradientStyle : {}}
                >
                  Volunteera
                </span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link to="/browse" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Browse
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Dashboard
                  </Link>
                  {user.is_organization && (
                    <Link
                      to="/opportunities/create"
                      className="px-4 py-2 text-sm font-medium rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Opportunity
                    </Link>
                  )}
                </>
              )}
              {user && !user.is_organization && (
                <Link 
                  to="/friends" 
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Friends
                </Link>
              )}
              <Link 
                to="/leaderboard"
                className='px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900'
              >
                Leaderboard
              </Link>

              
              {user ? (
                <div className="relative ml-3 flex items-center space-x-4">
                  <div className="flex items-center">
                    {user.is_organization && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                        Organization
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-700">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Login
                  </Link>
                  
                  {/* Register Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRegisterDropdown(!showRegisterDropdown)}
                      onBlur={() => setTimeout(() => setShowRegisterDropdown(false), 100)}
                      className="ml-2 px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors flex items-center"
                    >
                      Register
                      <svg 
                        className={`ml-2 h-4 w-4 transition-transform ${showRegisterDropdown ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showRegisterDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      >
                        <Link
                          to="/register"
                          state={{ type: 'volunteer' }}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center"
                        >
                          <span className="text-lg mr-2">🤝</span>
                          I'm a Volunteer
                        </Link>
                        <Link
                          to="/register"
                          state={{ type: 'organization' }}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg flex items-center"
                        >
                          <span className="text-lg mr-2">🏢</span>
                          I'm an Organization
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </>
              )}

              <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                About Us
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/browse"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Browse
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </Link>
          )}
          {user && user.is_organization && (
            <Link
              to="/opportunities/create"
              className="block px-3 py-2 text-base font-medium text-green-600 hover:text-green-700 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Opportunity
              </div>
            </Link>
          )}
          {user && !user.is_organization && (
            <Link 
              to="/friends" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Friends
            </Link>
          )}
          <Link 
            to="/leaderboard"
            className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          >
            Leaderboard
          </Link>
          {user ? (
            <>
              <div className="px-3 py-2">
                {user.is_organization && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Organization
                  </span>
                )}
                <span className="block mt-1 text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Login
              </Link>
              <div className="px-3 py-2 space-y-1">
                <Link
                  to="/register"
                  state={{ type: 'volunteer' }}
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Register as Volunteer
                </Link>
                <Link
                  to="/register"
                  state={{ type: 'organization' }}
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Register as Organization
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
