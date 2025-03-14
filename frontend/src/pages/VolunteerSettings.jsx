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
  const [formData, setFormData] = useState({
      f_name: '',
      l_name: '',
      display_name: '',
      interests: [],
    });

  useEffect(() => {
    async function fetchVol() {
      try {
        setIsLoading(true);
        let response = await api.get(`/volunteer/${id}/`);
        console.log(response)
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

    async function saveInterests(){
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
            throw new Error(data.error || 'Registration failed');
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">{vol.email}</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 mb-6 text-center"
          >
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
      <div className="w-full flex justify-center items-center mt-4">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between"
            >
            <button
                onClick={saveInterests}
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
