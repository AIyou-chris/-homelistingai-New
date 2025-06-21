import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getListingsForAgent } from '../../services/listingService';
import { AgentProfile, Listing } from '../../types';
import AgentProfileManager from '../../components/dashboard/AgentProfileManager';
import MyListingsTable from '../../components/dashboard/MyListingsTable';
import { useNavigate } from 'react-router-dom';

const AgentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const handleDeleteListing = (listingId: string) => {
    console.log('Deleting listing:', listingId);
    // TODO: Call service to delete and then refresh list
  };

  const handleManageKb = (listingId: string) => {
    navigate(`/dashboard/knowledge-base/${listingId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agent Dashboard</h1>
      {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
      
      <AgentProfileManager onProfileUpdate={handleProfileUpdate} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Listings</h2>
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