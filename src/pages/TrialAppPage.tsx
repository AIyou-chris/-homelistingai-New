import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileListingApp from '../components/shared/MobileListingApp';
import { getListingById } from '../services/listingService';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// Default property data for when no listing is found
const defaultProperty = {
  id: 'default-123',
  title: 'Beautiful 3-Bedroom Home in Prime Location',
  address: '123 Oak Street, Springfield, IL 62701',
  price: 475000,
  bedrooms: 3,
  bathrooms: 2.5,
  squareFootage: 1850,
  description: 'Stunning 3-bedroom home in a prime location with modern amenities and beautiful landscaping. This property features an open floor plan, updated kitchen, and a spacious backyard perfect for entertaining.',
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ],
  agent: {
    name: 'Sarah Johnson',
    title: 'HomeListingAI Agent',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@homelistingai.com'
  }
};

const TrialAppPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState(defaultProperty);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (id) {
        try {
          const listing = await getListingById(id);
          if (listing) {
            // Transform listing data to match our property interface
            setProperty({
              id: listing.id,
              title: listing.title || 'Beautiful Home',
              address: listing.address || 'Address TBD',
              price: listing.price || 0,
              bedrooms: listing.bedrooms || 0,
              bathrooms: listing.bathrooms || 0,
              squareFootage: listing.square_footage || 0,
              description: listing.description || 'Beautiful home with modern amenities.',
              images: listing.images || defaultProperty.images,
              agent: {
                name: listing.agent_name || 'HomeListingAI Agent',
                title: 'HomeListingAI Agent',
                photo: listing.agent_photo || defaultProperty.agent.photo,
                phone: listing.agent_phone || '+1 (555) 123-4567',
                email: listing.agent_email || 'agent@homelistingai.com'
              }
            });
          }
        } catch (error) {
          console.error('Error fetching listing:', error);
          // Keep default property if fetch fails
        }
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  const handleChatOpen = () => {
    setShowChat(true);
  };

  const handleScheduleShowing = () => {
    // TODO: Implement scheduling functionality
    alert('Schedule showing functionality coming soon!');
  };

  const handleSaveListing = () => {
    // TODO: Implement save functionality
    alert('Save listing functionality coming soon!');
  };

  const handleContactAgent = () => {
    // TODO: Implement contact functionality
    alert('Contact agent functionality coming soon!');
  };

  const handleShareListing = () => {
    // TODO: Implement share functionality
    alert('Share listing functionality coming soon!');
  };

  const handleFeatureClick = (featureId: string) => {
    // TODO: Implement feature functionality
    const featureMessages = {
      'video-tour': 'Video tour functionality coming soon!',
      'amenities': 'Amenities list coming soon!',
      'neighborhood': 'Neighborhood information coming soon!',
      'schedule': 'Schedule showing coming soon!',
      'map': 'Interactive map coming soon!',
      'comparables': 'Comparable properties coming soon!',
      'financing': 'Financing options coming soon!',
      'history': 'Property history coming soon!',
      'virtual-tour': 'Virtual tour coming soon!',
      'reports': 'Property reports coming soon!'
    };
    
    alert(featureMessages[featureId as keyof typeof featureMessages] || 'Feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MobileListingApp
        property={property}
        onChatOpen={handleChatOpen}
        onScheduleShowing={handleScheduleShowing}
        onSaveListing={handleSaveListing}
        onContactAgent={handleContactAgent}
        onShareListing={handleShareListing}
        onFeatureClick={handleFeatureClick}
        isDemo={false}
        isPreview={false}
      />
    </div>
  );
};

export default TrialAppPage; 