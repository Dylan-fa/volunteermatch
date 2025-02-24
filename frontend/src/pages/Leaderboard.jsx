import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import _ from "lodash";

const Leaderboard = () => {

    const [volunteers, setVolunteers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    

    useEffect(() => {
        const fetchVolunteers = async () => {
          try {
            setIsLoading(true);
            const response = await axios.get('/api/volunteer/list/');
            const sortedData = _.orderBy(response.data, ["overall_score"], ["desc"]);
            setVolunteers(sortedData)
            console.log(sortedData)


          } catch (error) {
            console.error('Error fetching volunteers:', error);
          } finally {
            setIsLoading(false);
          }
          
        };
    
        fetchVolunteers();
      }, []);
      
      

  return (
    <PageTransition>
    <div className="min-h-screen bg-white-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
        <ul>
          {volunteers.map((vol, index) => (
            <li
              key={vol.id}
              className={'flex justify-between items-center p-3 rounded-lg mb-2'}
            >
              <span className="font-medium">{vol.display_name}</span>
              <span className="font-bold">{vol.overall_score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </PageTransition>
  );
};

export default Leaderboard;