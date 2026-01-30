import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../api";
import ConfirmModal from "../../components/common/ConfirmModal";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [pendingRoleChanges, setPendingRoleChanges] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    userId: null,
    userName: "",
    userEmail: ""
  });

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminService.getAllUsers();
      const usersList = usersData.data;
      setUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      setUpdateStatus('error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (updateStatus === 'success') {
      const timer = setTimeout(() => {
        setUpdateStatus(null);
        setUpdatingUserId(null);
        setDeletingUserId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateStatus]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId, newRole) => {
    // Store pending role change
    setPendingRoleChanges(prev => ({
      ...prev,
      [userId]: newRole
    }));
  };

  // Get current role (either pending change or original role)
  const getCurrentRole = (user) => {
    return pendingRoleChanges[user.id] || user.role;
  };

  // Check if user has pending changes (role different from original)
  const hasPendingChanges = (user) => {
    const pendingRole = pendingRoleChanges[user.id];
    return pendingRole !== undefined && pendingRole !== user.role;
  };

  const isCurrentUser = (userEmail) => {
    return currentUser?.email === userEmail;
  };



  const handleDeleteUser = async (userId) => {
    try {
      setDeletingUserId(userId);
      
      // Call API to delete user
      await adminService.deleteUser(userId);
      
      // Show success message
      setUpdateStatus('success');
      
      // Close modal
      setConfirmModal({ isOpen: false, userId: null, userName: "", userEmail: "" });
      
      // Refresh users list
      await loadUsers();
      
    } catch (error) {
      setUpdateStatus('error');
      setConfirmModal({ isOpen: false, userId: null, userName: "", userEmail: "" });
    } finally {
      setDeletingUserId(null);
    }
  };

  const openDeleteModal = (user) => {
    setConfirmModal({
      isOpen: true,
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ isOpen: false, userId: null, userName: "", userEmail: "" });
  };

  const handleUpdateUser = async (userId) => {
    try {
      setUpdatingUserId(userId);
      
      // Check if there's a pending role change for this user
      const newRole = pendingRoleChanges[userId];
      
      if (newRole) {
        // Call API to update user role
        await adminService.updateUserRole(userId, { role: newRole });
        
        // Update local state
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
        
        // Clear pending role change
        setPendingRoleChanges(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
      
      setUpdateStatus('success');
    } catch (error) {
      setUpdateStatus('error');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">View and manage all platform users</p>
        </div>

        {/* Success Message */}
        {updateStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Operation completed successfully!</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {updateStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Operation failed. Please try again.</span>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="ROLE_USER">Users</option>
                <option value="ROLE_ADMIN">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isCurrentUser(user.email) ? (
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'} (You)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <select
                            value={getCurrentRole(user)}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={updatingUserId === user.id || deletingUserId === user.id}
                            className={`text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                              hasPendingChanges(user) 
                                ? 'border-orange-300 bg-orange-50' 
                                : 'border-gray-300'
                            }`}
                          >
                            <option value="ROLE_USER">User</option>
                            <option value="ROLE_ADMIN">Admin</option>
                          </select>
                          {hasPendingChanges(user) && (
                            <span className="ml-2 text-xs text-orange-600 font-medium">
                              Pending
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!isCurrentUser(user.email) ? (
                        <>
                          <button
                            onClick={() => handleUpdateUser(user.id)}
                            disabled={updatingUserId === user.id || deletingUserId === user.id}
                            className={`mr-3 px-3 py-1 rounded text-xs font-medium transition-colors ${
                              updatingUserId === user.id || deletingUserId === user.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {updatingUserId === user.id ? 'Updating...' : 'Update'}
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            disabled={updatingUserId === user.id || deletingUserId === user.id}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              updatingUserId === user.id || deletingUserId === user.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Protected Account
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{users.length}</span> results
              </p>
            </div>
          </div>
        </div>

        {/* Custom Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handleDeleteUser(confirmModal.userId)}
          title="Delete User"
          message={`Are you sure you want to delete "${confirmModal.userName}" (${confirmModal.userEmail})? This action cannot be undone and will permanently remove all user data.`}
          confirmText="Delete User"
          cancelText="Cancel"
          type="danger"
        />

      </div>
    </div>
  );
};

export default ManageUsers;