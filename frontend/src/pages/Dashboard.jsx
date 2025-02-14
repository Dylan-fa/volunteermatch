import React from 'react';

const SAMPLE_STATS = [
  { label: 'Hours Volunteered', value: '24', unit: 'hours' },
  { label: 'Opportunities Completed', value: '5', unit: 'projects' },
  { label: 'Impact Score', value: '850', unit: 'points' },
  { label: 'Organizations Helped', value: '3', unit: 'orgs' },
];

const UPCOMING_OPPORTUNITIES = [
  {
    id: 1,
    title: "Community Garden Helper",
    date: "Tomorrow, 2:00 PM",
    location: "Downtown Community Garden",
    status: "Confirmed"
  },
  {
    id: 2,
    title: "Food Bank Volunteer",
    date: "Next Tuesday, 10:00 AM",
    location: "Central Food Bank",
    status: "Pending"
  }
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Volunteer!</h1>
          <p className="mt-1 text-sm text-gray-600">Here's an overview of your volunteering journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {SAMPLE_STATS.map((stat) => (
            <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stat.value}
                  <span className="ml-1 text-sm font-normal text-gray-500">{stat.unit}</span>
                </dd>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upcoming Opportunities */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Opportunities</h2>
              <div className="space-y-4">
                {UPCOMING_OPPORTUNITIES.map((opportunity) => (
                  <div key={opportunity.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{opportunity.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{opportunity.date}</p>
                        <p className="text-sm text-gray-500">{opportunity.location}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        opportunity.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {opportunity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View All Opportunities
              </button>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Impact</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">🌟</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Achievement Unlocked!</h3>
                      <p className="text-sm text-blue-700">Completed 5 volunteer opportunities</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Environmental Impact</h3>
                      <p className="text-sm text-green-700">Helped plant 20 trees this month</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View Full Impact Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 