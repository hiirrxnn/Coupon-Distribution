
// client/src/components/admin/CouponList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCoupons, deleteCoupon, updateCoupon } from '../../services/couponService';
import { useNotification } from '../../contexts/NotificationContext';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'claimed', 'expired'
  const [searchTerm, setSearchTerm] = useState('');
  
  const { showSuccess, showError } = useNotification();
  
  useEffect(() => {
    fetchCoupons();
  }, []);
  
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { success, data, error } = await getAllCoupons();
      
      if (success) {
        setCoupons(data);
      } else {
        showError(error || 'Failed to fetch coupons');
      }
    } catch (err) {
      showError('An error occurred while fetching coupons');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const { success, error } = await updateCoupon(id, {
        active: !currentStatus
      });
      
      if (success) {
        setCoupons(
          coupons.map(coupon =>
            coupon._id === id ? { ...coupon, active: !currentStatus } : coupon
          )
        );
        
        showSuccess(
          `Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`
        );
      } else {
        showError(error || 'Failed to update coupon status');
      }
    } catch (err) {
      showError('An error occurred while updating coupon');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const { success, error } = await deleteCoupon(id);
        
        if (success) {
          setCoupons(coupons.filter(coupon => coupon._id !== id));
          showSuccess('Coupon deleted successfully');
        } else {
          showError(error || 'Failed to delete coupon');
        }
      } catch (err) {
        showError('An error occurred while deleting coupon');
      }
    }
  };
  
  const filteredCoupons = () => {
    const now = new Date();
    
    let filtered = [...coupons];
    
    // Apply text search
    if (searchTerm) {
      filtered = filtered.filter(
        coupon =>
          coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    switch (filter) {
      case 'active':
        return filtered.filter(
          coupon => coupon.active && new Date(coupon.expiryDate) > now && !coupon.claimed
        );
      case 'claimed':
        return filtered.filter(coupon => coupon.claimed);
      case 'expired':
        return filtered.filter(
          coupon => new Date(coupon.expiryDate) <= now
        );
      default:
        return filtered;
    }
  };
  
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Coupons</h2>
        <Link to="/admin/coupons/add" className="btn btn-primary">
          Add New Coupon
        </Link>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Coupons</option>
                <option value="active">Active & Available</option>
                <option value="claimed">Claimed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {filteredCoupons().length === 0 ? (
        <div className="alert alert-info">No coupons found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Value</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons().map((coupon) => {
                const isExpired = new Date(coupon.expiryDate) <= new Date();
                
                return (
                  <tr key={coupon._id}>
                    <td>{coupon.code}</td>
                    <td>{coupon.description}</td>
                    <td>
                      {coupon.isPercentage
                        ? `${coupon.value}%`
                        : `$${coupon.value}`}
                    </td>
                    <td>
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td>
                      {coupon.claimed ? (
                        <span className="badge bg-info">Claimed</span>
                      ) : isExpired ? (
                        <span className="badge bg-warning text-dark">Expired</span>
                      ) : coupon.active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary">Inactive</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link
                          to={`/admin/coupons/edit/${coupon._id}`}
                          className="btn btn-outline-primary"
                        >
                          Edit
                        </Link>
                        
                        <button
                          className={`btn btn-outline-${
                            coupon.active ? 'warning' : 'success'
                          }`}
                          onClick={() => handleToggleActive(coupon._id, coupon.active)}
                          disabled={coupon.claimed || isExpired}
                        >
                          {coupon.active ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(coupon._id)}
                          disabled={coupon.claimed}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CouponList;
