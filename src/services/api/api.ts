// src/services/api/api.ts - CLEAN VERSION
import axios from 'axios';

// DIRECT HARDCODED URL - NO ENV VARIABLES
const API_BASE_URL = 'http://localhost:5000/api';

console.log('=== API SETUP ===');
console.log('Using API URL:', API_BASE_URL);
console.log('Backend should be running on port 5000');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Simple interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: any) => api.post('/auth/register', data),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (data: any) => api.put('/auth/profile', data),
  
  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },
};

export const tenantsAPI = {
  getAll: () => api.get('/tenants'),
  getById: (id: string) => api.get(`/tenants/${id}`),
  create: (data: any) => api.post('/tenants', data),
  update: (id: string, data: any) => api.put(`/tenants/${id}`, data),
  delete: (id: string) => api.delete(`/tenants/${id}`),
};