import apiClient from '../config';

const authService = {
  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Register user (signup)
  register: async (userData) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  }
};

export default authService;