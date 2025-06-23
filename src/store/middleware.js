// src/store/middleware.js
export const logger = (config) => (set, get, api) =>
  config(
    (...args) => {
      set(...args);
    },
    get,
    api
  );

export const persistence = (config) => (set, get, api) =>
  config(
    (partial, replace) => {
      const result = set(partial, replace);
      
      // Custom persistence logic if needed
      // For example, saving specific slices to localStorage
      const state = get();
      if (state.isAuthenticated) {
        localStorage.setItem('auth_token', state.token);
      }
      
      return result;
    },
    get,
    api
  );

export const errorHandler = (config) => (set, get, api) =>
  config(
    (partial, replace) => {
      try {
        return set(partial, replace);
      } catch (error) {
        console.error('Store error:', error);
        
        // Set error in UI slice
        set((state) => {
          state.error = error.message;
        });
      }
    },
    get,
    api
  );