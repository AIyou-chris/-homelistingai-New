import React, { useState, useEffect } from 'react';
import { Listing, PropertyType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

interface ListingFormProps {
  onSubmit: (listing: Omit<Listing, 'id' | 'created_at' | 'agent_id' | 'status'>) => void;
  initialData?: Partial<Listing>;
  isLoading?: boolean;
}

const ListingForm: React.FC<ListingFormProps> = ({ onSubmit, initialData = {}, isLoading }) => {
  const [listing, setListing] = useState<Partial<Listing>>({
    title: '',
    description: '',
    price: 0,
    address: '',
    bedrooms: 0,
    bathrooms: 0,
    square_footage: 0,
    property_type: PropertyType.SINGLE_FAMILY,
    image_urls: [],
    ...initialData,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setListing(prev => ({
        ...prev,
        title: initialData.title || '',
        address: initialData.address || '',
        price: initialData.price || 0,
        bedrooms: initialData.bedrooms || 0,
        bathrooms: initialData.bathrooms || 0,
        square_footage: initialData.square_footage || 0,
        description: initialData.description || '',
        property_type: initialData.property_type || PropertyType.SINGLE_FAMILY,
        image_urls: initialData.image_urls || [],
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setListing(prev => ({
      ...prev,
      [name]: ['price', 'bedrooms', 'bathrooms', 'square_footage'].includes(name) ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!listing.title || !listing.address || !listing.price || !listing.bedrooms || !listing.bathrooms || !listing.square_footage || !listing.description) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    if (isNaN(listing.price) || isNaN(listing.bedrooms) || isNaN(listing.bathrooms) || isNaN(listing.square_footage)) {
        setFormError('Price, bedrooms, bathrooms, and square_footage must be valid numbers.');
        return;
    }

    try {
      await onSubmit(listing as Omit<Listing, 'id' | 'created_at' | 'agent_id' | 'status'>);
      // Optionally, redirect or show success message handled by parent
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError((error as Error).message || 'Failed to save listing.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm mb-4">{formError}</p>}
      
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={listing.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={listing.address || ''} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" value={listing.price} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="square_footage">Square Footage</Label>
          <Input id="square_footage" name="square_footage" type="number" value={listing.square_footage} onChange={handleChange} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" name="bedrooms" type="number" value={listing.bedrooms} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" name="bathrooms" type="number" value={listing.bathrooms} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="property_type">Property Type</Label>
        <select
          id="property_type"
          name="property_type"
          value={listing.property_type}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {Object.values(PropertyType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={listing.description || ''} onChange={handleChange} rows={4} />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-700">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="default" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Listing')}
        </Button>
      </div>
    </form>
  );
};

export default ListingForm;
