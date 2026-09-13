import axios from 'axios';
import { message } from 'antd';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

// Request interceptor: attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('roommatehub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: standard handling for 401 / 403 / 500
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      const errorMsg = data?.message || 'Something went wrong';

      if (status === 401) {
        // Clear token if expired or invalid (except when attempting to login)
        if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
          localStorage.removeItem('roommatehub_token');
          localStorage.removeItem('roommatehub_user');
          window.dispatchEvent(new Event('auth-logout'));
        }
      }

      return Promise.reject(new Error(errorMsg));
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Unable to connect to server.'));
    }

    return Promise.reject(error);
  }
);

export default API;
