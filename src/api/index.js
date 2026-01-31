// Main API exports - centralized access to all services
import authService from './services/authService';
import userService from './services/userService';
import adminService from './services/adminService';
import contactService from './services/contactService';
import searchService from './services/searchService';
import courseService from './services/courseService';
import apiClient from './config';

// Export all services
export {
  authService,
  userService,
  adminService,
  contactService,
  searchService,
  courseService,
  apiClient
};

// Default export with all services
const api = {
  auth: authService,
  user: userService,
  admin: adminService,
  contact: contactService,
  search: searchService,
  course: courseService,
  client: apiClient
};

export default api;