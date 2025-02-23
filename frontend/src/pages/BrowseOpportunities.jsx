import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaCheckCircle } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import api from '../utils/api';

const CATEGORIES = [
  { name: 'All Categories', count: '2.5k' },
  { name: 'Environment', count: '850' },
  { name: 'Education', count: '420' },
  { name: 'Healthcare', count: '380' },
  { name: 'Community', count: '510' },
  { name: 'Arts & Culture', count: '290' },
];

const LOCATIONS = [
  { name: 'All Locations', count: '2.5k' },
  { name: 'London', count: '850' },
  { name: 'Manchester', count: '420' },
  { name: 'Birmingham', count: '380' },
  { name: 'Leeds', count: '310' },
  { name: 'Liverpool', count: '290' },
];

// Verification badge component
const VerificationBadge = ({ type }) => {
  const badges = {
    companiesHouse: {
      label: "UK Companies House Verified",
      color: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    charitiesCommission: {
      label: "UK Charity Commission Verified",
      color: "bg-purple-50 text-purple-700 border border-purple-200",
    }
  };

  const badge = badges[type];

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color} gap-1.5`}
      title={badge.label}
    >
      {badge.label}
      <FaCheckCircle className="w-3 h-3" />
    </span>
  );
};

// Opportunity Card component
const OpportunityCard = ({ opportunity }) => {
  return (
    <div className='opportunity'>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          {/* Header section */}
          <div className="flex flex-col gap-4">
            {/* Title and Organization */}
            <div className="flex items-start gap-3">
              <span className="text-2xl">{opportunity.image || '📋'}</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {opportunity.title}
                </h3>
                
                <p className="text-sm text-gray-500">
                  {opportunity.organization.name}
                </p>
              </div>
              <h4 className='text-sm text-gray-500'>
                  Effort: {opportunity.effort}
              </h4>
            </div>
            
            {/* Verification Badges */}
            <div className="flex flex-wrap gap-2">
              {opportunity.organization.companiesHouseVerified && (
                <VerificationBadge type="companiesHouse" />
              )}
              {opportunity.organization.charitiesCommissionVerified && (
                <VerificationBadge type="charitiesCommission" />
              )}
            </div>
          </div>
          
          {/* Description */}
          <p className="mt-4 text-gray-600">
            {opportunity.description}
          </p>
          
          {/* Tags */}
          {opportunity.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {opportunity.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span>📍</span> {opportunity.location_name}
              </span>
            </div>
            <Link
              to={`/opportunity/${opportunity.id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrowseOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function searchOpportunity() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let opportunities = document.querySelectorAll(".opportunity");
    console.log(opportunities);

    opportunities.forEach(opportunity => {
        if (opportunity.textContent.toLowerCase().includes(input)) {
            opportunity.style.display = "block";
        } else {
            opportunity.style.display = "none";
        }
    });
}

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/opportunities/');
        setOpportunities(data);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Discover Opportunities</h1>
            <p className="mt-2 text-gray-600">Explore volunteer opportunities near you</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Categories Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
                  <div className="space-y-2">
                    {CATEGORIES.map(category => (
                      <button
                        key={category.name}
                        className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span>{category.name}</span>
                        <span className="text-gray-400">{category.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Locations Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Locations</h2>
                  <div className="space-y-2">
                    {LOCATIONS.map(location => (
                      <button
                        key={location.name}
                        className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span>{location.name}</span>
                        <span className="text-gray-400">{location.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Filters */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    id='searchBar'
                    type="text"
                    onKeyUp={searchOpportunity}
                    placeholder="Search opportunities..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div className="flex gap-4">
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200">
                    <option>Location</option>
                    <option>Within 5 miles</option>
                    <option>Within 10 miles</option>
                    <option>Within 25 miles</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200">
                    <option>Date</option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                </div>
              </div>

              {/* Opportunities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  <div className="col-span-2 text-center py-12">
                    <div className="animate-pulse">Loading opportunities...</div>
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500">No opportunities found</p>
                  </div>
                ) : (
                  opportunities.map(opportunity => (
                    <OpportunityCard 
                      key={opportunity.id} 
                      opportunity={opportunity} 
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BrowseOpportunities;