import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import { 
  BookOpenIcon,
  DocumentArrowUpIcon, 
  GlobeAltIcon, 
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  XMarkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

interface KnowledgeBaseEntry {
  id: string;
  entry_type: 'document' | 'note' | 'faq' | 'file';
  title: string;
  content?: string;
  file_url?: string;
  version: number;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

interface KnowledgeBaseEntryVersion {
  id: string;
  entry_id: string;
  content?: string;
  file_url?: string;
  created_by: string;
  created_at: string;
  version: number;
}

interface KnowledgeBaseManagerProps {
  knowledgeBaseId: string;
  user: User;
}

const emptyEntry: Partial<KnowledgeBaseEntry> = {
  entry_type: 'note',
  title: '',
  content: '',
};

const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({ knowledgeBaseId, user }) => {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<KnowledgeBaseEntry | null>(null);
  const [showDelete, setShowDelete] = useState<KnowledgeBaseEntry | null>(null);
  const [previewEntry, setPreviewEntry] = useState<KnowledgeBaseEntry | null>(null);
  const [showVersions, setShowVersions] = useState<KnowledgeBaseEntry | null>(null);
  const [versions, setVersions] = useState<KnowledgeBaseEntryVersion[]>([]);
  const [form, setForm] = useState<Partial<KnowledgeBaseEntry>>(emptyEntry);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('knowledge_base_entries')
      .select('*')
      .eq('knowledge_base_id', knowledgeBaseId)
      .eq('is_current', true)
      .order('updated_at', { ascending: false });
    if (error) setError(error.message);
    else setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [knowledgeBaseId]);

  const handleAddEntry = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('knowledge_base_entries')
      .insert([{ ...form, knowledge_base_id: knowledgeBaseId, created_by: user.id }]);
    if (error) setError(error.message);
    setShowAdd(false);
    setForm(emptyEntry);
    fetchEntries();
    setLoading(false);
  };

  const handleEditEntry = async () => {
    if (!showEdit) return;
    setLoading(true);
    // Save current version
    await supabase.from('knowledge_base_entry_versions').insert({
      entry_id: showEdit.id,
      content: showEdit.content,
      file_url: showEdit.file_url,
      created_by: user.id,
      version: showEdit.version,
    });
    // Update entry (increment version)
    const { error } = await supabase
      .from('knowledge_base_entries')
      .update({ ...form, version: (showEdit.version || 1) + 1 })
      .eq('id', showEdit.id);
    if (error) setError(error.message);
    setShowEdit(null);
    setForm(emptyEntry);
    fetchEntries();
    setLoading(false);
  };

  const handleDeleteEntry = async () => {
    if (!showDelete) return;
    setLoading(true);
    const { error } = await supabase
      .from('knowledge_base_entries')
      .delete()
      .eq('id', showDelete.id);
    if (error) setError(error.message);
    setShowDelete(null);
    fetchEntries();
    setLoading(false);
  };

  const handleShowVersions = async (entry: KnowledgeBaseEntry) => {
    setShowVersions(entry);
    setLoading(true);
    const { data, error } = await supabase
      .from('knowledge_base_entry_versions')
      .select('*')
      .eq('entry_id', entry.id)
      .order('version', { ascending: false });
    if (error) setError(error.message);
    else setVersions(data || []);
    setLoading(false);
  };

  const handleRestoreVersion = async (version: KnowledgeBaseEntryVersion) => {
    if (!showVersions) return;
    setLoading(true);
    // Save current as new version
    await supabase.from('knowledge_base_entry_versions').insert({
      entry_id: showVersions.id,
      content: showVersions.content,
      file_url: showVersions.file_url,
      created_by: user.id,
      version: showVersions.version,
    });
    // Restore selected version
    const { error } = await supabase
      .from('knowledge_base_entries')
      .update({
        content: version.content,
        file_url: version.file_url,
        version: (showVersions.version || 1) + 1,
      })
      .eq('id', showVersions.id);
    if (error) setError(error.message);
    setShowVersions(null);
    fetchEntries();
    setLoading(false);
  };

  if (loading) return <div className="text-red-500">{error}</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <BookOpenIcon className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Knowledge Base Manager</h2>
            <p className="text-blue-100">Enhance your AI assistant with custom knowledge</p>
          </div>
        </div>
      </div>

      {/* Add Entry Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => { setShowAdd(true); setForm(emptyEntry); }}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Entry
        </Button>
      </div>

      {/* Entries Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300" style={{ backdropFilter: 'blur(20px)' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {entry.entry_type === 'document' && <DocumentArrowUpIcon className="w-5 h-5 text-blue-600" />}
                      {entry.entry_type === 'note' && <SparklesIcon className="w-5 h-5 text-purple-600" />}
                      {entry.entry_type === 'faq' && <BookOpenIcon className="w-5 h-5 text-green-600" />}
                      {entry.entry_type === 'file' && <CloudArrowUpIcon className="w-5 h-5 text-orange-600" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{entry.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded-full capitalize">{entry.entry_type}</span>
                        <span>•</span>
                        <span>Version {entry.version}</span>
                      </div>
                    </div>
                  </div>
                  {entry.content && (
                    <p className="text-gray-600 line-clamp-2 mt-2">{entry.content.substring(0, 150)}...</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => setPreviewEntry(entry)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => { setShowEdit(entry); setForm(entry); }}
                    className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => handleShowVersions(entry)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
                  >
                    <ClockIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    onClick={() => setShowDelete(entry)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {entries.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
              <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries yet</h3>
              <p className="text-gray-600">Start building your knowledge base by adding your first entry.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Entry Modal */}
      {showAdd && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
             onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
               onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlusIcon className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Add New Entry</h3>
                    <p className="text-green-100">Create a new knowledge base entry</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdd(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={e => { e.preventDefault(); handleAddEntry(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.entry_type} 
                    onChange={e => setForm(f => ({ ...f, entry_type: e.target.value as any }))}
                  >
                    <option value="note">Note</option>
                    <option value="document">Document</option>
                    <option value="faq">FAQ</option>
                    <option value="file">File</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    value={form.title} 
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                    required 
                    placeholder="Enter a descriptive title..."
                  />
                </div>

                {form.entry_type !== 'file' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-32" 
                      value={form.content} 
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                      placeholder="Enter your content here..."
                    />
                  </div>
                )}

                {form.entry_type === 'file' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      value={form.file_url} 
                      onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))}
                      placeholder="https://example.com/document.pdf"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-xl"
                  >
                    Add Entry
                  </Button>
                  <Button 
                    type="button"
                    variant="secondary" 
                    onClick={() => setShowAdd(false)}
                    className="px-6 py-3 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Entry Modal */}
      {showEdit && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
             onClick={() => setShowEdit(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
               onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpenIcon className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Edit Entry</h3>
                    <p className="text-purple-100">Modify an existing knowledge base entry</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEdit(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={e => { e.preventDefault(); handleEditEntry(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={form.entry_type} 
                    onChange={e => setForm(f => ({ ...f, entry_type: e.target.value as any }))}
                  >
                    <option value="note">Note</option>
                    <option value="document">Document</option>
                    <option value="faq">FAQ</option>
                    <option value="file">File</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                    value={form.title} 
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                    required 
                    placeholder="Enter a descriptive title..."
                  />
                </div>

                {form.entry_type !== 'file' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors h-32" 
                      value={form.content} 
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                      placeholder="Enter your content here..."
                    />
                  </div>
                )}

                {form.entry_type === 'file' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                      value={form.file_url} 
                      onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))}
                      placeholder="https://example.com/document.pdf"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 rounded-xl"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    type="button"
                    variant="secondary" 
                    onClick={() => setShowEdit(null)}
                    className="px-6 py-3 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
             onClick={() => setShowDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
               onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrashIcon className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Delete Entry</h3>
                    <p className="text-red-100">Confirm deletion of "{showDelete.title}"</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDelete(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
              <p className="text-gray-600 mb-4">This action cannot be undone. Deleting "{showDelete.title}" will permanently remove it from your knowledge base.</p>
              <div className="flex gap-3">
                <Button 
                  variant="danger" 
                  onClick={handleDeleteEntry}
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white py-3 rounded-xl"
                >
                  Delete
                </Button>
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => setShowDelete(null)}
                  className="px-6 py-3 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Version History Modal */}
      {showVersions && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
             onClick={() => setShowVersions(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
               onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Version History: {showVersions.title}</h3>
                    <p className="text-indigo-100">View and restore previous versions of "{showVersions.title}"</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVersions(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <ul className="space-y-4 max-h-full overflow-y-auto">
                {versions.map(v => (
                  <li key={v.id} className="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>v{v.version} • {new Date(v.created_at).toLocaleString()}</span>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => handleRestoreVersion(v)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200"
                      >
                        Restore
                      </Button>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-xs overflow-x-auto max-h-32">
                      {v.content || v.file_url}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* AI Preview Modal */}
      {previewEntry && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
             onClick={() => setPreviewEntry(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
               onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <EyeIcon className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">AI Preview: {previewEntry.title}</h3>
                    <p className="text-blue-100">Preview how this entry would look to the AI assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewEntry(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gray-100 rounded-lg p-4 text-xs overflow-x-auto max-h-64">
                {previewEntry.content || previewEntry.file_url}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default KnowledgeBaseManager; 