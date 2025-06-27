const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Car = require('./models/Car');
const { authenticateToken } = require('./middleware/auth'); // Usa tu archivo auth.js

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_aqui';

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Conexión a MongoDB Atlas
mongoose.connect(
  'mongodb+srv://danielvallec98:Liam0408%40@clusterdv.suqozna.mongodb.net/vehiculos?retryWrites=true&w=majority'
).then(() => {
  console.log('✅ Conectado a MongoDB Atlas');
}).catch((err) => {
  console.error('❌ Error conectando a MongoDB:', err);
});

// Backup en archivo (opcional)
const carsFile = './data/cars.json';
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(carsFile)) fs.writeFileSync(carsFile, '[]');

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// GET: obtener vehículos
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    console.error('❌ Error leyendo desde MongoDB:', error);
    res.status(500).json({ error: 'No se pudieron cargar los vehículos' });
  }
});

// POST: publicar un nuevo vehículo (requiere autenticación)
app.post('/api/cars', authenticateToken, async (req, res) => {
  const newCar = req.body;

  try {
    const exists = await Car.findOne({ id: newCar.id });
    if (exists) {
      return res.status(409).json({ error: 'Vehículo duplicado por ID' });
    }

    newCar.ownerId = req.user.userId; // Se agrega el ownerId desde el token

    const mongoCar = new Car(newCar);
    await mongoCar.save();

    // Respaldar en archivo
    const backup = JSON.parse(fs.readFileSync(carsFile, 'utf8') || '[]');
    backup.push(newCar);
    fs.writeFileSync(carsFile, JSON.stringify(backup, null, 2));

    console.log('✅ Vehículo guardado');
    res.status(201).json(newCar);
  } catch (err) {
    console.error('❌ Error guardando en MongoDB:', err);
    res.status(500).json({ error: 'Error al guardar en MongoDB' });
  }
});

// DELETE: eliminar vehículo (solo el dueño puede hacerlo)
app.delete('/api/cars/:id', authenticateToken, async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await Car.findOne({ id: carId });

    if (!car) return res.status(404).json({ error: 'Vehículo no encontrado' });

    // Solo el dueño del vehículo (ownerId) puede eliminarlo
    if (car.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este vehículo' });
    }

    await Car.findOneAndDelete({ id: carId });

    // Actualizar backup
    const data = fs.readFileSync(carsFile, 'utf8') || '[]';
    const cars = JSON.parse(data).filter(car => car.id !== carId);
    fs.writeFileSync(carsFile, JSON.stringify(cars, null, 2));

    res.json({ message: 'Vehículo eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error eliminando vehículo:', err);
    res.status(500).json({ error: 'Error al eliminar vehículo' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend en http://localhost:${PORT}`);
});
