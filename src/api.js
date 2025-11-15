import axios from 'axios';

// Get API base URL from environment variable
// Note: The environment variable name should be VITE_API_URL (not VITE_API)
const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with configuration
const API = axios.create({
  baseURL: base,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Clear auth data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access forbidden');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 500:
          // Server error
          console.error('Server error occurred');
          break;

        default:
          console.error(`Error ${status}: ${error.response.data?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
