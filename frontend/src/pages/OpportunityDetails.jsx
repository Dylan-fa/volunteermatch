import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import PageTransition from '../components/PageTransition';
import { useUser } from '../contexts/UserContext';
import api from '../utils/api';

const OpportunityDetails = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const mapRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await api.get(`/opportunities/${id}/`, {
          withCredentials: true,
      });
        setOpportunity(response);
        initMap(response);
      } catch (error) {
        console.error('Error fetching opportunity:', error);
      }
    };
    fetchOpportunity();
  }, [id]);

  const initMap = (opportunity) => {
    if (!window.google || !mapRef.current || !opportunity.latitude || !opportunity.longitude) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: opportunity.latitude, lng: opportunity.longitude }
    });

    new window.google.maps.Marker({
      position: { lat: opportunity.latitude, lng: opportunity.longitude },
      map,
      title: opportunity.title
    });
  };

  const handleApply = async () => {
    try {
      await api.post(`/opportunities/${id}/apply/`)
      // Refresh opportunity data to update application status
      const response = await api.get(`/opportunities/${id}/`, {
        withCredentials: true,
      });
      console.log(response)
      setOpportunity(response);
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  if (!opportunity) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link to="/browse" className="text-sm text-gray-500 hover:text-gray-900">
              ← Back to opportunities
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <div className="text-6xl mb-6">
                    {opportunity.image?.logo || opportunity.image?.name || '📷'}
                  </div>
                  <h1 className="text-3xl font-semibold text-gray-900">{opportunity.title}</h1>
                  <div className="mt-4 flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {opportunity.category}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{opportunity.organization?.name}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-4">About this opportunity</h2>
                  <p className="text-gray-600">{opportunity.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {opportunity.requirements && opportunity.requirements.split('\n').filter(req => req.trim()).map((req, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {req.trim()}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact */}
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Your Impact</h2>
                  <p className="text-gray-600">{opportunity.impact}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gray-50 rounded-xl p-6 space-y-6">
                {/* Date & Time */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Date & Time</h3>
                  <p className="text-gray-600">{opportunity.date}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                  <div className="flex items-center text-gray-600">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {opportunity.location_name}
                  </div>
                </div>

                {/* Commitment */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Time Commitment</h3>
                  <p className="text-gray-600">{opportunity.commitment}</p>
                </div>

                {/* Apply Button */}
                <button
                  className="w-full px-6 py-3 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                  onClick={handleApply}
                  disabled={opportunity.has_applied}
                >
                  {opportunity.has_applied ? 'Applied' : 'Apply Now'}
                </button>

                {/* Share Button */}
                <button className="w-full px-6 py-3 text-sm font-medium rounded-full text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors">
                  Share Opportunity
                </button>
              </div>
            </div>
          </div>
          <div ref={mapRef} className="w-full h-[300px] rounded-lg overflow-hidden" />
        </div>
      </div>
    </PageTransition>
  );
};

export default OpportunityDetails;
