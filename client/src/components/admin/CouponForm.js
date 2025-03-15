
// client/src/components/admin/CouponForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCoupon, updateCoupon, getAllCoupons } from '../../services/couponService';
import { useNotification } from '../../contexts/NotificationContext';

const CouponForm = () => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    value: '',
    isPercentage: false,
    active: true,
    expiryDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchCouponDetails();
    } else {
      // Set default expiry date to 30 days from now
      const defaultExpiryDate = new Date();
      defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 30);
      
      setFormData({
        ...formData,
        expiryDate: defaultExpiryDate.toISOString().split('T')[0]
      });
    }
  }, [id]);
  
  const fetchCouponDetails = async () => {
    setLoading(true);
    try {
      const { success, data, error } = await getAllCoupons();
      
      if (success) {
        const coupon = data.find(c => c._id === id);
        
        if (coupon) {
          setFormData({
            code: coupon.code,
            description: coupon.description,
            value: coupon.value,
            isPercentage: coupon.isPercentage,
            active: coupon.active,
            expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0]
          });
        } else {
          showError('Coupon not found');
          navigate('/admin/coupons');
        }
      } else {
        showError(error || 'Failed to fetch coupon details');
        navigate('/admin/coupons');
      }
    } catch (err) {
      showError('An error occurred');
      navigate('/admin/coupons');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const validateForm = () => {
    const { code, description, value, expiryDate } = formData;
    
    if (!code.trim()) {
      showError('Coupon code is required');
      return false;
    }
    
    if (!description.trim()) {
      showError('Description is required');
      return false;
    }
    
    if (!value || isNaN(value) || parseFloat(value) <= 0) {
      showError('Value must be a positive number');
      return false;
    }
    
    if (!expiryDate) {
      showError('Expiry date is required');
      return false;
    }
    
    if (new Date(expiryDate) < new Date()) {
      showError('Expiry date cannot be in the past');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { code, description, value, isPercentage, active, expiryDate } = formData;
      
      const couponData = {
        code,
        description,
        value: parseFloat(value),
        isPercentage,
        active,
        expiryDate
      };
      
      let response;
      
      if (isEdit) {
        response = await updateCoupon(id, couponData);
      } else {
        response = await createCoupon(couponData);
      }
      
      const { success, error } = response;
      
      if (success) {
        showSuccess(
          `Coupon ${isEdit ? 'updated' : 'created'} successfully`
        );
        navigate('/admin/coupons');
      } else {
        showError(error || `Failed to ${isEdit ? 'update' : 'create'} coupon`);
      }
    } catch (err) {
      showError('An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEdit) {
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
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>{isEdit ? 'Edit Coupon' : 'Add New Coupon'}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    disabled={isEdit} // Cannot edit code in edit mode
                  />
                  {isEdit && (
                    <small className="text-muted">
                      Coupon code cannot be changed after creation
                    </small>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="value" className="form-label">
                      Value *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="value"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isPercentage"
                        name="isPercentage"
                        checked={formData.isPercentage}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="isPercentage">
                        Is Percentage (%)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="expiryDate" className="form-label">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="active">
                      Active (available for claiming)
                    </label>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin/coupons')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEdit ? 'Update Coupon' : 'Create Coupon'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;