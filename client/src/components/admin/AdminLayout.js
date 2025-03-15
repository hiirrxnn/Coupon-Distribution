import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { admin } = useAuth();
  
  return (
    <div className="admin-layout d-flex flex-column min-vh-100">
      <div className="container-fluid py-3 bg-light border-bottom mb-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Admin Panel</h3>
            {admin && (
              <div className="admin-info text-muted">
                Welcome, {admin.username}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;