// src/services/api.ts
import axios from 'axios';

// API base URL
export const API_BASE_URL = 'https://api-gateway-run8-1-team6-api-gateway-dev.development.krci-dev.cloudmentor.academy';

// Configure axios instance with interceptors
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with auth header:', {
        url: config.url,
        method: config.method,
        tokenPreview: `${token.substring(0, 10)}...`,
        hasAuthHeader: true
      });
    } else {
      console.log('Request without auth token:', {
        url: config.url,
        method: config.method
      });
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses and errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  async (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.error('No refresh token available, logging out');
          // Instead of dispatching logout directly, we'll handle this in the component
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('authUser');
          localStorage.removeItem('isAuthenticated');
          return Promise.reject(new Error('Authentication expired. Please log in again.'));
        }
        
        console.log('Attempting to refresh token...');
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
          refreshToken
        });
        
        console.log('Token refresh successful');
        
        // Update tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Update authorization header and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Instead of dispatching logout directly, we'll handle this in the component
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
        localStorage.removeItem('isAuthenticated');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Function to handle logout
export const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('authUser');
  localStorage.removeItem('isAuthenticated');
  // The component will handle the actual logout action
};