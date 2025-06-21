import React, { useState, useEffect } from 'react';
import { Listing } from '../../types';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useNavigate } from 'react-router-dom';

interface ListingFormProps {
  onSubmit: (listingData: Omit<Listing, 'id' | 'createdAt' | 'agentId' | 'status'>) => Promise<void>;
  initialData?: Partial<Listing>; // For editing
  isLoading?: boolean;
}

const ListingForm: React.FC<ListingFormProps> = ({ onSubmit, initialData, isLoading }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [price, setPrice] = useState<string>(initialData?.price?.toString() || '');
  const [bedrooms, setBedrooms] = useState<string>(initialData?.bedrooms?.toString() || '');
  const [bathrooms, setBathrooms] = useState<string>(initialData?.bathrooms?.toString() || '');
  const [sqft, setSqft] = useState<string>(initialData?.sqft?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  // Add more fields like knowledgeBase, etc. as needed.
  // const [knowledgeBase, setKnowledgeBase] = useState(initialData?.knowledgeBase || '');


  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAddress(initialData.address || '');
      setPrice(initialData.price?.toString() || '');
      setBedrooms(initialData.bedrooms?.toString() || '');
      setBathrooms(initialData.bathrooms?.toString() || '');
      setSqft(initialData.sqft?.toString() || '');
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl || '');
      // setKnowledgeBase(initialData.knowledgeBase || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title || !address || !price || !bedrooms || !bathrooms || !sqft || !description) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    const numericPrice = parseFloat(price);
    const numericBedrooms = parseInt(bedrooms, 10);
    const numericBathrooms = parseFloat(bathrooms); // Can be .5
    const numericSqft = parseInt(sqft, 10);

    if (isNaN(numericPrice) || isNaN(numericBedrooms) || isNaN(numericBathrooms) || isNaN(numericSqft)) {
        setFormError('Price, bedrooms, bathrooms, and sqft must be valid numbers.');
        return;
    }

    try {
      await onSubmit({
        title,
        address,
        city: '', // TODO: Add city field
        state: '', // TODO: Add state field
        zipCode: '', // TODO: Add zipCode field
        propertyType: 'Single Family', // TODO: Add propertyType field
        price: numericPrice,
        bedrooms: numericBedrooms,
        bathrooms: numericBathrooms,
        sqft: numericSqft,
        description,
        imageUrl,
        updatedAt: new Date().toISOString(),
        photos: [],
        // knowledgeBase,
      });
      // Optionally, redirect or show success message handled by parent
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError((error as Error).message || 'Failed to save listing.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
      {formError && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm mb-4">{formError}</p>}
      
      <Input
        label="Listing Title"
        name="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Modern Downtown Condo"
        required
      />
      <Input
        label="Address"
        name="address"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="e.g., 123 Main St, Anytown, USA"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Price (USD)"
          name="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g., 500000"
          required
          min="0"
        />
        <Input
          label="Square Footage (sqft)"
          name="sqft"
          type="number"
          value={sqft}
          onChange={(e) => setSqft(e.target.value)}
          placeholder="e.g., 1500"
          required
          min="0"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Bedrooms"
          name="bedrooms"
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          placeholder="e.g., 3"
          required
          min="0"
        />
        <Input
          label="Bathrooms"
          name="bathrooms"
          type="number"
          step="0.5"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          placeholder="e.g., 2.5"
          required
          min="0"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-100"
          placeholder="Detailed description of the property..."
          required
        />
      </div>
      <Input
        label="Image URL"
        name="imageUrl"
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="https://example.com/image.jpg (Optional)"
      />
       {/* 
      <div>
        <label htmlFor="knowledgeBase" className="block text-sm font-medium text-gray-300 mb-1">
          Per-Listing Knowledge Base (for AI)
        </label>
        <textarea
          id="knowledgeBase"
          name="knowledgeBase"
          rows={3}
          value={knowledgeBase}
          onChange={(e) => setKnowledgeBase(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-100"
          placeholder="Enter specific details for the AI to use regarding this listing (e.g., HOA fees, recent upgrades, showing instructions)."
        />
      </div>
      */}

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-700">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full sm:w-auto">
          {isLoading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Listing')}
        </Button>
      </div>
    </form>
  );
};

export default ListingForm;
