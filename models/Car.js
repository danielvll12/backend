const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: Number,
  pricePerDay: Number,
  location: String,
  imageUrl: String,
  description: String,
  features: [String], // ✅ Corrección aquí: array de strings
  ownerId: {
    type: mongoose.Schema.Types.ObjectId, // ✅ Corrección aquí: tipo ObjectId
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
