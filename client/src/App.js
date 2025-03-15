// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Notification from './components/common/Notification';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import UserLayout from './components/user/UserLayout';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import CouponList from './components/admin/CouponList';
import CouponForm from './components/admin/CouponForm';
import ClaimHistory from './components/admin/ClaimHistory';

// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <Notification />
            
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<UserLayout />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Admin Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="coupons" element={<CouponList />} />
                    <Route path="coupons/add" element={<CouponForm />} />
                    <Route path="coupons/edit/:id" element={<CouponForm />} />
                    <Route path="claims" element={<ClaimHistory />} />
                  </Route>
                </Route>
                
                {/* Fallback route for 404 */}
                <Route path="*" element={
                  <div className="container text-center py-5">
                    <h1 className="display-4">404 - Page Not Found</h1>
                    <p className="lead">The page you are looking for does not exist.</p>
                  </div>
                } />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
