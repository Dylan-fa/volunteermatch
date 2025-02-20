import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import WelcomeStep from '../components/registration/organization/WelcomeStep';
import BasicInfoStep from '../components/registration/organization/BasicInfoStep';
import ContactStep from '../components/registration/organization/ContactStep';
import VerificationStep from '../components/registration/organization/VerificationStep';
import CompleteStep from '../components/registration/CompleteStep';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Let\'s get your organization set up',
    icon: '🏢'
  },
  {
    id: 'basic',
    title: 'Organization Info',
    description: 'Tell us about your organization',
    icon: '📋'
  },
  {
    id: 'contact',
    title: 'Contact Details',
    description: 'How volunteers can reach you',
    icon: '📞'
  },
  {
    id: 'verification',
    title: 'Verification',
    description: 'Verify your organization',
    icon: '✅'
  },
  {
    id: 'complete',
    title: 'All Set!',
    description: 'Ready to post opportunities',
    icon: '🎉'
  }
];

const OrganizationRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationType: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    registrationNumber: '',
    taxId: '',
    logo: null
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={() => setCurrentStep(1)} />;
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            setFormData={setFormData}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
          />
        );
      case 2:
        return (
          <ContactStep
            formData={formData}
            setFormData={setFormData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <VerificationStep
            formData={formData}
            setFormData={setFormData}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
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
                        ? 'bg-green-500 text-white' 
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
                className="absolute left-0 top-0 h-full bg-green-500 rounded-full"
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

export default OrganizationRegister; 
