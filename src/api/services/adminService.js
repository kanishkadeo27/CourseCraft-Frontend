import apiClient from '../config';
import apiCache from '../../utils/cache';

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
  },

  // Get all trainers
  getAllTrainers: async () => {
    const cacheKey = 'all_trainers';
    
    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/admin/trainers');
      
      // Cache the response for 5 minutes
      apiCache.set(cacheKey, response, 5 * 60 * 1000);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create trainer
  createTrainer: async (trainerData) => {
    const response = await apiClient.post('/admin/trainers', trainerData);
    
    // Clear trainers cache after creation
    apiCache.delete('all_trainers');
    
    return response.data;
  },

  // Delete trainer
  deleteTrainer: async (trainerId) => {
    const response = await apiClient.delete(`/admin/trainers/${trainerId}`);
    
    // Clear trainers cache after deletion
    apiCache.delete('all_trainers');
    
    return response.data;
  },

  // Get trainer by ID
  getTrainerById: async (trainerId) => {
    const response = await apiClient.get(`/admin/trainers/${trainerId}`);
    return response.data;
  },

  // Update trainer
  updateTrainer: async (trainerId, trainerData) => {
    const response = await apiClient.put(`/admin/trainers/${trainerId}`, trainerData);
    
    // Clear trainers cache after update
    apiCache.delete('all_trainers');
    
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  }
};

export default adminService;