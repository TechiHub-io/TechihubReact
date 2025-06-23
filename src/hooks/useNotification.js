// src/hooks/useNotification.js
import { useStore } from './useZustandStore';

export function useNotification() {
  const { notifications, addNotification, removeNotification, clearNotifications } = useStore(
    (state) => ({
      notifications: state.notifications,
      addNotification: state.addNotification,
      removeNotification: state.removeNotification,
      clearNotifications: state.clearNotifications
    })
  );

  const showSuccess = (message, duration = 3000) => {
    const id = Date.now();
    addNotification({
      id,
      type: 'success',
      message,
      duration
    });
  };

  const showError = (message, duration = 5000) => {
    const id = Date.now();
    addNotification({
      id,
      type: 'error',
      message,
      duration
    });
  };

  const showInfo = (message, duration = 3000) => {
    const id = Date.now();
    addNotification({
      id,
      type: 'info',
      message,
      duration
    });
  };

  const showWarning = (message, duration = 4000) => {
    const id = Date.now();
    addNotification({
      id,
      type: 'warning',
      message,
      duration
    });
  };

  return {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeNotification,
    clearNotifications
  };
}