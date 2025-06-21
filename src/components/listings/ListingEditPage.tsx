import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Listing, ListingPhoto } from '../../types';
import * as listingService from '../../services/listingService';
import LoadingSpinner from '../shared/LoadingSpinner';
import Button from '../shared/Button';
import { useAuth } from '../../contexts/AuthContext';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ListingEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await listingService.getListingById(id);
          if (data) {
            if (data.agentId !== user?.id) {
              setError('You do not have permission to edit this listing.');
              return;
            }
            setListing(data);
          } else {
            setError('Listing not found.');
          }
        } catch (err) {
          console.error("Failed to fetch listing details:", err);
          setError('Failed to load listing details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchListing();
    }
  }, [id, user]);

  const handleSave = async () => {
    if (!listing) return;
    setIsSaving(true);
    try {
      await listingService.updateListing(listing.id, {
        title: listing.title,
        description: listing.description,
        customDescription: listing.customDescription,
        specialFeatures: listing.specialFeatures,
        moreInformation: listing.moreInformation,
      });
      navigate(`/listings/${listing.id}`);
    } catch (err) {
      console.error("Failed to update listing:", err);
      setError('Failed to update listing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPhoto = async () => {
    if (!listing || !newPhotoUrl) return;
    try {
      const newPhoto: ListingPhoto = {
        id: `temp-${Date.now()}`,
        listingId: listing.id,
        url: newPhotoUrl,
        isPrimary: listing.photos.length === 0,
        isScraped: false,
        displayOrder: listing.photos.length,
        createdAt: new Date().toISOString(),
      };
      setListing({
        ...listing,
        photos: [...listing.photos, newPhoto],
      });
      setNewPhotoUrl('');
    } catch (err) {
      console.error("Failed to add photo:", err);
      setError('Failed to add photo. Please try again.');
    }
  };

  const handleRemovePhoto = async (photoId: string) => {
    if (!listing) return;
    try {
      await listingService.deleteListingPhoto(photoId);
      setListing({
        ...listing,
        photos: listing.photos.filter(p => p.id !== photoId),
      });
    } catch (err) {
      console.error("Failed to remove photo:", err);
      setError('Failed to remove photo. Please try again.');
    }
  };

  const handleAddFeature = () => {
    if (!listing || !newFeature) return;
    setListing({
      ...listing,
      specialFeatures: [...(listing.specialFeatures || []), newFeature],
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    if (!listing) return;
    const newFeatures = [...(listing.specialFeatures || [])];
    newFeatures.splice(index, 1);
    setListing({
      ...listing,
      specialFeatures: newFeatures,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center text-red-400 p-8">
        {error || 'Listing not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Edit Listing</h1>

        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={listing.title}
              onChange={(e) => setListing({ ...listing, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={listing.description}
              onChange={(e) => setListing({ ...listing, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Agent's Notes
            </label>
            <textarea
              value={listing.customDescription || ''}
              onChange={(e) => setListing({ ...listing, customDescription: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-gray-100"
              placeholder="Add your personal notes about the property..."
            />
          </div>

          {/* Special Features */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Special Features
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-gray-100"
                placeholder="Add a special feature..."
              />
              <Button
                variant="secondary"
                onClick={handleAddFeature}
                disabled={!newFeature}
              >
                Add
              </Button>
            </div>
            <ul className="space-y-2">
              {listing.specialFeatures?.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-slate-700 px-3 py-2 rounded-md"
                >
                  <span className="text-gray-300">{feature}</span>
                  <button
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Information */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              More Information
            </label>
            <textarea
              value={listing.moreInformation || ''}
              onChange={(e) => setListing({ ...listing, moreInformation: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-gray-100"
              placeholder="Add additional information about the property..."
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Photos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {listing.photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt="Listing photo"
                    className="w-full aspect-w-16 aspect-h-9 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-gray-100"
                placeholder="Enter photo URL..."
              />
              <Button
                variant="secondary"
                onClick={handleAddPhoto}
                disabled={!newPhotoUrl}
              >
                <PhotoIcon className="h-5 w-5 mr-2" />
                Add Photo
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate(`/listings/${listing.id}`)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingEditPage; 