const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: Number,
  pricePerDay: Number,
  location: String,
  imageUrl: String,
  description: String,
  features: String,
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // obligatorio para saber quién creó el vehículo
  }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
