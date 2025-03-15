// client/src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCoupons, getAllClaims } from '../../services/couponService';
import { useNotification } from '../../contexts/NotificationContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    claimedCoupons: 0,
    expiredCoupons: 0,
    totalClaims: 0,
    uniqueUsers: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { showError } = useNotification();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch coupons
        const { success: couponSuccess, data: coupons } = await getAllCoupons();
        
        // Fetch claims
        const { success: claimsSuccess, data: claims } = await getAllClaims();
        
        if (couponSuccess && claimsSuccess) {
          const now = new Date();
          
          // Calculate coupon stats
          const activeCoupons = coupons.filter(
            c => c.active && new Date(c.expiryDate) > now
          ).length;
          
          const claimedCoupons = coupons.filter(c => c.claimed).length;
          
          const expiredCoupons = coupons.filter(
            c => new Date(c.expiryDate) <= now
          ).length;
          
          // Calculate unique users (by IP)
          const uniqueIps = [...new Set(claims.map(claim => claim.ipAddress))];
          
          setStats({
            totalCoupons: coupons.length,
            activeCoupons,
            claimedCoupons,
            expiredCoupons,
            totalClaims: claims.length,
            uniqueUsers: uniqueIps.length
          });
        } else {
          showError('Failed to load dashboard data');
        }
      } catch (err) {
        showError('An error occurred while loading dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [showError]);
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Total Coupons</h5>
              <p className="display-4">{stats.totalCoupons}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Active Coupons</h5>
              <p className="display-4">{stats.activeCoupons}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Claimed Coupons</h5>
              <p className="display-4">{stats.claimedCoupons}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h5 className="card-title">Expired Coupons</h5>
              <p className="display-4">{stats.expiredCoupons}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-secondary text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Total Claims</h5>
              <p className="display-4">{stats.totalClaims}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Unique Users</h5>
              <p className="display-4">{stats.uniqueUsers}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/admin/coupons/add" className="btn btn-primary">
                  Add New Coupon
                </Link>
                <Link to="/admin/coupons" className="btn btn-outline-primary">
                  Manage Coupons
                </Link>
                <Link to="/admin/claims" className="btn btn-outline-secondary">
                  View Claims History
                </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;