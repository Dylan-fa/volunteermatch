import React, { useState, useEffect, useRef } from 'react';
import { FaMedal, FaClock, FaUsers, FaTrophy } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import { useUser } from '../contexts/UserContext'
import Spin from '../components/LoadingSpinner';
import { useParams, useLocation, Link } from 'react-router';
import { format } from 'date-fns';
import api from '../utils/api';

const MessageCard = ({message}) => {
  const [isVisible, setIsVisible] = useState(true);

  async function handleMessage(id){
    setIsVisible(false);
    try {
      await api.delete(`/message/${id}/remove`);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  if (!isVisible) return null
  return(
  <div key={message.id} className="p-6 bg-white rounded-xl shadow-lg relative">
    <div className="flex items-start space-x-4">
      <div className="w-14 h-14 bg-yellow-300 text-white rounded-full flex items-center justify-center text-2xl font-semibold">
        <span role="img" aria-label="star">⭐</span>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{message.from_person}</h3>
        <p className="text-md text-gray-700">{message.message}</p>
      </div>
    </div>

    <p className="absolute top-2 right-4 text-xs text-gray-400">{format(new Date(message.time_sent), 'EEEE, MMMM dd, yyyy')}</p>

    <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
      <button
        className="text-gray-400 hover:bg-gray-300 rounded-full p-2 transition-all duration-200 text-2xl font-bold hover:text-gray-700"
        onClick={() => handleMessage(message.id)}
      >
        X
      </button>
    </div>
  </div>
  )
}

const OpportunityCard = ({app, completeButton, setUpdate, update}) => {

  async function handleClick(mode){

    try {
      await api.post(`/application/update/${app.id}/${mode}/`);
      } catch (error) {
      console.error('Error:', error);
    }
    setUpdate(!update);

  }

  return(
    <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 relative">
    {/* Date Applied in Top Right */}
    <p className="absolute top-2 right-4 text-xs text-gray-500">
      Applied: {format(new Date(app.date_applied), "MMM dd, yyyy")}
    </p>

    {/* Header with Icon */}
    <div className="flex items-center space-x-4">
      <div className="text-6xl w-24 h-24 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold shadow-md">
      📋
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {app.opportunity.opportunity_name}
        </h3>
        <p className="text-sm text-gray-600">{app.opportunity.organisation_name}</p>
      </div>

      <Link
          to={`/opportunity/${app.opportunity.id}`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
        >
          Learn More
      </Link>
      </div>

    {completeButton ? (
    <div className='flex justfy-end items-center w-full'>
      <span className="text-sm text-gray-700 mr-4">Think you have completeed this activity?</span>
      <button
          className="px-6 py-3 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
          onClick={() => handleClick("requesting_complete")}
          disabled={app.opportunity.has_applied}
        >
          {app.opportunity.status === 'requesting_complete' ? 'Sent Requested' : 'Complete'}
      </button>
    </div>
    ) : ('')}
    </div>
  )
}



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

const BadgeItem = ({ category, score, maxScore, icon, color }) => {
  const level = Math.min(7, Math.floor(score / (maxScore / 7)) + 1);
  const progress = (score % (maxScore / 7)) / (maxScore / 7) * 100;
  
  return (
    <div className="transform transition-all duration-300 hover:scale-105 p-4 bg-white rounded-xl shadow-md hover:shadow-lg">
      <div className={`w-full h-24 ${color} text-white rounded-lg flex items-center justify-center mb-3`}>
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{category}</h3>
      <p className="text-xs text-gray-600 mb-2">Level {level} Badge</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color.replace('bg-', 'bg-')}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const Badge = ({volunteer}) => {
  return(
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{volunteer.is_user ? 'Your Badges' : 'Badges'}</h2>
        <Link 
          to="/badges" 
          state={{ from: 'dashboard' }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          View All Badges
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <BadgeItem 
          category="Elderly Care" 
          score={volunteer.scores.elderly || 0} 
          maxScore={500}
          icon="👵"
          color="bg-amber-500"
        />
        <BadgeItem 
          category="Medical" 
          score={volunteer.scores.medical || 0} 
          maxScore={500}
          icon="🩺"
          color="bg-red-500"
        />
        <BadgeItem 
          category="Special Needs" 
          score={volunteer.scores.disability || 0} 
          maxScore={500}
          icon="♿"
          color="bg-blue-500"
        />
        <BadgeItem 
          category="Animal Welfare" 
          score={volunteer.scores.animals || 0} 
          maxScore={500}
          icon="🐾"
          color="bg-green-500"
        />
        <BadgeItem 
          category="Sports" 
          score={volunteer.scores.animals || 0} 
          maxScore={500}
          icon="🐾"
          color="bg-blue-600"
        />
        <BadgeItem 
          category="Greener Planet" 
          score={volunteer.scores.animals || 0} 
          maxScore={500}
          icon="🐾"
          color="bg-green-600"
        />
        <BadgeItem 
          category="Education" 
          score={volunteer.scores.animals || 0} 
          maxScore={500}
          icon="🐾"
          color="bg-yellow-500"
        />
        <BadgeItem 
          category="Community" 
          score={volunteer.scores.animals || 0} 
          maxScore={500}
          icon="🐾"
          color="bg-purple-500"
        />
      </div>
    </div>
  )
}

const VolunteerDashboard = () => {
  const [volunteer, setVolunteer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [FRIENDS, setFriends] = useState([]);
  const [MESSAGES, setMessages] = useState([]);
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const { user } = useUser();
  const {id} = useParams();
  const location = useLocation();
  const [showAll, setShowAll] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllAccepted, setShowAllAccepted] = useState(false);
  const [update, setUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'stats');
  

  const visibleMessages = showAll ? MESSAGES : MESSAGES.slice(0, 3);
  const visible_pending = showAllPending ? pending : pending.slice(0, 1);
  const visible_accepted = showAllAccepted ? accepted : accepted.slice(0, 1);
  let user_id = 0

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        if(id){
          user_id = id;
        }
        else{
          const response1 = await api.get('/volunteer/list/');
          const users = response1
          users.forEach(item =>{
            if (item.email === user.email){
              user_id = item.id
            }
          })
        }

        const response2 = await api.get('/volunteer/' + user_id + '/');
        setVolunteer(response2);
        setFriends(response2.friends);
        setMessages(response2.messages);
        setPending(response2.pending_applications);
        setAccepted(response2.accepted_applications);


      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if(user){
      fetchUser();
    }
  }, [user, showAll, update], );




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

  useEffect(() => {
    // If there's an activeTab state passed in, update the tab
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  function goToFriendsSection(){
    setActiveTab("friends")
    document.getElementById("active tab").scrollIntoView({ behavior: "smooth" });
  }

  function goToBadgesSection(){
    setActiveTab("badges")
    document.getElementById("active tab").scrollIntoView({ behavior: "smooth" });
  }
  function goToActivitiesSection(){
    setActiveTab("stats")
    document.getElementById("active tab").scrollIntoView({ behavior: "smooth" });
  }

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
              {user && user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Profile"
                  className="rounded-full w-24 h-24 border-4 border-white shadow-md"
                />
              ) : (
                <div className="text-5xl bg-white/20 p-4 rounded-full">{volunteer.avatar || "👤"}</div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-white">{volunteer.is_user ? (volunteer.f_name + " " + volunteer.l_name) : volunteer.display_name}</h1>
                <div className="mt-2 flex items-center gap-6 text-white/90">
                  <span onClick = {goToActivitiesSection} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:cursor-pointer hover:shadow-lg">
                    <FaClock className="w-5 h-5" />
                    {volunteer.hours} hours volunteered
                  </span>
                  <span onClick = {goToFriendsSection} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:cursor-pointer hover:shadow-lg">
                    <FaUsers className="w-5 h-5" />
                    {FRIENDS.length} friends
                  </span>
                  <span  onClick = {goToBadgesSection} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:cursor-pointer hover:shadow-lg">
                    <FaTrophy className="w-5 h-5" />
                    {Object.keys(volunteer.scores).length} badges
                  </span>
                  <Link
                    to={`/volunteer/${volunteer.id}/settings`}
                    className="flex items-center gap-2 bg-white/10 px-4 py-2 ml-auto rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Edit Profile
                  </Link>
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
              <h3 className="text-lg font-medium text-white/90 mb-2">Last Completion</h3>
              <p className="text-xl font-bold text-white">
                {isVisible ? (volunteer.last_completion ? format(new Date(volunteer.last_completion), 'EEEE, MMMM dd, yyyy') : "Not completed") : "0"}
              </p>
            </div>
          </div>
          
          {/* Tabs Navigation */}
          {volunteer.is_user ? (
            <>
            <div id = "active tab" className="mb-6 border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
              <li className="mr-2">
                <button 
                  className={`inline-flex items-center justify-center p-4 rounded-t-lg border-b-2 ${activeTab === 'stats' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('stats')}
                >
                  <FaMedal className="w-4 h-4 mr-2" />
                  Activity
                </button>
              </li>
              <li className="mr-2">
                <button 
                  className={`inline-flex items-center justify-center p-4 rounded-t-lg border-b-2 ${activeTab === 'friends' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('friends')}
                >
                  <FaUsers className="w-4 h-4 mr-2" />
                  Friends
                </button>
              </li>
              <li className="mr-2">
                <button 
                  className={`inline-flex items-center justify-center p-4 rounded-t-lg border-b-2 ${activeTab === 'badges' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('badges')}
                >
                  <FaTrophy className="w-4 h-4 mr-2" />
                  Badges
                </button>
              </li>
            </ul>
            </div>
            {/* Tab Content */}
          {activeTab === 'stats' && (
            <>
          {/* Pending Applications Tab */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Opportunities applied for</h2>
          {pending.length === 0 ? (
            <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500">No pending applications</p>
            </div>) : (
            <div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="divide-y divide-gray-100">
                {visible_pending.map(app => (
                  <OpportunityCard key = {app.id} app = {app} completeButton={false} setUpdate = {setUpdate} update = {update}/>
                  ))}
                </div>
            </div>
          </div>
        )}
        {pending.length > 1 && (
        <button
          onClick={() => setShowAllPending(!showAllPending)}
          className="w-full py-1 bg-gray-300 hover:bg-gray-400 text-white px-4 rounded-full transition-all relative"
        >
          {showAllPending ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Applications in Progress Tab */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Opportunities in Progress</h2>
          {accepted.length === 0 ? (
            <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500">No opportunities in progress</p>
            </div>) : (
            <div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="divide-y divide-gray-100">
                {visible_accepted.map(app => (
                  <OpportunityCard key = {app.id} app = {app} completeButton={true} setUpdate = {setUpdate} update = {update}/>
                  ))}
                </div>
            </div>
          </div>
        )}
        {accepted.length > 1 && (
        <button
          onClick={() => setShowAllAccepted(!showAllAccepted)}
          className="w-full py-1 bg-gray-300 hover:bg-gray-400 text-white px-4 rounded-full transition-all relative"
        >
          {showAllAccepted ? "Show Less" : "Show More"}
        </button>
      )}

          {/* Messages */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Messages</h2>
          {MESSAGES.length === 0 ? (
            <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500">No messages</p>
            </div>) : (
            <div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="divide-y divide-gray-100">
                {visibleMessages.map(message => (
                  <MessageCard key = {message.id} message = {message} />
                  ))}
                </div>
            </div>
          </div>
        )}
        {MESSAGES.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-1 bg-gray-300 hover:bg-gray-400 text-white px-4 rounded-full transition-all relative"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
      </>
          )}

          {activeTab === 'friends' && (
            <>
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
                          {friend.overall_score} Impact
                        </span>
                        <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-1 py-1 rounded-full">
                          <FaMedal className="w-4 h-4" />
                          {friend.opportunities_completed} Completed Opportunities
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          

          {activeTab === 'badges' && (
            <Badge volunteer = {volunteer}/>
          )}</>) : (<div><Badge volunteer = {volunteer}/></div>)}
          
        </div>
      </div>
      )}
    </PageTransition>

  );
};

export default VolunteerDashboard;
