import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, updateListing } from '@/services/listingService';
import { Listing } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

interface FormData {
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  description: string;
  knowledge_base: string;
}

const ListingEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
        if (data) {
          setFormData({
            title: data.title,
            address: data.address,
            price: data.price,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            square_footage: data.square_footage,
            description: data.description,
            knowledge_base: typeof data.knowledge_base === 'string' ? data.knowledge_base : JSON.stringify(data.knowledge_base || {}, null, 2),
          });
          setPhotos(data.image_urls);
        }
      } catch (err) {
        setError('Failed to fetch listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'square_footage' ? parseFloat(value) : value } : null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotoUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotoUrls]);
      // In a real app, you'd upload these files and get back URLs
    }
  };

  const handleRemovePhoto = (urlToRemove: string) => {
    setPhotos(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleSave = async () => {
    if (!id || !formData || !listing) return;
    setLoading(true);
    try {
      const updatedData: Partial<Listing> = { ...formData };
      
      // A bit of a hack for knowledge base - assuming it's JSON in the textarea
      try {
        updatedData.knowledge_base = JSON.parse(formData.knowledge_base);
      } catch (e) {
        // Keep as string if not valid JSON
        updatedData.knowledge_base = formData.knowledge_base;
      }
      
      // Here you would handle photo uploads and get back new URLs
      // For now, we just save the current list of (potentially local blob) URLs
      updatedData.image_urls = photos;

      await updateListing(id, updatedData);
      navigate(`/listings/${id}`);
    } catch (err) {
      setError('Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!listing || !formData) return <div className="text-center mt-10">Listing not found.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" value={formData.price.toString()} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" name="bedrooms" type="number" value={formData.bedrooms.toString()} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" name="bathrooms" type="number" value={formData.bathrooms.toString()} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="square_footage">Square Footage</Label>
          <Input id="square_footage" name="square_footage" type="number" value={formData.square_footage.toString()} onChange={handleInputChange} />
        </div>
      </div>

      <div className="mt-6">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={6} />
      </div>
      
      <div className="mt-6">
        <Label htmlFor="knowledge_base">Additional Info (JSON or Text)</Label>
        <Textarea id="knowledge_base" name="knowledge_base" value={formData.knowledge_base} onChange={handleInputChange} rows={8} />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Photos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {photos.map((url) => (
            <div key={url} className="relative">
              <img src={url} alt="Listing" className="w-full h-auto rounded shadow-md" />
              <Button size="sm" variant="destructive" className="absolute top-1 right-1 h-7 w-7 p-0" onClick={() => handleRemovePhoto(url)}>
                <Trash2 className="h-4 w-4"/>
              </Button>
            </div>
          ))}
        </div>
        <Label htmlFor="photos">Upload New Photos</Label>
        <Input id="photos" type="file" multiple onChange={handlePhotoUpload} />
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate(`/listings/${id}`)}>Cancel</Button>
        <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </div>
  );
};

export default ListingEditPage; 