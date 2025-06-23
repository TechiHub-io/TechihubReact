// src/hooks/useAuthAxios.js
"use client";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Create an axios instance
const API_URL =
  process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAuthAxios = () => {
  useEffect(() => {
    // Add a request interceptor
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        // Add token to headers from cookies
        const token = Cookies.get("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add a response interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const refreshToken = Cookies.get("refresh_token");
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const response = await axios.post(
              `${API_URL}/auth/token/refresh/`,
              {
                refresh: refreshToken,
              }
            );

            // If successful, update the cookies
            const { access } = response.data;
            Cookies.set("auth_token", access);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout and redirect to login
            Cookies.remove("auth_token");
            Cookies.remove("refresh_token");
            Cookies.remove("user_role");
            Cookies.remove("has_company");
            window.location.href = "/auth/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors when component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosInstance;
};

export default useAuthAxios;
