import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useUser } from '../contexts/UserContext';
import VolunteerRegistration from '../components/VolunteerRegistration';
import OrganizationRegistration from '../components/OrganizationRegistration';
import PageTransition from '../components/PageTransition';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useUser();
  const [userType, setUserType] = useState('volunteer');
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.type) {
      setUserType(location.state.type);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Login with both user data and tokens
        login(data.user, {
          access: data.access,
          refresh: data.refresh
        });
        
        // Redirect based on user type
        if (data.user.is_volunteer) {
          navigate('/browse');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleRegisterSuccess = (data) => {
    // Store tokens first
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    // Then login user
    login(data.user);
    
    // Redirect based on user type
    if (data.user.is_volunteer) {
      navigate('/browse');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-md" role="group">
            <button
              onClick={() => setUserType('volunteer')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                userType === 'volunteer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Volunteer
            </button>
            <button
              onClick={() => setUserType('organization')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                userType === 'organization'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Organization
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {userType === 'volunteer' ? (
          <VolunteerRegistration onRegisterSuccess={handleRegisterSuccess} />
        ) : (
          <OrganizationRegistration onRegisterSuccess={handleRegisterSuccess} />
        )}
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
    </PageTransition>

  );
};

export default Register;
