import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '../contexts/UserContext';

const NavBar = ({ isScrolled = false, gradientStyle = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderAuthLinks = () => {
    if (user) {
      return (
        <>
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            {user.is_organization && (
              <Link
                to="/opportunities/create"
                className="px-4 py-2 text-sm font-medium rounded-full text-white bg-green-600 hover:bg-green-700"
              >
                Create Opportunity
              </Link>
            )}
            <span className="text-sm text-gray-600">
              {user.email}
              {user.is_organization && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Organization
                </span>
              )}
            </span>
            <Link 
              to="/dashboard" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {user.is_organization ? 'Organization Dashboard' : 'Volunteer Dashboard'}
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-900"
            >
              Logout
            </button>
          </div>
        </>
      );
    }

    return (
      <div className="hidden sm:flex sm:items-center sm:space-x-6">
        <Link to="/browse" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          Browse
        </Link>
        <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          Login
        </Link>
        <Link
          to="/register"
          className="ml-2 px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800"
        >
          Register
        </Link>
      </div>
    );
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className={`transition-all duration-500 transform ${
                isScrolled 
                  ? "animate-gradient bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent text-xl font-semibold"
                  : "text-xl font-semibold text-gray-900"
              }`}
              style={isScrolled ? gradientStyle : {}}>
                Volunteera
              </span>
            </Link>
          </div>
          
          {renderAuthLinks()}

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

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {user ? (
            <>
              {user.is_organization && (
                <Link
                  to="/opportunities/create"
                  className="block px-3 py-2 text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Create Opportunity
                </Link>
              )}
              <span className="block px-3 py-2 text-base font-medium text-gray-700">
                {user.email}
              </span>
              {user.is_organization && (
                <span className="block px-3 py-1 text-sm text-blue-800 bg-blue-100">
                  Organization
                </span>
              )}
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {user.is_organization ? 'Organization Dashboard' : 'Volunteer Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/browse"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Browse
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;