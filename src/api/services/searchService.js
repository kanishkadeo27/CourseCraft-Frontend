import apiClient from '../config';
import apiCache from '../../utils/cache';

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
    const cacheKey = 'all_courses';
    
    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/allcourses');
      
      // Cache the response for 2 minutes
      apiCache.set(cacheKey, response, 2 * 60 * 1000);
      
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default searchService;