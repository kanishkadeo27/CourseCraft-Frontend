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
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      // Logout can fail silently - we still clear local storage
      console.warn('Logout API call failed:', error.message);
      throw error;
    }
  }
};

export default authService;