import apiClient from '../config';

const adminService = {
  // Update admin profile
  updateProfile: async (userData) => {
    const response = await apiClient.put('/admin/update', userData);
    return response.data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, roleData) => {
    const response = await apiClient.put(`/admin/users/${userId}/role`, roleData);
    return response.data;
  }
};

export default adminService;