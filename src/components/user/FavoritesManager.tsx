import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';
import { UserFavorite, Listing } from '../../types';
import { 
  Heart, 
  Trash2, 
  Edit3, 
  Eye, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  DollarSign,
  X,
  Save,
  MessageSquare,
  Home
} from 'lucide-react';

interface FavoritesManagerProps {
  onClose?: () => void;
  onViewListing?: (listing: Listing) => void;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({ onClose, onViewListing }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    const favs = await UserService.getUserFavorites(user.id);
    setFavorites(favs);
    setLoading(false);
  };

  const removeFavorite = async (listingId: string) => {
    if (!user) return;
    
    const success = await UserService.removeFromFavorites(user.id, listingId);
    if (success) {
      setFavorites(favorites.filter(fav => fav.listing_id !== listingId));
    }
  };

  const updateNote = async (favoriteId: string, newNote: string) => {
    if (!user) return;
    
    // Update the note in the database
    const { error } = await UserService.updateFavoriteNote(favoriteId, newNote);
    if (!error) {
      setFavorites(favorites.map(fav => 
        fav.id === favoriteId ? { ...fav, notes: newNote } : fav
      ));
      setEditingNote(null);
    }
  };

  const startEditingNote = (favorite: UserFavorite) => {
    setEditingNote(favorite.id);
    setNoteText(favorite.notes || '');
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setNoteText('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatAddress = (listing: Listing) => {
    return listing.address;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
              {favorites.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">
                Start exploring properties and save your favorites to keep track of homes you love.
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex space-x-4">
                    {/* Listing Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {favorite.listing?.image_urls?.[0] ? (
                        <img
                          src={favorite.listing.image_urls[0]}
                          alt={favorite.listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Listing Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {favorite.listing?.title || 'Property Listing'}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="truncate">
                              {favorite.listing ? formatAddress(favorite.listing) : 'Address not available'}
                            </span>
                          </p>
                          
                          {/* Property Stats */}
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              {favorite.listing?.bedrooms || 0} beds
                            </span>
                            <span className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              {favorite.listing?.bathrooms || 0} baths
                            </span>
                            <span className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              {favorite.listing?.square_footage?.toLocaleString() || 0} sqft
                            </span>
                          </div>

                          {/* Price */}
                          <div className="mt-2">
                            <span className="text-lg font-bold text-gray-900">
                              {favorite.listing?.price ? formatPrice(favorite.listing.price) : 'Price not available'}
                            </span>
                          </div>

                          {/* Notes */}
                          {editingNote === favorite.id ? (
                            <div className="mt-3">
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add a note about this property..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                rows={2}
                              />
                              <div className="flex space-x-2 mt-2">
                                <button
                                  onClick={() => updateNote(favorite.id, noteText)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={cancelEditingNote}
                                  className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3">
                              {favorite.notes ? (
                                <div className="flex items-start space-x-2">
                                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-gray-700 flex-1">{favorite.notes}</p>
                                  <button
                                    onClick={() => startEditingNote(favorite)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditingNote(favorite)}
                                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Add note</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => onViewListing?.(favorite.listing!)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFavorite(favorite.listing_id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from Favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesManager; 