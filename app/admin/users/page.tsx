"use client";

import { useState, useEffect } from "react";
import { Role, OrderStatus } from "@prisma/client";
import {
  getUsers,
  updateUserRole,
  updateUserPoints,
  UserWithOrders,
} from "@/actions/actions";
import Image from "next/image";

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserWithOrders | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [editingPoints, setEditingPoints] = useState(false);
  const [editedPoints, setEditedPoints] = useState(0);
  const [pointsLoading, setPointsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: roleFilter !== "all" ? roleFilter : undefined,
        search: searchQuery || undefined,
      });

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      console.error("Error updating user role:", error);
    }
  };

  const openUserDetails = (user: UserWithOrders) => {
    setSelectedUser(user);
    setEditedPoints(user.points);
    setEditingPoints(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setEditingPoints(false);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
    }).format(amount);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MODERATOR":
        return "bg-yellow-100 text-yellow-800";
      case "USER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdatePoints = async () => {
    if (!selectedUser) return;

    try {
      setPointsLoading(true);
      await updateUserPoints(selectedUser.id, editedPoints);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, points: editedPoints } : user
        )
      );

      setSelectedUser((prev) =>
        prev ? { ...prev, points: editedPoints } : null
      );
      setEditingPoints(false);
    } catch (error) {
      console.error("Error updating points:", error);
    } finally {
      setPointsLoading(false);
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
      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    {selectedUser.name}&apos;s Details
                  </h2>
                  <p className="text-gray-600">
                    Full account information and order history
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-black text-2xl font-bold hover:text-red-600"
                >
                  &times;
                </button>
              </div>

              {/* User Profile Section */}
              <div className="mb-8 p-4 border-2 border-black rounded-lg">
                <h3 className="text-xl font-bold mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full border-2 border-black bg-[#4ECDC4] flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-white">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedUser.name}</p>
                      <p className="text-gray-600">ID: {selectedUser.id}</p>
                    </div>
                  </div>

                  <div>
                    <p>
                      <span className="font-bold">Email:</span>{" "}
                      {selectedUser.email}
                    </p>
                    <p>
                      <span className="font-bold">Phone:</span>{" "}
                      {selectedUser.phone || "N/A"}
                    </p>
                    <p>
                      <span className="font-bold">Role:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-sm font-semibold ${getRoleColor(
                          selectedUser.role
                        )}`}
                      >
                        {selectedUser.role}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold">Grade:</span>{" "}
                      {selectedUser.grade}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="font-bold">Total Points:</span>
                      {editingPoints ? (
                        <div className="flex items-center ml-2">
                          <input
                            type="number"
                            value={editedPoints}
                            onChange={(e) =>
                              setEditedPoints(Number(e.target.value))
                            }
                            className="w-24 border-2 border-black px-2 py-1 rounded mr-2"
                            min="0"
                          />
                          <button
                            onClick={handleUpdatePoints}
                            disabled={pointsLoading}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                          >
                            {pointsLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingPoints(false)}
                            className="ml-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center ml-2">
                          <span className="ml-2">
                            {selectedUser.points || 0}
                          </span>
                          <button
                            onClick={() => setEditingPoints(true)}
                            className="ml-3 text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="mt-2">
                      <span className="font-bold">Joined:</span>{" "}
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order History Section */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-4">
                  Order History ({selectedUser.orders.length})
                </h3>

                {selectedUser.orders.length === 0 ? (
                  <div className="text-center py-8 border-2 border-black rounded-lg bg-gray-50">
                    <p className="text-gray-500">
                      No orders found for this user
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedUser.orders.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-black rounded-lg p-4"
                      >
                        <div className="flex flex-wrap justify-between items-center mb-2">
                          <div>
                            <p className="font-bold">
                              Order #{order.id.slice(-8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold">
                              {formatCurrency(order.totalPrice)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(
                                order.status as OrderStatus
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="font-bold mb-1">Points Earned:</p>
                          <p>
                            {order.pointsEarned || 0} points (1 point per 5{" "}
                            <Image
                              width={20}
                              height={20}
                              src={"/SAR.svg"}
                              alt="Reward Points"
                              className="border border-gray-300"
                            />
                            )
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="border-2 border-black bg-[#FF6B6B] px-4 py-2 rounded font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <th className="py-3 px-4 text-left font-bold">Points</th>
                <th className="py-3 px-4 text-left font-bold">Orders</th>
                <th className="py-3 px-4 text-left font-bold">Joined</th>
                <th className="py-3 px-4 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full border-2 border-black bg-[#4ECDC4] flex items-center justify-center mr-3">
                          <span className="text-lg font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-sm text-gray-600">
                            ID: {user.id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleUpdateUserRole(user.id, e.target.value as Role)
                        }
                        className={`px-2 py-1 rounded text-sm font-semibold ${getRoleColor(
                          user.role
                        )}`}
                      >
                        <option value="USER">User</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-lg">
                        {user.points || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        {user.orders.reduce(
                          (sum, order) => sum + (order.pointsEarned || 0),
                          0
                        )}{" "}
                        earned
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold">{user.orders.length}</p>
                        <p className="text-sm text-gray-600">
                          {user.orders
                            .reduce((sum, order) => sum + order.totalPrice, 0)
                            .toFixed(2)}{" "}
                          <Image
                            width={20}
                            height={20}
                            src={"/SAR.svg"}
                            alt="Reward Points"
                            className="border border-gray-300"
                          />
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openUserDetails(user)}
                        className="border-2 border-black bg-[#FFD166] px-3 py-1 rounded font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
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
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1}
              className={`px-3 py-2 border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ${
                pagination.page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-white text-black"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else {
                const startPage = Math.max(
                  1,
                  Math.min(pagination.page - 2, pagination.pages - 4)
                );
                pageNum = startPage + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: pageNum }))
                  }
                  className={`px-3 py-2 border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ${
                    pageNum === pagination.page
                      ? "bg-[#FFD166] text-black"
                      : "bg-white text-black"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(pagination.pages, prev.page + 1),
                }))
              }
              disabled={pagination.page >= pagination.pages}
              className={`px-3 py-2 border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ${
                pagination.page >= pagination.pages
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-white text-black"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
