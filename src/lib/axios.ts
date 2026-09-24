import axios from 'axios';
import { getAccessToken, clearAccessToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAccessToken();
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
