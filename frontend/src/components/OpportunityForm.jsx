import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router';
import api from '../utils/api';

const defaultCenter = {
  lat: 51.5074, // London coordinates as default
  lng: -0.1278
};

const OpportunityForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location_name: '',
    latitude: null,
    longitude: null
  });
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setMarker({ lat, lng });
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    // Get address from coordinates using Geocoding service
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };
    
    try {
      const response = await geocoder.geocode({ location: latlng });
      if (response.results[0]) {
        setFormData(prev => ({
          ...prev,
          location_name: response.results[0].formatted_address
        }));
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Add debug logging
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Current user:', user);
      console.log('Form data:', formData);

      const response = await api.post('/opportunities/create/', formData);
      if (response.status === 201) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error response:', err.response?.data);
      if (err.response?.status === 403) {
        setError('You must be logged in as an organization to create opportunities');
      } else {
        setError(err.response?.data?.error || 'Failed to create opportunity');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Opportunity</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            required
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location_name"
            value={formData.location_name}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
          />
          <div className="mt-2 h-[400px] w-full">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={defaultCenter}
                zoom={13}
                onClick={handleMapClick}
              >
                {marker && <Marker position={marker} />}
              </GoogleMap>
            </LoadScript>
          </div>
          <p className="mt-2 text-sm text-gray-500">Click on the map to set the location</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Opportunity
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpportunityForm;
