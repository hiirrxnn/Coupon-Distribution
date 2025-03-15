# Coupon Distribution System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for distributing coupons to guest users in a round-robin manner with admin management and abuse prevention.

## Features

### User-Facing Features
- **Coupon Distribution**: Sequential distribution of coupons to users without repetition
- **Guest Access**: Users can claim coupons without creating an account or logging in
- **Abuse Prevention**:
  - IP tracking with cooldown periods
  - Cookie/session-based tracking to prevent multiple claims
- **User Feedback**: Clear messaging for successful claims and time restrictions

### Admin Panel
- **Secure Login**: Protected access to administrative functions
- **Coupon Management**:
  - View all coupons (active, claimed, expired)
  - Add new coupons and update existing ones
  - Toggle coupon availability (activate/deactivate)
- **Claim History**: Track which users claimed coupons with IP and session information
- **Dashboard**: Overview of system statistics

## Technology Stack

- **Frontend**:
  - React.js
  - React Router for navigation
  - Bootstrap for styling
  - Context API for state management

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose ODM
  - JWT for authentication

- **Security Features**:
  - Express Rate Limit for request throttling
  - Cookie-based session tracking
  - JWT authentication for admin access
  - Bcrypt for password hashing

## Setup and Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/coupon-distribution-system.git
   cd coupon-distribution-system
   ```

2. **Install server dependencies**
   ```
   cd server
   npm install
   ```

3. **Configure server**
   - Create a `default.json` file in the `server/config` directory with the following content:
   ```json
   {
     "mongoURI": "your_mongodb_connection_string",
     "jwtSecret": "your_jwt_secret",
     "cookieSecret": "your_cookie_secret"
   }
   ```

4. **Install client dependencies**
   ```
   cd ../client
   npm install
   ```

5. **Run the development servers**
   
   In the server directory:
   ```
   npm run server
   ```
   
   In the client directory:
   ```
   npm start
   ```

6. **Create an admin user**
   
   Use MongoDB Compass or MongoDB Shell to create an admin user in the Admin collection:
   ```javascript
   db.admins.insertOne({
     username: "admin",
     email: "admin@example.com",
     password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9E0MYHaBBRSbil" // password: "password123"
   })
   ```

## Usage

### User Side
1. Navigate to the homepage
2. Click the "Claim Your Coupon" button
3. Use the provided coupon code for your purchase

### Admin Side
1. Navigate to `/login` and enter admin credentials
2. Use the dashboard to manage coupons and view claim history

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- React.js team for the frontend library
- MongoDB team for the database
- Node.js and Express.js teams for the backend framework# Coupon-Distribution
