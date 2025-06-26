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
  features: {
    type: [String],  // <-- array de strings
    default: []
  },
  startDate: String,
  endDate: String,

  phoneNumber: String,  // <-- agregado aquí

}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
