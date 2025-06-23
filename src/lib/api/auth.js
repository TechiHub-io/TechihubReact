// src/lib/api/auth.js
import api from './index';

export const authApi = {
  login: (credentials) => api.post('/auth/login/', credentials),
  
  register: (userData) => api.post('/auth/register/', userData),
  
  logout: () => api.post('/auth/logout/'),
  
  refreshToken: (refresh) => api.post('/auth/token/refresh/', { refresh }),
  
  resetPassword: (email) => api.post('/auth/password-reset/', { email }),
  
  confirmResetPassword: (token, password) => 
    api.post('/auth/password-reset/confirm/', { token, password }),
  
  changePassword: (oldPassword, newPassword) => 
    api.post('/auth/password-change/', { 
      old_password: oldPassword, 
      new_password: newPassword 
    }),
  
  verifyEmail: (token) => api.post('/auth/verify-email/', { token }),
  
  socialAuth: (provider, accessToken) => 
    api.post('/auth/social/', { provider, access_token: accessToken }),
};

export const socialAuth = async (provider, accessToken) => {
  const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
  
  const response = await fetch(`${API_URL}/auth/social/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      provider: provider,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Social authentication failed');
  }

  return response.json();
};

export const getProfileById = async (profileId, token) => {
  const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
  
  const response = await fetch(`${API_URL}/profiles/${profileId}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch profile');
  }

  return response.json();
};