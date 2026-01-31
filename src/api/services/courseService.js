import apiClient from '../config';
import apiCache from '../../utils/cache';

const courseService = {
  // Get course details by ID (public endpoint - includes syllabus data)
  getCourseById: async (courseId) => {
    const cacheKey = `course_${courseId}`;
    
    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get(`/courses/${courseId}`);
      
      // Cache the response for 3 minutes
      apiCache.set(cacheKey, response, 3 * 60 * 1000);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's enrolled courses (requires authentication)
  getEnrolledCourses: async () => {
    try {
      const response = await apiClient.get('/user/mycourses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Enroll in a course (requires authentication)
  enrollInCourse: async (courseId) => {
    try {
      const response = await apiClient.post(`/user/enroll?courseId=${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course content for classroom
  getCourseContent: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/content`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new course with content (admin only)
  createCourse: async (courseData) => {
    try {
      const response = await apiClient.post('/admin/courses', courseData);
      
      // Clear all courses cache after creation
      apiCache.delete('all_courses');
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course by ID for admin (includes all details)
  getCourseByIdAdmin: async (courseId) => {
    try {
      const response = await apiClient.get(`/admin/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update course (admin only)
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await apiClient.put(`/admin/courses/${courseId}`, courseData);
      
      // Clear cache for this course after update
      apiCache.delete(`course_${courseId}`);
      apiCache.delete('all_courses');
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete course (admin only)
  deleteCourse: async (courseId) => {
    try {
      const response = await apiClient.delete(`/admin/courses/${courseId}`);
      
      // Clear cache for this course and all courses after deletion
      apiCache.delete(`course_${courseId}`);
      apiCache.delete('all_courses');
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default courseService;