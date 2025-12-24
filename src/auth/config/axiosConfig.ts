import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { BASE_API_URL } from './api';
import authService from '../authService';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await authService.getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.error('Authentication error: Token expired or invalid');

      // Try to get a fresh token
      try {
        const user = await authService.getUser();

        if (!user || user.expired) {
          // Redirect to login
          await authService.removeUser();
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
