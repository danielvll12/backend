const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true // Para evitar duplicados
  },
  brand: String,
  model: String,
  year: String,
  pricePerDay: String,
  location: String,
  imageUrl: String,
  description: String,
  features: String,
  startDate: String,
  endDate: String
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
