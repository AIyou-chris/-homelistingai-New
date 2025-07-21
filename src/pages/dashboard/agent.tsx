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
      {/* Demo Mode Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-blue-400 text-2xl">🎯</div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-800 text-lg mb-2">Demo Mode Active</h3>
            <p className="text-blue-700 mb-3">
              Welcome! You're in demo mode. Explore the dashboard and see what you can do. 
              Your AI listing is ready to go live when you're ready to capture leads.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/checkout?listingId=' + (listings[0]?.id || 'demo'))}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
              >
                🚀 Go Live - $59/mo
              </button>
              <button
                onClick={() => navigate('/build-ai-listing')}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-blue-800 rounded-lg font-semibold border border-blue-300 transition-all"
              >
                + Create Another Listing
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <AgentProfileManager onProfileUpdate={handleProfileUpdate} />
      
      {/* Agent Knowledge Base Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Agent Knowledge Base</h2>
            <p className="text-sm text-gray-600">Train your AI's personality and behavior for all listings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Personality */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">AI Personality</h3>
            <p className="text-sm text-purple-700 mb-3">
              How your AI talks and represents you professionally across all listings.
            </p>
            <div className="space-y-2 text-xs text-purple-600">
              <div className="flex items-start gap-2">
                <span className="font-medium">Example:</span>
                <span>"Always be warm and professional, mention your 10+ years of experience, emphasize luxury properties"</span>
              </div>
            </div>
            <button className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
              Edit Personality
            </button>
          </div>
          
          {/* AI Behavior */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">AI Behavior</h3>
            <p className="text-sm text-blue-700 mb-3">
              What your AI should always do for every listing.
            </p>
            <div className="space-y-2 text-xs text-blue-600">
              <div className="flex items-start gap-2">
                <span className="font-medium">Example:</span>
                <span>"Always ask for contact info, mention virtual tours, offer to schedule viewings"</span>
              </div>
            </div>
            <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
              Edit Behavior
            </button>
          </div>
        </div>
        
        {/* Pro Tip */}
        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="text-purple-600 text-sm">💡</div>
            <div className="text-xs text-purple-700">
              <span className="font-medium">Pro tip:</span> You can also edit AI personality and upload documents in your dashboard anytime!
            </div>
          </div>
        </div>
        
        {/* Upload Documents */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Upload Documents</h3>
          <p className="text-sm text-green-700 mb-3">
            Upload PDFs, Word docs, or text files to enhance your AI's knowledge for all listings.
          </p>
          <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center">
            <div className="text-green-600 mb-2">
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <p className="text-sm text-green-600">Drag and drop files here, or click to browse</p>
            <p className="text-xs text-green-500 mt-1">Supports PDF, DOC, DOCX, TXT</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="flex justify-end mb-4">
          <button
            className={`px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold shadow hover:from-green-600 hover:to-blue-700 transition-all text-base`}
            onClick={() => navigate('/build-ai-listing')}
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