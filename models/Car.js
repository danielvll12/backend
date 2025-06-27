const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  ownerId: {
    type: String,
    required: true, // Este campo ahora es obligatorio
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema);
