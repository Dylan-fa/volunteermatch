import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaMedal, FaClock, FaUsers } from 'react-icons/fa';
import PageTransition from './PageTransition';
import api from '../utils/api';
// Badge definitions
const BADGES = {
  hours: [
    { id: 1, name: "First Step", icon: "🌱", description: "Complete your first hour", requirement: 1 },
    { id: 2, name: "Regular Helper", icon: "⭐", description: "Complete 10 hours", requirement: 10 },
    { id: 3, name: "Dedicated Volunteer", icon: "🌟", description: "Complete 50 hours", requirement: 50 },
    { id: 4, name: "Community Champion", icon: "👑", description: "Complete 100 hours", requirement: 100 },
  ],
  categories: [
    { id: 5, name: "Environmental Hero", icon: "🌍", description: "Complete 5 environmental projects", category: "Environment" },
    { id: 6, name: "Education Mentor", icon: "📚", description: "Complete 5 education projects", category: "Education" },
    { id: 7, name: "Healthcare Helper", icon: "❤️", description: "Complete 5 healthcare projects", category: "Healthcare" },
    { id: 8, name: "Community Builder", icon: "🤝", description: "Complete 5 community projects", category: "Community" },
  ],
  special: [
    { id: 9, name: "Diversity Champion", icon: "🌈", description: "Volunteer in 5 different categories" },
    { id: 10, name: "Team Player", icon: "👥", description: "Participate in 3 group activities" },
    { id: 11, name: "Local Hero", icon: "🏆", description: "Complete 10 projects in your local area" },
  ]
};


// Badge Component
const Badge = ({ badge, earned }) => {
  // Color mapping for different badge types
  const getBadgeColors = (id) => {
    const colors = {
      // Hours badges (blue theme)
      1: 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200',
      2: 'bg-blue-200 border-blue-400 text-blue-900 hover:bg-blue-300',
      3: 'bg-blue-300 border-blue-500 text-blue-900 hover:bg-blue-400',
      4: 'bg-gradient-to-r from-blue-400 to-blue-500 border-blue-600 text-white hover:from-blue-500 hover:to-blue-600',
      
      // Category badges with gradients
      5: 'bg-gradient-to-r from-emerald-400 to-green-500 border-green-600 text-white hover:from-emerald-500 hover:to-green-600', // Environmental
      6: 'bg-gradient-to-r from-violet-400 to-purple-500 border-purple-600 text-white hover:from-violet-500 hover:to-purple-600', // Education
      7: 'bg-gradient-to-r from-rose-400 to-red-500 border-red-600 text-white hover:from-rose-500 hover:to-red-600', // Healthcare
      8: 'bg-gradient-to-r from-amber-400 to-yellow-500 border-yellow-600 text-white hover:from-amber-500 hover:to-yellow-600', // Community
      
      // Special badges (premium gradients)
      9: 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 border-purple-500 text-white hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500',
      10: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 border-blue-500 text-white hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500',
      11: 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 border-orange-500 text-white hover:from-amber-500 hover:via-orange-500 hover:to-yellow-500',
    };
    return colors[id] || 'bg-gray-100 border-gray-300 text-gray-600';
  };

  return (
    <div 
      className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
        earned 
          ? getBadgeColors(badge.id)
          : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{badge.icon}</span>
    <div>
          <h3 className={`font-semibold ${
            earned 
              ? badge.id <= 4 ? 'text-blue-900' : 'text-white'
              : 'text-gray-500'
          }`}>
            {badge.name}
          </h3>
          <p className={`text-sm ${
            earned 
              ? badge.id <= 4 ? 'text-blue-800/80' : 'text-white/90'
              : 'text-gray-500'
          }`}>
            {badge.description}
          </p>
        </div>
      </div>
      {earned && (
        <div className={`mt-2 text-xs flex items-center gap-1 ${
          badge.id <= 4 ? 'text-blue-900' : 'text-white'
        }`}>
          <FaMedal className="w-3 h-3" />
          <span>Earned</span>
        </div>
      )}
    </div>
  );
};

// Friend Card Component
const FriendCard = ({ friend }) => (
  <div className="p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200">
    <div className="flex items-center gap-4">
      <div className="relative">
        <span className="text-3xl">{friend.avatar}</span>
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
          friend.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
        } border-2 border-white`}></span>
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{friend.name}</h3>
        <p className="text-sm text-gray-500">{friend.recentActivity}</p>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
      <span className="flex items-center gap-1">
        <FaClock className="w-4 h-4" />
        {friend.hours} hours
      </span>
      <span className="flex items-center gap-1">
        <FaMedal className="w-4 h-4" />
        {friend.badges} badges
      </span>
    </div>
  </div>
);

// Add this new component for animated counting
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentCount = Math.floor(easeOutQuart * value);
      
      setCount(currentCount);

      if (percentage < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };

    countRef.current = requestAnimationFrame(animate);

    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [value, duration]);

  return <>{count}</>;
};

const VolunteerDashboard = () => {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [FRIENDS, setFriends] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/volunteer/2/');
        console.log(data)
        setUser(data);
        setFriends(data.friends);

      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);


  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Overview */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="text-5xl bg-white/20 p-4 rounded-full">{user.avatar || "👤"}</div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-white">{user.f_name + " " + user.l_name}</h1>
                <div className="mt-2 flex items-center gap-6 text-white/90">
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FaClock className="w-5 h-5" />
                    {user.hours} hours volunteered
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FaMedal className="w-5 h-5" />
                     badges earned
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FaUsers className="w-5 h-5" />
                    {FRIENDS.length} friends
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div 
            ref={statsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className={`bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg transform transition-all duration-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h3 className="text-lg font-medium text-white/90 mb-2">Total Hours</h3>
              <p className="text-3xl font-bold text-white">
                {isVisible ? <AnimatedCounter value={user.hours} /> : '0'}
              </p>
              <p className="text-sm text-white/80 mt-1">Hours volunteered</p>
            </div>

            <div className={`bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-xl shadow-lg transform transition-all duration-500 delay-100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h3 className="text-lg font-medium text-white/90 mb-2">Projects</h3>
              <p className="text-3xl font-bold text-white">
                {isVisible ? <AnimatedCounter value={user.opportunities_completed} /> : '0'}
              </p>
              <p className="text-sm text-white/80 mt-1">Completed projects</p>
            </div>

            <div className={`bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-xl shadow-lg transform transition-all duration-500 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h3 className="text-lg font-medium text-white/90 mb-2">Impact</h3>
              <p className="text-3xl font-bold text-white">
                {isVisible ? <AnimatedCounter value={user.overall_score} /> : '0'}
              </p>
              <p className="text-sm text-white/80 mt-1">People helped</p>
            </div>

            <div className={`bg-gradient-to-br from-amber-500 to-yellow-600 p-6 rounded-xl shadow-lg transform transition-all duration-500 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h3 className="text-lg font-medium text-white/90 mb-2">Rating</h3>
              <p className="text-3xl font-bold text-white">
                {isVisible ? <AnimatedCounter value={4.9} duration={1500} /> : '0'}
              </p>
              <p className="text-sm text-white/80 mt-1">Average rating</p>
            </div>
          </div>

          {/* Friends Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Friends</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FRIENDS.map(friend => (
                <div key={friend.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="text-3xl bg-gray-50 p-2 rounded-full">{friend.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{friend.display_name}</h3>
                      <p className="text-sm text-gray-500">{friend.recentActivity}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      <FaClock className="w-4 h-4" />
                      {friend.overall_score} impact
                    </span>
                    <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                      <FaMedal className="w-4 h-4" />
                      {friend.badges} badges
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="divide-y divide-gray-100">
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="text-2xl bg-green-50 p-2 rounded-full mr-3">🌱</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Community Garden Project</p>
                      <p className="text-sm text-gray-500">Completed 3 hours • Yesterday</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="text-2xl bg-blue-50 p-2 rounded-full mr-3">📚</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Youth Mentoring Program</p>
                      <p className="text-sm text-gray-500">Completed 2 hours • 3 days ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="text-2xl bg-yellow-50 p-2 rounded-full mr-3">🏆</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Earned "Regular Helper" Badge</p>
                      <p className="text-sm text-gray-500">Achievement • 1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VolunteerDashboard;
