const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

router.post('/cars', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { brand, model, year, pricePerDay, location, imageUrl, description, features } = req.body;

    // Crear vehículo con ownerId del usuario autenticado
    const newCar = new Car({
      brand,
      model,
      year,
      pricePerDay,
      location,
      imageUrl,
      description,
      features,
      ownerId: req.user.userId // asigna dueño desde token JWT
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear vehículo' });
  }
});

module.exports = router;

router.delete('/cars/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user.userId;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    if (car.ownerId.toString() !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este vehículo' });
    }

    await Car.findByIdAndDelete(carId);
    res.json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
