import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Mock users data (replace with real API call)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "user", joinDate: "2024-01-15" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", joinDate: "2024-01-20" },
        { id: 3, name: "Admin User", email: "admin@example.com", role: "admin", joinDate: "2024-01-01" },
        { id: 4, name: "Bob Johnson", email: "bob@example.com", role: "user", joinDate: "2024-01-25" },
      ];

      // If current user is an admin and not in mock data, add them
      if (currentUser && currentUser.role && 
          (currentUser.role.toLowerCase() === 'admin' || currentUser.role.toLowerCase() === 'role_admin') &&
          !mockUsers.find(u => u.email === currentUser.email)) {
        mockUsers.push({
          id: mockUsers.length + 1,
          name: currentUser.name || 'Current Admin',
          email: currentUser.email,
          role: 'admin',
          joinDate: new Date().toISOString().split('T')[0]
        });
      }

      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, [currentUser]);



  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (updateStatus === 'success') {
      const timer = setTimeout(() => {
        setUpdateStatus(null);
        setUpdatingUserId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateStatus]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle role filtering with ROLE_ prefix
    let matchesRole = roleFilter === "";
    if (!matchesRole) {
      // Normalize both user role and filter for comparison
      const normalizeRole = (role) => {
        if (!role) return "";
        const lowerRole = role.toLowerCase();
        return lowerRole.startsWith('role_') ? lowerRole.replace('role_', '') : lowerRole;
      };
      
      const userRole = normalizeRole(user.role);
      const filterRole = normalizeRole(roleFilter);
      matchesRole = userRole === filterRole;
    }
    
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      
      // TODO: Replace with actual API call
      // await userService.updateUserRole(userId, { role: newRole });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setUpdateStatus('success');
    } catch (error) {
      console.error("Error updating user role:", error);
      setUpdateStatus('error');
    }
  };

  // Check if current admin is trying to modify their own role
  const isCurrentUser = (userEmail) => {
    return currentUser?.email === userEmail;
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleUpdateUser = async (userId) => {
    try {
      setUpdatingUserId(userId);
      
      // TODO: Replace with actual API call to update user
      // const updatedUser = await userService.updateUser(userId, userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show success message (in real implementation, you'd update with actual data)
      setUpdateStatus('success');
      
      console.log(`User ${userId} updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
      setUpdateStatus('error');
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
              <span className="font-medium">User updated successfully!</span>
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
              <span className="font-medium">Failed to update user. Please try again.</span>
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
                <option value="user">Users</option>
                <option value="admin">Admins</option>
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
                    Join Date
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
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded border">
                            {user.role} (You)
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            Cannot change own role
                          </span>
                        </div>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updatingUserId === user.id}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!isCurrentUser(user.email) && (
                        <button
                          onClick={() => handleUpdateUser(user.id)}
                          disabled={updatingUserId === user.id}
                          className={`mr-3 px-3 py-1 rounded text-xs font-medium transition-colors ${
                            updatingUserId === user.id
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {updatingUserId === user.id ? 'Updating...' : 'Update'}
                        </button>
                      )}
                      {!isCurrentUser(user.email) && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={updatingUserId === user.id}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            updatingUserId === user.id
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          Delete
                        </button>
                      )}
                      {isCurrentUser(user.email) && (
                        <span className="text-xs text-gray-500 italic">
                          Cannot modify own account
                        </span>
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

      </div>
    </div>
  );
};

export default ManageUsers;