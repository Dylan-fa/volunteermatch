import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaMedal, FaClock, FaUsers } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import { useUser } from '../contexts/UserContext';
import Spin from '../components/LoadingSpinner';

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
  const [volunteer, setVolunteer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [FRIENDS, setFriends] = useState([]);
  const { user } = useUser();
  let user_id = 0

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data1 = await api.get('/volunteer/list/');
        const users = data1;
        users.forEach(item =>{
          if (item.email === user.email){
            user_id = item.id
          }
        })
        const data2 = await api.get('/volunteer/' + user_id + '/');
        setVolunteer(data2);
        setFriends(data2.friends);

      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if(user){
      fetchUser();
    }
  }, [user]);

 


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
  }, [isLoading]);

  return (
    <PageTransition>
      {isLoading ? (<div className="flex justify-center items-center h-screen">
        <Spin/>
      </div>) : (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Overview */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="text-5xl bg-white/20 p-4 rounded-full">{volunteer.avatar || "👤"}</div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-white">{volunteer.f_name + " " + volunteer.l_name}</h1>
                <div className="mt-2 flex items-center gap-6 text-white/90">
                  <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FaClock className="w-5 h-5" />
                    {volunteer.hours} hours volunteered
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
                {isVisible ? <AnimatedCounter value={volunteer.hours} /> : '0'}
              </p>
              <p className="text-sm text-white/80 mt-1">Hours volunteered</p>
            </div>

            <div className={`bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-xl shadow-lg transform transition-all duration-500 delay-100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h3 className="text-lg font-medium text-white/90 mb-2">Completions</h3>
              <p className="text-3xl font-bold text-white">
                {isVisible ? <AnimatedCounter value={volunteer.opportunities_completed} /> : '0'}
              </p>
              <p className="text-sm text-white/80 mt-1">Opportunities Done</p>
            </div>

            <div className={`bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-xl shadow-lg transform transition-all duration-500 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h3 className="text-lg font-medium text-white/90 mb-2">Impact</h3>
              <p className="text-3xl font-bold text-white">
                {isVisible ? <AnimatedCounter value={volunteer.overall_score} /> : '0'}
              </p>
              <p className="text-sm text-white/80 mt-1">Points</p>
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
                      <span className="text-3xl bg-gray-50 p-2 rounded-full">👤</span>
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
      )}
    </PageTransition>
            
  );
};

export default VolunteerDashboard;
