
// client/src/components/user/UserLayout.js
import React from 'react';
import CouponClaim from './CouponClaim';

const UserLayout = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Welcome to our Coupon Distribution System</h1>
        <p className="lead">
          Get exclusive discounts for your purchases! Our system ensures fair
          distribution of coupons to all users.
        </p>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <CouponClaim />
          
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">How It Works</h3>
              <div className="row mt-4">
                <div className="col-md-4 text-center mb-3">
                  <div className="h1 text-primary mb-3">1</div>
                  <h5>Click to Claim</h5>
                  <p className="text-muted">
                    Press the button to request your unique coupon code
                  </p>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="h1 text-primary mb-3">2</div>
                  <h5>Get Your Code</h5>
                  <p className="text-muted">
                    Receive a unique discount code assigned just to you
                  </p>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="h1 text-primary mb-3">3</div>
                  <h5>Use at Checkout</h5>
                  <p className="text-muted">
                    Apply your coupon during purchase to get your discount
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h3 className="card-title">Frequently Asked Questions</h3>
              <div className="accordion mt-3" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How often can I claim coupons?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      To ensure fair distribution, each user (based on IP address and browser session) 
                      can claim one coupon within a 30-minute period.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      How long are coupons valid?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      The validity period varies for each coupon. The expiration date is 
                      clearly displayed when you receive your coupon.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      What if I lose my coupon code?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Unfortunately, we cannot recover lost coupon codes due to our fair distribution system. 
                      We recommend saving or writing down your code after claiming it.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;