import React, { useState, useRef } from 'react';
import { 
  DocumentTextIcon, 
  ArrowUpTrayIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  DocumentIcon,
  UserIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

interface KnowledgeBaseItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text' | 'document';
  size: string;
  uploadedAt: string;
  propertyId?: string;
  propertyName?: string;
  description?: string;
  knowledgeBaseType: 'agent' | 'listing';
}

const KnowledgeBasePage: React.FC = () => {
  const [files, setFiles] = useState<KnowledgeBaseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'agent' | 'listing'>('agent');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const mockFiles: KnowledgeBaseItem[] = [
    // Agent Knowledge Base (permanent)
    {
      id: '1',
      name: 'Company_Policies.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      description: 'Company policies and procedures',
      knowledgeBaseType: 'agent'
    },
    {
      id: '2',
      name: 'Sales_Scripts.docx',
      type: 'document',
      size: '1.2 MB',
      uploadedAt: '2024-01-14',
      description: 'Standard sales scripts and responses',
      knowledgeBaseType: 'agent'
    },
    {
      id: '3',
      name: 'Market_Research.pdf',
      type: 'pdf',
      size: '3.1 MB',
      uploadedAt: '2024-01-12',
      description: 'Market analysis and trends',
      knowledgeBaseType: 'agent'
    },
    // Listing Knowledge Base (property-specific)
    {
      id: '4',
      name: 'Property_Floor_Plan.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      propertyId: 'prop-1',
      propertyName: '123 Main Street',
      description: 'Detailed floor plan with measurements',
      knowledgeBaseType: 'listing'
    },
    {
      id: '5',
      name: 'Neighborhood_Info.docx',
      type: 'document',
      size: '1.2 MB',
      uploadedAt: '2024-01-14',
      propertyId: 'prop-1',
      propertyName: '123 Main Street',
      description: 'Local amenities and school information',
      knowledgeBaseType: 'listing'
    },
    {
      id: '6',
      name: 'Property_Photos.zip',
      type: 'image',
      size: '15.7 MB',
      uploadedAt: '2024-01-13',
      propertyId: 'prop-2',
      propertyName: '456 Oak Avenue',
      description: 'High-resolution property photos',
      knowledgeBaseType: 'listing'
    }
  ];

  React.useEffect(() => {
    setFiles(mockFiles);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newFiles: KnowledgeBaseItem[] = Array.from(selectedFiles).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString().split('T')[0],
        propertyId: activeTab === 'listing' && selectedProperty !== 'all' ? selectedProperty : undefined,
        propertyName: activeTab === 'listing' && selectedProperty !== 'all' ? 'Selected Property' : undefined,
        description: '',
        knowledgeBaseType: activeTab
      }));

      setFiles(prev => [...newFiles, ...prev]);
      setUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 2000);
  };

  const getFileType = (filename: string): KnowledgeBaseItem['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext || '')) return 'document';
    return 'document';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: KnowledgeBaseItem['type']) => {
    switch (type) {
      case 'pdf':
        return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
      case 'image':
        return <DocumentIcon className="h-8 w-8 text-green-500" />;
      case 'document':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
      default:
        return <DocumentTextIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = selectedProperty === 'all' || file.propertyId === selectedProperty;
    const matchesKnowledgeBase = file.knowledgeBaseType === activeTab;
    return matchesSearch && matchesProperty && matchesKnowledgeBase;
  });

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
          <p className="mt-1 text-sm text-gray-300">
            Manage your agent knowledge and property-specific information
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            variant="primary" 
            leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip"
          />
        </div>
      </div>

      {/* Knowledge Base Tabs */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="flex space-x-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('agent')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'agent'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Agent Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab('listing')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'listing'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Listing Knowledge Base
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'agent' ? (
            <div className="text-center">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Agent Knowledge Base</h3>
              <p className="text-gray-400 mb-4">
                Upload company policies, sales scripts, market research, and other information that stays with your agent permanently.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Listing Knowledge Base</h3>
              <p className="text-gray-400 mb-4">
                Upload property-specific documents, photos, and information that goes with each listing.
              </p>
              
              {/* Property Selection for Listing Knowledge Base */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Property for Upload:
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Select a property...</option>
                  <option value="prop-1">123 Main Street</option>
                  <option value="prop-2">456 Oak Avenue</option>
                  <option value="prop-3">789 Pine Drive</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Upload {activeTab === 'agent' ? 'Agent' : 'Property'} Documents
          </h3>
          <p className="text-gray-400 mb-4">
            Drag and drop files here, or click to browse. Supported formats: PDF, DOC, DOCX, TXT, Images, ZIP
          </p>
          <Button 
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gray-700 text-white hover:bg-gray-600"
          >
            Choose Files
          </Button>
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
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Property Filter - Only show for listing knowledge base */}
          {activeTab === 'listing' && (
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Properties</option>
              <option value="prop-1">123 Main Street</option>
              <option value="prop-2">456 Oak Avenue</option>
              <option value="prop-3">789 Pine Drive</option>
            </select>
          )}

          {/* Clear Filters */}
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              setSelectedProperty('all');
            }}
            className="justify-center bg-gray-700 text-white hover:bg-gray-600"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Files Grid */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Uploaded Files</h3>
          <p className="text-sm text-gray-400">
            {filteredFiles.length} of {files.filter(f => f.knowledgeBaseType === activeTab).length} files
          </p>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No files found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedProperty !== 'all'
                ? 'Try adjusting your filters'
                : `Upload your first ${activeTab === 'agent' ? 'agent' : 'property'} document to get started`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <div key={file.id} className="border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{file.name}</h4>
                      <p className="text-xs text-gray-400">{file.size}</p>
                      {file.propertyName && (
                        <p className="text-xs text-blue-400">{file.propertyName}</p>
                      )}
                      {file.description && (
                        <p className="text-xs text-gray-400 mt-1">{file.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-300">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-1 text-gray-400 hover:text-red-400"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400">Uploaded {file.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{files.length}</div>
            <div className="text-sm text-gray-500">Total Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">22.4 MB</div>
            <div className="text-sm text-gray-500">Total Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">15%</div>
            <div className="text-sm text-gray-500">Storage Used</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage; 