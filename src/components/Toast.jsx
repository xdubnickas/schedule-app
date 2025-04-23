import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

const Toast = ({ toast }) => {
  const { dismissToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);

  // Configure toast appearance based on type
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success text-success-content';
      case 'error':
        return 'bg-error text-error-content';
      case 'warning':
        return 'bg-warning text-warning-content';
      case 'info':
      default:
        return 'bg-info text-info-content';
    }
  };

  // Get the icon based on toast type
  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Handle dismiss animation
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      dismissToast(toast.id);
    }, 300); // Match this with the CSS transition duration
  };

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        dismissToast(toast.id);
      }, 300);
    }, toast.duration - 300); // Start exiting animation before complete duration

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dismissToast]);

  return (
    <div 
      className={`
        flex items-center justify-between p-3 rounded-lg shadow-lg mb-2 max-w-sm w-full
        ${getToastStyles()}
        ${isExiting ? 'animate-toast-exit' : 'animate-toast-enter'}
        transition-all duration-300
      `}
    >
      <div className="flex items-center">
        <div className="mr-3">{getToastIcon()}</div>
        <p className="font-medium">{toast.message}</p>
      </div>
      <button 
        onClick={handleDismiss}
        className="ml-4 p-1 hover:bg-black/10 rounded-full transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Main Toast container component that shows all toasts
const ToastContainer = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
