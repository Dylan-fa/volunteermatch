import React from 'react';
import OpportunityForm from '../components/OpportunityForm';
import PageTransition from '../components/PageTransition';

const CreateOpportunity = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <OpportunityForm />
        </div>
      </div>
    </PageTransition>
  );
};

export default CreateOpportunity;
