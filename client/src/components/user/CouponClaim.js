// client/src/components/user/CouponClaim.js
import React, { useState } from 'react';
import { claimCoupon } from '../../services/couponService';
import { useNotification } from '../../contexts/NotificationContext';
import Feedback from './Feedback';

const CouponClaim = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [error, setError] = useState('');
  
  const { showSuccess, showError } = useNotification();
  
  const handleClaimCoupon = async () => {
    setIsLoading(true);
    setError('');
    setClaimedCoupon(null);
    
    try {
      const { success, data, error } = await claimCoupon();
      
      if (success && data.success) {
        setClaimedCoupon(data.coupon);
        showSuccess('You have successfully claimed a coupon!');
      } else {
        setError(error || 'Failed to claim coupon. Please try again later.');
        showError(error || 'Failed to claim coupon');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      showError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body text-center">
        <h2 className="mb-4">Get Your Discount Coupon</h2>
        <p className="lead mb-4">
          Click the button below to claim a unique discount coupon for your purchase!
        </p>
        
        {claimedCoupon ? (
          <div className="coupon-result">
            <div className="alert alert-success p-4">
              <h4 className="mb-3">Congratulations!</h4>
              <div className="coupon-box p-3 mb-3 border border-success rounded bg-light">
                <h3 className="text-success">{claimedCoupon.code}</h3>
                <p className="mb-0">{claimedCoupon.description}</p>
                <p className="mb-0">
                  <strong>Value: </strong>
                  {claimedCoupon.isPercentage
                    ? `${claimedCoupon.value}% off`
                    : `$${claimedCoupon.value} off`}
                </p>
                <p className="mb-0">
                  <strong>Valid until: </strong>
                  {new Date(claimedCoupon.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <p>
                Use this coupon at checkout to receive your discount. This coupon has been assigned to you and cannot be claimed again.
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => setClaimedCoupon(null)}
              >
                Close
              </button>
            </div>
            <Feedback />
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            <p className="mb-3">{error}</p>
            <button
              className="btn btn-outline-danger"
              onClick={() => setError('')}
            >
              Try Again Later
            </button>
          </div>
        ) : (
          <button
            className="btn btn-lg btn-primary px-4 py-2"
            onClick={handleClaimCoupon}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              'Claim Your Coupon Now'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CouponClaim;