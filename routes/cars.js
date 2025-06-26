const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const Car = require('../models/Car');

// Ruta para eliminar vehículo (solo admin)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const deleted = await Car.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json({ message: 'Vehículo eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
