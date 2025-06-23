// src/store/slices/uiSlice.js
export const createUISlice = (set, get) => ({
  // UI state
  modals: {
    loginModal: false,
    registerModal: false,
    applicationModal: false,
    jobModal: false,
    messageModal: false,
  },
  notifications: [],
  sidebarOpen: true,
  isLoading: false,
  error: null,

  // Actions
  openModal: (modalName) => set((state) => {
    state.modals[modalName] = true;
  }),

  closeModal: (modalName) => set((state) => {
    state.modals[modalName] = false;
  }),

  toggleModal: (modalName) => set((state) => {
    state.modals[modalName] = !state.modals[modalName];
  }),

  addNotification: (notification) => set((state) => {
    state.notifications.push(notification);
    
    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(notification.id);
      }, notification.duration);
    }
  }),

  removeNotification: (id) => set((state) => {
    state.notifications = state.notifications.filter(notif => notif.id !== id);
  }),

  clearNotifications: () => set((state) => {
    state.notifications = [];
  }),

  toggleSidebar: () => set((state) => {
    state.sidebarOpen = !state.sidebarOpen;
  }),

  setSidebarOpen: (isOpen) => set((state) => {
    state.sidebarOpen = isOpen;
  }),

  setLoading: (isLoading) => set((state) => {
    state.isLoading = isLoading;
  }),

  setError: (error) => set((state) => {
    state.error = error;
  }),

  clearError: () => set((state) => {
    state.error = null;
  }),

  resetUI: () => set((state) => {
    state.modals = {
      loginModal: false,
      registerModal: false,
      applicationModal: false,
      jobModal: false,
      messageModal: false,
    };
    state.notifications = [];
    state.error = null;
  }),
});