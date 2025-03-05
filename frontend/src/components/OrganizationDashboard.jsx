import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';  // Update import to use configured instance
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="text-3xl text-gray-400">{icon}</div>
    </div>
  </div>
);

const OrganizationDashboard = () => {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, profileRes] = await Promise.all([
          axiosInstance.get('/api/organization/stats/'),  // Use axiosInstance instead of axios
          axiosInstance.get('/api/organization/profile/')
        ]);
        setStats(statsRes.data);
        setProfile(profileRes.data);
        setEditForm(profileRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== profile[key]) {
          formData.append(key, editForm[key]);
        }
      });

      const response = await axiosInstance.put('/api/organization/profile/', formData, {  // Use axiosInstance
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading || !stats || !profile) return <div>Loading...</div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-8">
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Organization Profile</h2>
                  <p className="text-gray-500">Manage your organization's information</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-sm font-medium rounded-full text-gray-900 border border-gray-200 hover:bg-gray-50"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Logo</label>
                    <input
                      type="file"
                      onChange={e => setEditForm({...editForm, logo: e.target.files[0]})}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {profile.logo && (
                      <img src={profile.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div>
                      <h3 className="text-xl font-medium">{profile.name}</h3>
                      <p className="text-gray-500">{profile.email}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{profile.description}</p>
                  {profile.charity_number && (
                    <p className="text-sm text-gray-500">Charity Number: {profile.charity_number}</p>
                  )}
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Opportunities" value={stats?.total_opportunities || 0} icon="📊" />
              <StatCard title="Active Opportunities" value={stats?.active_opportunities || 0} icon="✨" />
              <StatCard title="Total Applications" value={stats?.total_applications || 0} icon="📝" />
              <StatCard title="Pending Applications" value={stats?.pending_applications + stats?.request_applications|| 0} icon="⏳" />
            </div>

            {/* Recent Opportunities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Opportunities</h2>
                <Link
                  to="/create-opportunity"
                  className="px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800"
                >
                  Create New
                </Link>
              </div>
              <div className="divide-y">
                {stats?.recent_opportunities?.map(opportunity => (
                  <div key={opportunity.id} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{opportunity.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{opportunity.location_name}</p>
                        <p className="text-sm text-gray-500 mt-1">{opportunity.pending_applications + opportunity.request_applications} Pending/Requested Applications</p>
                      </div>
                      <Link
                        to={`/opportunity/${opportunity.id}/pending/`}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrganizationDashboard;
