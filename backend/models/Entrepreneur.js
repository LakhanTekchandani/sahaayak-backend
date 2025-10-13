// models/Entrepreneur.js
const mongoose = require('mongoose');

const entrepreneurSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  businessExperience: {
    type: String,
    required: true
  },
  aboutYou: {
    type: String,
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  mentorshipSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorshipSession'
  }],
  coursesEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Entrepreneur', entrepreneurSchema);