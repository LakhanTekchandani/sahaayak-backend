// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors()); // ✅ ye line express ke baad likh
app.use(express.json());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
    'http://localhost:3000',
    'https://sahaayakincrediblewebsite.netlify.app/'  // <-- yahan apna actual Netlify domain daal
  ],
  credentials: true
}));


// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sahaayak', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
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

