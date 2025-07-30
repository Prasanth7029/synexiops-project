// src/lib/axios.js
import axios from 'axios';

// 🔐 AUTH SERVICE API
export const AuthAPI = axios.create({
  baseURL: '/api/auth', // Matches vite.config.js
});

// 📦 INVENTORY SERVICE API
export const InventoryAPI = axios.create({
  baseURL: '/api/inventory', // Matches vite.config.js
});

// ✅ Shared interceptor logic to attach JWT
const attachToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// 🔐 Auth API interceptor (skip login/signup)
AuthAPI.interceptors.request.use((config) => {
  if (!config.url.includes('/login') && !config.url.includes('/signup')) {
    return attachToken(config);
  }
  return config;
}, Promise.reject);

// 📦 Inventory API interceptor (always attach token)
InventoryAPI.interceptors.request.use(attachToken, Promise.reject);
