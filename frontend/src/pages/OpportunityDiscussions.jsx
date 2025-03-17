import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import PageTransition from '../components/PageTransition';
import { useUser } from '../contexts/UserContext';
import api from '../utils/api';
import { format } from 'date-fns';

const CreateDiscussion = (opportunity) => {
    function handleSubmit(){

    }

    return(
        <PageTransition>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
        
        
                <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Save Changes
                </button>
                </div>
            </form>
        </PageTransition>
    )
}


const OpportunityDiscussions = () => {
  const { id } = useParams();
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [opportunity, setOpportunity] = useState(null);
  const mapRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await api.get(`/opportunities/${id}/`, {
          withCredentials: true,
      });
        setOpportunity(response);
        initMap(response);
        console.log(response)
      } catch (error) {
        console.error('Error fetching opportunity:', error);
      }
    };
    fetchOpportunity();
  }, [id]);

  const initMap = (opportunity) => {
    if (!window.google || !mapRef.current || !opportunity.latitude || !opportunity.longitude) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: opportunity.latitude, lng: opportunity.longitude }
    });

    new window.google.maps.Marker({
      position: { lat: opportunity.latitude, lng: opportunity.longitude },
      map,
      title: opportunity.title
    });
  };

  const handleApply = async () => {
    try {
      await api.post(`/opportunities/${id}/apply/`)
      // Refresh opportunity data to update application status
      const response = await api.get(`/opportunities/${id}/`, {
        withCredentials: true,
      });
      setOpportunity(response);
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  if (!opportunity) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link to={`/opportunity/${id}`} className="text-sm text-gray-500 hover:text-gray-900">
              ← Back to {opportunity.title}
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">Discussions</h1>
                </div>
              </div>
            </div>

            {/* Application closing date */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Application closing date</h3>
                <p className="text-gray-600">{format(new Date(opportunity.end_date), 'EEEE, MMMM dd, yyyy')}</p>
            </div>
            <button
            type="button"
            onClick={() => setShowDiscussion(!showDiscussion)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
                Save Changes
            </button>

            {showDiscussion && <CreateDiscussion className='w-full' opportunity={opportunity} />}
            

          </div>
          <div ref={mapRef} className="w-full h-[300px] rounded-lg overflow-hidden" />
        </div>
      </div>
    </PageTransition>
  );
};

export default OpportunityDiscussions;
