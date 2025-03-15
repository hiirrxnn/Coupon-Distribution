import api from './api';

export const login = async (username, password) => {
  try {
    console.log('Login attempt with:', { username, passwordLength: password.length });
    const res = await api.post('/auth/login', { username, password });
    console.log('Login response:', res.data);
    
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      return { success: true };
    }
    
    return { success: false, error: 'Authentication failed' };
  } catch (err) {
    console.error('Login error details:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    
    return { 
      success: false, 
      error: err.response?.data?.msg || 'Authentication failed' 
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentAdmin = async () => {
  try {
    const res = await api.get('/auth');
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.msg || 'Failed to get admin data' 
    };
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

