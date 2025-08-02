'use client';

import { useState, useEffect } from 'react';
import { Role } from '@prisma/client';
import { getUsers, updateUserRole, UserWithOrders } from '../../../actions/actions';

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        search: searchQuery || undefined
      });

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchQuery, pagination.page]);

  const handleUpdateUserRole = async (userId: string, newRole: Role) => {
    try {
      await updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MODERATOR': return 'bg-yellow-100 text-yellow-800';
      case 'USER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl font-bold">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">User Management</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-2 border-black p-3 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border-2 border-black p-3 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <option value="all">All Roles</option>
            <option value="USER">Users</option>
            <option value="MODERATOR">Moderators</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-black bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-bold">User</th>
                <th className="py-3 px-4 text-left font-bold">Email</th>
                <th className="py-3 px-4 text-left font-bold">Phone</th>
                <th className="py-3 px-4 text-left font-bold">Role</th>
                <th className="py-3 px-4 text-left font-bold">Orders</th>
                <th className="py-3 px-4 text-left font-bold">Joined</th>
                <th className="py-3 px-4 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full border-2 border-black bg-[#4ECDC4] flex items-center justify-center mr-3">
                          <span className="text-lg font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-sm text-gray-600">ID: {user.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value as Role)}
                        className={`px-2 py-1 rounded text-sm font-semibold ${getRoleColor(user.role)}`}
                      >
                        <option value="USER">User</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold">{user.orders.length}</p>
                        <p className="text-sm text-gray-600">
                          ${user.orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)} total
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="border-2 border-black bg-[#FFD166] px-3 py-1 rounded font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination(prev => ({ ...prev, page }))}
                className={`px-3 py-2 border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ${
                  page === pagination.page
                    ? 'bg-[#FFD166] text-black'
                    : 'bg-white text-black'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 