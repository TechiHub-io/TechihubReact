// src/lib/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Try to get token from cookies first (our primary auth method), then localStorage as fallback
    let token = null;

    if (typeof window !== 'undefined') {
      // Get token from cookies (primary method)
      const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      // Fallback to localStorage
      const localStorageToken = localStorage.getItem("auth_token");

      token = cookieToken || localStorageToken;

      // Debug log only for auth-related requests
      if (config.url?.includes('auth') || config.url?.includes('admin')) {
        console.log('🔍 API Request Token Check:', {
          cookieToken: cookieToken ? 'exists' : 'missing',
          localStorageToken: localStorageToken ? 'exists' : 'missing',
          usingToken: token ? 'exists' : 'missing',
          url: config.url
        });
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized response:', {
        url: error.config?.url,
        method: error.config?.method,
        hasAuthHeader: !!error.config?.headers?.Authorization
      });

      // Only redirect if we're not already on an auth page
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
        // Clear auth data
        localStorage.removeItem("auth_token");
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        console.log('🔄 Redirecting to login due to 401');
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
