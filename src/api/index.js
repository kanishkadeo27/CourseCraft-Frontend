// Main API exports - centralized access to all services
import authService from './services/authService';
import userService from './services/userService';
import adminService from './services/adminService';
import courseService from './services/courseService';
import trainerService from './services/trainerService';
import contactService from './services/contactService';
import apiClient from './config';

// Export all services
export {
  authService,
  userService,
  adminService,
  courseService,
  trainerService,
  contactService,
  apiClient
};

// Default export with all services
const api = {
  auth: authService,
  user: userService,
  admin: adminService,
  course: courseService,
  trainer: trainerService,
  contact: contactService,
  client: apiClient
};

export default api;