const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  },
  description: {
    type: String,
  },
  features: {
    type: [String],
  },
  startDate: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
