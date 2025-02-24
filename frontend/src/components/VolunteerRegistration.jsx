import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const VolunteerRegistration = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    display_name: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/volunteer/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onRegisterSuccess(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('/api/auth/google/callback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          access_token: credentialResponse.credential,
          user_type: 'volunteer'
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Google registration failed');
      }

      onRegisterSuccess(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError('Google registration failed')}
        className="w-full mb-4"
        containerProps={{ allow: "identity-credentials-get" }}
        use_fedcm_for_prompt
      />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            id="first_name"
            type="first_name"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
          />
        </div>
        
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="last_name"
            type="last_name"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <input
            id="display_name"
            type="display_name"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setFormData({...formData, display_name: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="password2"
            type="password"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setFormData({...formData, password2: e.target.value})}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerRegistration;
