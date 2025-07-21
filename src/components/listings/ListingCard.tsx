import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../../types';
import { MapPinIcon, CurrencyDollarIcon, HomeIcon, ArrowsPointingOutIcon, PencilSquareIcon, BookOpenIcon } from '@heroicons/react/24/outline'; // Changed BedIcon to HomeIcon for general purpose
import Button from '../shared/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import KnowledgeBaseModal from '../shared/KnowledgeBaseModal';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ListingCardProps {
  listing: Listing;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAiTrainingSuccess?: (listingId: string) => void;
}

const trainAI = async (listing: Listing, user: any, setTrainingLoading: (loading: boolean) => void, setTrainingError: (error: string | null) => void, onAiTrainingSuccess?: (listingId: string) => void) => {
  try {
    setTrainingLoading(true);
    setTrainingError(null);
    
    console.log('🤖 Training AI for listing:', listing.title);
    
    if (!user) {
      setTrainingError('Please log in to train AI agents.');
      return;
    }
    
    const aiConfig = {
      listing_id: listing.id,
      custom_prompt: `You are an AI real estate assistant specializing in ${listing.title}.

PROPERTY DETAILS:
- Title: ${listing.title}
- Address: ${listing.address}
- Price: $${Number(listing.price).toLocaleString()}
- Bedrooms: ${listing.bedrooms}
- Bathrooms: ${listing.bathrooms}
- Description: ${listing.description}

PERSONALITY:
- Be enthusiastic about THIS specific property 🏠
- Use emojis occasionally to make responses engaging  
- Paint vivid pictures of living in this home
- Be knowledgeable about the local area
- Act as a local expert who loves this property

LEAD GENERATION STRATEGY:
- After 3-4 exchanges, naturally suggest a viewing
- Ask qualifying questions about timeline and budget
- Always offer to connect them with the agent

ALWAYS:
- Reference specific details about THIS property
- Be enthusiastic and positive
- Suggest scheduling a viewing for interested buyers`,
      
      voice_settings: {
        voice: 'Professional Female',
        speed: 1.0,
        tone: 'friendly-professional'
      },
      
      lead_capture_settings: {
        aggressiveness: 'medium',
        qualificationQuestions: [
          'What\'s your timeline for purchasing?',
          'Are you pre-approved for a mortgage?',
          'What\'s most important to you in a home?',
          'Would you like to schedule a viewing?'
        ]
      },
      
      knowledge_base: `Property-specific information for ${listing.title}`,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      demo_expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      is_demo: true
    };
    
    // Check if AI already exists in localStorage (fallback approach)
    const existingAI = localStorage.getItem(`ai_config_${listing.id}`);
    
    if (existingAI) {
      const chatUrl = `${window.location.origin}/chat/${listing.id}`;
      setTrainingError(null);
      alert(`🤖 AI Agent already exists!\n\nChat URL: ${chatUrl}\n\n⏰ Demo expires in 30 minutes!`);
      return;
    }
    
    // Try to save to database, but fallback to localStorage if needed
    try {
      const { error } = await supabase
        .from('property_ai_configs')
        .insert([aiConfig]);
      
      if (error) {
        throw error;
      }
      
      console.log('✅ AI agent saved to database!');
    } catch (dbError) {
      console.log('⚠️  Database not available, using localStorage fallback');
      // Save to localStorage as fallback
      localStorage.setItem(`ai_config_${listing.id}`, JSON.stringify(aiConfig));
    }
    
    // Always show success message and provide chat URL
    console.log('✅ AI agent trained successfully!');
    const chatUrl = `${window.location.origin}/chat/${listing.id}`;
    
    // Call success callback if provided
    if (onAiTrainingSuccess) {
      onAiTrainingSuccess(listing.id);
    } else {
      // Fallback to alert if no callback provided
      alert(`🎉 AI Agent trained successfully!\n\n⏰ DEMO MODE: Your AI agent will self-destruct in 30 minutes!\n\nTry it here: ${chatUrl}\n\n💳 Upgrade to keep it forever: $59/month per listing`);
    }
    
    // Store the listing data for the chat interface
    localStorage.setItem(`listing_${listing.id}`, JSON.stringify(listing));
    
    // Set up auto-destruct timer
    setTimeout(() => {
      // Remove the AI config after 30 minutes
      localStorage.removeItem(`ai_config_${listing.id}`);
      console.log('💥 Demo AI agent self-destructed for listing:', listing.id);
      
      // Show upgrade reminder
      if (window.location.pathname.includes('/chat/')) {
        alert('⏰ Demo expired! Upgrade to keep your AI agent forever: $59/month per listing');
      }
    }, 30 * 60 * 1000); // 30 minutes
  } catch (error) {
    console.error('❌ Training error:', error);
    setTrainingError('Error training AI agent. Please try again.');
  } finally {
    setTrainingLoading(false);
  }
};

const ListingCard: React.FC<ListingCardProps> = ({ listing, onEdit, onDelete, onAiTrainingSuccess }) => {
  const { user } = useAuth();
  const [showKBModal, setShowKBModal] = useState(false);
  const [currentListing, setCurrentListing] = useState(listing);
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [trainingError, setTrainingError] = useState<string | null>(null);
  const [demoTimeLeft, setDemoTimeLeft] = useState<number | null>(null);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  const handleListingUpdate = (updatedListing: Listing) => {
    setCurrentListing(updatedListing);
  };

  // Check if this listing has a demo AI agent and show countdown
  useEffect(() => {
    const aiConfig = localStorage.getItem(`ai_config_${listing.id}`);
    if (aiConfig) {
      try {
        const config = JSON.parse(aiConfig);
        if (config.is_demo && config.demo_expires_at) {
          const checkTimeLeft = () => {
            const now = new Date().getTime();
            const expiresAt = new Date(config.demo_expires_at).getTime();
            const timeLeft = Math.max(0, expiresAt - now);
            
            if (timeLeft > 0) {
              setDemoTimeLeft(Math.ceil(timeLeft / 1000 / 60)); // Convert to minutes
            } else {
              setDemoTimeLeft(0);
              // Demo expired - remove the config
              localStorage.removeItem(`ai_config_${listing.id}`);
            }
          };
          
          checkTimeLeft();
          const interval = setInterval(checkTimeLeft, 60000); // Check every minute
          
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('Error parsing AI config:', error);
      }
    }
  }, [listing.id]);

  const handleTrainAI = async () => {
    // Check if user has subscription
    const hasSubscription = localStorage.getItem('user_subscription') === 'active';
    
    if (!hasSubscription) {
      // Show pricing modal before training
      const shouldProceed = window.confirm(
        '🎯 Create AI Agent Demo?\n\n' +
        'Demo: Full AI agent experience for 30 minutes\n' +
        'Pro ($59/month): Keep AI agent forever + lead capture\n\n' +
        'Start demo or upgrade now?'
      );
      
      if (shouldProceed) {
        // User chose to upgrade - redirect to checkout
        window.location.href = '/checkout';
        return;
      }
      // User chose to continue with demo version
    }
    
    await trainAI(currentListing, user, setTrainingLoading, setTrainingError, onAiTrainingSuccess);
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-sky-500/30 transform hover:-translate-y-1">
      <div className="relative h-48 sm:h-56 w-full">
        <img 
          src={listing.image_urls?.[0] || `https://via.placeholder.com/400x250/777/fff?text=${listing.title.split(' ').join('+')}`} 
          alt={listing.title} 
          className="w-full h-full object-cover object-center" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/400x250/777/fff?text=${listing.title.split(' ').join('+')}`;
          }}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded
          ${listing.status === 'active' ? 'bg-green-500' : listing.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-1 truncate" title={listing.title}>
          {listing.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 flex items-center mb-3 truncate" title={listing.address}>
          <MapPinIcon className="h-4 w-4 mr-1.5 text-sky-400 shrink-0" />
          {listing.address}
        </p>

        <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs sm:text-sm text-gray-300 mb-4">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-1.5 text-sky-400" />
            <span className="font-semibold text-lg">{formatPrice(listing.price)}</span>
          </div>
           <div className="flex items-center">
            <ArrowsPointingOutIcon className="h-5 w-5 mr-1.5 text-sky-400" />
            {listing.square_footage} sqft
          </div>
          <div className="flex items-center col-span-1">
            <HomeIcon className="h-5 w-5 mr-1.5 text-sky-400" /> {/* Using HomeIcon more broadly */}
            <div className="flex items-center text-gray-600">
              <span className="mr-2">{listing.bedrooms} bds</span>
              <span className="mr-2">|</span>
              <span className="mr-2">{listing.bathrooms} ba</span>
              <span className="mr-2">|</span>
              <span>{listing.square_footage} sqft</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-white mb-4 line-clamp-3 flex-grow">
          {listing.description}
        </p>

        <div className="mt-auto pt-3 border-t border-slate-700">
          <div className="flex flex-col gap-2">
            {/* Demo Countdown */}
            {demoTimeLeft !== null && demoTimeLeft > 0 && (
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-2 mb-2">
                <div className="flex items-center justify-center gap-2 text-orange-300 text-sm">
                  <span className="animate-pulse">⏰</span>
                  <span>Demo expires in {demoTimeLeft} min</span>
                  <button 
                    onClick={() => window.location.href = '/checkout'}
                    className="text-blue-400 hover:text-blue-300 underline text-xs"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleTrainAI} 
              variant="primary" 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto" 
              aria-label="Train AI Agent"
              disabled={trainingLoading}
            >
              {trainingLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Training...
                </>
              ) : demoTimeLeft !== null && demoTimeLeft > 0 ? (
                '🤖 Demo Active'
              ) : (
                '🤖 Train AI'
              )}
            </Button>
            {trainingError && (
              <div className="text-red-400 text-xs mt-1 p-2 bg-red-900/20 rounded border border-red-700/30">
                {trainingError}
              </div>
            )}
            <Button 
              onClick={() => setShowKBModal(true)}
              variant="secondary" 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto flex items-center gap-2" 
              aria-label="Manage Knowledge Base"
            >
              <BookOpenIcon className="h-4 w-4" />
              Manage KB
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(listing.id)} variant="secondary" size="sm" className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto flex items-center gap-2" aria-label="Edit listing">
                <PencilSquareIcon className="h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
               <Button onClick={() => onDelete(listing.id)} variant="danger" size="sm" className="bg-red-700/50 hover:bg-red-600 w-full sm:w-auto" aria-label="Delete listing">
                 Delete
               </Button>
            )}
          </div>
        </div>
      </div>

      {/* Knowledge Base Modal */}
      <KnowledgeBaseModal
        isOpen={showKBModal}
        onClose={() => setShowKBModal(false)}
        listing={currentListing}
        onUpdate={handleListingUpdate}
      />
    </div>
  );
};

export default ListingCard;
