import React, { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import api from '../utils/api';
import { useUser } from '../contexts/UserContext';
import Spin from '../components/LoadingSpinner'
import { Link } from 'react-router';

const Friends = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [FRIENDS, setFriends] = useState([]);
  const [sentRequests, setSent] = useState([]);
  const [FriendRequests, setReqs] = useState([]);
  const { user } = useUser();
  const [volunteer_id, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("friends");
  const [isOpen, setIsOpen] = useState(false);
  let user_id = 0

  function searchFriend() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let users = document.querySelectorAll(".user");

    users.forEach(user => {
        if (user.textContent.toLowerCase().includes(input)) {
            user.style.display = "block";
        } else {
            user.style.display = "none";
        }
    });
}

  const fetchUser = async () => {
    try {
      setIsLoading(true);

      if (!user) {
          console.error("User is null. Cannot fetch data.");
          return;
      }

      const response1 = await api.get('/volunteer/list/');
      const users = response1

      let possibleVolunteers = response1

      
      users.forEach(item =>{
          if (item.email === user.email){
              user_id = item.id;
              setUser(item.id);
          }
      })
      const response2 = await api.get('/volunteer/' + user_id + '/');
      setFriends(response2.friends);
      const friends = response2.friends;

      // filter so that none of your friends will show up as possible people to add
      possibleVolunteers = possibleVolunteers.filter(volunteer => !friends.some(friend => friend.id === volunteer.id))
      // filter so that the current user will not be able to add themselves
      possibleVolunteers = possibleVolunteers.filter(volunteer => volunteer.id !== user_id)

      const pendingRequestsData = await api.get('/friendship/list/pending/');
      const pendingRequests = pendingRequestsData;

      possibleVolunteers = possibleVolunteers.filter(volunteer => 
        !pendingRequests.some(req => 
          (req.from_volunteer === user_id && req.to_volunteer === volunteer.id) || 
          (req.to_volunteer === user_id && req.from_volunteer === volunteer.id)
        )
      );
// getting data for the already sent requests to allow a user to cancel them or just view them with the sentRequests variable
      const reqs = pendingRequests.filter(request => 
        request.from_volunteer === user_id && request.to_volunteer !== user_id
    );
    
      let sentRequests = []
      
      for (const req of reqs) {
        const response = await api.get('/volunteer/' + req.to_volunteer + '/');
        sentRequests.push(response);
      }
      setSent(sentRequests);

// getting data for the already sent requests to allow a user to cancel them or just view them with the sentRequests variable
      const reqst = pendingRequests.filter(request => 
        request.to_volunteer === user_id && request.from_volunteer !== user_id
    );
    
      let fRequests = []
      
      for (const req of reqst) {
        const response = await api.get('/volunteer/' + req.from_volunteer + '/');
        fRequests.push(response);
      }
      setReqs(fRequests);

      setVolunteers(possibleVolunteers);

    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
}

  useEffect(() => {
    
    if(user){
        fetchUser();
    }
    
  }, [user]);

  const deleteFriend = async (friendshipId) => {
    try {
        const response = await api.delete(`/friendship/delete/${friendshipId}/${volunteer_id}/`);

        fetchUser();

        setMessage(response.message);
        console.log(response.message)

    } catch (error) {
        console.error("Error deleting friendship:", error);
    }
};

const addFriend = async (friendshipId) => {
    try {
        // Ensure the request body is properly structured, if needed
        const response = await api.post(`/friendship/create/${friendshipId}/${volunteer_id}/`);
        fetchUser();
        setMessage(response.message);
    } catch (error) {
        console.error("Error creating friendship:", error);
    }
};
const acceptFriend = async (friendshipId) => {
    try {
        const response = await api.post(`/friendship/accept/${friendshipId}/${volunteer_id}/`, {
            headers: {
                "Content-Type": "application/json"
            },
        });

        fetchUser();

        setMessage(response.message);

    } catch (error) {
        console.error("Error creating friendship:", error);
    }
};

  return (
    <PageTransition>
            <div className="min-h-screen bg-white -mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-gray-900">Friends</h1>
                        <p className="mt-2 text-gray-600">Discover and manage friends</p>
                    </div>
                    
                    {/* Tabs Navigation */}
                    <div className="flex space-x-4 border-b pb-4 mb-6">
                        {[
                            { id: "friends", label: "Friends" },
                            { id: "friendRequests", label: "Friend Requests" },
                            { id: "sentRequests", label: "Sent Requests" },
                            { id: "search", label: "Search" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                className={`rounded-full px-4 py-2 text-lg font-medium border-b-2 ${activeTab === tab.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500"} hover:underline hover:bg-gray-100`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    {/* Tab Content */}
                    {activeTab === "friends" && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Friends</h2>
                            <div className="space-y-2">
                                {FRIENDS.map((friend) => (
                                    <div key={friend.id} className="flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                                        <span>{friend.display_name}</span>
                                        <div className="relative">
                                        <button
                                          onClick={() => setIsOpen(!isOpen)}
                                          className="px-4 py-2 bg-gray-900 text-white rounded-full"
                                        >
                                          Action
                                        </button>

                                        {isOpen && (
                                          <div className="absolute mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
                                            <button
                                              className="w-full text-left px-4 py-2 hover:bg-red-100"
                                              onClick={() => deleteFriend(friend.id)}
                                            >
                                              Remove
                                            </button>
                                            <Link
                                                to={`/dashboard/volunteer/${friend.id}/`}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                View Volunteer
                                            </Link>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "friendRequests" && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Friend Requests</h2>
                            <div className="space-y-2">
                                {FriendRequests.map((friend) => (
                                    <div key={friend.id} className="flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                                        <span>{friend.display_name}</span>
                                        <button className="px-4 py-2 text-sm font-medium rounded-full text-white bg-red-900 hover:bg-gray-800" onClick={() => deleteFriend(friend.id)}>Decline</button>
                                        <button className="px-4 py-2 text-sm font-medium rounded-full text-white bg-green-900 hover:bg-gray-800" onClick={() => acceptFriend(friend.id)}>Accept</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "sentRequests" && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Sent Requests</h2>
                            <div className="space-y-2">
                                {sentRequests.map((friend) => (
                                    <div key={friend.id} className="flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                                        <span>{friend.display_name}</span>
                                        <button className="px-4 py-2 text-sm font-medium rounded-full text-white bg-red-900 hover:bg-gray-800" onClick={() => deleteFriend(friend.id)}>Cancel</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "search" && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Search for Friends</h2>
                            <input
                                id="searchBar"
                                onKeyUp={searchFriend}
                                type="text"
                                placeholder="Search friends..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 mb-4"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isLoading ? (
                                    <Spin />
                                ) : volunteers.length === 0 ? (
                                    <div className="col-span-2 text-center py-12">
                                        <p className="text-gray-500">No volunteers found</p>
                                    </div>
                                ) : (
                                    volunteers.map((vol) => (
                                        <div className="user" key={vol.id}>
                                            <div className="bg-white rounded-xl shadow-sm hover:shadow-md">
                                                <div className="p-6">
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-2xl">👤</span>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-900">{vol.display_name}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 flex justify-between items-center">
                                                        <button onClick={() => addFriend(vol.id)} className="px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800">Add</button>
                                                        <Link
                                                            to={`/dashboard/volunteer/${vol.id}/`}
                                                            className="ml-auto inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                                                            >
                                                            View Volunteer
                                                        </Link>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
  );
};

export default Friends;