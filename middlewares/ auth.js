const express = require('express');
const router = express.Router();
const Car = require('../models/Car'); // tu modelo de vehículos
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Ruta para eliminar vehículo - solo admin y dueño del vehículo
router.delete('/cars/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user.userId; // id del admin logueado

    // Buscar vehículo por id
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    // Verificar que el vehículo pertenezca al usuario administrador
    if (car.ownerId.toString() !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este vehículo' });
    }

    // Eliminar vehículo
    await Car.findByIdAndDelete(carId);

    return res.json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
