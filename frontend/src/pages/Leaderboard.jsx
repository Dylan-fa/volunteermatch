import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import api from '../utils/api';
import React, { useState, useEffect } from 'react';
import _ from "lodash";

const Leaderboard = () => {

    const [volunteers, setVolunteers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    

    useEffect(() => {
        const fetchVolunteers = async () => {
          try {
            setIsLoading(true);
            const response = await api.get('/volunteer/list/');
            const sortedData = _.orderBy(response, ["overall_score"], ["desc"]);
            setVolunteers(sortedData)


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
      {isLoading ? (
      <div className="flex justify-center items-center h-screen">
        <Spin/>
      </div>) : (
      <div className="min-h-screen bg-white-900 flex items-center justify-center p-4">
        <div className="bg-gray-700 text-white p-6 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
          <ul>
            {volunteers.map((vol, index) => (
              <li
                key={vol.id}
                className={'flex justify-between items-center p-3 rounded-lg mb-2 border'}
              >
                {index + 1}
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