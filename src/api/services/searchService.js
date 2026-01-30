import apiClient from '../config';

const searchService = {
  // Search courses by keyword
  searchCourses: async (keyword) => {
    try {
      const response = await apiClient.get('/search', {
        params: { keyword }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all published courses
  getAllCourses: async () => {
    try {
      const response = await apiClient.get('/allcourses');
      return response.data;
    } catch (error) {
      // Add more specific error information
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout - please check if the backend server is running on http://localhost:8080');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error - please check if the backend server is running on http://localhost:8080');
      } else if (error.status === 404) {
        throw new Error('API endpoint not found - please check if /api/allcourses exists on the backend');
      }
      throw error;
    }
  }
};

export default searchService;