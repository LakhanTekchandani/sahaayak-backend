// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerBuyer, 
  registerEntrepreneur, 
  registerMentor, 
  login, 
  getProfile, 
  logout 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Signup Routes
router.post('/signup/buyer', registerBuyer);
router.post('/signup/entrepreneur', registerEntrepreneur);
router.post('/signup/mentor', registerMentor);

// Login Route
router.post('/login', login);

// Profile Route (Protected)
router.get('/profile', protect, getProfile);

// Logout Route
router.post('/logout', logout);

module.exports = router;