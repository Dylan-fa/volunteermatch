import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PageTransition from '../components/PageTransition';
import { FaMedal } from 'react-icons/fa';

const BadgeDetails = ({ badge }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-28 h-28 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
          <img 
            src={badge.image_url || "/media/ElderlyBadge.png"} 
            alt={badge.title} 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-900">{badge.title}</h3>
          <div className="mt-1 mb-3">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
              Level {badge.level || 1}
            </span>
          </div>
          <p className="text-gray-600">{badge.description}</p>
          
          {/* Progress bar - styled to match dashboard */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress toward next level</span>
              <span className="font-medium">{badge.progress || 50}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${badge.progress || 50}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BadgesPage = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        // const response = await api.get('/api/volunteer/badges/');
        // setBadges(response.data);
        
        // Mock data for development
        setBadges([
          {
            id: 1,
            title: "Elderly Badge",
            description: "Awarded for helping elderly people in your community",
            level: 2,
            image_url: "/media/ElderlyBadge.png",
            progress: 75
          },
          {
            id: 2,
            title: "Medical Badge",
            description: "Awarded for supporting healthcare initiatives",
            level: 1,
            image_url: "/media/ElderlyBadge.png",
            progress: 30
          },
          {
            id: 3,
            title: "Community Badge",
            description: "Awarded for contributing to community well-being",
            level: 3,
            image_url: "/media/ElderlyBadge.png",
            progress: 90
          },
          {
            id: 4,
            title: "Disability Badge",
            description: "Awarded for supporting people with disabilities",
            level: 1,
            image_url: "/media/ElderlyBadge.png",
            progress: 40
          },
          {
            id: 5,
            title: "Animals Badge",
            description: "Awarded for helping animals in need",
            level: 1,
            image_url: "/media/ElderlyBadge.png",
            progress: 15
          },
          {
            id: 6,
            title: "Sports Badge",
            description: "Awarded for supporting athletic initiatives",
            level: 2,
            image_url: "/media/ElderlyBadge.png",
            progress: 60
          }
        ]);
      } catch (error) {
        console.error("Error fetching badges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading your badges...</div>;
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - styled to match the dashboard */}
        <div className="flex items-center mb-6">
          <div className="rounded-md bg-purple-50 p-3 mr-4">
            <FaMedal className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Badges</h1>
            <p className="text-gray-600">
              Badges are awarded based on your volunteering activity in different categories
            </p>
          </div>
        </div>

        {/* Badge cards grid for small screen */}
        <div className="md:hidden grid grid-cols-2 gap-4 mb-8">
          {badges.map(badge => (
            <div key={badge.id} className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-2">
                <img 
                  src={badge.image_url || "/media/ElderlyBadge.png"} 
                  alt={badge.title} 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900">{badge.title}</h3>
              <span className="mt-1 px-2 py-0.5 inline-block bg-blue-100 text-blue-800 text-xs rounded-full">
                Level {badge.level}
              </span>
            </div>
          ))}
        </div>
        
        {/* Badge details list for medium+ screens */}
        <div className="hidden md:block">
          {badges.length > 0 ? (
            <div className="space-y-6">
              {badges.map(badge => (
                <BadgeDetails key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4-9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm4 3a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No badges yet</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                Start volunteering with organizations to earn badges in different categories. Badges represent your skills and contributions to the community.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BadgesPage;