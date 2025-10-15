// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
// CORS: use a whitelist and a dynamic origin function so we can log and control access
const whitelist = [
  'http://localhost:3000',
  'https://sahaayakincredible.netlify.app/'
];

app.use((req, res, next) => {
  // Helpful for debugging CORS issues from the frontend
  console.log('Incoming request origin:', req.headers.origin);
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Simple health endpoint for quick reachability tests from the frontend
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));


// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sahaayak')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// Routes
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Sahaayak Backend is running! 🚀' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

