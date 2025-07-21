import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, updateListing } from '@/services/listingService';
import { Listing } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Trash2, 
  Upload, 
  Star, 
  Edit3, 
  Move3D, 
  Play, 
  Image as ImageIcon,
  Video,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface PhotoItem {
  id: string;
  url: string;
  isHeroPhoto: boolean;
  caption?: string;
  sortOrder: number;
}

const ListingEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string>('');

  // Constants
  const MAX_PHOTOS = 10;
  const MAX_HERO_PHOTOS = 3;

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
          
          // Convert image_urls to PhotoItem format
          const photoItems: PhotoItem[] = (data.image_urls || []).map((url, index) => ({
            id: `photo-${index}`,
            url,
            isHeroPhoto: index < MAX_HERO_PHOTOS, // First 3 are hero photos
            caption: '',
            sortOrder: index
          }));
          setPhotos(photoItems);
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
    setFormData(prev => prev ? { 
      ...prev, 
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'square_footage' 
        ? parseFloat(value) 
        : value 
    } : null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && photos.length < MAX_PHOTOS) {
      const remainingSlots = MAX_PHOTOS - photos.length;
      const filesToProcess = Array.from(e.target.files).slice(0, remainingSlots);
      
      const newPhotoItems: PhotoItem[] = filesToProcess.map((file, index) => ({
        id: `photo-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        isHeroPhoto: false,
        caption: '',
        sortOrder: photos.length + index
      }));
      
      setPhotos(prev => [...prev, ...newPhotoItems]);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos(prev => {
      const updatedPhotos = prev.filter(photo => photo.id !== photoId);
      // Reorder and reassign hero photos
      return updatedPhotos.map((photo, index) => ({
        ...photo,
        sortOrder: index,
        isHeroPhoto: index < MAX_HERO_PHOTOS
      }));
    });
  };

  const handleToggleHeroPhoto = (photoId: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === photoId);
      if (!photo) return prev;

      const heroPhotos = prev.filter(p => p.isHeroPhoto);
      
      if (photo.isHeroPhoto) {
        // Remove from hero
        return prev.map(p => 
          p.id === photoId ? { ...p, isHeroPhoto: false } : p
        );
      } else {
        // Add to hero if under limit
        if (heroPhotos.length < MAX_HERO_PHOTOS) {
          return prev.map(p => 
            p.id === photoId ? { ...p, isHeroPhoto: true } : p
          );
        }
      }
      return prev;
    });
  };

  const handleMovePhoto = (photoId: string, direction: 'up' | 'down') => {
    setPhotos(prev => {
      const photoIndex = prev.findIndex(p => p.id === photoId);
      if (photoIndex === -1) return prev;

      const newPhotos = [...prev];
      const targetIndex = direction === 'up' ? photoIndex - 1 : photoIndex + 1;
      
      if (targetIndex >= 0 && targetIndex < newPhotos.length) {
        [newPhotos[photoIndex], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[photoIndex]];
        
        // Update sort orders and hero status
        return newPhotos.map((photo, index) => ({
          ...photo,
          sortOrder: index,
          isHeroPhoto: index < MAX_HERO_PHOTOS
        }));
      }
      
      return prev;
    });
  };

  const openPhotoModal = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
    setEditingCaption(photo.caption || '');
    setShowPhotoModal(true);
  };

  const savePhotoCaption = () => {
    if (selectedPhoto) {
      setPhotos(prev => prev.map(p => 
        p.id === selectedPhoto.id 
          ? { ...p, caption: editingCaption }
          : p
      ));
      setShowPhotoModal(false);
      setSelectedPhoto(null);
    }
  };

  const handleSave = async () => {
    if (!id || !formData || !listing) return;
    setLoading(true);
    try {
      const updatedData: Partial<Listing> = { ...formData };
      
      // Handle knowledge base
      try {
        updatedData.knowledge_base = JSON.parse(formData.knowledge_base);
      } catch (e) {
        updatedData.knowledge_base = formData.knowledge_base;
      }
      
      // Convert photos back to simple URL array, sorted by order
      const sortedPhotos = [...photos].sort((a, b) => a.sortOrder - b.sortOrder);
      updatedData.image_urls = sortedPhotos.map(p => p.url);

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

  const heroPhotos = photos.filter(p => p.isHeroPhoto).sort((a, b) => a.sortOrder - b.sortOrder);
  const galleryPhotos = photos.filter(p => !p.isHeroPhoto).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/listings/${id}`)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Property Title</Label>
                  <Input id="title" name="title" value={formData.title || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" value={formData.price?.toString() || ''} onChange={handleInputChange} />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                                  <Input id="address" name="address" value={formData.address || ''} onChange={handleInputChange} />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" name="bedrooms" type="number" value={formData.bedrooms?.toString() || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" name="bathrooms" type="number" step="0.5" value={formData.bathrooms?.toString() || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="square_footage">Square Feet</Label>
                  <Input id="square_footage" name="square_footage" type="number" value={formData.square_footage?.toString() || ''} onChange={handleInputChange} />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} rows={6} />
              </div>
              
              <div>
                <Label htmlFor="knowledge_base">Additional Information</Label>
                <Textarea id="knowledge_base" name="knowledge_base" value={formData.knowledge_base || ''} onChange={handleInputChange} rows={4} placeholder="Additional details, features, or JSON data..." />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Media Management */}
        <div className="space-y-6">
          {/* Hero Photos Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Hero Photos ({heroPhotos.length}/{MAX_HERO_PHOTOS})
              </CardTitle>
              <p className="text-sm text-gray-600">These photos will appear in the main slider</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: MAX_HERO_PHOTOS }).map((_, index) => {
                  const photo = heroPhotos[index];
                  return (
                    <div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {photo ? (
                        <div className="relative w-full h-full group">
                          <img 
                            src={photo.url} 
                            alt={`Hero ${index + 1}`} 
                            className="w-full h-full object-cover rounded-lg cursor-pointer"
                            onClick={() => openPhotoModal(photo)}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                              <Button size="sm" variant="secondary" onClick={() => openPhotoModal(photo)}>
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleToggleHeroPhoto(photo.id)}>
                                <Star className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <Star className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">Hero {index + 1}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Photo Gallery Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Photo Gallery ({photos.length}/{MAX_PHOTOS})
              </CardTitle>
              <p className="text-sm text-gray-600">Drag to reorder • Click star to make hero photo</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              {photos.length < MAX_PHOTOS && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Upload up to {MAX_PHOTOS - photos.length} more photos</p>
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.sort((a, b) => a.sortOrder - b.sortOrder).map((photo, index) => (
                  <div key={photo.id} className="relative group aspect-square">
                    <img 
                      src={photo.url} 
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-300"
                      onClick={() => openPhotoModal(photo)}
                    />
                    
                    {/* Photo Controls Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                        <Button size="sm" variant="secondary" onClick={() => openPhotoModal(photo)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={photo.isHeroPhoto ? "default" : "outline"}
                          onClick={() => handleToggleHeroPhoto(photo.id)}
                          disabled={!photo.isHeroPhoto && heroPhotos.length >= MAX_HERO_PHOTOS}
                        >
                          <Star className={`w-3 h-3 ${photo.isHeroPhoto ? 'text-yellow-300' : ''}`} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemovePhoto(photo.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Position Badge */}
                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </div>

                    {/* Hero Badge */}
                    {photo.isHeroPhoto && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Hero
                      </div>
                    )}

                    {/* Move Controls */}
                    <div className="absolute right-2 bottom-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100">
                      {index > 0 && (
                        <Button size="sm" variant="secondary" onClick={() => handleMovePhoto(photo.id, 'up')}>
                          <ChevronLeft className="w-3 h-3" />
                        </Button>
                      )}
                      {index < photos.length - 1 && (
                        <Button size="sm" variant="secondary" onClick={() => handleMovePhoto(photo.id, 'down')}>
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Video Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Property Video (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input 
                  type="url"
                  placeholder="YouTube, Vimeo, or direct video URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                {videoUrl && (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Edit Photo</h3>
              <Button variant="ghost" onClick={() => setShowPhotoModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Letterbox Image Display */}
              <div className="w-full h-96 bg-black rounded-lg flex items-center justify-center">
                <img 
                  src={selectedPhoto.url} 
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Caption Editor */}
              <div>
                <Label htmlFor="caption">Photo Caption</Label>
                <Input 
                  id="caption"
                  value={editingCaption}
                  onChange={(e) => setEditingCaption(e.target.value)}
                  placeholder="Add a caption for this photo..."
                />
              </div>
              
              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPhotoModal(false)}>
                  Cancel
                </Button>
                <Button onClick={savePhotoCaption}>
                  <Check className="w-4 h-4 mr-2" />
                  Save Caption
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingEditPage; 