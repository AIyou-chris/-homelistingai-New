import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getListingsForAgent, deleteListing } from '../../services/listingService';
import { AgentProfile, Listing } from '../../types';
import AgentProfileManager from '../../components/dashboard/AgentProfileManager';
import MyListingsTable from '../../components/dashboard/MyListingsTable';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/shared/ToastContainer';

const AgentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) {
        setLoading(false);
        setError("User not found.");
        return;
      }
      try {
        setLoading(true);
        const agentListings = await getListingsForAgent(user.id);
        if (agentListings) {
          setListings(agentListings as Listing[]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch agent listings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  const handleProfileUpdate = (updatedProfile: AgentProfile) => {
    // This could be used to show a success notification, for example.
    console.log('Profile was updated in the manager:', updatedProfile);
  };

  const handleEditListing = (listing: Listing) => {
    navigate(`/dashboard/listings/${listing.id}/edit`);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteListing(listingId);
      // Refresh listings after successful deletion
      const updatedListings = await getListingsForAgent(user!.id);
      if (updatedListings) {
        setListings(updatedListings as Listing[]);
      }
      // Show success toast
      showToast({
        type: 'success',
        title: 'Listing Deleted',
        message: 'The listing has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting listing:', error);
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete listing. Please try again.',
      });
    }
  };

  const handleManageKb = (listingId: string) => {
    navigate(`/dashboard/knowledge-base/${listingId}`);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Loading...
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Remove error message for 'User not found.' */}
      {/* {error && (
        <div className={`p-4 rounded-md ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      )} */}
      
      <AgentProfileManager onProfileUpdate={handleProfileUpdate} />
      
      <div className="mt-8">
        <div className="flex justify-end mb-4">
          <button
            className={`px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold shadow hover:from-green-600 hover:to-blue-700 transition-all text-base`}
            onClick={() => navigate('/anonymous-builder')}
          >
            + Add Listing
          </button>
        </div>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Listings</h2>
        <MyListingsTable 
          listings={listings}
          onEdit={handleEditListing}
          onDelete={handleDeleteListing}
          onManageKb={handleManageKb}
        />
      </div>
    </div>
  );
};

export default AgentDashboardPage; 