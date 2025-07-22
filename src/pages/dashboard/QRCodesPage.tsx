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
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

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
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [filteredQRCodes, setFilteredQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);

  useEffect(() => {
    loadQRCodes();
  }, []);

  useEffect(() => {
    filterQRCodes();
  }, [qrCodes, searchTerm, statusFilter]);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockQRCodes: QRCode[] = [
        {
          id: '1',
          name: '123 Main Street QR',
          propertyId: 'prop-1',
          propertyName: '123 Main Street, Austin, TX',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://homelistingai.com/listings/123-main-street',
          targetUrl: 'https://homelistingai.com/listings/123-main-street',
          scanCount: 45,
          uniqueScans: 38,
          createdAt: '2024-01-15',
          lastScanned: '2024-01-19T14:30:00Z',
          status: 'active'
        },
        {
          id: '2',
          name: '456 Oak Avenue QR',
          propertyId: 'prop-2',
          propertyName: '456 Oak Avenue, Austin, TX',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://homelistingai.com/listings/456-oak-avenue',
          targetUrl: 'https://homelistingai.com/listings/456-oak-avenue',
          scanCount: 23,
          uniqueScans: 20,
          createdAt: '2024-01-16',
          lastScanned: '2024-01-18T09:15:00Z',
          status: 'active'
        },
        {
          id: '3',
          name: 'General Contact QR',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://homelistingai.com/contact',
          targetUrl: 'https://homelistingai.com/contact',
          scanCount: 12,
          uniqueScans: 10,
          createdAt: '2024-01-17',
          status: 'inactive'
        },
        {
          id: '4',
          name: '789 Pine Drive QR',
          propertyId: 'prop-3',
          propertyName: '789 Pine Drive, Austin, TX',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://homelistingai.com/listings/789-pine-drive',
          targetUrl: 'https://homelistingai.com/listings/789-pine-drive',
          scanCount: 67,
          uniqueScans: 52,
          createdAt: '2024-01-20',
          lastScanned: '2024-01-21T16:45:00Z',
          status: 'active'
        },
        {
          id: '5',
          name: '321 Elm Street QR',
          propertyId: 'prop-4',
          propertyName: '321 Elm Street, Austin, TX',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://homelistingai.com/listings/321-elm-street',
          targetUrl: 'https://homelistingai.com/listings/321-elm-street',
          scanCount: 34,
          uniqueScans: 28,
          createdAt: '2024-01-22',
          lastScanned: '2024-01-23T11:20:00Z',
          status: 'active'
        },
        {
          id: '6',
          name: '555 Luxury Lane QR',
          propertyId: 'prop-5',
          propertyName: '555 Luxury Lane, Austin, TX',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://homelistingai.com/listings/555-luxury-lane',
          targetUrl: 'https://homelistingai.com/listings/555-luxury-lane',
          scanCount: 89,
          uniqueScans: 71,
          createdAt: '2024-01-25',
          lastScanned: '2024-01-26T13:10:00Z',
          status: 'active'
        }
      ];
      setQrCodes(mockQRCodes);
    } catch (error) {
      console.error('Error loading QR codes:', error);
    } finally {
      setLoading(false);
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

  const generateQRCode = (data: { name: string; targetUrl: string; propertyId?: string }) => {
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
      status: 'active'
    };

    setQrCodes(prev => [newQR, ...prev]);
    setShowGenerateModal(false);
  };

  const downloadQRCode = (qrCode: QRCode) => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    link.href = qrCode.qrCodeUrl;
    link.download = `${qrCode.name.replace(/\s+/g, '-')}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQRCode = (qrCode: QRCode) => {
    if (navigator.share) {
      navigator.share({
        title: qrCode.name,
        text: `Check out this property: ${qrCode.propertyName || qrCode.name}`,
        url: qrCode.targetUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrCode.targetUrl);
      alert('Link copied to clipboard!');
    }
  };

  const getConversionRate = (qrCode: QRCode) => {
    if (qrCode.scanCount === 0) return 0;
    return Math.round((qrCode.uniqueScans / qrCode.scanCount) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">QR Code Management</h1>
          <p className="mt-1 text-sm text-gray-300">
            Generate, track, and analyze QR codes for your properties
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            variant="primary" 
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setShowGenerateModal(true)}
          >
            Generate QR Code
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <QrCodeIcon className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total QR Codes</p>
              <p className="text-2xl font-bold text-white">{qrCodes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DevicePhoneMobileIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Scans</p>
              <p className="text-2xl font-bold text-white">
                {qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Unique Scans</p>
              <p className="text-2xl font-bold text-white">
                {qrCodes.reduce((sum, qr) => sum + qr.uniqueScans, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Active QR Codes</p>
              <p className="text-2xl font-bold text-white">
                {qrCodes.filter(qr => qr.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* QR Codes Grid */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Your QR Codes</h3>
          <p className="text-sm text-gray-400">
            {filteredQRCodes.length} of {qrCodes.length} QR codes
          </p>
        </div>

        {filteredQRCodes.length === 0 ? (
          <div className="text-center py-12">
            <QrCodeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No QR codes found</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Generate your first QR code to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQRCodes.map((qrCode) => (
              <div key={qrCode.id} className="border border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white">{qrCode.name}</h4>
                    {qrCode.propertyName && (
                      <p className="text-sm text-blue-400 mt-1">{qrCode.propertyName}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Created {new Date(qrCode.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    qrCode.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {qrCode.status}
                  </span>
                </div>

                {/* QR Code Image */}
                <div className="text-center mb-4">
                  <img 
                    src={qrCode.qrCodeUrl} 
                    alt={qrCode.name}
                    className="mx-auto h-32 w-32 border border-gray-600 rounded bg-white"
                  />
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{qrCode.scanCount}</div>
                    <div className="text-xs text-gray-400">Total Scans</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{qrCode.uniqueScans}</div>
                    <div className="text-xs text-gray-400">Unique</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{getConversionRate(qrCode)}%</div>
                    <div className="text-xs text-gray-400">Rate</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-300"
                      onClick={() => downloadQRCode(qrCode)}
                      title="Download QR Code"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-300"
                      onClick={() => shareQRCode(qrCode)}
                      title="Share QR Code"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-400"
                      onClick={() => setSelectedQR(qrCode)}
                      title="View Analytics"
                    >
                      <ChartBarIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    className="p-2 text-gray-400 hover:text-red-400"
                    title="Delete QR Code"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Last Scanned */}
                {qrCode.lastScanned && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-xs text-gray-400">
                      Last scanned: {new Date(qrCode.lastScanned).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate QR Code Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generate QR Code</h3>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                generateQRCode({
                  name: formData.get('name') as string,
                  targetUrl: formData.get('targetUrl') as string,
                  propertyId: formData.get('propertyId') as string || undefined
                });
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">QR Code Name</label>
                  <Input 
                    name="name"
                    type="text" 
                    placeholder="e.g., 123 Main Street QR" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target URL</label>
                  <Input 
                    name="targetUrl"
                    type="url" 
                    placeholder="https://yourwebsite.com/property" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property (Optional)</label>
                  <select 
                    name="propertyId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">No specific property</option>
                    <option value="prop-1">123 Main Street</option>
                    <option value="prop-2">456 Oak Avenue</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    type="submit"
                    variant="primary" 
                    className="flex-1"
                  >
                    Generate
                  </Button>
                  <Button 
                    type="button"
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => setShowGenerateModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Analytics Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">QR Code Analytics</h3>
                <button 
                  onClick={() => setSelectedQR(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <img 
                    src={selectedQR.qrCodeUrl} 
                    alt={selectedQR.name}
                    className="mx-auto h-32 w-32 border border-gray-200 rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-gray-900">{selectedQR.scanCount}</div>
                    <div className="text-sm text-gray-500">Total Scans</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-gray-900">{selectedQR.uniqueScans}</div>
                    <div className="text-sm text-gray-500">Unique Scans</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-gray-900">{getConversionRate(selectedQR)}%</div>
                  <div className="text-sm text-gray-500">Conversion Rate</div>
                </div>
                <div className="text-sm text-gray-500">
                  <p><strong>Target URL:</strong> {selectedQR.targetUrl}</p>
                  <p><strong>Created:</strong> {new Date(selectedQR.createdAt).toLocaleDateString()}</p>
                  {selectedQR.lastScanned && (
                    <p><strong>Last Scanned:</strong> {new Date(selectedQR.lastScanned).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodesPage; 