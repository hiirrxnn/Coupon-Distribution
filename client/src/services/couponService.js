// client/src/services/couponService.js
import api from './api';

// Public endpoints (for guest users)
export const claimCoupon = async () => {
  try {
    // Generate a session ID if it doesn't exist yet
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
      localStorage.setItem('sessionId', sessionId);
    }
    
    const res = await api.post('/claims', { sessionId });
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.msg || 'Failed to claim coupon' 
    };
  }
};

// Admin endpoints
export const getAllCoupons = async () => {
  try {
    const res = await api.get('/coupons');
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.msg || 'Failed to fetch coupons' 
    };
  }
};

export const createCoupon = async (couponData) => {
  try {
    const res = await api.post('/coupons', couponData);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.msg || 'Failed to create coupon' 
    };
  }
};

export const updateCoupon = async (id, couponData) => {
  try {
    const res = await api.put(`/coupons/${id}`, couponData);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.msg || 'Failed to update coupon' 
    };
  }
};

export const deleteCoupon = async (id) => {
  try {
    const res = await api.delete(`/coupons/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.msg || 'Failed to delete coupon' 
    };
  }
};

export const getAllClaims = async () => {
  try {
    const res = await api.get('/claims');
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.msg || 'Failed to fetch claims' 
    };
  }
};