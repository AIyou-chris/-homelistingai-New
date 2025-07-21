import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../shared/LoadingSpinner';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
  is_active: boolean;
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Use the new Edge Function to get all users
      const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/get-all-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('Users from Edge Function:', result.users); // Debug log
        
        // Transform the data to match AdminUser interface
        const transformedUsers: AdminUser[] = result.users.map((user: any) => {
          // Handle empty or missing names
          let displayName = user.name;
          if (!displayName || displayName === 'N/A' || displayName.trim() === '') {
            displayName = user.email ? user.email.split('@')[0] : 'Unknown User';
          }
          
          return {
            id: user.id,
            email: user.email,
            name: displayName,
            role: user.subscription_status === 'active' ? 'agent' : 'inactive',
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            is_active: user.profile_exists
          };
        });
        
        console.log('Transformed users:', transformedUsers); // Debug log
        setUsers(transformedUsers);
      } else {
        throw new Error(result.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to old method if Edge Function fails
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select(`
            user_id,
            first_name,
            last_name,
            display_name,
            role,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        const transformedUsers: AdminUser[] = profiles?.map(profile => {
          let displayName = profile.display_name || `${profile.first_name} ${profile.last_name}`.trim();
          if (!displayName || displayName.trim() === '') {
            displayName = 'Unknown User';
          }
          
          return {
            id: profile.user_id,
            email: 'N/A', // Can't get email without admin access
            name: displayName,
            role: profile.role || 'agent',
            created_at: profile.created_at,
            last_sign_in_at: undefined,
            is_active: true
          };
        }) || [];

        setUsers(transformedUsers);
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { is_active: false }
      });

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: false } : user
      ));
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone and will permanently remove all their data.')) {
      return;
    }

    try {
      const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/admin-delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
        },
        body: JSON.stringify({ userId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove user from local state
        setUsers(prev => prev.filter(user => user.id !== userId));
        alert('User and all data deleted successfully');
      } else {
        console.error('Error deleting user:', result.error);
        alert('Error deleting user: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-gray-400">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="text-sm text-gray-400">
          Total Users: {users.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold">
                          {user.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-sky-400 hover:text-sky-300 mr-3"
                    >
                      View Details
                    </button>
                    {user.is_active && (
                      <button
                        onClick={() => deactivateUser(user.id)}
                        className="text-red-400 hover:text-red-300 mr-3"
                      >
                        Deactivate
                      </button>
                    )}
                    {user.email && (
                      <button
                        onClick={() => window.open(`mailto:${user.email}`)}
                        className="text-green-400 hover:text-green-300"
                        title={`Email ${user.email}`}
                      >
                        Email
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-400 hover:text-red-300 ml-3"
                      title="Delete User"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">User Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-white">{selectedUser.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Role</label>
                <p className="text-white">{selectedUser.role}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Created</label>
                <p className="text-white">{new Date(selectedUser.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement; 