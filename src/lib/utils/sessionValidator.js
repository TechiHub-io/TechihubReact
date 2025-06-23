
// src/utils/sessionValidator.js
import Cookies from 'js-cookie';

export class SessionValidator {
  static async validateToken(token) {
    if (!token) return false;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/auth/verify-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  static async validateCurrentSession() {
    const token = Cookies.get('auth_token');
    const userRole = Cookies.get('user_role');
    
    // Check if we have both token and role
    if (!token || !userRole) {
      return false;
    }
    
    // Validate token with backend
    const isValid = await this.validateToken(token);
    
    if (!isValid) {
      // Clear invalid session
      this.clearSession();
      return false;
    }
    
    return true;
  }

  static clearSession() {
    const allCookies = [
      'auth_token', 'refresh_token', 'user_role', 'has_company',
      'company_id', 'has_multiple_companies', 'has_completed_profile',
      'registration_type', 'company_setup_step'
    ];

    allCookies.forEach(cookie => {
      Cookies.remove(cookie, { path: "/" });
    });

    // Clear localStorage
    try {
      localStorage.removeItem("techhub-storage");
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach(key => {
        if (key.startsWith('techhub') || key.includes('auth') || key.includes('user')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  static scheduleValidation(callback, interval = 15 * 60 * 1000) {
    return setInterval(async () => {
      const isValid = await this.validateCurrentSession();
      if (!isValid && callback) {
        callback();
      }
    }, interval);
  }
}