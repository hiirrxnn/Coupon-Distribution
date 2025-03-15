import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ 
    visible: false, 
    type: 'info', 
    message: '' 
  });

  const showNotification = (type, message, timeout = 5000) => {
    setNotification({ visible: true, type, message });
    
    // Auto-hide notification after timeout
    if (timeout > 0) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, timeout);
    }
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  return (
    <NotificationContext.Provider
      value={{
        notification,
        showSuccess: (message, timeout) => showNotification('success', message, timeout),
        showError: (message, timeout) => showNotification('error', message, timeout),
        showInfo: (message, timeout) => showNotification('info', message, timeout),
        showWarning: (message, timeout) => showNotification('warning', message, timeout),
        hideNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);