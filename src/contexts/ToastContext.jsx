import React, { createContext, useState, useContext, useCallback } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add a new toast notification
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    
    // Auto dismiss after duration
    setTimeout(() => {
      dismissToast(id);
    }, duration);
    
    return id;
  }, []);

  // Remove a toast notification by id
  const dismissToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Helper functions for specific toast types
  const showSuccess = useCallback((message, duration) => 
    showToast(message, 'success', duration), [showToast]);
  
  const showError = useCallback((message, duration) => 
    showToast(message, 'error', duration), [showToast]);
    
  const showWarning = useCallback((message, duration) => 
    showToast(message, 'warning', duration), [showToast]);
    
  const showInfo = useCallback((message, duration) => 
    showToast(message, 'info', duration), [showToast]);

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      showToast, 
      dismissToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
    </ToastContext.Provider>
  );
}

// Custom hook to use the toast context
export const useToast = () => useContext(ToastContext);
