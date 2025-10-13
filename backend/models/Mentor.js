// models/Mentor.js
const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
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
  professionalBackground: {
    type: String,
    required: true
  },
  areasOfMentorship: {
    type: String,
    required: true
  },
  aboutYou: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    default: '0 years'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  mentorshipSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorshipSession'
  }],
  availability: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mentor', mentorSchema);