// client/src/components/admin/ClaimHistory.js
import React, { useState, useEffect } from 'react';
import { getAllClaims } from '../../services/couponService';
import { useNotification } from '../../contexts/NotificationContext';

const ClaimHistory = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [searchTerm, setSearchTerm] = useState('');
  
  const { showError } = useNotification();
  
  useEffect(() => {
    fetchClaims();
  }, []);
  
  const fetchClaims = async () => {
    setLoading(true);
    try {
      const { success, data, error } = await getAllClaims();
      
      if (success) {
        setClaims(data);
      } else {
        showError(error || 'Failed to fetch claim history');
      }
    } catch (err) {
      showError('An error occurred while fetching claim history');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredClaims = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    let filtered = [...claims];
    
    // Apply text search
    if (searchTerm) {
      filtered = filtered.filter(
        claim =>
          claim.ipAddress.includes(searchTerm) ||
          claim.sessionId.includes(searchTerm) ||
          (claim.coupon && claim.coupon.code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply time filters
    switch (filter) {
      case 'today':
        return filtered.filter(
          claim => new Date(claim.claimedAt) >= today
        );
      case 'week':
        return filtered.filter(
          claim => new Date(claim.claimedAt) >= oneWeekAgo
        );
      case 'month':
        return filtered.filter(
          claim => new Date(claim.claimedAt) >= oneMonthAgo
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
      <h2 className="mb-4">Coupon Claim History</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by IP, session ID, or coupon code..."
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
                <option value="all">All Claims</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {filteredClaims().length === 0 ? (
        <div className="alert alert-info">No claim records found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Claimed At</th>
                <th>Coupon Code</th>
                <th>Value</th>
                <th>IP Address</th>
                <th>Session ID</th>
                <th>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims().map((claim) => (
                <tr key={claim._id}>
                  <td>
                    {new Date(claim.claimedAt).toLocaleString()}
                  </td>
                  <td>
                    {claim.coupon ? claim.coupon.code : 'N/A'}
                  </td>
                  <td>
                    {claim.coupon
                      ? claim.coupon.isPercentage
                        ? `${claim.coupon.value}%`
                        : `$${claim.coupon.value}`
                      : 'N/A'}
                  </td>
                  <td>{claim.ipAddress}</td>
                  <td>
                    <span title={claim.sessionId}>
                      {claim.sessionId.substring(0, 8)}...
                    </span>
                  </td>
                  <td>
                    <span title={claim.userAgent}>
                      {claim.userAgent.substring(0, 30)}...
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClaimHistory;

