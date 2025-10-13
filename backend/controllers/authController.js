// controllers/authController.js
const User = require('../models/User');
const Buyer = require('../models/Buyer');
const Entrepreneur = require('../models/Entrepreneur');
const Mentor = require('../models/Mentor');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'sahaayak_secret_key_2025', {
    expiresIn: '30d'
  });
};

// @desc    Register Buyer
// @route   POST /api/auth/signup/buyer
exports.registerBuyer = async (req, res) => {
  try {
    const { fullName, email, password, phone, location, aboutYou } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create User
    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      location,
      role: 'buyer',
      aboutYou
    });

    // Create Buyer Profile
    const buyer = await Buyer.create({
      userId: user._id,
      fullName,
      email,
      phone,
      location,
      aboutYou
    });

    // Generate Token
    const token = generateToken(user._id);

    // Set Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      message: 'Buyer registered successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Buyer Registration Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register Entrepreneur
// @route   POST /api/auth/signup/entrepreneur
exports.registerEntrepreneur = async (req, res) => {
  try {
    const { fullName, email, password, phone, location, skills, businessExperience, aboutYou } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      location,
      role: 'entrepreneur',
      aboutYou
    });

    const entrepreneur = await Entrepreneur.create({
      userId: user._id,
      fullName,
      email,
      phone,
      location,
      skills,
      businessExperience,
      aboutYou
    });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'Entrepreneur registered successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Entrepreneur Registration Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register Mentor
// @route   POST /api/auth/signup/mentor
exports.registerMentor = async (req, res) => {
  try {
    const { fullName, email, password, phone, location, professionalBackground, areasOfMentorship, aboutYou } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      location,
      role: 'mentor',
      aboutYou
    });

    const mentor = await Mentor.create({
      userId: user._id,
      fullName,
      email,
      phone,
      location,
      professionalBackground,
      areasOfMentorship,
      aboutYou
    });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'Mentor registered successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Mentor Registration Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate Token
    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get User Profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profileData;
    
    if (user.role === 'buyer') {
      profileData = await Buyer.findOne({ userId: user._id });
    } else if (user.role === 'entrepreneur') {
      profileData = await Entrepreneur.findOne({ userId: user._id });
    } else if (user.role === 'mentor') {
      profileData = await Mentor.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user,
      profile: profileData
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout User
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ success: true, message: 'Logged out successfully' });
};