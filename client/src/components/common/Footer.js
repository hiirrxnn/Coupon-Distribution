import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-light py-3 mt-auto">
      <div className="container">
        <div className="text-center">
          <p className="mb-0">
            &copy; {year} Coupon Distribution System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;