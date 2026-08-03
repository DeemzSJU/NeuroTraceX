/**
 * NeuroTraceX — Axios API Client
 *
 * Configured Axios instance with base URL, interceptors,
 * and error handling for all backend API calls.
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    console.log("[Axios Request]", config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    console.log("[Axios Response]", response.status, response.data);
    return response.data;
  },
  (error) => {
    console.error("[Axios Error]", error.response?.status, error.response?.data || error.message);
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    console.error('[API Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message,
    });

    return Promise.reject(new Error(message));
  }
);

export default api;
