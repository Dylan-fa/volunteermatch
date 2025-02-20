import React from 'react';
import { useUser } from '../contexts/UserContext';
import OrganizationDashboard from '../components/OrganizationDashboard';
import VolunteerDashboard from '../components/VolunteerDashboard';

const Dashboard = () => {
  const { user } = useUser();


  return (
    <div className="min-h-screen bg-gray-50">
      {user.is_organization ? (
        <OrganizationDashboard />
      ) : user.is_volunteer ? (
        <VolunteerDashboard />
      ) : (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Account Type Not Found</h1>
          <p className="mt-2 text-gray-600">Please contact support if you believe this is an error.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;