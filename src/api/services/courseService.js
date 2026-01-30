import apiClient from '../config';

const courseService = {
  // Get course details by ID (includes syllabus data)
  getCourseById: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}`);
      return response.data;
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
      const response = await apiClient.post(`/user/courses/${courseId}/enroll`);
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
  }
};

export default courseService;