
// client/src/components/common/Notification.js
import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const Notification = () => {
  const { notification, hideNotification } = useNotification();
  
  if (!notification.visible) {
    return null;
  }
  
  const { type, message } = notification;
  
  // Bootstrap alert classes
  const classes = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info'
  };
  
  return (
    <div className="notification-container">
      <div className={`alert ${classes[type]} alert-dismissible fade show`} role="alert">
        {message}
        <button
          type="button"
          className="btn-close"
          onClick={hideNotification}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default Notification;