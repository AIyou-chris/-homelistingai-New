import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';

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

  if (loading) return <LoadingSpinner size="md" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Knowledge Base Entries</h2>
      <Button onClick={() => { setShowAdd(true); setForm(emptyEntry); }}>Add Entry</Button>
      <ul className="mt-4 space-y-2">
        {entries.map(entry => (
          <li key={entry.id} className="bg-slate-700 p-4 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{entry.title}</div>
              <div className="text-xs text-gray-400">{entry.entry_type} • v{entry.version}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setPreviewEntry(entry)}>Preview AI</Button>
              <Button size="sm" variant="secondary" onClick={() => { setShowEdit(entry); setForm(entry); }}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => setShowDelete(entry)}>Delete</Button>
              <Button size="sm" variant="secondary" onClick={() => handleShowVersions(entry)}>Versions</Button>
            </div>
          </li>
        ))}
      </ul>
      {/* Add Entry Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-lg w-full">
            <h3 className="font-bold mb-2">Add Entry</h3>
            <form onSubmit={e => { e.preventDefault(); handleAddEntry(); }}>
              <label className="block mb-2">Type
                <select className="w-full" value={form.entry_type} onChange={e => setForm(f => ({ ...f, entry_type: e.target.value as any }))}>
                  <option value="note">Note</option>
                  <option value="document">Document</option>
                  <option value="faq">FAQ</option>
                  <option value="file">File</option>
                </select>
              </label>
              <label className="block mb-2">Title
                <input className="w-full" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </label>
              {form.entry_type !== 'file' && (
                <label className="block mb-2">Content
                  <textarea className="w-full" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
                </label>
              )}
              {form.entry_type === 'file' && (
                <label className="block mb-2">File URL
                  <input className="w-full" value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} />
                </label>
              )}
              <div className="flex gap-2 mt-4">
                <Button type="submit">Add</Button>
                <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Entry Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-lg w-full">
            <h3 className="font-bold mb-2">Edit Entry</h3>
            <form onSubmit={e => { e.preventDefault(); handleEditEntry(); }}>
              <label className="block mb-2">Type
                <select className="w-full" value={form.entry_type} onChange={e => setForm(f => ({ ...f, entry_type: e.target.value as any }))}>
                  <option value="note">Note</option>
                  <option value="document">Document</option>
                  <option value="faq">FAQ</option>
                  <option value="file">File</option>
                </select>
              </label>
              <label className="block mb-2">Title
                <input className="w-full" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </label>
              {form.entry_type !== 'file' && (
                <label className="block mb-2">Content
                  <textarea className="w-full" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
                </label>
              )}
              {form.entry_type === 'file' && (
                <label className="block mb-2">File URL
                  <input className="w-full" value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} />
                </label>
              )}
              <div className="flex gap-2 mt-4">
                <Button type="submit">Save</Button>
                <Button variant="secondary" onClick={() => setShowEdit(null)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
            <h3 className="font-bold mb-2">Delete Entry</h3>
            <p>Are you sure you want to delete "{showDelete.title}"?</p>
            <div className="flex gap-2 mt-4">
              <Button variant="danger" onClick={handleDeleteEntry}>Delete</Button>
              <Button variant="secondary" onClick={() => setShowDelete(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
      {/* Version History Modal */}
      {showVersions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-lg w-full">
            <h3 className="font-bold mb-2">Version History: {showVersions.title}</h3>
            <ul className="mb-4 max-h-64 overflow-y-auto">
              {versions.map(v => (
                <li key={v.id} className="mb-2 p-2 border rounded">
                  <div className="text-xs text-gray-500">v{v.version} • {new Date(v.created_at).toLocaleString()}</div>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-32">{v.content || v.file_url}</pre>
                  <Button size="sm" variant="secondary" onClick={() => handleRestoreVersion(v)} className="mt-2">Restore</Button>
                </li>
              ))}
            </ul>
            <Button onClick={() => setShowVersions(null)}>Close</Button>
          </div>
        </div>
      )}
      {/* AI Preview Modal */}
      {previewEntry && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-lg w-full">
            <h3 className="font-bold mb-2">AI Preview: {previewEntry.title}</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-64">{previewEntry.content || previewEntry.file_url}</pre>
            <Button onClick={() => setPreviewEntry(null)} className="mt-4">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseManager; 