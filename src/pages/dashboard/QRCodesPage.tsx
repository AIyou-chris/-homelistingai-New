import React, { useState, useEffect } from 'react';
import { 
  QrCodeIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ShareIcon,
  ChartBarIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import ImageWithFallback from '../../components/ImageWithFallback';
import { useAuth } from '../../contexts/AuthContext';
import * as listingService from '../../services/listingService';
import { Listing } from '../../types';

interface QRCode {
  id: string;
  name: string;
  propertyId?: string;
  propertyName?: string;
  qrCodeUrl: string;
  targetUrl: string;
  scanCount: number;
  uniqueScans: number;
  createdAt: string;
  lastScanned?: string;
  status: 'active' | 'inactive';
  notes?: string;
}

interface QRScan {
  id: string;
  qrCodeId: string;
  timestamp: string;
  location?: string;
  device?: string;
  userAgent?: string;
  ipAddress?: string;
}

const QRCodesPage: React.FC = () => {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [filteredQRCodes, setFilteredQRCodes] = useState<QRCode[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);

  useEffect(() => {
    loadQRCodes();
    loadListings();
  }, []);

  useEffect(() => {
    filterQRCodes();
  }, [qrCodes, searchTerm, statusFilter]);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      
      // Check if we're on demo dashboard
      const isDemo = window.location.pathname.startsWith('/demo-dashboard') || window.location.hash.startsWith('#/demo-dashboard');
      
      if (isDemo) {
        // Add demo QR codes for demo dashboard
        const demoQRCodes: QRCode[] = [
          {
            id: 'qr-1',
            name: 'Oak Street Property QR',
            propertyId: 'demo-listing-1',
            propertyName: '123 Oak Street - Beautiful 3BR Home',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.homelistingai.com/#/chat/demo-listing-1',
            targetUrl: 'https://www.homelistingai.com/#/chat/demo-listing-1',
            scanCount: 47,
            uniqueScans: 32,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastScanned: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            notes: 'QR code for Oak Street property - leads to AI chat'
          },
          {
            id: 'qr-2',
            name: 'Maple Avenue Luxury Home',
            propertyId: 'demo-listing-2',
            propertyName: '456 Maple Avenue - Luxury 4BR Home',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.homelistingai.com/#/chat/demo-listing-2',
            targetUrl: 'https://www.homelistingai.com/#/chat/demo-listing-2',
            scanCount: 23,
            uniqueScans: 18,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            lastScanned: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            notes: 'QR code for Maple Avenue luxury home'
          },
          {
            id: 'qr-3',
            name: 'Pine Street Condo',
            propertyId: 'demo-listing-3',
            propertyName: '789 Pine Street - Cozy 2BR Condo',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.homelistingai.com/#/chat/demo-listing-3',
            targetUrl: 'https://www.homelistingai.com/#/chat/demo-listing-3',
            scanCount: 15,
            uniqueScans: 12,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            lastScanned: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            notes: 'QR code for downtown condo'
          },
          {
            id: 'qr-4',
            name: 'Contact Information QR',
            propertyId: undefined,
            propertyName: undefined,
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.homelistingai.com/#/contact',
            targetUrl: 'https://www.homelistingai.com/#/contact',
            scanCount: 89,
            uniqueScans: 67,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            lastScanned: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            notes: 'General contact QR code for business cards'
          },
          {
            id: 'qr-5',
            name: 'Willow Way Cottage',
            propertyId: 'demo-listing-6',
            propertyName: '3030 Willow Way - Charming 3BR Cottage',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.homelistingai.com/#/chat/demo-listing-6',
            targetUrl: 'https://www.homelistingai.com/#/chat/demo-listing-6',
            scanCount: 8,
            uniqueScans: 6,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            lastScanned: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            status: 'inactive',
            notes: 'QR code for Willow Way cottage - currently inactive'
          }
        ];
        setQrCodes(demoQRCodes);
      } else {
        // For regular dashboard, start with empty array
        setQrCodes([]);
      }
    } catch (error) {
      console.error('Error loading QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadListings = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingListings(true);
      const userListings = await listingService.getListingsForAgent(user.id);
      setListings(userListings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      setListings([]);
    } finally {
      setLoadingListings(false);
    }
  };

  const filterQRCodes = () => {
    let filtered = qrCodes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(qr =>
        qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.propertyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(qr => qr.status === statusFilter);
    }

    setFilteredQRCodes(filtered);
  };

  const generateQRCode = (data: { name: string; targetUrl: string; propertyId?: string; notes?: string }) => {
    const newQR: QRCode = {
      id: `qr-${Date.now()}`,
      name: data.name,
      propertyId: data.propertyId,
      propertyName: data.propertyId ? 'Selected Property' : undefined,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.targetUrl)}`,
      targetUrl: data.targetUrl,
      scanCount: 0,
      uniqueScans: 0,
      createdAt: new Date().toISOString(),
      status: 'active',
      notes: data.notes || '',
    };

    setQrCodes(prev => [newQR, ...prev]);
    setShowGenerateModal(false);
  };

  const downloadQRCode = (qrCode: QRCode) => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    link.href = qrCode.qrCodeUrl;
    link.download = `${qrCode.name}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteQRCode = (id: string) => {
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      setQrCodes(prev => prev.filter(qr => qr.id !== id));
    }
  };

  const toggleQRStatus = (id: string) => {
    setQrCodes(prev => prev.map(qr => 
      qr.id === id 
        ? { ...qr, status: qr.status === 'active' ? 'inactive' : 'active' }
        : qr
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          <QrCodeIcon className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">QR Code Manager</h1>
            <p className="text-blue-100 text-lg">Create and manage QR codes for your listings and contact information</p>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search QR codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <Button
            onClick={() => setShowGenerateModal(true)}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Generate QR Code
          </Button>
        </div>
      </div>

      {/* QR Codes Grid */}
      {filteredQRCodes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
          <QrCodeIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No QR Codes Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create QR codes for your listings to make it easy for potential buyers to access property information and contact you.
          </p>
          <Button
            onClick={() => setShowGenerateModal(true)}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 mx-auto"
          >
            <PlusIcon className="w-5 h-5" />
            Create Your First QR Code
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQRCodes.map((qrCode) => (
            <div key={qrCode.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* QR Code Header */}
              <div className={`p-4 ${qrCode.status === 'active' ? 'bg-gradient-to-r from-green-500 to-blue-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'} text-white`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg truncate">{qrCode.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    qrCode.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {qrCode.status}
                  </div>
                </div>
                {qrCode.propertyName && (
                  <p className="text-sm opacity-90 mt-1">{qrCode.propertyName}</p>
                )}
              </div>

              {/* QR Code Image */}
              <div className="p-6 text-center bg-gray-50">
                                 <ImageWithFallback
                   src={qrCode.qrCodeUrl}
                   alt={`QR Code for ${qrCode.name}`}
                   className="w-32 h-32 mx-auto border border-gray-200 rounded-lg"
                   fallbackSrc="/listing.png"
                 />
              </div>

              {/* Stats */}
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{qrCode.scanCount}</div>
                    <div className="text-xs text-gray-500">Total Scans</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{qrCode.uniqueScans}</div>
                    <div className="text-xs text-gray-500">Unique Scans</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 flex gap-2">
                <Button
                  onClick={() => downloadQRCode(qrCode)}
                  size="sm"
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  onClick={() => toggleQRStatus(qrCode.id)}
                  size="sm"
                  className={`flex-1 ${qrCode.status === 'active' 
                    ? 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200' 
                    : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                  }`}
                >
                  {qrCode.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  onClick={() => deleteQRCode(qrCode.id)}
                  size="sm"
                  className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

             {/* Generate QR Code Modal */}
       {showGenerateModal && (
         <QRGenerateModal
           onClose={() => setShowGenerateModal(false)}
           onGenerate={generateQRCode}
           listings={listings}
           loadingListings={loadingListings}
         />
       )}

      {/* View QR Details Modal */}
      {selectedQR && (
        <QRDetailsModal
          qrCode={selectedQR}
          onClose={() => setSelectedQR(null)}
        />
      )}
    </div>
  );
};

// QR Generate Modal Component
interface QRGenerateModalProps {
  onClose: () => void;
  onGenerate: (data: { name: string; targetUrl: string; propertyId?: string; notes?: string }) => void;
  listings: Listing[];
  loadingListings: boolean;
}

const QRGenerateModal: React.FC<QRGenerateModalProps> = ({ onClose, onGenerate, listings, loadingListings }) => {
  const [qrType, setQrType] = useState<'listing' | 'manual'>('listing');
  const [selectedListingId, setSelectedListingId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    targetUrl: '',
    propertyId: '',
    notes: ''
  });

  // Auto-populate form when listing is selected
  useEffect(() => {
    if (qrType === 'listing' && selectedListingId) {
      const listing = listings.find(l => l.id === selectedListingId);
      if (listing) {
        setFormData({
          name: `${listing.title} QR Code`,
          targetUrl: `${window.location.origin}/#/chat/${listing.id}`,
          propertyId: listing.id,
          notes: `QR code for ${listing.title} - leads to AI chat for this property`
        });
      }
    } else if (qrType === 'manual') {
      setFormData({
        name: '',
        targetUrl: '',
        propertyId: '',
        notes: ''
      });
    }
  }, [qrType, selectedListingId, listings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.targetUrl) {
      onGenerate(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlusIcon className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">Generate QR Code</h3>
                <p className="text-green-100">Create a new QR code for your listing or contact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* QR Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">QR Code Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setQrType('listing')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  qrType === 'listing'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <HomeIcon className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Property Listing</div>
                <div className="text-xs mt-1">Select from your listings</div>
              </button>
              <button
                type="button"
                onClick={() => setQrType('manual')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  qrType === 'manual'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <QrCodeIcon className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Manual Entry</div>
                <div className="text-xs mt-1">Enter custom URL</div>
              </button>
            </div>
          </div>

          {/* Listing Selection (when listing type is selected) */}
          {qrType === 'listing' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Property</label>
              {loadingListings ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                  <HomeIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No listings found. Create a listing first!</p>
                </div>
              ) : (
                <select
                  value={selectedListingId}
                  onChange={(e) => setSelectedListingId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required={qrType === 'listing'}
                >
                  <option value="">Choose a property...</option>
                  {listings.map((listing) => (
                    <option key={listing.id} value={listing.id}>
                      {listing.title} - ${listing.price?.toLocaleString()}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={qrType === 'listing' ? 'Auto-filled from selected listing' : 'e.g., Contact Info QR'}
              required
              className="w-full"
              disabled={qrType === 'listing' && !selectedListingId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target URL</label>
            <Input
              type="url"
              value={formData.targetUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
              placeholder={qrType === 'listing' ? 'Auto-filled with AI chat link' : 'https://example.com/your-page'}
              required
              className="w-full"
              disabled={qrType === 'listing' && !selectedListingId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes about this QR code..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-xl"
            >
              Generate QR Code
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// QR Details Modal Component (placeholder for future implementation)
interface QRDetailsModalProps {
  qrCode: QRCode;
  onClose: () => void;
}

const QRDetailsModal: React.FC<QRDetailsModalProps> = ({ qrCode, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Implementation for QR details view */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">QR Code Details</h3>
          <p>Details for {qrCode.name} coming soon...</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodesPage; 