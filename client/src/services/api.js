// src/services/api.js
import axios from 'axios';

// Create API instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        // Redirect to login if needed
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('API Error: No response received', error.request);
    } else {
      // Error setting up the request
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Api utilities
export const checkApiStatus = async () => {
  try {
    const response = await api.get('/status');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('API status check failed:', error);
    return false;
  }
};

export default api;