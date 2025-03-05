import React from 'react';
import { useUser } from '../contexts/UserContext';
import OrganizationDashboard from '../components/OrganizationDashboard';
import VolunteerDashboard from '../components/VolunteerDashboard';

const Dashboard = () => {
  const { user } = useUser();
  // Add loading state when user data is not available
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

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