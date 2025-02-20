import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import WelcomeStep from '../components/registration/volunteer/WelcomeStep';
import BasicInfoStep from '../components/registration/volunteer/BasicInfoStep';
import InterestsStep from '../components/registration/volunteer/InterestsStep';
import LocationStep from '../components/registration/volunteer/LocationStep';
import CompleteStep from '../components/registration/CompleteStep';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Volunteera',
    description: 'Let\'s get you started on your volunteering journey',
    icon: '👋'
  },
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Tell us a bit about yourself',
    icon: '👤'
  },
  {
    id: 'interests',
    title: 'Your Interests',
    description: 'What causes are you passionate about?',
    icon: '❤️'
  },
  {
    id: 'location',
    title: 'Location Preferences',
    description: 'Where would you like to volunteer?',
    icon: '🌍'
  },
  {
    id: 'complete',
    title: 'All Set!',
    description: 'Ready to make a difference',
    icon: '🎉'
  }
];

const interests = [
  { id: 'environment', label: 'Environment', icon: '🌱' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { id: 'animals', label: 'Animal Welfare', icon: '🐾' },
  { id: 'community', label: 'Community', icon: '🤝' },
  { id: 'elderly', label: 'Elderly Care', icon: '👵' },
  { id: 'youth', label: 'Youth Programs', icon: '🧑‍🤝‍🧑' },
  { id: 'arts', label: 'Arts & Culture', icon: '🎨' }
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    interests: [],
    location: '',
    radius: '10',
    availability: []
  });

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return (
          <BasicInfoStep 
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <InterestsStep
            interests={interests}
            selectedInterests={formData.interests}
            onToggle={handleInterestToggle}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <LocationStep
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return <CompleteStep />;
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                      ${index <= currentStep 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-400'}`}
                  >
                    {step.icon}
                  </div>
                  <div className="hidden md:block text-sm mt-2 text-gray-500">
                    {step.title}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full">
              <motion.div
                className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
