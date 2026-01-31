import axios from 'axios';

// Base URL for all API calls
const BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Reduced to 30 seconds for better UX
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token expiration check utility
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Request interceptor to add auth token with expiration check
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired before making request
      if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Return a consistent error format
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    });
  }
);

export default apiClient;
export { BASE_URL };