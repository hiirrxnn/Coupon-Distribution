// client/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentAdmin, isAuthenticated, login, logout } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAdmin = async () => {
      if (isAuthenticated()) {
        try {
          const { success, data, error } = await getCurrentAdmin();
          if (success) {
            setAdmin(data);
          } else {
            setError(error);
            logout(); // Clear invalid token
          }
        } catch (err) {
          setError('Failed to load admin data');
          logout(); // Clear invalid token
        }
      }
      setLoading(false);
    };

    loadAdmin();
  }, []);

  const loginAdmin = async (username, password) => {
    setLoading(true);
    const { success, error } = await login(username, password);
    
    if (success) {
      const { success: adminSuccess, data } = await getCurrentAdmin();
      if (adminSuccess) {
        setAdmin(data);
        setError(null);
      } else {
        setError('Failed to load admin data');
        logout();
      }
    } else {
      setError(error || 'Login failed');
    }
    
    setLoading(false);
    return success;
  };

  const logoutAdmin = () => {
    logout();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        error,
        isAuthenticated: !!admin,
        login: loginAdmin,
        logout: logoutAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);