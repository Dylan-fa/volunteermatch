import React from 'react';
import EditForm from '../components/EditForm';
import PageTransition from '../components/PageTransition';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../utils/api';
import Spin from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const character = {
    'Animal': '🐶',
    'Elderly': '👵',
    'Greener_Planet': '🌱',
    'Sports': '⚽',
    'Medical': '🧬',
    'Disability': '♿',
    'Community': '🤝',
    'Educational': '🎓',
  }

const VolunteerSettings = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [vol, setVol] = useState(null);
  const [all_interests, setInterests] = useState([]);
  const { id } = useParams();
  const [selectedInterests, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
      f_name: '',
      l_name: '',
      display_name: '',
      interests: [],
      password1: '',
      password2: ''
    });

  useEffect(() => {
    async function fetchVol() {
      try {
        setIsLoading(true);
        let response = await api.get(`/volunteer/${id}/`);
        setVol(response);
        setSelected(response.interests);
        const newData = {
            f_name: response.f_name,
            l_name: response.l_name,
            display_name: response.display_name,
            interests: response.interests
        }
        setFormData((prevData) => ({
            ...prevData, 
            ...newData, 
          }));
        response = await api.get(`/interests/`);
        setInterests(response);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    }

    if (id) {
      fetchVol();
    }
    }, [id]);
    console.log(formData)
    const container = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      };
    
    const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
    };

    const handleInterestToggle = (interestId) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interestId)
            ? prev.interests.filter(id => id !== interestId)
            : [...prev.interests, interestId]
        }));
    };

    async function save(){
        try {
          const response = await fetch(`/api/volunteer/${id}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Save failed');
          }
        } catch (err) {
          console.log(err.message);
        }
        
      }
  return (
    <PageTransition>
  {isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <Spin />
    </div>
  ) : vol.is_user ? (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-gray-100">
          {/* Top navigation bar */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6  text-white">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Settings</h1>
              <div className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`text-white font-medium ${
                    activeTab === 'profile' ? 'underline' : 'hover:text-gray-200'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`text-white font-medium ${
                    activeTab === 'security' ? 'underline' : 'hover:text-gray-200'
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`text-white font-medium ${
                    activeTab === 'notifications' ? 'underline' : 'hover:text-gray-200'
                  }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('interests')}
                  className={`text-white font-medium ${
                    activeTab === 'interests' ? 'underline' : 'hover:text-gray-200'
                  }`}
                >
                  Interests
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="py-12">
            <div className="max-w-7xl mx-auto px-6">
              {activeTab === 'profile' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
                    <p className="text-gray-600">Here you can update your profile information.</p>
                  
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-5 ml-5">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={vol.email}
                        className="mt-1 ml-5 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-200"
                        disabled={true}
                    />
                    </div>

                    <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mt-5 ml-5">
                        First Name
                    </label>
                    <input
                        id="first_name"
                        type="first_name"
                        required
                        value={vol.f_name}
                        className="mt-1 ml-5 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-200"
                        disabled={true}
                    />
                    </div>
                    
                    <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mt-5 ml-5">
                        Last Name
                    </label>
                    <input
                        id="last_name"
                        type="last_name"
                        required
                        value={vol.l_name}
                        className="mt-1 ml-5 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-200"
                        disabled={true}
                    />
                    </div>

                    <div>
                    <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mt-5 ml-5">
                        Display Name
                    </label>
                    <input
                        id="display_name"
                        type="display_name"
                        value={vol.display_name}
                        required
                        className="mt-1 ml-5 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                    />
                    </div>

                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Security Settings</h2>
                  <p className="text-gray-600">Manage your security preferences, including passwords and two-factor authentication.</p>
                  {/* Add security settings form or content here */}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Notification Settings</h2>
                  <p className="text-gray-600">Choose which notifications you want to receive and how.</p>
                  {/* Add notification settings form or content here */}
                </div>
              )}

              {activeTab === 'interests' && (
                <div>
                 

                  <div className="max-w-2xl mx-auto">
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-gray-900 mb-6 text-center"
                    >
                    <h2 className="text-2xl font-semibold mb-4">Interests</h2>
                      What causes interest you?
                    </motion.h2>

                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {all_interests.map((interest) => (
                        <motion.div
                          key={interest.id}
                          variants={item}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            onClick={() => handleInterestToggle(interest.id)}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                              ${formData.interests.includes(interest.id)
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            <span className="text-3xl">{character[interest.category]}</span>
                            <span className="font-medium">{interest.name}</span>
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between"
        >
          <button
            onClick={save}
            disabled={formData.interests.length === 0}
            className={`mb-4 px-6 py-2 rounded-full text-white transition-all duration-200
              ${formData.interests.length > 0
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            Save
          </button>
        </motion.div>
      </div>
    </div>
  ) : (
    "You cannot edit this user"
  )}
</PageTransition>

  );
};

export default VolunteerSettings;
