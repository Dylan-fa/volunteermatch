import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import api from '../utils/api';
import React, { useState, useEffect } from 'react';
import _ from "lodash";
import { useUser } from '../contexts/UserContext';
import { motion } from 'framer-motion';
import {Link} from 'react-router'

const Leaderboard = () => {
  const { user } = useUser();
  const [userID, setUserID] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFriendsLeaderboard, setShowFriendsLeaderboard] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({});

  const toggleDropdown = (id) => {
    setDropdownStates((prev) => ({
      [id]: !prev[id],
    }));
  };

  // Fetch userID based on the logged-in user's email
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        if (!user) return; // Wait for user data

        const response = await api.get('/volunteer/list/');
        const users = response;

        const matchedUser = users.find(volunteer => volunteer.email === user.email);
        if (matchedUser) {
          setUserID(matchedUser.id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserID();
  }, [user]);

  const addFriend = async (friendshipId, index) => {
    try {
        await api.post(`/friendship/create/${friendshipId}/${userID}/`);
        toggleDropdown(index);
    } catch (error) {
        console.error("Error creating friendship:", error);
    }
};

  // Fetch all volunteers and sort them by overall score
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/volunteer/list/');
        const sortedData = _.orderBy(response, ["overall_score"], ["desc"]).slice(0,50);
        setVolunteers(sortedData);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Fetch friends leaderboard once userID is available
  useEffect(() => {
    if (!userID) return;

    const fetchFriends = async () => {
      try {
        const response = await api.get(`/volunteer/${userID}/`);
        const listOfFriends = response.friends || [];
        listOfFriends.push(response)
        const sortedFriends = _.orderBy(listOfFriends, ["overall_score"], ["desc"]);
        setFriends(sortedFriends)
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [userID]);


  return (
    <PageTransition>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="bg-gray-700 min-h-screen text-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>

            {friends.length > 0 ? (
              <div className="flex justify-center items-center mb-6">
                <div className="relative w-48 h-10 bg-gray-500 rounded-full flex items-center">
                <div
                  className={`absolute top-0 left-0 w-1/2 h-full bg-blue-500 rounded-full transition-transform duration-300`}
                  style={{ transform: showFriendsLeaderboard ? "translateX(100%)" : "translateX(0%)" }}
                ></div>
                  <button
                    onClick={() => setShowFriendsLeaderboard(false)}
                    className={`relative z-10 w-1/2 h-full rounded-full text-center font-medium ${
                      !showFriendsLeaderboard ? ' text-white' : 'text-gray-300'
                    }`}
                  >
                    Global
                  </button>
                  <button
                    onClick={() => setShowFriendsLeaderboard(true)}
                    className={`relative z-10 w-1/2 h-full rounded-full text-center font-medium ${
                      showFriendsLeaderboard ? ' text-white' : 'text-gray-300'
                    }`}
                  >
                    Friends
                  </button>
                </div>
              </div>
            ) : null}
            

            {/* Leaderboard List */}
            <ul>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
              {(showFriendsLeaderboard ? friends : volunteers).map((vol, index) => (
                <li
                  key={vol.id}
                  className="flex justify-between items-center p-3 rounded-lg mb-2 border bg-gray-600"
                >
                  <span className="font-bold">{index + 1}</span>
                  <span className="font-medium">{vol.display_name}</span>
                  <span className="font-bold">{vol.overall_score}</span>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="p-2 rounded-full hover:bg-gray-500 transition"
                    >
                      &#x22EE; {/* Vertical 3-dot icon */}
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownStates[index] && (
                      <div className="absolute z-10 right-0 mt-2 w-32 bg-black shadow-md rounded-lg">
                        {user?.is_volunteer ? (<button
                          onClick={() => addFriend(vol.id, index)}
                          className="block rounded-lg w-full z-10 text-left px-4 py-2 hover:bg-gray-200"
                        >
                          Add Friend
                        </button>) : ""}
                        
                        <Link
                          to={`/dashboard/volunteer/${vol.id}/`}
                          className="block rounded-lg w-full z-10 text-left px-4 py-2 hover:bg-gray-200"
                          >
                          View Profile
                      </Link>
                    </div>
                    )}</div></li>
              ))}
              </motion.h2>
            </ul>
          </div>
        </div>
      )}
    </PageTransition>
  );
};


export default Leaderboard;