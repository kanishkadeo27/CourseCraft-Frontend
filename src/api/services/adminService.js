import apiClient from '../config';

const adminService = {
  // Update admin profile
  updateProfile: async (userData) => {
    const response = await apiClient.put('/admin/update', userData);
    return response.data;
  }
};

export default adminService;