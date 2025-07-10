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
import ImageWithFallback from '../../components/ImageWithFallback';

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
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=123-Main-Street',
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
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=456-Oak-Avenue',
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
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=General-Contact',
          targetUrl: 'https://homelistingai.com/contact',
          scanCount: 12,
          uniqueScans: 10,
          createdAt: '2024-01-17',
          status: 'inactive'
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

  const generateQRCode = (data: { name: string; targetUrl: string; propertyId?: string; notes?: string }) => {
    const newQR: QRCode = {
      id: `qr-${Date.now()}`,
      name: data.name,
      propertyId: data.propertyId,
      propertyName: data.propertyId ? 'Selected Property' : undefined,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.name)}`,
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
    return ((qrCode.uniqueScans / qrCode.scanCount) * 100).toFixed(1);
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
          <h1 className="text-2xl font-bold text-gray-900">QR Code Management</h1>
          <p className="mt-1 text-sm text-gray-500">
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <QrCodeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total QR Codes</p>
              <p className="text-2xl font-bold text-gray-900">{qrCodes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DevicePhoneMobileIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">
                {qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Scans</p>
              <p className="text-2xl font-bold text-gray-900">
                {qrCodes.reduce((sum, qr) => sum + qr.uniqueScans, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active QR Codes</p>
              <p className="text-2xl font-bold text-gray-900">
                {qrCodes.filter(qr => qr.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-100 text-gray-900 border border-slate-200 focus:ring-sky-500 focus:border-sky-500 rounded-md shadow-sm placeholder-gray-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* QR Codes Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your QR Codes</h3>
          <p className="text-sm text-gray-500">
            {filteredQRCodes.length} of {qrCodes.length} QR codes
          </p>
        </div>

        {filteredQRCodes.length === 0 ? (
          <div className="text-center py-12">
            <QrCodeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Generate your first QR code to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQRCodes.map((qrCode) => (
              <div key={qrCode.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{qrCode.name}</h4>
                    {qrCode.propertyName && (
                      <p className="text-sm text-sky-600 mt-1">{qrCode.propertyName}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Created {new Date(qrCode.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    qrCode.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {qrCode.status}
                  </span>
                </div>

                {/* QR Code Image */}
                <div className="text-center mb-4">
                  <ImageWithFallback
                    src={qrCode.qrCodeUrl}
                    alt={qrCode.name}
                    className="mx-auto h-32 w-32 border border-gray-200 rounded bg-slate-100 object-contain"
                    fallbackSrc="/listing.png"
                  />
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{qrCode.scanCount}</div>
                    <div className="text-xs text-gray-500">Total Scans</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{qrCode.uniqueScans}</div>
                    <div className="text-xs text-gray-500">Unique</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{getConversionRate(qrCode)}%</div>
                    <div className="text-xs text-gray-500">Rate</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600"
                      onClick={() => downloadQRCode(qrCode)}
                      title="Download QR Code"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600"
                      onClick={() => shareQRCode(qrCode)}
                      title="Share QR Code"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-sky-600"
                      onClick={() => setSelectedQR(qrCode)}
                      title="View Analytics"
                    >
                      <ChartBarIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Delete QR Code"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {qrCode.lastScanned && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Last scanned: {new Date(qrCode.lastScanned).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {qrCode.notes && (
                  <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-gray-600 border border-slate-100">
                    <strong>Notes:</strong> {qrCode.notes}
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
                  propertyId: formData.get('propertyId') as string || undefined,
                  notes: formData.get('notes') as string || undefined,
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    placeholder="Add any notes about this QR code..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-slate-50"
                    rows={2}
                  />
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