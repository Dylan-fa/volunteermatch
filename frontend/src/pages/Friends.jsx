import React, { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import Cookies from 'js-cookie';
import Spin from '../components/LoadingSpinner'

const Friends = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [FRIENDS, setFriends] = useState([]);
  const [sentRequests, setSent] = useState([]);
  const [FriendRequests, setReqs] = useState([]);
  const { user } = useUser();
  const [volunteer_id, setUser] = useState(null);
  const [message, setMessage] = useState(null);
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

      const response1 = await axios.get('/api/volunteer/list/');
      const users = response1.data

      let possibleVolunteers = response1.data

      
      users.forEach(item =>{
          if (item.email === user.email){
              user_id = item.id;
              setUser(item.id);
          }
      })
      const response2 = await axios.get('/api/volunteer/' + user_id + '/');
      setFriends(response2.data.friends);
      const friends = response2.data.friends;

      // filter so that none of your friends will show up as possible people to add
      possibleVolunteers = possibleVolunteers.filter(volunteer => !friends.some(friend => friend.id === volunteer.id))
      // filter so that the current user will not be able to add themselves
      possibleVolunteers = possibleVolunteers.filter(volunteer => volunteer.id !== user_id)

      const pendingRequestsData = await axios.get('/api/friendship/list/pending/');
      const pendingRequests = pendingRequestsData.data;

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
        const response = await axios.get('/api/volunteer/' + req.to_volunteer + '/');
        sentRequests.push(response.data);
      }
      setSent(sentRequests);

// getting data for the already sent requests to allow a user to cancel them or just view them with the sentRequests variable
      const reqst = pendingRequests.filter(request => 
        request.to_volunteer === user_id && request.from_volunteer !== user_id
    );
    
      let fRequests = []
      
      for (const req of reqst) {
        const response = await axios.get('/api/volunteer/' + req.from_volunteer + '/');
        fRequests.push(response.data);
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
        const csrfToken = Cookies.get('csrftoken');
        const response = await axios.delete(`/api/friendship/delete/${friendshipId}/${volunteer_id}/`, {
            headers: {
                "X-CSRFToken": csrfToken
            },
            withCredentials: true
        });

        fetchUser();

        setMessage(response.data.message);
        console.log(response.data.message)

    } catch (error) {
        console.error("Error deleting friendship:", error);
    }
};

const addFriend = async (friendshipId) => {
    try {
        const csrfToken = Cookies.get('csrftoken');
        // Ensure the request body is properly structured, if needed
        const response = await axios.post(`/api/friendship/create/${friendshipId}/${volunteer_id}/`, {}, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            }
        });

        fetchUser();
        setMessage(response.data.message);
    } catch (error) {
        console.error("Error creating friendship:", error);
    }
};
const acceptFriend = async (friendshipId) => {
    try {
        const response = await axios.post(`/api/friendship/accept/${friendshipId}/${volunteer_id}/`, {
            headers: {
                "Content-Type": "application/json"
            },
        });

        fetchUser();

        setMessage(response.data.message);

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
          {message && <p className="fixed-top text-center" role="alert">{message}</p>}
            <h1 className="text-3xl font-semibold text-gray-900">Friends</h1>
            <p className="mt-2 text-gray-600">Discover and manage friends</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Friends accepted Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4"> Your Friends</h2>
                  <div className="space-y-2">
                    {FRIENDS.map(friend => (
                      <div
                        key={friend.id}
                        className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span>{friend.display_name}</span>
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-red-900 hover:bg-gray-800 transition-colors" onClick={() => deleteFriend(friend.id)}>Remove</button>
                        
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Requests sent Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4"> Sent Requests</h2>
                  <div className="space-y-2">
                    {sentRequests.map(friend => (
                      <div
                        key={friend.id}
                        className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span>{friend.display_name}</span>
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-red-900 hover:bg-gray-800 transition-colors" onClick={() => deleteFriend(friend.id)}>Cancel</button>
                        
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Friend Requests Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4"> Friend Requests</h2>
                  <div className="space-y-2">
                    {FriendRequests.map(friend => (
                      <div
                        key={friend.id}
                        className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span>{friend.display_name}</span>
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-red-900 hover:bg-gray-800 transition-colors" onClick={() => deleteFriend(friend.id)}>Decline</button>
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-green-900 hover:bg-gray-800 transition-colors" onClick={() => acceptFriend(friend.id)}>Accept</button>
                        
                      </div>
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
                    id="searchBar"
                    onKeyUp={searchFriend}
                    type="text"
                    placeholder="Search friends..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div className="flex gap-4">
                </div>
              </div>

              {/* Friends Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  <Spin/>
                ) : volunteers.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500">No volunteers found</p>
                  </div>
                ) : (
                  volunteers.map(vol => (
                    <div className='user' key = {vol.id}>
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                {/* Header section */}
                                <div className="flex flex-col gap-4">
                                {/* Friend Name */}
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{'👤'}</span>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {vol.display_name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                                
                                {/* Score */}
                                <p className="mt-4 text-gray-600">
                                    {vol.overall_score}
                                </p>
                                
                                {/* Add Friend Button */}
                                <div className="mt-6 flex justify-between items-center">
                                    <button onClick={() => addFriend(vol.id)} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors" >Add</button>
                                </div>
                            </div>
                        </div>
                    </div>

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

export default Friends;