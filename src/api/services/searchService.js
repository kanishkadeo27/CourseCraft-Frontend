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
      throw error;
    }
  }
};

export default searchService;