// Centralized API helper for frontend
// Uses Vite build-time/runtime env var VITE_API_URL
// In Docker Compose, this is set to http://js-src:7002

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const getApiBase = () => API_BASE;

export const apiFetch = (path, options = {}) => {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  return fetch(url, options);
};
