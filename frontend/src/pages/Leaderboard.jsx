import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import api from '../utils/api';
import React, { useState, useEffect } from 'react';
import _ from "lodash";
import { useUser } from '../contexts/UserContext';

const Leaderboard = () => {
  const { user } = useUser();
  const [userID, setUserID] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFriendsLeaderboard, setShowFriendsLeaderboard] = useState(false);

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

  // Fetch all volunteers and sort them by overall score
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/volunteer/list/');
        const sortedData = _.orderBy(response, ["overall_score"], ["desc"]);
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
        console.log("2")
        const response = await api.get(`/volunteer/${userID}/`);
        console.log("1")
        console.log(response)
        const listOfFriends = response.friends || [];
        listOfFriends.push(response)
        const sortedFriends = _.orderBy(listOfFriends, ["overall_score"], ["desc"]);
        setFriends(sortedFriends)
      } catch (error) {
        console.log("error")
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
          <div className="bg-gray-700 text-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>

            {/* Sliding Toggle Button */}
            <div className="flex justify-center items-center mb-6">
              <div className="relative w-48 h-10 bg-gray-500 rounded-full flex items-center">
                <button
                  onClick={() => setShowFriendsLeaderboard(false)}
                  className={`w-1/2 h-full rounded-full text-center font-medium ${
                    !showFriendsLeaderboard ? 'bg-blue-500 text-white' : 'text-gray-300'
                  }`}
                >
                  Global
                </button>
                <button
                  onClick={() => setShowFriendsLeaderboard(true)}
                  className={`w-1/2 h-full rounded-full text-center font-medium ${
                    showFriendsLeaderboard ? 'bg-blue-500 text-white' : 'text-gray-300'
                  }`}
                >
                  Friends
                </button>
              </div>
            </div>

            {/* Leaderboard List */}
            <ul>
              {(showFriendsLeaderboard ? friends : volunteers).map((vol, index) => (
                <li
                  key={vol.id}
                  className="flex justify-between items-center p-3 rounded-lg mb-2 border bg-gray-600"
                >
                  <span className="font-bold">{index + 1}</span>
                  <span className="font-medium">{vol.display_name}</span>
                  <span className="font-bold">{vol.overall_score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </PageTransition>
  );
};


export default Leaderboard;