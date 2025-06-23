// src/lib/api/config.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.techihub.io/api/v1";

export const getApiUrl = (endpoint) => {
  // Make sure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};