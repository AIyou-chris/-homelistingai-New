import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  UserPlus,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { supabase } from '../../lib/supabase';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  role?: string;
  is_active?: boolean;
  profile?: {
    company_name?: string;
    phone?: string;
    website?: string;
  };
  listings_count?: number;
}

interface UserManagementProps {
  onUserAction?: (action: string, userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onUserAction }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // For now, use mock data since admin.listUsers() requires server-side privileges
      // In production, this would be handled by a serverless function
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'support@homelistingai.com',
          created_at: '2024-01-15T10:30:00Z',
          last_sign_in_at: '2024-01-20T14:45:00Z',
          email_confirmed_at: '2024-01-15T10:35:00Z',
          role: 'admin',
          is_active: true,
          profile: {
            company_name: 'HomeListingAI',
            phone: '+1 (555) 123-4567',
            website: 'https://homelistingai.com'
          },
          listings_count: 0
        },
        {
          id: '2',
          email: 'realtor@example.com',
          created_at: '2024-01-10T09:15:00Z',
          last_sign_in_at: '2024-01-19T16:20:00Z',
          email_confirmed_at: '2024-01-10T09:20:00Z',
          role: 'user',
          is_active: true,
          profile: {
            company_name: 'Example Real Estate',
            phone: '+1 (555) 987-6543',
            website: 'https://examplerealestate.com'
          },
          listings_count: 5
        },
        {
          id: '3',
          email: 'agent@demo.com',
          created_at: '2024-01-05T11:00:00Z',
          last_sign_in_at: '2024-01-18T13:30:00Z',
          email_confirmed_at: '2024-01-05T11:05:00Z',
          role: 'user',
          is_active: true,
          profile: {
            company_name: 'Demo Properties',
            phone: '+1 (555) 456-7890',
            website: 'https://demoproperties.com'
          },
          listings_count: 12
        },
        {
          id: '4',
          email: 'suspended@example.com',
          created_at: '2024-01-01T08:00:00Z',
          last_sign_in_at: '2024-01-15T10:00:00Z',
          email_confirmed_at: '2024-01-01T08:05:00Z',
          role: 'user',
          is_active: false,
          profile: {
            company_name: 'Suspended Agency',
            phone: '+1 (555) 111-2222',
            website: 'https://suspendedagency.com'
          },
          listings_count: 0
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action: string, userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      
      switch (action) {
        case 'see':
          console.log('Viewing user details:', user);
          // In a real app, this would open a modal or navigate to user details
          alert(`Viewing details for: ${user?.email}`);
          break;
        case 'email':
          if (user?.email) {
            console.log('Emailing user:', user.email);
            // In a real app, this would open email client or send email
            window.open(`mailto:${user.email}`, '_blank');
          }
          break;
        case 'phone':
          if (user?.profile?.phone) {
            console.log('Calling user:', user.profile.phone);
            // In a real app, this would initiate a call or show phone number
            alert(`Phone number: ${user.profile.phone}`);
          } else {
            alert('No phone number available for this user');
          }
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setUsers(prev => prev.filter(user => user.id !== userId));
          }
          break;
        case 'suspend':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, is_active: false } : user
          ));
          break;
        case 'activate':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, is_active: true } : user
          ));
          break;
        case 'promote':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, role: 'admin' } : user
          ));
          break;
        case 'demote':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, role: 'user' } : user
          ));
          break;
      }
      
      onUserAction?.(action, userId);
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.is_active) ||
                         (filterStatus === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500 text-white"><Crown className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-500 text-white">Moderator</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge> :
      <Badge className="bg-red-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Suspended</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-300">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-gray-300">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={fetchUsers}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by email or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Users ({filteredUsers.length})</span>
            <div className="text-sm text-gray-400">
              {selectedUsers.length > 0 && `${selectedUsers.length} selected`}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded border-white/20 bg-white/10"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Listings</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Joined</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Last Sign In</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded border-white/20 bg-white/10"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-white">{user.email}</div>
                        {user.profile?.company_name && (
                          <div className="text-sm text-gray-400 flex items-center">
                            <Building className="w-3 h-3 mr-1" />
                            {user.profile.company_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getRoleBadge(user.role || 'user')}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(user.is_active || false)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium">{user.listings_count || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-400">
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-400">
                        {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem 
                            onClick={() => handleUserAction('see', user.id)}
                            className="text-gray-300 hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            See
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUserAction('email', user.id)}
                            className="text-gray-300 hover:bg-gray-700"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUserAction('phone', user.id)}
                            className="text-gray-300 hover:bg-gray-700"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Phone
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUserAction('delete', user.id)}
                            className="text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement; 