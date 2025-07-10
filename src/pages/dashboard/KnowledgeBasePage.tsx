import React, { useState, useRef, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ArrowUpTrayIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { Image, FileText } from 'lucide-react';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import * as knowledgeBaseService from '../../services/knowledgeBaseService';

interface KnowledgeBaseItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text' | 'document';
  size: string;
  uploadedAt: string;
  propertyId?: string;
  propertyName?: string;
  description?: string;
}

interface KnowledgeBase {
  id: string;
  type: string;
  title: string;
  personality?: string;
  created_at: string;
  agent_id?: string;
  listing_id?: string;
}

const KnowledgeBasePage: React.FC = () => {
  const { user } = useAuth();
  const [agentKnowledgeBases, setAgentKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [listingKnowledgeBases, setListingKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock uploaded documents
  const uploadedDocs = [
    { id: '1', name: 'Property_Floor_Plan.pdf', type: 'pdf', uploadedAt: '2024-01-15' },
    { id: '2', name: 'Agent_Script.docx', type: 'document', uploadedAt: '2024-01-14' },
    { id: '3', name: 'Property_Photos.zip', type: 'image', uploadedAt: '2024-01-13' },
  ];

  // Fetch knowledge bases
  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      console.log('Fetching knowledge bases, user:', user);
      if (!user?.id) {
        console.log('No user ID, returning');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching agent KBs for user:', user.id);
        // Fetch agent knowledge bases
        const { data: agentKBs, error: agentError } = await knowledgeBaseService.getKnowledgeBasesByAgent(user.id);
        console.log('Agent KBs result:', { data: agentKBs, error: agentError });
        if (agentError) {
          console.error('Error fetching agent KBs:', agentError);
          setError('Failed to load agent knowledge bases');
        } else {
          setAgentKnowledgeBases(agentKBs || []);
        }

        // For now, we'll use a mock listing ID - this should come from route params or context
        const mockListingId = 'demo-listing-1';
        console.log('Fetching listing KBs for listing:', mockListingId);
        const { data: listingKBs, error: listingError } = await knowledgeBaseService.getKnowledgeBasesByListing(mockListingId);
        console.log('Listing KBs result:', { data: listingKBs, error: listingError });
        if (listingError) {
          console.error('Error fetching listing KBs:', listingError);
          setError('Failed to load listing knowledge bases');
        } else {
          setListingKnowledgeBases(listingKBs || []);
        }
      } catch (err) {
        console.error('Error fetching knowledge bases:', err);
        setError('Failed to load knowledge bases');
      } finally {
        console.log('Setting loading to false');
        setIsLoading(false);
      }
    };

    fetchKnowledgeBases();
  }, [user?.id]);

  // Drag-and-drop/upload handler placeholder
  const handleFileUpload = () => {};

  // Helper to get colored icon by file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <DocumentTextIcon className="h-6 w-6 text-red-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-green-500" />;
      case 'document':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'text':
        return <FileText className="h-6 w-6 text-yellow-500" />;
      default:
        return <DocumentIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  // Collapsible state for mobile
  const [showDocs, setShowDocs] = React.useState(true);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading knowledge bases...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Agent Knowledge Base Card */}
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Agent Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            <strong>What is this?</strong> This is your personal knowledge base for scripts, FAQs, and notes that help you as an agent. Use it for your own talking points, responses, and best practices that you want to keep handy for all your listings.
          </p>
          
          {agentKnowledgeBases.length > 0 && (
            <div className="mb-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
              <h4 className="font-medium text-sky-800 mb-2">Your Knowledge Bases:</h4>
              <div className="space-y-2">
                {agentKnowledgeBases.map(kb => (
                  <div key={kb.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <p className="font-medium text-gray-800">{kb.title}</p>
                      <p className="text-sm text-gray-500">Created {new Date(kb.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button variant="secondary" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-xl border-2 border-dashed border-sky-300 p-8 flex flex-col items-center justify-center mb-4 cursor-pointer hover:bg-slate-100 transition w-full">
            <svg className="h-10 w-10 text-sky-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span className="text-sky-600 font-medium">Drag & drop or click to upload agent documents</span>
            <span className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT, Images, ZIP</span>
          </div>
          <button className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition">Edit</button>
        </CardContent>
      </Card>

      {/* Listing Knowledge Base Card */}
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Listing Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            <strong>What is this?</strong> This is the knowledge base for the current property/listing. Use it for property-specific info, disclosures, marketing copy, and anything unique to this home. This helps you answer buyer questions and keep all details in one place.
          </p>
          
          {listingKnowledgeBases.length > 0 && (
            <div className="mb-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
              <h4 className="font-medium text-sky-800 mb-2">Listing Knowledge Bases:</h4>
              <div className="space-y-2">
                {listingKnowledgeBases.map(kb => (
                  <div key={kb.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <p className="font-medium text-gray-800">{kb.title}</p>
                      <p className="text-sm text-gray-500">Created {new Date(kb.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button variant="secondary" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-xl border-2 border-dashed border-sky-300 p-8 flex flex-col items-center justify-center mb-4 cursor-pointer hover:bg-slate-100 transition w-full">
            <svg className="h-10 w-10 text-sky-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span className="text-sky-600 font-medium">Drag & drop or click to upload listing documents</span>
            <span className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT, Images, ZIP</span>
          </div>
          <button className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition">Edit</button>
        </CardContent>
      </Card>

      {/* AI Knowledge Base Tips Card */}
      <Card className="w-full bg-gradient-to-br from-sky-50 to-white border border-sky-100 shadow-sm mb-2">
        <CardHeader>
          <CardTitle className="text-sky-700 text-lg">Tips for a Smarter AI Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Add detailed property descriptions, unique features, and selling points.</li>
            <li>Upload floor plans, disclosures, and neighborhood info for richer answers.</li>
            <li>Include FAQs you get from buyers—AI will use these to help answer questions.</li>
            <li>Provide marketing copy, agent scripts, or talking points for consistent messaging.</li>
            <li>Keep your knowledge base up to date for the best results!</li>
          </ul>
        </CardContent>
      </Card>

      {/* Uploaded Documents List - Collapsible on mobile */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
          <button className="md:hidden text-sky-600 text-sm font-medium" onClick={() => setShowDocs(v => !v)}>
            {showDocs ? 'Hide' : 'Show'}
          </button>
        </div>
        {(showDocs || window.innerWidth >= 768) && (
          uploadedDocs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No documents uploaded yet.</div>
          ) : (
            <div className="space-y-4">
              {uploadedDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(doc.type)}
                    <span className="font-medium text-gray-800">{doc.name}</span>
                    <span className="text-xs text-gray-500">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-sky-600" title="View"><svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                    <button className="p-2 text-gray-400 hover:text-red-600" title="Delete"><svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasePage; 